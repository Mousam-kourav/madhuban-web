import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formats a number as Indian locale currency digits, e.g. 5000 → "5,000". */
export function formatPrice(amount: number): string {
  return amount.toLocaleString('en-IN');
}
