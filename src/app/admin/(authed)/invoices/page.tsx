import { createAdminClient } from "@/lib/supabase/admin";
import type { Metadata } from "next";
import type { InvoiceRow } from "@/lib/supabase/database.types";
import { InvoicesClient } from "./invoices-client";
import { GstSummary } from "./gst-summary";
import type { InvoiceListRow } from "./types";

export const metadata: Metadata = { title: "Invoices — Madhuban Admin" };

export default async function InvoicesPage() {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("invoices")
    .select("*, bookings!booking_id(booking_ref)")
    .order("generated_at", { ascending: false });

  type RawRow = InvoiceRow & { bookings: { booking_ref: string } | null };
  const invoices: InvoiceListRow[] = (
    (data ?? []) as unknown as RawRow[]
  ).map(({ bookings: bk, ...rest }) => ({
    ...rest,
    booking_ref: bk?.booking_ref ?? "",
  }));

  return (
    <div className="space-y-10">
      <h1 className="font-display text-2xl font-medium italic text-charcoal">Invoices</h1>
      <InvoicesClient invoices={invoices} />
      <GstSummary invoices={invoices} />
    </div>
  );
}
