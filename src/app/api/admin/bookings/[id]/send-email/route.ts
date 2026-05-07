import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
import { bookingCustomEmail } from "@/lib/email/templates/booking-custom";
import { getSettings } from "@/lib/admin/settings";
import type { Json } from "@/lib/supabase/database.types";
import { assertAdmin } from "@/lib/admin/auth";


export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const messageBody = typeof body.body === "string" ? body.body.trim() : "";
  if (!subject || !messageBody) {
    return NextResponse.json({ error: "Subject and body are required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select(`id, booking_ref, guests!guest_id ( name, email )`)
    .eq("id", id)
    .single();

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const guest = Array.isArray(booking.guests) ? booking.guests[0] : booking.guests as unknown as { name: string; email: string } | null;
  if (!guest) return NextResponse.json({ error: "No guest on booking" }, { status: 400 });

  const settings = await getSettings();

  try {
    await sendEmail({
      to: guest.email,
      ...bookingCustomEmail({
        subject,
        body: messageBody,
        guestName: guest.name,
        bookingRef: booking.booking_ref,
        emailSignature: settings.email_signature,
      }),
    });
  } catch (err) {
    console.error("[send-email] failed:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  await supabase.from("audit_log").insert({
    admin_user_id: user.id,
    actor_email: user.email,
    action: "custom_email_sent",
    entity_type: "booking",
    entity_id: id,
    details: { subject, to: guest.email } as Json,
  });

  return NextResponse.json({ ok: true });
}
