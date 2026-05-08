import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { ADMIN_EMAIL } from "@/lib/admin/constants";
import type { NextRequest } from "next/server";
import type { Json } from "@/lib/supabase/database.types";
import { sendEmail } from "@/lib/email/resend";
import { bookingCancelledGuestEmail } from "@/lib/email/templates/booking-cancelled-guest";
import { bookingCancelledAdminEmail } from "@/lib/email/templates/booking-cancelled-admin";
import { createNotification } from "@/lib/admin/notifications";
import { assertAdmin } from "@/lib/admin/auth";


async function writeAuditLog(
  supabase: ReturnType<typeof createAdminClient>,
  adminUserId: string,
  actorEmail: string | null,
  bookingId: string,
  action: string,
  details: Json,
) {
  await supabase.from("audit_log").insert({
    admin_user_id: adminUserId,
    actor_email: actorEmail,
    action,
    entity_type: "booking",
    entity_id: bookingId,
    details,
  });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();

  const { data: booking, error } = await supabase
    .from("bookings")
    .select(`
      *,
      guests!guest_id ( * ),
      rooms!room_id ( name, slug )
    `)
    .eq("id", id)
    .single();

  if (error || !booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("booking_id", id)
    .order("created_at", { ascending: true });

  const { data: auditEntries } = await supabase
    .from("audit_log")
    .select("id, action, details, created_at, admin_user_id")
    .eq("entity_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({ booking, payments: payments ?? [], auditLog: auditEntries ?? [] });
}

export async function PATCH(
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

  const action = typeof body.action === "string" ? body.action : "";
  const supabase = createAdminClient();

  // Fetch current booking
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select(`
      id, booking_ref, status, payment_status, total_amount, checkin, checkout,
      guests!guest_id ( name, email, mobile ),
      rooms!room_id ( name, slug )
    `)
    .eq("id", id)
    .single();

  if (fetchError || !booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const guest = Array.isArray(booking.guests) ? booking.guests[0] : booking.guests as unknown as {
    name: string; email: string; mobile: string | null;
  } | null;
  const room = Array.isArray(booking.rooms) ? booking.rooms[0] : booking.rooms as unknown as {
    name: string; slug: string;
  } | null;

  const adminId = user.id;
  const actorEmail = user.email ?? null;

  switch (action) {
    case "CHECKED_IN": {
      if (booking.status !== "CONFIRMED") {
        return NextResponse.json({ error: "Booking must be CONFIRMED to check in" }, { status: 409 });
      }
      await supabase.from("bookings").update({ status: "CHECKED_IN" }).eq("id", id);
      await writeAuditLog(supabase, adminId, actorEmail, id, "check_in", {
        before: { status: booking.status },
        after: { status: "CHECKED_IN" },
      });
      return NextResponse.json({ ok: true });
    }

    case "CHECKED_OUT": {
      if (booking.status !== "CHECKED_IN") {
        return NextResponse.json({ error: "Booking must be CHECKED_IN to check out" }, { status: 409 });
      }
      await supabase.from("bookings").update({ status: "CHECKED_OUT" }).eq("id", id);
      await writeAuditLog(supabase, adminId, actorEmail, id, "check_out", {
        before: { status: booking.status },
        after: { status: "CHECKED_OUT" },
      });
      return NextResponse.json({ ok: true });
    }

    case "BALANCE_PAID": {
      if (booking.status !== "CHECKED_IN") {
        return NextResponse.json({ error: "Balance can only be recorded after check-in" }, { status: 409 });
      }
      const amount = typeof body.amount === "number" ? body.amount : Number(body.amount);
      const method = typeof body.method === "string" ? body.method : "cash";
      if (!amount || amount <= 0) {
        return NextResponse.json({ error: "Valid amount required" }, { status: 400 });
      }
      await supabase.from("payments").insert({
        booking_id: id,
        amount,
        status: "captured",
        payment_type: "balance",
        method,
        captured_at: new Date().toISOString(),
      });
      await supabase.from("bookings").update({ payment_status: "paid" }).eq("id", id);
      await writeAuditLog(supabase, adminId, actorEmail, id, "balance_paid", {
        amount,
        method,
        before: { payment_status: booking.payment_status },
        after: { payment_status: "paid" },
      });
      return NextResponse.json({ ok: true });
    }

    case "NO_SHOW": {
      if (!["CONFIRMED", "CHECKED_IN"].includes(booking.status)) {
        return NextResponse.json({ error: "Cannot mark no-show for this booking status" }, { status: 409 });
      }
      await supabase.from("bookings").update({ status: "NO_SHOW" }).eq("id", id);
      await writeAuditLog(supabase, adminId, actorEmail, id, "no_show", {
        before: { status: booking.status },
        after: { status: "NO_SHOW" },
      });
      return NextResponse.json({ ok: true });
    }

    case "INTERNAL_NOTE": {
      const note = typeof body.note === "string" ? body.note.trim() : "";
      await supabase.from("bookings").update({ internal_notes: note || null }).eq("id", id);
      await writeAuditLog(supabase, adminId, actorEmail, id, "internal_note_updated", { note });
      return NextResponse.json({ ok: true });
    }

    case "CANCELLED": {
      const allowedFromStatuses = ["PENDING_PAYMENT", "CONFIRMED"];
      if (!allowedFromStatuses.includes(booking.status)) {
        return NextResponse.json({ error: "Cannot cancel a booking in this state" }, { status: 409 });
      }
      const refundAmount = typeof body.refundAmount === "number"
        ? body.refundAmount
        : typeof body.refundAmount === "string" ? Number(body.refundAmount) : 0;
      const cancelReason = typeof body.reason === "string" ? body.reason.trim() : "";
      const cancelNotes = typeof body.notes === "string" ? body.notes.trim() : "";
      const fullReason = cancelReason && cancelNotes
        ? `${cancelReason} — ${cancelNotes}`
        : cancelReason || cancelNotes || null;

      await supabase.from("bookings").update({
        status: "CANCELLED",
        cancellation_reason: fullReason,
        cancelled_at: new Date().toISOString(),
      }).eq("id", id);

      if (refundAmount > 0) {
        // Find captured advance payment and mark refunded
        const { data: advPayment } = await supabase
          .from("payments")
          .select("id")
          .eq("booking_id", id)
          .eq("status", "captured")
          .eq("payment_type", "advance")
          .maybeSingle();

        if (advPayment) {
          await supabase
            .from("payments")
            .update({ refund_amount: refundAmount, refunded_at: new Date().toISOString() })
            .eq("id", advPayment.id);
        }
      }

      await writeAuditLog(supabase, adminId, actorEmail, id, "cancelled", {
        reason: fullReason,
        refundAmount,
        before: { status: booking.status },
        after: { status: "CANCELLED" },
      });

      // Send cancellation emails
      if (guest && room) {
        const data = {
          bookingRef: booking.booking_ref,
          guestName: guest.name,
          roomName: room.name,
          checkIn: booking.checkin,
          checkOut: booking.checkout,
          refundAmount,
        };
        const notifyEmail = ADMIN_EMAIL;
        try { await sendEmail({ to: guest.email, ...bookingCancelledGuestEmail(data) }); }
        catch (err) { console.error("[admin/cancel] guest email:", err); }
        try {
          await sendEmail({
            to: notifyEmail,
            ...bookingCancelledAdminEmail({
              ...data,
              guestEmail: guest.email,
              guestMobile: guest.mobile ?? "",
              cancelledBy: user.email ?? adminId,
            }),
          });
        } catch (err) { console.error("[admin/cancel] admin email:", err); }
      }

      try {
        await createNotification({
          type: "booking_cancelled",
          title: `Booking cancelled — ${booking.booking_ref}`,
          body: `${guest?.name ?? "Guest"} · Cancelled by ${user.email ?? "admin"}`,
          linkUrl: `/admin/bookings/${id}`,
        });
      } catch (err) { console.error("[admin/cancel] notification:", err); }

      return NextResponse.json({ ok: true });
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
