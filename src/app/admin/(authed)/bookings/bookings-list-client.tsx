"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  Download,
  CalendarOff,
  X,
  Plus,
  Mail,
  Printer,
} from "lucide-react";
import {
  Card,
  Button,
  Badge,
  DataTable,
  Input,
  Select,
  DatePicker,
  EmptyState,
} from "@/components/admin/ui";
import type { Column } from "@/components/admin/ui";
import type { BookingListItem, BookingsStats, RoomTypeOption, BookingsQueryParams } from "@/lib/admin/bookings";
import { fetchBookingsForExport } from "./bookings-actions";

// ─── Constants ───────────────────────────────────────────────────────────────

const SOURCE_OPTIONS = [
  { value: "all", label: "All Sources" },
  { value: "website", label: "Website" },
  { value: "airbnb", label: "Airbnb" },
  { value: "mmt", label: "MakeMyTrip" },
  { value: "goibibo", label: "Goibibo" },
  { value: "walkin", label: "Walk-in" },
  { value: "phone", label: "Phone" },
  { value: "agent", label: "Agent" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending_payment", label: "Pending Payment" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checked_in", label: "Checked In" },
  { value: "checked_out", label: "Checked Out" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No Show" },
  { value: "arriving_today", label: "Arriving Today" },
  { value: "departing_today", label: "Departing Today" },
];

const STATUS_BADGE_MAP: Record<string, { variant: "confirmed" | "pending" | "cancelled" | "info" | "neutral"; label: string }> = {
  CONFIRMED:       { variant: "confirmed", label: "Confirmed" },
  CHECKED_IN:      { variant: "info",      label: "Checked In" },
  CHECKED_OUT:     { variant: "neutral",   label: "Checked Out" },
  PENDING_PAYMENT: { variant: "pending",   label: "Pending Payment" },
  CANCELLED:       { variant: "cancelled", label: "Cancelled" },
  NO_SHOW:         { variant: "cancelled", label: "No Show" },
};

const SOURCE_LABELS: Record<string, string> = {
  website: "Website",
  airbnb:  "Airbnb",
  mmt:     "MakeMyTrip",
  goibibo: "Goibibo",
  walkin:  "Walk-in",
  phone:   "Phone",
  agent:   "Agent",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function formatAmount(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

function formatADR(n: number): string {
  if (n === 0) return "—";
  return "₹" + n.toLocaleString("en-IN");
}

function escapeCSVCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

function generateCSV(rows: BookingListItem[]): string {
  const headers = [
    "Booking ID", "Guest Name", "Guest Email", "Room",
    "Check-in Date", "Check-out Date", "Nights",
    "Adults", "Children", "Source", "Status", "Amount", "Created At",
  ];
  const csvRows = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.booking_ref,
        r.guest_name,
        r.guest_email,
        r.room_name,
        r.checkin,
        r.checkout,
        r.nights,
        r.num_adults,
        r.num_children,
        SOURCE_LABELS[r.source] ?? r.source,
        r.status,
        r.total_amount,
        r.created_at,
      ]
        .map((v) => escapeCSVCell(String(v)))
        .join(",")
    ),
  ];
  return csvRows.join("\n");
}

