import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeRoomGstRate, priceBreakdown } from "@/lib/gst";
import type { PricingBreakdown } from "./types";

interface PricingParams {
  roomSlug: string;
  checkIn: string;  // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  adults: number;
  children: number;
  couponCode?: string;
}

function diffDays(a: string, b: string): number {
  const msPerDay = 86400000;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

export async function calculatePricing(params: PricingParams): Promise<PricingBreakdown> {
  const { roomSlug, checkIn, checkOut, adults, children, couponCode } = params;
  const supabase = createAdminClient();

  // Fetch room
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, name, slug, base_price_per_night, min_nights")
    .eq("slug", roomSlug)
    .eq("is_active", true)
    .single();

  if (roomError || !room) throw new Error("Room not found");

  const nights = diffDays(checkIn, checkOut);
  if (nights < 1) throw new Error("Check-out must be after check-in");

  const minNights = room.min_nights ?? 1;
  if (nights < minNights) throw new Error(`Minimum stay is ${minNights} night${minNights > 1 ? "s" : ""}`);

  // Apply pricing rules — take the highest multiplier that applies to the date range.
  // pricing_rules has: rule_type, date_from, date_to, multiplier (no is_active/priority columns).
  const { data: rules } = await supabase
    .from("pricing_rules")
    .select("rule_type, date_from, date_to, multiplier")
    .or(`room_id.eq.${room.id},room_id.is.null`);

  let multiplier = 1;
  for (const rule of rules ?? []) {
    if (rule.date_from && rule.date_to) {
      const applies = checkIn < rule.date_to && checkOut > rule.date_from;
      if (applies && rule.multiplier > multiplier) {
        multiplier = rule.multiplier;
      }
    }
  }

  const baseNightlyRate = Number(room.base_price_per_night);
  const effectiveNightlyRate = +(baseNightlyRate * multiplier).toFixed(2);
  const gstRatePct = computeRoomGstRate(baseNightlyRate);

  const baseNightlyTotal = +(effectiveNightlyRate * nights).toFixed(2);

  // Apply coupon
  let discountAmount = 0;
  let appliedCouponCode: string | null = null;

  if (couponCode) {
    const code = couponCode.trim().toUpperCase();
    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .single();

    if (coupon) {
      const today = new Date().toISOString().slice(0, 10);
      // DB columns: valid_to (not valid_until), usage_limit (not max_uses), min_booking_value (not min_amount)
      const notExpired = !coupon.valid_to || coupon.valid_to >= today;
      const notBeforeStart = !coupon.valid_from || coupon.valid_from <= today;
      const notExhausted = coupon.usage_limit == null || coupon.used_count < coupon.usage_limit;
      const meetsMinAmount = baseNightlyTotal >= Number(coupon.min_booking_value);

      if (notExpired && notBeforeStart && notExhausted && meetsMinAmount) {
        if (coupon.discount_type === "percentage") {
          discountAmount = +(baseNightlyTotal * Number(coupon.discount_value) / 100).toFixed(2);
        } else {
          discountAmount = Math.min(Number(coupon.discount_value), baseNightlyTotal);
        }
        appliedCouponCode = code;
      }
    }
  }

  const discountedTotal = +(baseNightlyTotal - discountAmount).toFixed(2);
  const { base: subtotalBeforeGst, gst: gstAmount } = priceBreakdown(discountedTotal, gstRatePct);
  const totalAmount = discountedTotal;

  return {
    roomId: room.id,
    roomSlug: room.slug,
    roomName: room.name,
    checkIn,
    checkOut,
    nights,
    adults,
    children,
    pricePerNight: effectiveNightlyRate,
    baseNightlyTotal,
    discountAmount,
    couponCode: appliedCouponCode,
    gstRate: gstRatePct,
    subtotalBeforeGst,
    gstAmount,
    totalAmount,
  };
}
