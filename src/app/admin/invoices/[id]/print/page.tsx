import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { amountToWords, fmtINR } from "@/lib/gst";
import type { InvoiceRow } from "@/lib/supabase/database.types";
import { PrintControls } from "./print-controls";

export const metadata: Metadata = { title: "Invoice — Madhuban Eco Retreat" };

import { ADMIN_EMAIL } from "@/lib/admin/constants";
const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? "";

type LineItem = { description: string; hsn: string; qty: number; rate: number; amount: number };

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

interface Props { params: Promise<{ id: string }> }

export default async function InvoicePrintPage({ params }: Props) {
  const { id } = await params;

  // Auth check (outside (authed) layout — must verify manually)
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) redirect("/admin/login");

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const invoice = data as InvoiceRow;
  const lineItems = (Array.isArray(invoice.line_items) ? invoice.line_items : []) as LineItem[];
  const invoiceDateStr = fmtDate(invoice.generated_at.slice(0, 10));

  return (
    <>
      <style>{`
        @page { size: A4; margin: 18mm; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
        body { font-family: 'Lato', system-ui, sans-serif; font-size: 13px; color: #2C2C2C; background: #fff; margin: 0; }
        * { box-sizing: border-box; }
      `}</style>

      <PrintControls id={id} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px" }}>

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${R2_BASE}/branding/logo/madhuban-mark-md.png`}
              alt="Madhuban"
              style={{ height: 52, width: "auto", marginBottom: 10 }}
            />
            <div style={{ fontWeight: 700, fontSize: 15, color: "#3D4A2B" }}>{invoice.issuer_trade_name}</div>
            <div style={{ fontSize: 11, color: "#767676", marginTop: 2 }}>{invoice.issuer_legal_name}</div>
            <div style={{ fontSize: 12, marginTop: 3 }}>{invoice.issuer_address}</div>
            <div style={{ fontSize: 12, marginTop: 2 }}>GSTIN: {invoice.issuer_gstin}</div>
            <div style={{ fontSize: 12, marginTop: 1 }}>State: {invoice.issuer_state} (23)</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#3D4A2B", letterSpacing: 1 }}>TAX INVOICE</div>
          </div>
        </div>

        <div style={{ borderBottom: "2px solid #C9A84C", marginBottom: 14 }} />

        {/* ── Invoice meta ──────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 24, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, color: "#767676", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Invoice Number</div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{invoice.invoice_number}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#767676", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Date</div>
            <div style={{ fontSize: 13 }}>{invoiceDateStr}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#767676", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Place of Supply</div>
            <div style={{ fontSize: 13 }}>{invoice.place_of_supply_state} ({invoice.place_of_supply_state_code})</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#767676", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Service Period</div>
            <div style={{ fontSize: 13 }}>{fmtDate(invoice.service_period_from)} – {fmtDate(invoice.service_period_to)}</div>
          </div>
        </div>

        <div style={{ borderBottom: "1px solid #D9D4C8", marginBottom: 14 }} />

        {/* ── Bill To ───────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: "#767676", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5 }}>Bill To</div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{invoice.bill_to_name}</div>
          {invoice.bill_to_company_name && <div style={{ fontSize: 12, marginTop: 2 }}>{invoice.bill_to_company_name}</div>}
          {invoice.bill_to_address && <div style={{ fontSize: 12, marginTop: 2, color: "#555" }}>{invoice.bill_to_address}</div>}
          {invoice.bill_to_phone && <div style={{ fontSize: 12, marginTop: 2 }}>Ph: {invoice.bill_to_phone}</div>}
          {invoice.bill_to_email && <div style={{ fontSize: 12, marginTop: 1 }}>{invoice.bill_to_email}</div>}
          {invoice.bill_to_gstin && <div style={{ fontSize: 12, marginTop: 2 }}>GSTIN: {invoice.bill_to_gstin}</div>}
        </div>

        <div style={{ borderBottom: "1px solid #D9D4C8", marginBottom: 0 }} />

        {/* ── Line items table ──────────────────────────────────────────── */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 0 }}>
          <thead>
            <tr style={{ backgroundColor: "#3D4A2B", color: "#fff" }}>
              <th style={{ textAlign: "left", padding: "8px 8px", fontWeight: 600, fontSize: 11 }}>Description</th>
              <th style={{ textAlign: "center", padding: "8px 6px", fontWeight: 600, fontSize: 11 }}>HSN</th>
              <th style={{ textAlign: "center", padding: "8px 6px", fontWeight: 600, fontSize: 11 }}>Qty</th>
              <th style={{ textAlign: "right", padding: "8px 8px", fontWeight: 600, fontSize: 11 }}>Rate (₹)</th>
              <th style={{ textAlign: "right", padding: "8px 8px", fontWeight: 600, fontSize: 11 }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 1 ? "#F5F5F0" : "#fff", borderBottom: "1px solid #D9D4C8" }}>
                <td style={{ padding: "8px 8px", fontSize: 12 }}>{item.description}</td>
                <td style={{ padding: "8px 6px", textAlign: "center", fontSize: 12 }}>{item.hsn}</td>
                <td style={{ padding: "8px 6px", textAlign: "center", fontSize: 12 }}>{item.qty}</td>
                <td style={{ padding: "8px 8px", textAlign: "right", fontSize: 12 }}>{item.rate.toLocaleString("en-IN")}</td>
                <td style={{ padding: "8px 8px", textAlign: "right", fontSize: 12 }}>{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── Totals ────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <div style={{ width: 280 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #D9D4C8" }}>
              <span style={{ fontSize: 13 }}>Taxable Amount</span>
              <span style={{ fontSize: 13 }}>{fmtINR(invoice.taxable_amount)}</span>
            </div>

            {!invoice.is_inter_state && invoice.cgst_amount != null && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                  <span style={{ fontSize: 13 }}>CGST @ {invoice.cgst_rate}%</span>
                  <span style={{ fontSize: 13 }}>{fmtINR(invoice.cgst_amount)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #D9D4C8" }}>
                  <span style={{ fontSize: 13 }}>SGST @ {invoice.sgst_rate}%</span>
                  <span style={{ fontSize: 13 }}>{fmtINR(invoice.sgst_amount!)}</span>
                </div>
              </>
            )}

            {invoice.is_inter_state && invoice.igst_amount != null && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #D9D4C8" }}>
                <span style={{ fontSize: 13 }}>IGST @ {invoice.igst_rate}%</span>
                <span style={{ fontSize: 13 }}>{fmtINR(invoice.igst_amount)}</span>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", backgroundColor: "#3D4A2B", marginTop: 4 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>TOTAL</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>{fmtINR(invoice.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* ── Amount in words ───────────────────────────────────────────── */}
        <div style={{ marginTop: 12, border: "1px solid #D9D4C8", padding: 10, backgroundColor: "#F5F5F0" }}>
          <div style={{ fontSize: 10, color: "#767676", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>Amount in Words</div>
          <div style={{ fontWeight: 700, fontSize: 13 }}>{amountToWords(invoice.total_amount)}</div>
        </div>

        {/* ── Footer: QR placeholder + Signature ───────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 24 }}>
          <div>
            <div style={{ fontSize: 10, color: "#767676", marginBottom: 6 }}>Payment</div>
            <div style={{ width: 90, height: 90, border: "1px solid #D9D4C8", backgroundColor: "#F5F5F0", display: "flex", alignItems: "center", justifyContent: "center", padding: 8 }}>
              <div style={{ fontSize: 9, color: "#999", textAlign: "center", lineHeight: 1.4 }}>
                Payment QR will appear once UPI ID is configured in Settings
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#767676", marginBottom: 2 }}>For {invoice.issuer_trade_name}</div>
            <div style={{ height: 32 }} />
            <div style={{ fontWeight: 700, fontSize: 13 }}>Authorised Signatory</div>
            <div style={{ fontSize: 11, color: "#767676" }}>Madhuban Eco Retreat Management</div>
          </div>
        </div>

        {/* ── Footnote ──────────────────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid #D9D4C8", marginTop: 20, paddingTop: 10, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#999" }}>This is a computer-generated invoice and does not require a physical signature.</div>
          <div style={{ fontSize: 10, color: "#999", marginTop: 3 }}>GSTIN: {invoice.issuer_gstin} | {invoice.issuer_address}</div>
        </div>

      </div>
    </>
  );
}
