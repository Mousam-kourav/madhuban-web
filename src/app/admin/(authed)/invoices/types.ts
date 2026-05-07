import type { InvoiceRow } from "@/lib/supabase/database.types";

/** InvoiceRow with booking_ref flattened from the bookings join. */
export type InvoiceListRow = InvoiceRow & { booking_ref: string };
