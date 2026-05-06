"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  parseISO,
  addMonths,
  subMonths,
  addDays,
  subDays,
  startOfMonth,
  eachDayOfInterval,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  CalendarRange,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Modal,
  Select,
  TextArea,
  Input,
  Badge,
  Card,
} from "@/components/admin/ui";
import {
  computeCellState,
  type RoomTypeLite,
  type BookingOverlap,
  type ManualBlock,
  type CellState,
} from "@/lib/admin/availability-utils";

// ─── Color mapping ────────────────────────────────────────────────────────────

const CELL_CLASSES: Record<CellState["state"], string> = {
  available: "bg-white border border-admin-card-border text-charcoal/40",
  partial: "bg-warm-beige text-charcoal",
  "fully-booked": "bg-forest-green text-ivory",
  blocked: "bg-charcoal text-ivory",
  "check-in": "bg-gold-accent text-charcoal",
};

const LEGEND = [
  { state: "available" as const, label: "Available" },
  { state: "partial" as const, label: "Partial" },
  { state: "fully-booked" as const, label: "Fully Booked" },
  { state: "check-in" as const, label: "Check-in" },
  { state: "blocked" as const, label: "Blocked" },
];

const REASON_OPTIONS = [
  { value: "Maintenance", label: "Maintenance" },
  { value: "Private Event", label: "Private Event" },
  { value: "Owner / Staff Stay", label: "Owner / Staff Stay" },
  { value: "Renovation", label: "Renovation" },
  { value: "Off-Season Closure", label: "Off-Season Closure" },
  { value: "Other", label: "Other" },
];

function statusLabel(status: string): string {
  switch (status) {
    case "CONFIRMED": return "Confirmed";
    case "CHECKED_IN": return "Checked In";
    case "CHECKED_OUT": return "Checked Out";
    case "PENDING_PAYMENT": return "Pending Payment";
    default: return status;
  }
}

function statusVariant(status: string): "confirmed" | "pending" | "info" | "neutral" {
  switch (status) {
    case "CONFIRMED": return "confirmed";
    case "CHECKED_IN": return "info";
    case "CHECKED_OUT": return "neutral";
    default: return "pending";
  }
}

function formatDisplayDate(dateStr: string): string {
  return format(parseISO(dateStr), "EEE, d MMM yyyy");
}

function formatMonthLabel(dateStr: string): string {
  return format(parseISO(dateStr), "MMMM yyyy");
}

