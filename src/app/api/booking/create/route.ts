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

    const referenceNumber = await generateBookingReference();

    // Resolve coupon ID if coupon was applied
    const supabase = createAdminClient();
    let couponId: string | null = null;
    if (pricing.couponCode) {
      const { data: coupon } = await supabase
        .from("coupons")
        .select("id")
        .eq("code", pricing.couponCode)
        .single();
      couponId = coupon?.id ?? null;
    }

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        reference_number: referenceNumber,
        room_id: pricing.roomId,
        check_in: checkIn,
        check_out: checkOut,
        nights: pricing.nights,
        adults,
        children,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        price_per_night: pricing.pricePerNight,
        base_amount: pricing.subtotalBeforeGst,
        gst_rate: pricing.gstRate,
        gst_amount: pricing.gstAmount,
        discount_amount: pricing.discountAmount,
        coupon_id: couponId,
        coupon_code: pricing.couponCode,
        total_amount: pricing.totalAmount,
        advance_amount: pricing.advanceAmount,
        balance_due: pricing.balanceDue,
        special_requests: specialRequests ?? null,
        status: "PENDING_PAYMENT",
        source: "online",
      })
      .select("id, reference_number")
      .single();

    if (error) {
      console.error("[booking/create]", error);
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }

    // Increment coupon used_count if applied
    if (couponId) {
      const { data: couponRow } = await supabase
        .from("coupons")
        .select("used_count")
        .eq("id", couponId)
        .single();
      if (couponRow) {
        await supabase
          .from("coupons")
          .update({ used_count: (couponRow.used_count ?? 0) + 1 })
          .eq("id", couponId);
      }
    }

    return NextResponse.json({
      bookingId: booking.id,
      referenceNumber: booking.reference_number,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create booking";
    console.error("[booking/create]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
