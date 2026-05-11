import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { fmtINR } from "@/lib/gst";
import { Card, Badge } from "@/components/admin/ui";
import type { InvoiceRow } from "@/lib/supabase/database.types";

export const metadata: Metadata = { title: "Invoice Detail — Madhuban Admin" };

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function DlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="font-body text-xs text-charcoal/60 pt-0.5">{label}</dt>
      <dd className="font-body text-sm text-charcoal">{children}</dd>
    </>
  );
}

interface Props { params: Promise<{ id: string }> }

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const invoice = data as InvoiceRow;

  const statusVariant = invoice.status === "ISSUED" ? "confirmed" : "cancelled";

  return (
    <div className="space-y-6">

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href={`/admin/bookings/${invoice.booking_id}`}
            className="font-body text-xs text-charcoal/50 hover:text-earth-brown transition-colors"
          >
            ← Back to Booking
          </Link>
          <h1 className="mt-1 font-display text-2xl font-medium text-charcoal">
            {invoice.invoice_number}
          </h1>
          <p className="mt-0.5 font-body text-xs text-charcoal/50">
            Generated {fmtDateTime(invoice.generated_at)} by {invoice.generated_by}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a
            href={`/admin/invoices/${id}/print`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-xl border border-charcoal/20 bg-admin-card-bg px-4 py-2 font-body text-sm text-charcoal transition-colors hover:bg-warm-beige/30"
          >
            Print View
          </a>
          <a
            href={`/api/admin/invoices/${id}/pdf`}
            className="inline-flex items-center rounded-xl bg-forest-green px-4 py-2 font-body text-sm text-ivory transition-colors hover:bg-forest-green/90"
          >
            Download PDF
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* ── Invoice summary ───────────────────────────────────────────── */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-body text-sm font-semibold text-charcoal">Invoice Summary</h2>
            <Badge variant={statusVariant}>{invoice.status}</Badge>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
            <DlRow label="Invoice Number">{invoice.invoice_number}</DlRow>
            <DlRow label="Financial Year">{invoice.fy}</DlRow>
            <DlRow label="Invoice Date">{fmtDate(invoice.generated_at.slice(0, 10))}</DlRow>
            <DlRow label="Service Period">
              {fmtDate(invoice.service_period_from)} – {fmtDate(invoice.service_period_to)}
            </DlRow>
            <DlRow label="Place of Supply">
              {invoice.place_of_supply_state} ({invoice.place_of_supply_state_code})
            </DlRow>
            <DlRow label="Tax Type">
              {invoice.is_inter_state ? "Inter-state (IGST)" : "Intra-state (CGST + SGST)"}
            </DlRow>
          </dl>
        </Card>

        {/* ── Tax breakdown ─────────────────────────────────────────────── */}
        <Card className="p-6">
          <h2 className="mb-4 font-body text-sm font-semibold text-charcoal">Tax Breakdown</h2>
          <div className="space-y-2">
            <div className="flex justify-between font-body text-sm">
              <span className="text-charcoal/70">Taxable Amount</span>
              <span className="text-charcoal">{fmtINR(invoice.taxable_amount)}</span>
            </div>
            {!invoice.is_inter_state && invoice.cgst_amount != null && (
              <>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-charcoal/70">CGST @ {invoice.cgst_rate}%</span>
                  <span className="text-charcoal">{fmtINR(invoice.cgst_amount)}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-charcoal/70">SGST @ {invoice.sgst_rate}%</span>
                  <span className="text-charcoal">{fmtINR(invoice.sgst_amount!)}</span>
                </div>
              </>
            )}
            {invoice.is_inter_state && invoice.igst_amount != null && (
              <div className="flex justify-between font-body text-sm">
                <span className="text-charcoal/70">IGST @ {invoice.igst_rate}%</span>
                <span className="text-charcoal">{fmtINR(invoice.igst_amount)}</span>
              </div>
            )}
            <div className="mt-2 flex justify-between rounded-xl bg-forest-green px-4 py-3 font-body text-sm font-semibold text-ivory">
              <span>Total</span>
              <span>{fmtINR(invoice.total_amount)}</span>
            </div>
          </div>
        </Card>

        {/* ── Bill To ───────────────────────────────────────────────────── */}
        <Card className="p-6">
          <h2 className="mb-4 font-body text-sm font-semibold text-charcoal">Bill To</h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
            <DlRow label="Name">{invoice.bill_to_name}</DlRow>
            {invoice.bill_to_company_name && (
              <DlRow label="Company">{invoice.bill_to_company_name}</DlRow>
            )}
            {invoice.bill_to_address && (
              <DlRow label="Address">{invoice.bill_to_address}</DlRow>
            )}
            {invoice.bill_to_phone && (
              <DlRow label="Phone">{invoice.bill_to_phone}</DlRow>
            )}
            {invoice.bill_to_email && (
              <DlRow label="Email">{invoice.bill_to_email}</DlRow>
            )}
            {invoice.bill_to_gstin && (
              <DlRow label="GSTIN">{invoice.bill_to_gstin}</DlRow>
            )}
          </dl>
        </Card>

        {/* ── Issuer ────────────────────────────────────────────────────── */}
        <Card className="p-6">
          <h2 className="mb-4 font-body text-sm font-semibold text-charcoal">Issuer</h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
            <DlRow label="Trade Name">{invoice.issuer_trade_name}</DlRow>
            <DlRow label="Legal Name">{invoice.issuer_legal_name}</DlRow>
            <DlRow label="GSTIN">{invoice.issuer_gstin}</DlRow>
            <DlRow label="Address">{invoice.issuer_address}</DlRow>
          </dl>
        </Card>

      </div>
    </div>
  );
}
