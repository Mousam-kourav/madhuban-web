import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createRazorpayOrder } from "@/lib/payments/razorpay";

const BOOKING_WINDOW_MINUTES = 60;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const bookingId = typeof body === "object" && body !== null && "bookingId" in body
    ? (body as Record<string, unknown>).bookingId
    : undefined;

  if (typeof bookingId !== "string" || !bookingId) {
    return NextResponse.json({ error: "bookingId required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select(`
      id, booking_ref, status, total_amount, created_at,
      guests!guest_id ( name, email, mobile ),
      rooms!room_id ( name )
    `)
    .eq("id", bookingId)
    .single();

  if (bookingError || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (booking.status !== "PENDING_PAYMENT") {
    return NextResponse.json(
      { error: `Booking is already ${booking.status.toLowerCase()}` },
      { status: 409 },
    );
  }

  // Reject bookings older than the window
  const createdAt = new Date(booking.created_at).getTime();
  const ageMinutes = (Date.now() - createdAt) / 60000;
  if (ageMinutes > BOOKING_WINDOW_MINUTES) {
    return NextResponse.json(
      { error: "This booking has expired. Please start a new booking." },
      { status: 410 },
    );
  }

  const totalAmount = Number(booking.total_amount);
  const amountPaise = Math.round(totalAmount * 100);

  let orderId: string;
  let amountFromOrder: number;
  try {
    const order = await createRazorpayOrder({
      amountPaise,
      receipt: booking.booking_ref,
      notes: { bookingId: booking.id },
    });
    orderId = order.id;
    amountFromOrder = order.amount;
  } catch (err) {
    console.error("[create-order] Razorpay error:", err);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }

  // Insert a pending payment row for the full amount
  await supabase.from("payments").insert({
    booking_id: booking.id,
    razorpay_order_id: orderId,
    amount: totalAmount,
    status: "pending",
    payment_type: "full",
  });

  const guest = Array.isArray(booking.guests)
    ? booking.guests[0]
    : booking.guests as unknown as { name: string; email: string; mobile: string | null } | null;

  return NextResponse.json({
    orderId,
    amount: amountFromOrder,
    currency: "INR",
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
    totalAmountRupees: totalAmount,
    bookingRef: booking.booking_ref,
    prefill: {
      name: guest?.name ?? "",
      email: guest?.email ?? "",
      contact: guest?.mobile ?? "",
    },
  });
}
