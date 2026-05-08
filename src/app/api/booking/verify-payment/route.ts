import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/admin/constants";
import type { Json } from "@/lib/supabase/database.types";
import { verifyPaymentSignature } from "@/lib/payments/razorpay";
import { sendEmail } from "@/lib/email/resend";
import { bookingConfirmationGuestEmail } from "@/lib/email/templates/booking-confirmation-guest";
import { bookingConfirmationAdminEmail } from "@/lib/email/templates/booking-confirmation-admin";
import { createNotification } from "@/lib/admin/notifications";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const bookingId = typeof b.bookingId === "string" ? b.bookingId : "";
  const orderId = typeof b.orderId === "string" ? b.orderId : "";
  const paymentId = typeof b.paymentId === "string" ? b.paymentId : "";
  const signature = typeof b.signature === "string" ? b.signature : "";

  if (!bookingId || !orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify HMAC signature
  const valid = verifyPaymentSignature(orderId, paymentId, signature);
  if (!valid) {
    const supabase = createAdminClient();
    await supabase.from("audit_log").insert({
      admin_user_id: "system",
      actor_email: "system",
      action: "payment_signature_mismatch",
      entity_type: "booking",
      entity_id: bookingId,
      details: { orderId, paymentId } as Json,
    });
    return NextResponse.json({ ok: false, error: "Payment verification failed" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Fetch booking with guest + room
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select(`
      id, booking_ref, status, payment_status, total_amount, base_amount, gst_amount,
      checkin, checkout, num_adults, num_children, source, special_requests,
      guests!guest_id ( name, email, mobile ),
      rooms!room_id ( name, slug )
    `)
    .eq("id", bookingId)
    .single();

  if (bookingError || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  // Idempotency: if already confirmed, return success
  if (booking.status === "CONFIRMED") {
    return NextResponse.json({ ok: true, bookingRef: booking.booking_ref });
  }

  const wasConfirmed = booking.status === "PENDING_PAYMENT";

  // Update booking status
  await supabase
    .from("bookings")
    .update({ status: "CONFIRMED", payment_status: "partial" })
    .eq("id", bookingId);

  // Update the matching pending payment row
  const { data: paymentRow } = await supabase
    .from("payments")
    .select("id")
    .eq("booking_id", bookingId)
    .eq("razorpay_order_id", orderId)
    .eq("status", "pending")
    .maybeSingle();

  if (paymentRow) {
    await supabase
      .from("payments")
      .update({
        razorpay_payment_id: paymentId,
        status: "captured",
        captured_at: new Date().toISOString(),
      })
      .eq("id", paymentRow.id);
  }

  // Audit log
  await supabase.from("audit_log").insert({
    admin_user_id: "system",
    actor_email: "system",
    action: "payment_confirmed",
    entity_type: "booking",
    entity_id: bookingId,
    details: {
      orderId,
      paymentId,
      before: { status: "PENDING_PAYMENT", payment_status: "pending" },
      after: { status: "CONFIRMED", payment_status: "paid" },
    } as Json,
  });

  // Send confirmation emails only when status was actually just changed
  if (wasConfirmed) {
    const guest = Array.isArray(booking.guests) ? booking.guests[0] : booking.guests as unknown as {
      name: string; email: string; mobile: string | null;
    } | null;
    const room = Array.isArray(booking.rooms) ? booking.rooms[0] : booking.rooms as unknown as {
      name: string; slug: string;
    } | null;

    const totalAmount = Number(booking.total_amount);
    const nights = Math.round(
      (new Date(booking.checkout).getTime() - new Date(booking.checkin).getTime()) / 86400000,
    );

    if (guest && room) {
      const confirmationData = {
        bookingRef: booking.booking_ref,
        guestName: guest.name,
        roomName: room.name,
        checkIn: booking.checkin,
        checkOut: booking.checkout,
        nights,
        adults: booking.num_adults,
        children: booking.num_children,
        totalAmount,
        specialRequests: booking.special_requests,
      };

      const adminEmail = ADMIN_EMAIL;

      try {
        await sendEmail({
          to: guest.email,
          ...bookingConfirmationGuestEmail(confirmationData),
        });
      } catch (err) {
        console.error("[verify-payment] guest email failed:", err);
      }

      try {
        await sendEmail({
          to: adminEmail,
          ...bookingConfirmationAdminEmail({
            ...confirmationData,
            guestEmail: guest.email,
            guestMobile: guest.mobile ?? "",
            source: booking.source,
            paidAmount: totalAmount,
          }),
        });
      } catch (err) {
        console.error("[verify-payment] admin email failed:", err);
      }

      try {
        await createNotification({
          type: "payment_received",
          title: `Payment received — ${booking.booking_ref}`,
          body: `${guest.name} · ${room.name} · ₹${totalAmount.toLocaleString("en-IN")}`,
          linkUrl: `/admin/bookings/${bookingId}`,
        });
      } catch (err) {
        console.error("[verify-payment] notification failed:", err);
      }
    }
  }

  return NextResponse.json({ ok: true, bookingRef: booking.booking_ref });
}
