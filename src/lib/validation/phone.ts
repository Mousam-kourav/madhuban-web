// Accepts: 10-digit Indian (with optional +91/91 prefix) or E.164 international (+<country><number>)
const INDIA_10 = /^(?:\+91|91)?([6-9]\d{9})$/;
const INTL_E164 = /^\+[1-9]\d{6,14}$/;

export function validatePhone(raw: string): { valid: boolean; normalized: string; error?: string } {
  const cleaned = raw.replace(/[\s\-().]/g, "");

  const indiaMatch = INDIA_10.exec(cleaned);
  if (indiaMatch) {
    return { valid: true, normalized: `+91${indiaMatch[1]}` };
  }

  if (INTL_E164.test(cleaned)) {
    return { valid: true, normalized: cleaned };
  }

  return {
    valid: false,
    normalized: raw,
    error: "Enter a 10-digit Indian number or international number with country code (e.g. +44…)",
  };
}

// Zod refinement helper — use in .refine() or .superRefine()
export function isValidPhone(raw: string): boolean {
  return validatePhone(raw).valid;
}

export const PHONE_ERROR = "Enter a 10-digit Indian number or international number with country code";
