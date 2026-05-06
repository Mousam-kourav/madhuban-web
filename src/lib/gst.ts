export function gstRate(nightlyRate: number): 12 | 18 {
  return nightlyRate >= 7500 ? 18 : 12;
}

/** Always derived from base price — never read stored gst_rate column. */
export function computeRoomGstRate(basePricePerNight: number): 12 | 18 {
  return gstRate(basePricePerNight);
}

export function priceBreakdown(totalInclusive: number, gstRatePct: 12 | 18) {
  const base = +(totalInclusive / (1 + gstRatePct / 100)).toFixed(2);
  const gst = +(totalInclusive - base).toFixed(2);
  return { base, gst, total: totalInclusive };
}
