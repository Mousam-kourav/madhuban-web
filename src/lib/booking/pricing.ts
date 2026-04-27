import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { gstRate, priceBreakdown } from "@/lib/gst";
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
    .select("id, name, slug, base_price_per_night, gst_rate, min_nights")
    .eq("slug", roomSlug)
    .eq("is_active", true)
    .single();

  if (roomError || !room) throw new Error("Room not found");

  const nights = diffDays(checkIn, checkOut);
  if (nights < 1) throw new Error("Check-out must be after check-in");

  const minNights = room.min_nights ?? 1;
  if (nights < minNights) throw new Error(`Minimum stay is ${minNights} night${minNights > 1 ? "s" : ""}`);

  // Apply pricing rules (take highest multiplier that applies)
  const { data: rules } = await supabase
    .from("pricing_rules")
    .select("*")
    .or(`room_id.eq.${room.id},room_id.is.null`)
    .eq("is_active", true)
    .order("priority", { ascending: false });

  let multiplier = 1;
  for (const rule of rules ?? []) {
    let applies = false;
    if (rule.rule_type === "seasonal" && rule.start_date && rule.end_date) {
      applies = checkIn < rule.end_date && checkOut > rule.start_date;
    } else if (rule.rule_type === "longstay" && rule.min_nights != null) {
      applies = nights >= rule.min_nights;
    } else if (rule.rule_type === "event" && rule.start_date && rule.end_date) {
      applies = checkIn < rule.end_date && checkOut > rule.start_date;
    }
    if (applies && rule.multiplier > multiplier) {
      multiplier = rule.multiplier;
    }
  }

  const baseNightlyRate = Number(room.base_price_per_night);
  const effectiveNightlyRate = +(baseNightlyRate * multiplier).toFixed(2);
  const gstRatePct = (room.gst_rate ?? gstRate(baseNightlyRate)) as 12 | 18;

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
      const notExpired = !coupon.valid_until || coupon.valid_until >= today;
      const notBeforeStart = !coupon.valid_from || coupon.valid_from <= today;
      const notExhausted = coupon.max_uses == null || coupon.used_count < coupon.max_uses;
      const meetsMinNights = nights >= coupon.min_nights;
      const meetsMinAmount = baseNightlyTotal >= Number(coupon.min_amount);

      if (notExpired && notBeforeStart && notExhausted && meetsMinNights && meetsMinAmount) {
        if (coupon.discount_type === "percent") {
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
  const advanceAmount = +(totalAmount * 0.5).toFixed(2);
  const balanceDue = +(totalAmount - advanceAmount).toFixed(2);

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
    advanceAmount,
    balanceDue,
  };
}
