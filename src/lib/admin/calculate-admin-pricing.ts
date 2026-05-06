import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { gstRate, priceBreakdown } from "@/lib/gst";

export interface AdminAddonLine {
  id: string;
  label: string;
  price: number;  // GST-inclusive price as listed in the catalog
  qty: number;
  unit: string;
}

export interface AdminPricingBreakdown {
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  basePricePerNight: number;
  roomTotal: number;        // basePricePerNight * nights (GST-inclusive)
  addonsTotal: number;      // sum of all selected add-ons (GST-inclusive)
  subtotalInclusive: number; // roomTotal + addonsTotal (GST-inclusive)
  gstRatePct: 12 | 18;
  subtotalBeforeGst: number;
  gstAmount: number;
  totalAmount: number;      // = subtotalInclusive (GST already included in listed prices)
}

function diffDays(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

function calcAddonTotal(addons: AdminAddonLine[], nights: number): number {
  return addons.reduce((sum, addon) => {
    // 'per night' addons multiply by nights; all others use qty directly
    const multiplier = addon.unit === 'per night' ? nights : 1;
    return sum + addon.price * addon.qty * multiplier;
  }, 0);
}

export async function calculateAdminPricing(params: {
  roomId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  addons: AdminAddonLine[];
}): Promise<AdminPricingBreakdown> {
  const { roomId, checkIn, checkOut, addons } = params;
  const supabase = createAdminClient();

  const { data: room, error } = await supabase
    .from("rooms")
    .select("id, name, base_price_per_night, gst_rate")
    .eq("id", roomId)
    .single();

  if (error || !room) throw new Error("Room not found");

  const nights = diffDays(checkIn, checkOut);
  if (nights < 1) throw new Error("Check-out must be after check-in");

  const basePricePerNight = Number(room.base_price_per_night);
  const roomTotal = +(basePricePerNight * nights).toFixed(2);
  const addonsTotal = +calcAddonTotal(addons, nights).toFixed(2);
  const subtotalInclusive = +(roomTotal + addonsTotal).toFixed(2);

  const gstRatePct = (room.gst_rate ?? gstRate(basePricePerNight)) as 12 | 18;
  const { base: subtotalBeforeGst, gst: gstAmount } = priceBreakdown(subtotalInclusive, gstRatePct);

  return {
    roomId: room.id,
    roomName: room.name,
    checkIn,
    checkOut,
    nights,
    basePricePerNight,
    roomTotal,
    addonsTotal,
    subtotalInclusive,
    gstRatePct,
    subtotalBeforeGst,
    gstAmount,
    totalAmount: subtotalInclusive,
  };
}
