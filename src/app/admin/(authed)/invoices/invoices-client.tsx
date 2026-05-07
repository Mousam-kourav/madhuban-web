"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Eye, Download, FileDown, Mail, FileSpreadsheet, Receipt } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  DataTable,
  Badge,
  Button,
  Input,
  Select,
  IconButton,
} from "@/components/admin/ui";
import type { Column } from "@/components/admin/ui";
import { fmtINR } from "@/lib/gst";
import type { InvoiceListRow } from "./types";

const PAGE_SIZE = 25;

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function exportToExcel(rows: InvoiceListRow[], baseName: string) {
  if (rows.length === 0) { toast.error("No invoices to export"); return; }
  const wsData = rows.map((inv) => ({
    "Invoice Number":   inv.invoice_number,
    "Invoice Date":     inv.generated_at.slice(0, 10),
    "Guest Name":       inv.bill_to_name,
    "Booking Ref":      inv.booking_ref || "—",
    "Guest GSTIN":      inv.bill_to_gstin ?? "",
    "Place of Supply":  inv.place_of_supply_state,
    "Tax Type":         inv.is_inter_state ? "Inter-state (IGST)" : "Intra-state (CGST+SGST)",
    "GST Rate %":       Number(inv.gst_rate_percent),
    "Taxable Amount":   Number(inv.taxable_amount),
    "CGST Amount":      Number(inv.cgst_amount ?? 0),
    "SGST Amount":      Number(inv.sgst_amount ?? 0),
    "IGST Amount":      Number(inv.igst_amount ?? 0),
    "Total GST":        Number(inv.total_gst_amount),
    "Total Amount":     Number(inv.total_amount),
    "Status":           inv.status,
    "FY":               inv.fy,
  }));
  const ws = XLSX.utils.json_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Invoices");
  XLSX.writeFile(wb, `${baseName}-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function InvoicesClient({ invoices }: { invoices: InvoiceListRow[] }) {
  // ── Filter state ────────────────────────────────────────────────────────────
  const [dateFrom, setDateFrom]           = useState("");
  const [dateTo, setDateTo]               = useState("");
  const [fy, setFy]                       = useState("");
  const [status, setStatus]               = useState("");
  const [placeOfSupply, setPlaceOfSupply] = useState("");
  const [search, setSearch]               = useState("");

  // ── Sort state (parent-managed so sort applies across all pages) ────────────
  const [sortKey, setSortKey] = useState<string | null>("generated_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // ── Pagination + selection state ────────────────────────────────────────────
  const [page, setPage]               = useState(1);
  const [tableKey, setTableKey]       = useState(0);
  const [selected, setSelected]       = useState<InvoiceListRow[]>([]);

  const distinctFYs = useMemo(
    () => [...new Set(invoices.map((i) => i.fy))].sort().reverse(),
    [invoices],
  );

  // ── Filtering ───────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const d = inv.generated_at.slice(0, 10);
      if (dateFrom && d < dateFrom) return false;
      if (dateTo && d > dateTo) return false;
      if (fy && inv.fy !== fy) return false;
      if (status && inv.status !== status) return false;
      if (placeOfSupply === "intra" && inv.is_inter_state) return false;
      if (placeOfSupply === "inter" && !inv.is_inter_state) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !inv.invoice_number.toLowerCase().includes(q) &&
          !inv.bill_to_name.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [invoices, dateFrom, dateTo, fy, status, placeOfSupply, search]);

  // ── Sorting (cross-page) ────────────────────────────────────────────────────
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey as keyof InvoiceListRow];
      const bv = b[sortKey as keyof InvoiceListRow];
      const cmp = String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  // ── Pagination ──────────────────────────────────────────────────────────────
  const paged = useMemo(
    () => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sorted, page],
  );

  function resetToFirstPage() {
    setPage(1);
    setSelected([]);
    setTableKey((k) => k + 1);
  }

  function handleSortChange(key: string) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    setSelected([]);
    setTableKey((k) => k + 1);
  }

  // ── Columns ─────────────────────────────────────────────────────────────────
  const columns: Column<InvoiceListRow>[] = [
    {
      key: "invoice_number",
      label: "Invoice No.",
      sortable: true,
      render: (row) => (
        <Link
          href={`/admin/invoices/${row.id}`}
          className="font-mono text-xs font-medium text-earth-brown hover:underline underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.invoice_number}
        </Link>
      ),
    },
    {
      key: "generated_at",
      label: "Invoice Date",
      sortable: true,
      render: (row) => (
        <span className="tabular-nums text-charcoal/80 whitespace-nowrap">
          {fmtDate(row.generated_at)}
        </span>
      ),
    },
    {
      key: "bill_to_name",
      label: "Guest Name",
      sortable: true,
    },
    {
      key: "booking_ref",
      label: "Booking Ref",
      sortable: true,
      render: (row) => (
        <Link
          href={`/admin/bookings/${row.booking_id}`}
          className="font-mono text-xs text-earth-brown hover:underline underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.booking_ref || "—"}
        </Link>
      ),
    },
    {
      key: "taxable_amount",
      label: "Taxable (₹)",
      sortable: true,
      render: (row) => (
        <span className="block text-right tabular-nums">
          {fmtINR(row.taxable_amount)}
        </span>
      ),
    },
    {
      key: "total_gst_amount",
      label: "GST (₹)",
      sortable: true,
      render: (row) => (
        <span className="block text-right tabular-nums text-charcoal/70">
          {fmtINR(row.total_gst_amount)}
        </span>
      ),
    },
    {
      key: "total_amount",
      label: "Total (₹)",
      sortable: true,
      render: (row) => (
        <span className="block text-right tabular-nums font-semibold">
          {fmtINR(row.total_amount)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={row.status === "ISSUED" ? "confirmed" : "cancelled"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/invoices/${row.id}`} onClick={(e) => e.stopPropagation()}>
            <IconButton icon={<Eye className="w-4 h-4" />} label="View invoice" />
          </Link>
          <a href={`/api/admin/invoices/${row.id}/pdf`} onClick={(e) => e.stopPropagation()}>
            <IconButton icon={<Download className="w-4 h-4" />} label="Download PDF" />
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">

      {/* ── Filter bar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end gap-3">
        <Input
          label="From"
          type="date"
          value={dateFrom}
          onChange={(e) => { setDateFrom(e.target.value); resetToFirstPage(); }}
          className="w-36"
        />
        <Input
          label="To"
          type="date"
          value={dateTo}
          onChange={(e) => { setDateTo(e.target.value); resetToFirstPage(); }}
          className="w-36"
        />
        <Select
          label="Financial Year"
          value={fy}
          onChange={(e) => { setFy(e.target.value); resetToFirstPage(); }}
          options={[
            { value: "", label: "All FY" },
            ...distinctFYs.map((f) => ({ value: f, label: f })),
          ]}
          className="w-32"
        />
        <Select
          label="Status"
          value={status}
          onChange={(e) => { setStatus(e.target.value); resetToFirstPage(); }}
          options={[
            { value: "", label: "All Status" },
            { value: "ISSUED",    label: "Issued" },
            { value: "CANCELLED", label: "Cancelled" },
          ]}
          className="w-36"
        />
        <Select
          label="Place of Supply"
          value={placeOfSupply}
          onChange={(e) => { setPlaceOfSupply(e.target.value); resetToFirstPage(); }}
          options={[
            { value: "",      label: "All" },
            { value: "intra", label: "Intra-state (MP)" },
            { value: "inter", label: "Inter-state" },
          ]}
          className="w-40"
        />
        <Input
          label="Search"
          type="search"
          placeholder="Invoice no. or guest name…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); resetToFirstPage(); }}
          className="w-56"
        />
        <div className="flex-1" />
        <div className="flex items-end">
          <Button
            variant="secondary"
            size="md"
            onClick={() => exportToExcel(sorted, "MADH-Invoices")}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export to Excel
          </Button>
        </div>
      </div>

      {/* ── Bulk action bar ─────────────────────────────────────────────────── */}
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-admin-card-border bg-admin-status-neutral-bg px-4 py-2.5">
          <span className="font-body text-sm text-charcoal/70">
            {selected.length} invoice{selected.length !== 1 ? "s" : ""} selected
          </span>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => exportToExcel(selected, "MADH-Invoices-Selected")}
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Selected
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toast.info("Bulk ZIP download — coming in A8")}
            >
              <FileDown className="w-4 h-4" /> Download ZIP
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toast.info("Bulk email — coming in A8")}
            >
              <Mail className="w-4 h-4" /> Email All
            </Button>
          </div>
        </div>
      )}

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <DataTable
        key={tableKey}
        columns={columns}
        data={paged as unknown as InvoiceListRow[]}
        selectable
        onSelectionChange={(rows) => setSelected(rows as unknown as InvoiceListRow[])}
        pagination={{
          page,
          pageSize: PAGE_SIZE,
          total: sorted.length,
          onPageChange: handlePageChange,
        }}
        serverSortKey={sortKey}
        serverSortDir={sortDir}
        onSortChange={handleSortChange}
        emptyIcon={<Receipt className="w-8 h-8 text-charcoal/30" />}
        emptyTitle="No invoices found"
        emptyDescription="No invoices match the current filters."
      />

      {sorted.length > 0 && (
        <p className="font-body text-xs text-charcoal/50">
          {sorted.length} invoice{sorted.length !== 1 ? "s" : ""}
          {sorted.length < invoices.length ? " (filtered)" : ""}
        </p>
      )}
    </div>
  );
}