function formatWeekLabel(fromDate: string, toDate: string): string {
  const from = parseISO(fromDate);
  const to = subDays(parseISO(toDate), 1);
  if (format(from, "MMM yyyy") === format(to, "MMM yyyy")) {
    return `${format(from, "d")}–${format(to, "d MMM yyyy")}`;
  }
  return `${format(from, "d MMM")} – ${format(to, "d MMM yyyy")}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type SelectedCell = {
  roomId: string;
  date: string;
  cellState: CellState;
};

type BlockFormData = {
  room_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  notes: string;
};

// ─── Main Client Component ────────────────────────────────────────────────────

interface AvailabilityClientProps {
  rooms: RoomTypeLite[];
  bookings: BookingOverlap[];
  blocks: ManualBlock[];
  view: "month" | "week";
  fromDate: string;
  toDate: string; // exclusive
  today: string;
}

export function AvailabilityClient({
  rooms,
  bookings,
  blocks,
  view,
  fromDate,
  toDate,
  today,
}: AvailabilityClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockPrefill, setBlockPrefill] = useState<Partial<BlockFormData>>({});
  const [blockModalKey, setBlockModalKey] = useState(0);

  // Compute days to display
  const lastDay = subDays(parseISO(toDate), 1);
  const days = eachDayOfInterval({
    start: parseISO(fromDate),
    end: lastDay,
  }).map((d) => format(d, "yyyy-MM-dd"));

  // ── Navigation ──────────────────────────────────────────────────────────────

  function navigate(newStart: string) {
    startTransition(() => {
      router.push(`/admin/availability?view=${view}&start=${newStart}`);
    });
  }

  function handlePrev() {
    if (view === "month") {
      navigate(format(subMonths(parseISO(fromDate), 1), "yyyy-MM-dd"));
    } else {
      navigate(format(subDays(parseISO(fromDate), 7), "yyyy-MM-dd"));
    }
  }

  function handleNext() {
    if (view === "month") {
      navigate(format(addMonths(parseISO(fromDate), 1), "yyyy-MM-dd"));
    } else {
      navigate(format(addDays(parseISO(fromDate), 7), "yyyy-MM-dd"));
    }
  }

  function handleToday() {
    if (view === "month") {
      navigate(format(startOfMonth(parseISO(today)), "yyyy-MM-dd"));
    } else {
      navigate(today);
    }
  }

  function handleViewToggle(newView: "month" | "week") {
    if (newView === view) return;
    const newStart = newView === "month"
      ? format(startOfMonth(parseISO(fromDate)), "yyyy-MM-dd")
      : fromDate;
    startTransition(() => {
      router.push(`/admin/availability?view=${newView}&start=${newStart}`);
    });
  }

  // ── Cell click ──────────────────────────────────────────────────────────────

  function handleCellClick(room: RoomTypeLite, date: string) {
    const cellState = computeCellState(room, date, bookings, blocks);
    setSelectedCell({ roomId: room.id, date, cellState });
  }

  // ── Block modal helpers ─────────────────────────────────────────────────────

  function openBlockModal(prefill?: Partial<BlockFormData>) {
    setBlockPrefill(prefill ?? {});
    setBlockModalOpen(true);
    setBlockModalKey((k) => k + 1);
  }

  function openBlockFromCell(room: RoomTypeLite, date: string) {
    openBlockModal({
      room_id: room.id,
      start_date: date,
      end_date: format(addDays(parseISO(date), 1), "yyyy-MM-dd"),
    });
  }

  // ── Remove block ────────────────────────────────────────────────────────────

  async function handleRemoveBlock(blockId: string) {
    if (!confirm("Remove this block? Dates will become bookable again.")) return;
    try {
      const res = await fetch("/api/admin/availability/unblock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ block_id: blockId }),
      });
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        toast.error(err.error ?? "Failed to remove block");
        return;
      }
      toast.success("Block removed");
      setSelectedCell(null);
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    }
  }

  const periodLabel =
    view === "month"
      ? formatMonthLabel(fromDate)
      : formatWeekLabel(fromDate, toDate);

  return (
    <div className="space-y-4">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={isPending}
            aria-label="Previous period"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-admin-card-border text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal transition-colors disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleToday}
            disabled={isPending}
            className="h-9 px-3 rounded-xl border border-admin-card-border font-body text-sm text-charcoal/70 hover:bg-charcoal/5 hover:text-charcoal transition-colors disabled:opacity-40"
          >
            Today
          </button>
          <button
            onClick={handleNext}
            disabled={isPending}
            aria-label="Next period"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-admin-card-border text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal transition-colors disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <h2 className="font-display text-xl font-medium text-charcoal ml-1">
            {periodLabel}
          </h2>
          {isPending && (
            <span className="font-body text-xs text-charcoal/40 animate-pulse">Loading…</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-xl border border-admin-card-border overflow-hidden">
            {(["month", "week"] as const).map((v) => (
              <button
                key={v}
                onClick={() => handleViewToggle(v)}
                disabled={isPending}
                className={`h-9 px-4 font-body text-sm capitalize transition-colors disabled:opacity-40 ${
                  view === v
                    ? "bg-forest-green text-ivory"
                    : "text-charcoal/70 hover:bg-charcoal/5 hover:text-charcoal"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => openBlockModal()}
          >
            <CalendarRange className="w-4 h-4" />
            Block Dates
          </Button>
        </div>
      </div>

      {/* ── Legend ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 flex-wrap">
        {LEGEND.map(({ state, label }) => (
          <div key={state} className="flex items-center gap-1.5">
            <div
              className={`h-3 w-3 rounded-sm flex-shrink-0 ${CELL_CLASSES[state]}`}
            />
            <span className="font-body text-xs text-charcoal/50">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm border-2 border-gold-accent flex-shrink-0" />
          <span className="font-body text-xs text-charcoal/50">Today</span>
        </div>
      </div>

      {/* ── Calendar grid ───────────────────────────────────────────────────── */}
      <Card>
        {rooms.length === 0 ? (
          <div className="py-12 text-center font-body text-sm text-charcoal/40">
            No active rooms found.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <CalendarGrid
              rooms={rooms}
              days={days}
              bookings={bookings}
              blocks={blocks}
              today={today}
              view={view}
              selectedCell={selectedCell}
              onCellClick={handleCellClick}
            />
          </div>
        )}
      </Card>

      {/* ── Side panel ──────────────────────────────────────────────────────── */}
      {selectedCell && (
        <SidePanel
          rooms={rooms}
          selectedCell={selectedCell}
          onClose={() => setSelectedCell(null)}
          onBlock={openBlockFromCell}
          onRemoveBlock={handleRemoveBlock}
        />
      )}

      {/* ── Block Dates modal ────────────────────────────────────────────────── */}
      <BlockDatesModal
        key={blockModalKey}
        open={blockModalOpen}
        rooms={rooms}
        prefill={blockPrefill}
        today={today}
        onClose={() => setBlockModalOpen(false)}
        onSuccess={() => {
          setBlockModalOpen(false);
          router.refresh();
        }}
      />
    </div>
  );
}

