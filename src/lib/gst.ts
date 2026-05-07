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

// ── A7: Invoice GST utilities ─────────────────────────────────────────────────

function roundTo2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Returns "2026-27" for any date in April 2026 – March 2027. */
export function getFinancialYear(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed; April = 3
  if (month >= 3) {
    const yy = (year + 1) % 100;
    return `${year}-${yy.toString().padStart(2, '0')}`;
  }
  const yy = year % 100;
  return `${year - 1}-${yy.toString().padStart(2, '0')}`;
}

/**
 * Returns true when the guest's state is NOT Madhya Pradesh.
 * Null/unknown defaults to intra-state (MP) — conservative for a MP property
 * where most walk-in guests are local.
 */
export function isInterStateGuest(guestState: string | null): boolean {
  if (!guestState) return false;
  const s = guestState.toLowerCase().trim();
  return s !== 'madhya pradesh' && s !== 'm.p.' && s !== 'mp' && s !== '23';
}

export type TaxBreakdown = {
  taxableAmount: number;
  gstRate: number;
  isInterState: boolean;
  cgstRate: number | null;
  cgstAmount: number | null;
  sgstRate: number | null;
  sgstAmount: number | null;
  igstRate: number | null;
  igstAmount: number | null;
  totalGst: number;
  totalAmount: number;
};

export function computeTaxBreakdown(
  taxableAmount: number,
  gstRatePercent: number,
  isInterState: boolean,
): TaxBreakdown {
  const totalGst = roundTo2(taxableAmount * gstRatePercent / 100);

  if (isInterState) {
    return {
      taxableAmount,
      gstRate: gstRatePercent,
      isInterState: true,
      cgstRate: null, cgstAmount: null,
      sgstRate: null, sgstAmount: null,
      igstRate: gstRatePercent,
      igstAmount: totalGst,
      totalGst,
      totalAmount: roundTo2(taxableAmount + totalGst),
    };
  }

  const halfRate = gstRatePercent / 2;
  const cgst = roundTo2(totalGst / 2);
  const sgst = roundTo2(totalGst - cgst);
  return {
    taxableAmount,
    gstRate: gstRatePercent,
    isInterState: false,
    cgstRate: halfRate, cgstAmount: cgst,
    sgstRate: halfRate, sgstAmount: sgst,
    igstRate: null, igstAmount: null,
    totalGst,
    totalAmount: roundTo2(taxableAmount + totalGst),
  };
}

/** Converts a rupee amount to Indian-style words for GST invoices. */
export function amountToWords(amount: number): string {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convert(n: number): string {
    if (n === 0) return '';
    if (n < 20) return ones[n] ?? '';
    if (n < 100) {
      const r = n % 10 !== 0 ? ' ' + (ones[n % 10] ?? '') : '';
      return (tens[Math.floor(n / 10)] ?? '') + r;
    }
    if (n < 1000) {
      const r = n % 100 !== 0 ? ' ' + convert(n % 100) : '';
      return (ones[Math.floor(n / 100)] ?? '') + ' Hundred' + r;
    }
    if (n < 100000) {
      const r = n % 1000 !== 0 ? ' ' + convert(n % 1000) : '';
      return convert(Math.floor(n / 1000)) + ' Thousand' + r;
    }
    if (n < 10000000) {
      const r = n % 100000 !== 0 ? ' ' + convert(n % 100000) : '';
      return convert(Math.floor(n / 100000)) + ' Lakh' + r;
    }
    const r = n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : '';
    return convert(Math.floor(n / 10000000)) + ' Crore' + r;
  }

  const rupeesText = rupees === 0 ? 'Zero' : convert(rupees);
  const paiseText = paise > 0 ? ` and ${convert(paise)} Paise` : '';
  return `${rupeesText} Rupees${paiseText} Only`;
}

/** Formats a number as Indian-style currency string (e.g. ₹1,00,000.00). */
export function fmtINR(amount: number): string {
  const str = Math.abs(amount).toFixed(2);
  const dotIdx = str.indexOf('.');
  const intPart = dotIdx >= 0 ? str.slice(0, dotIdx) : str;
  const decPart = dotIdx >= 0 ? str.slice(dotIdx + 1) : '00';
  if (intPart.length <= 3) return `₹${intPart}.${decPart}`;
  const last3 = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  const restFormatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `₹${restFormatted},${last3}.${decPart}`;
}
