export interface BookingAddon {
  readonly id: string;
  readonly label: string;
  readonly price: number;
  readonly unit: string;
}

export const BOOKING_ADDONS: readonly BookingAddon[] = [
  { id: 'forest-walk',       label: 'Forest Walk Experience',       price: 850,  unit: 'per person' },
  { id: 'village-visit',     label: 'Village Visit',                price: 1200, unit: 'per group (up to 6)' },
  { id: 'bird-watching',     label: 'Bird Watching Walk',           price: 600,  unit: 'per person' },
  { id: 'bhojpur-temple',    label: 'Bhojpur Temple Tour',          price: 2500, unit: 'per vehicle' },
  { id: 'bush-dining',       label: 'Bush Dining',                  price: 3000, unit: 'per couple, setup fee' },
  { id: 'alfresco-dining',   label: 'Alfresco Forest Dining',       price: 5500, unit: 'per couple, setup fee' },
  { id: 'early-checkin',     label: 'Early Check-in (before 12 PM)', price: 2000, unit: 'flat' },
  { id: 'late-checkout',     label: 'Late Check-out (after 11 AM)', price: 2000, unit: 'flat' },
  { id: 'extra-mattress',    label: 'Extra Mattress',               price: 1500, unit: 'per night' },
] as const;

export function getAddonById(id: string): BookingAddon | undefined {
  return BOOKING_ADDONS.find((a) => a.id === id);
}