function downloadCSV(csvContent: string, filename: string): void {
  const bom = "﻿"; // UTF-8 BOM for Excel compatibility (handles ₹ and special chars)
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = "checkin" | "checkout" | "created_at" | "total_amount" | "booking_ref" | "status" | "source";
type SortDir = "asc" | "desc";

interface ParsedSort {
  key: SortKey | null;
  dir: SortDir;
}

function parseSort(sort: string | null | undefined): ParsedSort {
  if (!sort) return { key: null, dir: "desc" };
  const colonIdx = sort.lastIndexOf(":");
  if (colonIdx === -1) return { key: null, dir: "desc" };
  const key = sort.slice(0, colonIdx) as SortKey;
  const dir = (sort.slice(colonIdx + 1) === "asc" ? "asc" : "desc") as SortDir;
  return { key, dir };
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface BookingsListClientProps {
  bookings: BookingListItem[];
  stats: BookingsStats;
  roomTypes: RoomTypeOption[];
  // Current URL params (for initializing filter form and export)
  initialParams: {
    from?: string;
    to?: string;
    source?: string;
    status?: string;
    roomId?: string;
    q?: string;
    sort?: string;
    page?: number;
  };
  today: string; // YYYY-MM-DD from server (avoids hydration mismatch)
  todayFormatted: string; // e.g. "Tuesday, 21 April 2026"
}

// ─── Table row type ───────────────────────────────────────────────────────────

type BookingRow = BookingListItem & Record<string, unknown>;

// ─── Main component ───────────────────────────────────────────────────────────

export function BookingsListClient({
  bookings,
  stats,
  roomTypes,
  initialParams,
  today,
  todayFormatted,
}: BookingsListClientProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // ─── Filter form state ───────────────────────────────────────────────────
  const [fromDate, setFromDate] = useState(initialParams.from ?? "");
  const [toDate, setToDate] = useState(initialParams.to ?? "");
  const [source, setSource] = useState(initialParams.source ?? "all");
  const [status, setStatus] = useState(initialParams.status ?? "all");
  const [roomId, setRoomId] = useState(initialParams.roomId ?? "all");

  // ─── Search state (debounced URL update) ─────────────────────────────────
  const [searchValue, setSearchValue] = useState(initialParams.q ?? "");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Sort state (from URL) ────────────────────────────────────────────────
  const parsedSort = parseSort(initialParams.sort);

  // ─── Selection state (local, not in URL) ─────────────────────────────────
  const [selectedRows, setSelectedRows] = useState<BookingListItem[]>([]);

  // ─── Export state ─────────────────────────────────────────────────────────
  const [exporting, setExporting] = useState(false);

  // ─── URL helpers ──────────────────────────────────────────────────────────

  function buildParams(overrides: Record<string, string | undefined>) {
    const base: Record<string, string> = {};
    if (initialParams.sort) base.sort = initialParams.sort;
    if (overrides.from ?? fromDate) base.from = (overrides.from ?? fromDate) || "";
    if (overrides.to ?? toDate) base.to = (overrides.to ?? toDate) || "";
    const srcVal = overrides.source ?? source;
    if (srcVal && srcVal !== "all") base.source = srcVal;
    const stVal = overrides.status ?? status;
    if (stVal && stVal !== "all") base.status = stVal;
    const rmVal = overrides.roomId ?? roomId;
    if (rmVal && rmVal !== "all") base.room = rmVal;
    const qVal = overrides.q ?? searchValue;
    if (qVal) base.q = qVal;

    // Remove empty values
    const clean: Record<string, string> = {};
    for (const [k, v] of Object.entries(base)) {
      if (v) clean[k] = v;
    }
    return clean;
  }

  function navigate(params: Record<string, string>) {
    const sp = new URLSearchParams(params);
    startTransition(() => {
      router.replace(`/admin/bookings?${sp.toString()}`, { scroll: false });
    });
  }

  // ─── Filter handlers ──────────────────────────────────────────────────────

  function applyFilters() {
    const params: Record<string, string> = {};
    if (fromDate) params.from = fromDate;
    if (toDate) params.to = toDate;
    if (source !== "all") params.source = source;
    if (status !== "all") params.status = status;
    if (roomId !== "all") params.room = roomId;
    if (searchValue) params.q = searchValue;
    if (initialParams.sort) params.sort = initialParams.sort;
    // Reset to page 1 when filters change
    navigate(params);
  }

  function clearFilters() {
    setFromDate("");
    setToDate("");
    setSource("all");
    setStatus("all");
    setRoomId("all");
    const params: Record<string, string> = {};
    if (searchValue) params.q = searchValue;
    if (initialParams.sort) params.sort = initialParams.sort;
    navigate(params);
  }

  const hasActiveFilters =
    !!initialParams.from ||
    !!initialParams.to ||
    (!!initialParams.source && initialParams.source !== "all") ||
    (!!initialParams.status && initialParams.status !== "all") ||
    (!!initialParams.roomId && initialParams.roomId !== "all");

  // ─── Search handler (debounced) ───────────────────────────────────────────

  function handleSearchChange(value: string) {
    setSearchValue(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      const params = buildParams({ q: value });
      delete params.page; // reset to page 1
      navigate(params);
    }, 300);
  }

  // ─── Sort handler ─────────────────────────────────────────────────────────

  function handleSortChange(key: string) {
    let newSort: string;
    if (parsedSort.key === key) {
      if (parsedSort.dir === "asc") {
        newSort = `${key}:desc`;
      } else {
        // Reset to default sort
        newSort = "created_at:desc";
      }
    } else {
      newSort = `${key}:asc`;
    }
    const params = buildParams({});
    params.sort = newSort;
    delete params.page;
    navigate(params);
  }

  // ─── Pagination handler ───────────────────────────────────────────────────

  function handlePageChange(page: number) {
    const params = buildParams({});
    if (page > 1) params.page = String(page);
    navigate(params);
  }

  // ─── Export helpers ───────────────────────────────────────────────────────

  const currentExportParams: BookingsQueryParams = {
    from: initialParams.from,
    to: initialParams.to,
    source: initialParams.source,
    status: initialParams.status,
    roomId: initialParams.roomId,
    q: initialParams.q,
    sort: initialParams.sort,
  };

  async function handleExportAll() {
    setExporting(true);
    try {
      const rows = await fetchBookingsForExport(currentExportParams);
      const csv = generateCSV(rows);
      downloadCSV(csv, `madhuban-bookings-export-${today}.csv`);
    } catch {
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  function handleExportSelected() {
    if (selectedRows.length === 0) return;
    const csv = generateCSV(selectedRows);
    downloadCSV(csv, `madhuban-bookings-export-${today}.csv`);
  }

  // ─── Column config ────────────────────────────────────────────────────────

  const columns: Column<BookingRow>[] = [
    {
      key: "booking_ref",
      label: "Booking ID",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-forest-green">
          {row.booking_ref}
        </span>
      ),
    },
    {
      key: "guest_name",
      label: "Guest",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-charcoal">{row.guest_name}</p>
          <p className="text-xs text-charcoal/50">{row.guest_email}</p>
        </div>
      ),
    },
    {
      key: "room_name",
      label: "Room",
      sortable: true,
      render: (row) => (
        <span className="text-charcoal/80">{row.room_name}</span>
      ),
    },
    {
      key: "checkin",
      label: "Dates",
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-charcoal">{formatDate(row.checkin)} – {formatDate(row.checkout)}</p>
          <p className="text-xs text-charcoal/50">{row.nights} night{row.nights !== 1 ? "s" : ""}</p>
        </div>
      ),
    },
    {
      key: "num_adults",
      label: "Guests",
      sortable: false,
      render: (row) => (
        <span className="text-charcoal/80 whitespace-nowrap">
          {row.num_adults}A{row.num_children > 0 ? `, ${row.num_children}C` : ""}
        </span>
      ),
    },
    {
      key: "source",
      label: "Source",
      sortable: true,
      render: (row) => (
        <Badge variant="neutral">
          {SOURCE_LABELS[row.source] ?? row.source}
        </Badge>
      ),
    },
    {
      key: "total_amount",
      label: "Amount",
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-charcoal tabular-nums">
          {formatAmount(row.total_amount)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => {
        const badgeInfo = STATUS_BADGE_MAP[row.status];
        const isArrivingToday = row.status === "CONFIRMED" && row.checkin === today;
        return (
          <div className="flex flex-col gap-1 items-start">
            <Badge variant={badgeInfo?.variant ?? "neutral"}>
              {badgeInfo?.label ?? row.status}
            </Badge>
            {isArrivingToday && (
              <Badge variant="info" className="text-[10px]">ARRIVING TODAY</Badge>
            )}
          </div>
        );
      },
    },
    {
      key: "id",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <a
          href={`/admin/bookings/${row.id}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-charcoal/40 hover:bg-charcoal/5 hover:text-charcoal transition-colors"
          aria-label="View booking"
        >
          <span className="text-lg leading-none">⋯</span>
        </a>
      ),
    },
  ];

  const tableData = bookings as unknown as BookingRow[];

  // ─── Room type select options ──────────────────────────────────────────────

  const roomOptions = [
    { value: "all", label: "All Rooms" },
    ...roomTypes.map((r) => ({ value: r.id, label: r.name })),
  ];

  // ─── Stats display ────────────────────────────────────────────────────────

  const statsText =
    stats.total === 0
      ? "No bookings match these filters"
      : `Showing ${stats.total} booking${stats.total !== 1 ? "s" : ""} · ${formatAmount(stats.totalRevenue)} total · Avg Daily Rate ${formatADR(stats.adr)}`;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-body text-xs uppercase tracking-widest text-charcoal/50">
            Admin · Bookings
          </p>
          <h1 className="mt-1 font-display text-3xl font-medium text-charcoal">
            All Reservations
          </h1>
          <p className="mt-0.5 font-body text-sm text-charcoal/60">{todayFormatted}</p>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportAll}
            loading={exporting}
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
          <Button variant="primary" size="sm" href="/admin/bookings/new">
            <Plus className="w-3.5 h-3.5" />
            New Booking
          </Button>
        </div>
      </div>

      {/* ── Filter row ────────────────────────────────────────────────────── */}
      <Card variant="compact">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[140px] flex-1">
            <DatePicker
              label="Check-in From"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="min-w-[140px] flex-1">
            <DatePicker
              label="Check-in To"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="min-w-[140px] flex-1">
            <Select
              label="Source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              options={SOURCE_OPTIONS}
            />
          </div>
          <div className="min-w-[160px] flex-1">
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={STATUS_OPTIONS}
            />
          </div>
          <div className="min-w-[140px] flex-1">
            <Select
              label="Room Type"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              options={roomOptions}
            />
          </div>
          <Button variant="primary" size="sm" onClick={applyFilters} className="mb-0.5">
            Apply Filters
          </Button>
        </div>
        {hasActiveFilters && (
          <div className="mt-3 border-t border-admin-card-border pt-3">
            <button
              type="button"
              onClick={clearFilters}
              className="font-body text-xs text-charcoal/50 hover:text-charcoal transition-colors underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </Card>

      {/* ── Search + stats bar ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 pointer-events-none" />
          <Input
            placeholder="Search by Guest Name or Booking ID"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="font-body text-sm text-charcoal/60 shrink-0">
          {statsText}
        </p>
      </div>

      {/* ── Bulk action bar ───────────────────────────────────────────────── */}
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-gold-accent/30 bg-gold-accent/5 px-4 py-2.5">
          <span className="font-body text-sm font-semibold text-charcoal">
            {selectedRows.length} selected
          </span>
          <div className="flex items-center gap-2 ml-2">
            <Button variant="secondary" size="sm" onClick={handleExportSelected}>
              <Download className="w-3.5 h-3.5" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.info("Coming in Phase A8 — Operations Polish")}
            >
              <Mail className="w-3.5 h-3.5" />
              Send Reminder
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.info("Coming in Phase A8 — Operations Polish")}
            >
              <Printer className="w-3.5 h-3.5" />
              Print Vouchers
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setSelectedRows([])}
            className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-lg text-charcoal/40 hover:bg-charcoal/5 hover:text-charcoal transition-colors"
            aria-label="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── DataTable ─────────────────────────────────────────────────────── */}
      {stats.total === 0 ? (
        <EmptyState
          icon={<CalendarOff className="w-8 h-8" />}
          title="No bookings found"
          description="Try adjusting your filters or search query."
          action={
            hasActiveFilters || !!initialParams.q
              ? { label: "Clear filters", onClick: clearFilters }
              : { label: "+ New Booking", href: "/admin/bookings/new" }
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={tableData}
          selectable
          onRowClick={(row) => {
            window.location.href = `/admin/bookings/${row.id}`;
          }}
          pagination={{
            page: initialParams.page ?? 1,
            pageSize: 20,
            total: stats.total,
            onPageChange: handlePageChange,
          }}
          serverSortKey={parsedSort.key}
          serverSortDir={parsedSort.dir}
          onSortChange={handleSortChange}
          onSelectionChange={(rows) => setSelectedRows(rows as unknown as BookingListItem[])}
        />
      )}
    </div>
  );
}
