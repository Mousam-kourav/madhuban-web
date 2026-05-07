import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";
import { sendEmail } from "@/lib/email/resend";
import { bookingConfirmationGuestEmail } from "@/lib/email/templates/booking-confirmation-guest";
import { bookingConfirmationAdminEmail } from "@/lib/email/templates/booking-confirmation-admin";

// Razorpay sends raw body for signature verification — must read as text.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { event: string; payload?: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Only handle captured events as backup confirmation signal
  if (event.event !== "payment.captured") {
    return NextResponse.json({ received: true });
  }

  const paymentEntity = (
    event.payload?.payment as Record<string, unknown> | undefined
  )?.entity as Record<string, unknown> | undefined;

  const orderId = typeof paymentEntity?.order_id === "string" ? paymentEntity.order_id : null;
  const paymentId = typeof paymentEntity?.id === "string" ? paymentEntity.id : null;

  if (!orderId || !paymentId) {
    return NextResponse.json({ received: true });
  }

  const supabase = createAdminClient();

  // Find the payment row by order id
  const { data: paymentRow } = await supabase
    .from("payments")
    .select("id, booking_id, status")
    .eq("razorpay_order_id", orderId)
    .maybeSingle();

  if (!paymentRow) {
    return NextResponse.json({ received: true });
  }

  // Idempotency: skip if already captured
  if (paymentRow.status === "captured") {
    return NextResponse.json({ received: true });
  }

  const bookingId = paymentRow.booking_id;

  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      id, booking_ref, status, total_amount,
      checkin, checkout, num_adults, num_children, source, special_requests,
      guests!guest_id ( name, email, mobile ),
      rooms!room_id ( name, slug )
    `)
    .eq("id", bookingId)
    .single();

  if (!booking || booking.status === "CONFIRMED") {
    return NextResponse.json({ received: true });
  }

  await supabase
    .from("bookings")
    .update({ status: "CONFIRMED", payment_status: "partial" })
    .eq("id", bookingId);

  await supabase
    .from("payments")
    .update({
      razorpay_payment_id: paymentId,
      status: "captured",
      captured_at: new Date().toISOString(),
    })
    .eq("id", paymentRow.id);

  await supabase.from("audit_log").insert({
    admin_user_id: "system",
    actor_email: "system",
    action: "payment_confirmed_via_webhook",
    entity_type: "booking",
    entity_id: bookingId,
    details: { orderId, paymentId } as Json,
  });

  const guest = Array.isArray(booking.guests) ? booking.guests[0] : booking.guests as unknown as {
    name: string; email: string; mobile: string | null;
  } | null;
  const room = Array.isArray(booking.rooms) ? booking.rooms[0] : booking.rooms as unknown as {
    name: string; slug: string;
  } | null;

  if (guest && room) {
    const totalAmount = Number(booking.total_amount);
    const advanceAmount = +(totalAmount * 0.5).toFixed(2);
    const balanceDue = +(totalAmount - advanceAmount).toFixed(2);
    const nights = Math.round(
      (new Date(booking.checkout).getTime() - new Date(booking.checkin).getTime()) / 86400000,
    );

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
      advanceAmount,
      balanceDue,
      specialRequests: booking.special_requests,
    };

    const adminEmail = process.env.CONTACT_FORM_TO ?? "madhubanecoretreat@gmail.com";

    try { await sendEmail({ to: guest.email, ...bookingConfirmationGuestEmail(confirmationData) }); }
    catch (err) { console.error("[webhook] guest email:", err); }

    try {
      await sendEmail({
        to: adminEmail,
        ...bookingConfirmationAdminEmail({
          ...confirmationData,
          guestEmail: guest.email,
          guestMobile: guest.mobile ?? "",
          source: booking.source,
        }),
      });
    } catch (err) { console.error("[webhook] admin email:", err); }
  }

  return NextResponse.json({ received: true });
}
