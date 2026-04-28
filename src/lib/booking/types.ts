export type BookingStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED"
  | "NO_SHOW";

export interface PricingBreakdown {
  roomId: string;
  roomSlug: string;
  roomName: string;
  checkIn: string;       // YYYY-MM-DD
  checkOut: string;      // YYYY-MM-DD
  nights: number;
  adults: number;
  children: number;
  pricePerNight: number; // GST-inclusive nightly rate used
  baseNightlyTotal: number; // pricePerNight × nights (before discount)
  discountAmount: number;
  couponCode: string | null;
  gstRate: 12 | 18;
  subtotalBeforeGst: number; // after discount, before GST
  gstAmount: number;
  totalAmount: number;   // GST-inclusive final
  advanceAmount: number; // 50% charged at booking
  balanceDue: number;    // 50% at check-in
}

export interface GuestDetails {
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

// Shape saved to sessionStorage key "booking_draft"
export interface BookingDraft {
  guest: GuestDetails;
  pricing: PricingBreakdown;
}
