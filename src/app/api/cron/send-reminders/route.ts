import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
import { bookingReminderEmail } from "@/lib/email/templates/booking-reminder";
import { createNotification } from "@/lib/admin/notifications";
import type { Json } from "@/lib/supabase/database.types";

// Called by Vercel cron at 09:00 IST daily (03:30 UTC).
// Also callable manually with the bearer token for testing.
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`
      id, booking_ref, checkin, checkout, num_adults, num_children,
      guests!guest_id ( name, email ),
      rooms!room_id ( name )
    `)
    .eq("status", "CONFIRMED")
    .eq("checkin", tomorrowStr);

  if (error) {
    console.error("[cron/send-reminders] query error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let sent = 0;
  let failed = 0;

  for (const booking of bookings ?? []) {
    const guest = Array.isArray(booking.guests) ? booking.guests[0] : booking.guests as unknown as { name: string; email: string } | null;
    const room = Array.isArray(booking.rooms) ? booking.rooms[0] : booking.rooms as unknown as { name: string } | null;

    if (!guest || !room) continue;

    const nights = Math.round(
      (new Date(booking.checkout).getTime() - new Date(booking.checkin).getTime()) / 86400000,
    );

    try {
      await sendEmail({
        to: guest.email,
        ...bookingReminderEmail({
          bookingRef: booking.booking_ref,
          guestName: guest.name,
          roomName: room.name,
          checkIn: booking.checkin,
          checkOut: booking.checkout,
          nights,
          adults: booking.num_adults,
          children: booking.num_children,
        }),
      });

      await supabase.from("audit_log").insert({
        admin_user_id: "system",
        actor_email: "cron@system",
        action: "reminder_email_sent",
        entity_type: "booking",
        entity_id: booking.id,
        details: { checkin: booking.checkin, guestEmail: guest.email } as Json,
      });

      try {
        await createNotification({
          type: "check_in_today",
          title: `Check-in tomorrow — ${booking.booking_ref}`,
          body: `${guest.name} · ${room.name} · ${tomorrowStr}`,
          linkUrl: `/admin/bookings/${booking.id}`,
        });
      } catch { /* non-fatal */ }

      sent++;
    } catch (err) {
      console.error(`[cron/send-reminders] failed for booking ${booking.booking_ref}:`, err);
      failed++;
    }
  }

  return NextResponse.json({ ok: true, sent, failed, date: tomorrowStr });
}
