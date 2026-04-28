export function gstRate(nightlyRate: number): 12 | 18 {
  return nightlyRate >= 7500 ? 18 : 12;
}

export function priceBreakdown(totalInclusive: number, gstRatePct: 12 | 18) {
  const base = +(totalInclusive / (1 + gstRatePct / 100)).toFixed(2);
  const gst = +(totalInclusive - base).toFixed(2);
  return { base, gst, total: totalInclusive };
}
