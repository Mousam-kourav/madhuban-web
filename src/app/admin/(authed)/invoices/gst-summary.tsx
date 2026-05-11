"use client";

import { useState, useMemo } from "react";
import { FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Button, Input } from "@/components/admin/ui";
import { fmtINR } from "@/lib/gst";
import { cn } from "@/lib/utils";
import type { InvoiceListRow } from "./types";

interface GstBucket {
  rate: number;
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  totalAmount: number;
}

const ZERO_TOTALS: GstBucket = { rate: 0, taxable: 0, cgst: 0, sgst: 0, igst: 0, totalGst: 0, totalAmount: 0 };

function getDefaultMonth() {
  return new Date().toISOString().slice(0, 7);
}

function monthLabel(ym: string) {
  return new Date(ym + "-01T00:00:00").toLocaleDateString("en-IN", {
    month: "long", year: "numeric",
  });
}

const COL_HEADERS = ["Rate", "Taxable Value", "CGST", "SGST", "IGST", "Total GST", "Total Invoice Value"];

export function GstSummary({ invoices }: { invoices: InvoiceListRow[] }) {
  const [month, setMonth] = useState(getDefaultMonth);

  const { buckets, monthInvoices } = useMemo(() => {
    const monthInvoices = invoices.filter(
      (inv) => inv.status === "ISSUED" && inv.generated_at.slice(0, 7) === month,
    );

    const map: Record<number, GstBucket> = {};
    for (const inv of monthInvoices) {
      const r = inv.gst_rate_percent;
      if (!map[r]) map[r] = { ...ZERO_TOTALS, rate: r };
      map[r].taxable    += Number(inv.taxable_amount);
      map[r].cgst       += Number(inv.cgst_amount ?? 0);
      map[r].sgst       += Number(inv.sgst_amount ?? 0);
      map[r].igst       += Number(inv.igst_amount ?? 0);
      map[r].totalGst   += Number(inv.total_gst_amount);
      map[r].totalAmount += Number(inv.total_amount);
    }

    return {
      buckets: Object.values(map).sort((a, b) => a.rate - b.rate),
      monthInvoices,
    };
  }, [invoices, month]);

  const totals = useMemo(
    () => buckets.reduce(
      (acc, b) => ({
        ...acc,
        taxable:     acc.taxable     + b.taxable,
        cgst:        acc.cgst        + b.cgst,
        sgst:        acc.sgst        + b.sgst,
        igst:        acc.igst        + b.igst,
        totalGst:    acc.totalGst    + b.totalGst,
        totalAmount: acc.totalAmount + b.totalAmount,
      }),
      { ...ZERO_TOTALS },
    ),
    [buckets],
  );

  function handleExport() {
    if (monthInvoices.length === 0) {
      toast.error("No issued invoices for this month");
      return;
    }

    // Sheet 1: Summary
    const summaryData = [
      ...buckets.map((b) => ({
        "Rate":                `${b.rate}%`,
        "Taxable Value":       b.taxable,
        "CGST":                b.cgst,
        "SGST":                b.sgst,
        "IGST":                b.igst,
        "Total GST":           b.totalGst,
        "Total Invoice Value": b.totalAmount,
      })),
      {
        "Rate":                "Total",
        "Taxable Value":       totals.taxable,
        "CGST":                totals.cgst,
        "SGST":                totals.sgst,
        "IGST":                totals.igst,
        "Total GST":           totals.totalGst,
        "Total Invoice Value": totals.totalAmount,
      },
    ];

    // Sheet 2: Individual invoices (GSTR-1 fields)
    const invoiceData = monthInvoices.map((inv) => ({
      "Invoice Number":    inv.invoice_number,
      "Invoice Date":      inv.generated_at.slice(0, 10),
      "Guest Name":        inv.bill_to_name,
      "Recipient GSTIN":   inv.bill_to_gstin ?? "",
      "Place of Supply":   inv.place_of_supply_state,
      "Place of Supply Code": inv.place_of_supply_state_code,
      "GST Rate %":        Number(inv.gst_rate_percent),
      "Taxable Value":     Number(inv.taxable_amount),
      "CGST Amount":       Number(inv.cgst_amount ?? 0),
      "SGST Amount":       Number(inv.sgst_amount ?? 0),
      "IGST Amount":       Number(inv.igst_amount ?? 0),
      "Total GST":         Number(inv.total_gst_amount),
      "Total Amount":      Number(inv.total_amount),
      "Tax Type":          inv.is_inter_state ? "Inter-state (IGST)" : "Intra-state (CGST+SGST)",
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryData), "Summary");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(invoiceData), "Invoices");
    XLSX.writeFile(wb, `MADH-GST-Summary-${month}.xlsx`);
  }

  return (
    <section className="space-y-4">

      {/* ── Section header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-xl font-medium text-charcoal">
          GST Summary — Monthly Liabilities
        </h2>
        <div className="flex flex-wrap items-end gap-3">
          <Input
            label="Month"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-40"
          />
          <Button
            variant="secondary"
            size="md"
            onClick={handleExport}
            disabled={monthInvoices.length === 0}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Download GST Report (Excel)
          </Button>
        </div>
      </div>

      {/* ── Summary table ──────────────────────────────────────────────────── */}
      {buckets.length === 0 ? (
        <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-10 text-center">
          <p className="font-body text-sm text-charcoal/50">
            No issued invoices in {monthLabel(month)}.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-admin-card-border bg-admin-card-bg shadow-[var(--admin-card-shadow)]">
          <div className="overflow-x-auto">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-admin-card-border bg-admin-canvas-bg">
                  {COL_HEADERS.map((h, i) => (
                    <th
                      key={h}
                      className={cn(
                        "px-4 py-3 font-semibold text-xs uppercase tracking-wider text-charcoal/60",
                        i === 0 ? "text-left" : "text-right",
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-card-border">
                {buckets.map((b) => (
                  <tr key={b.rate} className="text-charcoal">
                    <td className="px-4 py-3 font-medium">{b.rate}%</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmtINR(b.taxable)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmtINR(b.cgst)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmtINR(b.sgst)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmtINR(b.igst)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmtINR(b.totalGst)}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold">{fmtINR(b.totalAmount)}</td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr className="border-t-2 border-admin-card-border bg-admin-canvas-bg font-semibold text-charcoal">
                  <td className="px-4 py-3">Total</td>
                  <td className="px-4 py-3 text-right tabular-nums">{fmtINR(totals.taxable)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{fmtINR(totals.cgst)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{fmtINR(totals.sgst)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{fmtINR(totals.igst)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{fmtINR(totals.totalGst)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{fmtINR(totals.totalAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="font-body text-xs text-charcoal/50">
        Only <strong className="font-medium text-charcoal/70">Issued</strong> invoices
        in {monthLabel(month)} are counted. Cancelled invoices are excluded.
      </p>
    </section>
  );
}