// ─── Calendar Grid ────────────────────────────────────────────────────────────

interface CalendarGridProps {
  rooms: RoomTypeLite[];
  days: string[];
  bookings: BookingOverlap[];
  blocks: ManualBlock[];
  today: string;
  view: "month" | "week";
  selectedCell: SelectedCell | null;
  onCellClick: (room: RoomTypeLite, date: string) => void;
}

function CalendarGrid({
  rooms,
  days,
  bookings,
  blocks,
  today,
  view,
  selectedCell,
  onCellClick,
}: CalendarGridProps) {
  const cellW = view === "week" ? "min-w-[80px]" : "min-w-[36px]";
  const cellH = view === "week" ? "h-12" : "h-8";
  const roomColW = "min-w-[120px] w-[120px]";

  return (
    <table className="border-separate border-spacing-0.5 min-w-full">
      <thead>
        <tr>
          {/* Room label column */}
          <th className={`${roomColW} sticky left-0 z-10 bg-admin-canvas-bg pb-1 text-left`} />
          {days.map((day) => {
            const d = parseISO(day);
            const isToday = day === today;
            return (
              <th
                key={day}
                className={`${cellW} pb-1 text-center align-bottom`}
              >
                <div
                  className={`flex flex-col items-center ${
                    isToday ? "text-gold-accent font-semibold" : "text-charcoal/50"
                  }`}
                >
                  <span className="font-body text-[10px] uppercase tracking-wide">
                    {format(d, "EEE").slice(0, view === "week" ? 3 : 1)}
                  </span>
                  <span className="font-body text-xs">
                    {view === "week" ? format(d, "d MMM") : format(d, "d")}
                  </span>
                </div>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rooms.map((room) => (
          <tr key={room.id}>
            {/* Room name */}
            <td
              className={`${roomColW} sticky left-0 z-10 bg-admin-canvas-bg pr-2 py-0.5`}
            >
              <span className="font-body text-xs font-medium text-charcoal truncate block">
                {room.name}
              </span>
            </td>
            {days.map((day) => {
              const cellState = computeCellState(room, day, bookings, blocks);
              const isToday = day === today;
              const isSelected =
                selectedCell?.roomId === room.id && selectedCell?.date === day;
              const tooltip =
                cellState.state === "blocked"
                  ? `Blocked — ${cellState.blocks[0]?.reason ?? ""}`
                  : cellState.state === "available"
                  ? "Available"
                  : `${cellState.occupied}/${room.inventory_count} occupied`;

              return (
                <td key={day} className={`${cellW} py-0.5`}>
                  <button
                    type="button"
                    onClick={() => onCellClick(room, day)}
                    title={tooltip}
                    aria-label={`${room.name} on ${format(parseISO(day), "d MMM yyyy")}: ${tooltip}`}
                    className={`
                      w-full ${cellH} rounded-md flex items-center justify-center
                      font-body text-xs transition-all cursor-pointer
                      ${CELL_CLASSES[cellState.state]}
                      ${isToday ? "ring-2 ring-gold-accent ring-offset-1" : ""}
                      ${isSelected ? "ring-2 ring-forest-green ring-offset-1 scale-110" : "hover:scale-105"}
                    `}
                  >
                    {view === "week" && cellState.state !== "available" && (
                      <span className="text-[11px] font-medium">
                        {cellState.state === "blocked"
                          ? "Blocked"
                          : `${cellState.occupied}/${room.inventory_count}`}
                      </span>
                    )}
                  </button>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Side Panel ───────────────────────────────────────────────────────────────

interface SidePanelProps {
  rooms: RoomTypeLite[];
  selectedCell: SelectedCell;
  onClose: () => void;
  onBlock: (room: RoomTypeLite, date: string) => void;
  onRemoveBlock: (blockId: string) => Promise<void>;
}

function SidePanel({
  rooms,
  selectedCell,
  onClose,
  onBlock,
  onRemoveBlock,
}: SidePanelProps) {
  const room = rooms.find((r) => r.id === selectedCell.roomId);
  const { date, cellState } = selectedCell;
  const [removing, setRemoving] = useState<string | null>(null);

  if (!room) return null;

  async function handleRemove(blockId: string) {
    setRemoving(blockId);
    await onRemoveBlock(blockId);
    setRemoving(null);
  }

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-sm shadow-2xl">
      {/* Backdrop (mobile) */}
      <div
        className="fixed inset-0 bg-charcoal/30 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative h-full overflow-y-auto bg-admin-card-bg border-l border-admin-card-border flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-admin-card-border px-5 py-4 flex-shrink-0">
          <div>
            <h3 className="font-display text-lg font-medium text-charcoal">
              {room.name}
            </h3>
            <p className="font-body text-xs text-charcoal/60 mt-0.5">
              {formatDisplayDate(date)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="rounded-lg p-1.5 text-charcoal/40 hover:text-charcoal hover:bg-charcoal/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Status summary */}
          <div>
            <StatePill state={cellState.state} />
            {cellState.state === "blocked" ? (
              <p className="mt-1 font-body text-sm text-charcoal/70">
                Blocked — whole room type unavailable
              </p>
            ) : cellState.state === "available" ? (
              <p className="mt-1 font-body text-sm text-charcoal/70">
                All {room.inventory_count} units available
              </p>
            ) : (
              <p className="mt-1 font-body text-sm text-charcoal/70">
                {cellState.occupied} of {room.inventory_count} units occupied
              </p>
            )}
          </div>

          {/* Bookings list */}
          {cellState.bookings.length > 0 && (
            <div>
              <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-2">
                Bookings
              </h4>
              <ul className="space-y-2">
                {cellState.bookings.map((b) => (
                  <li key={b.id} className="rounded-xl border border-admin-card-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-body text-sm font-medium text-charcoal truncate">
                          {b.guest_name}
                        </p>
                        <p className="font-body text-xs text-charcoal/50 mt-0.5">
                          {b.num_adults + b.num_children} guests ·{" "}
                          {format(parseISO(b.checkin), "d MMM")} –{" "}
                          {format(parseISO(b.checkout), "d MMM")}
                        </p>
                      </div>
                      <Badge variant={statusVariant(b.status)}>
                        {statusLabel(b.status)}
                      </Badge>
                    </div>
                    <a
                      href={`/admin/bookings/${b.id}`}
                      className="mt-2 inline-block font-body text-xs text-earth-brown hover:underline underline-offset-4"
                    >
                      View booking →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Blocks list */}
          {cellState.blocks.length > 0 && (
            <div>
              <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-2">
                Blocks
              </h4>
              <ul className="space-y-2">
                {cellState.blocks.map((bl) => (
                  <li key={bl.id} className="rounded-xl border border-admin-card-border p-3">
                    <p className="font-body text-sm font-medium text-charcoal">
                      {bl.reason ?? "No reason given"}
                    </p>
                    <p className="font-body text-xs text-charcoal/50 mt-0.5">
                      {format(parseISO(bl.date_from), "d MMM")} –{" "}
                      {format(parseISO(bl.date_to), "d MMM yyyy")}
                    </p>
                    {bl.notes && (
                      <p className="font-body text-xs text-charcoal/60 mt-1 italic">
                        {bl.notes}
                      </p>
                    )}
                    <button
                      type="button"
                      disabled={removing === bl.id}
                      onClick={() => handleRemove(bl.id)}
                      className="mt-2 font-body text-xs text-error hover:underline underline-offset-4 disabled:opacity-50"
                    >
                      {removing === bl.id ? "Removing…" : "Remove block"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex-shrink-0 border-t border-admin-card-border px-5 py-4 space-y-2">
          {cellState.state !== "blocked" && (
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => onBlock(room, date)}
            >
              <CalendarRange className="w-4 h-4" />
              Block This Day for {room.name}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatePill({ state }: { state: CellState["state"] }) {
  const labels: Record<CellState["state"], string> = {
    available: "Available",
    partial: "Partially Occupied",
    "fully-booked": "Fully Booked",
    blocked: "Blocked",
    "check-in": "Check-in Day",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-body text-xs font-semibold ${CELL_CLASSES[state]}`}
    >
      {labels[state]}
    </span>
  );
}

// ─── Block Dates Modal ────────────────────────────────────────────────────────

interface BlockDatesModalProps {
  open: boolean;
  rooms: RoomTypeLite[];
  prefill: Partial<BlockFormData>;
  today: string;
  onClose: () => void;
  onSuccess: () => void;
}

function BlockDatesModal({
  open,
  rooms,
  prefill,
  today,
  onClose,
  onSuccess,
}: BlockDatesModalProps) {
  const [roomId, setRoomId] = useState(prefill.room_id ?? "");
  const [startDate, setStartDate] = useState(prefill.start_date ?? today);
  const [endDate, setEndDate] = useState(prefill.end_date ?? "");
  const [reason, setReason] = useState(prefill.reason ?? "");
  const [notes, setNotes] = useState(prefill.notes ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const roomOptions = rooms.map((r) => ({ value: r.id, label: r.name }));
  const isPrefillRoom = !!prefill.room_id;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (!roomId) { setServerError("Please select a room type."); return; }
    if (!startDate) { setServerError("Start date is required."); return; }
    if (!endDate) { setServerError("End date is required."); return; }
    if (endDate <= startDate) { setServerError("End date must be after start date."); return; }
    if (!reason) { setServerError("Reason category is required."); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/availability/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: roomId,
          start_date: startDate,
          end_date: endDate,
          reason,
          notes: notes.trim() || undefined,
        }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) {
        setServerError(data.error ?? "Failed to create block.");
        return;
      }
      toast.success("Dates blocked");
      onSuccess();
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Block Dates" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Room Type */}
        <div>
          {isPrefillRoom ? (
            <div>
              <label className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal block mb-1">
                Room Type
              </label>
              <p className="font-body text-sm text-charcoal px-3 h-10 flex items-center border border-admin-card-border rounded-xl bg-charcoal/5">
                {rooms.find((r) => r.id === prefill.room_id)?.name ?? "—"}
              </p>
            </div>
          ) : (
            <Select
              label="Room Type"
              required
              placeholder="Select a room type"
              options={roomOptions}
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          )}
        </div>

        {/* Date range */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Date"
            type="date"
            required
            min={today}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="End Date"
            type="date"
            required
            min={startDate || today}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Reason */}
        <Select
          label="Reason"
          required
          placeholder="Select a reason"
          options={REASON_OPTIONS}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        {/* Notes */}
        <TextArea
          label="Additional Notes"
          placeholder="Optional details for staff reference"
          helperText="Optional"
          value={notes}
          maxLength={500}
          currentLength={notes.length}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Server error */}
        {serverError && (
          <div className="flex items-start gap-2 rounded-xl border border-error/30 bg-error/5 px-3 py-2.5">
            <AlertTriangle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
            <p className="font-body text-sm text-error">{serverError}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" type="button" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={submitting}>
            Block Dates
          </Button>
        </div>
      </form>
    </Modal>
  );
}
