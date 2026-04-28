import { NextRequest, NextResponse } from "next/server";
import { createBookingSchema } from "@/lib/booking/schemas";
import { checkAvailability } from "@/lib/booking/availability";
import { calculatePricing } from "@/lib/booking/pricing";
import { generateBookingReference } from "@/lib/booking/reference";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const {
    roomSlug,
    checkIn,
    checkOut,
    adults,
    children,
    guestName,
    guestEmail,
    guestPhone,
    specialRequests,
    couponCode,
  } = parsed.data;

  try {
    // Calculate pricing (also validates room exists)
    const pricing = await calculatePricing({
      roomSlug,
      checkIn,
      checkOut,
      adults,
      children,
      couponCode,
    });

    // Re-check availability at point of booking
    const availability = await checkAvailability({
      roomId: pricing.roomId,
      checkIn,
      checkOut,
    });

    if (!availability.available) {
      return NextResponse.json({ error: availability.reason }, { status: 409 });
    }

    const bookingRef = await generateBookingReference();
    const supabase = createAdminClient();

    // Find existing guest by email or insert new one.
    // guests table: name, mobile (not phone), email
    const { data: existingGuest } = await supabase
      .from("guests")
      .select("id")
      .eq("email", guestEmail.trim().toLowerCase())
      .maybeSingle();

    let guestId: string;
    if (existingGuest) {
      guestId = existingGuest.id;
    } else {
      const { data: newGuest, error: guestError } = await supabase
        .from("guests")
        .insert({
          name: guestName.trim(),
          email: guestEmail.trim().toLowerCase(),
          mobile: guestPhone.trim(),
        })
        .select("id")
        .single();
      if (guestError || !newGuest) {
        console.error("[booking/create] guest insert:", guestError);
        return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
      }
      guestId = newGuest.id;
    }

    // Insert booking using actual column names.
    // Not stored: nights (checkout - checkin), price_per_night (base_amount / nights),
    // gst_rate (on rooms), advance_amount / balance_due (derived as total * 0.5),
    // razorpay_* (on payments table).
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        booking_ref: bookingRef,
        room_id: pricing.roomId,
        guest_id: guestId,
        checkin: checkIn,
        checkout: checkOut,
        num_adults: adults,
        num_children: children,
        base_amount: pricing.subtotalBeforeGst,
        gst_amount: pricing.gstAmount,
        discount_amount: pricing.discountAmount,
        coupon_code: pricing.couponCode ?? null,
        total_amount: pricing.totalAmount,
        special_requests: specialRequests ?? null,
        status: "PENDING_PAYMENT",
        payment_status: "pending",
        source: "online",
      })
      .select("id, booking_ref")
      .single();

    if (error) {
      console.error("[booking/create]", error);
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }

    // Increment coupon used_count if applied
    if (pricing.couponCode) {
      const { data: couponRow } = await supabase
        .from("coupons")
        .select("id, used_count")
        .eq("code", pricing.couponCode)
        .single();
      if (couponRow) {
        await supabase
          .from("coupons")
          .update({ used_count: (couponRow.used_count ?? 0) + 1 })
          .eq("id", couponRow.id);
      }
    }

    return NextResponse.json({
      bookingId: booking.id,
      referenceNumber: booking.booking_ref,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create booking";
    console.error("[booking/create]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
