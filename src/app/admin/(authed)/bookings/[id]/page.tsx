import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  CheckCircle2, XCircle, Circle, Zap,
  CreditCard, Banknote, CalendarDays, Users, BedDouble,
} from "lucide-react";
import { computeRoomGstRate } from "@/lib/gst";
import { Card, Badge } from "@/components/admin/ui";
import {
  bookingStatusVariant, bookingStatusLabel,
  initialsFromName, avatarColor,
} from "@/lib/admin/dashboard";
import { BookingActionsPanel } from "./booking-actions";
import { StaffNotesPanel } from "./internal-note-form";
import { RecordPaymentSection } from "./record-payment-section";
import { TopbarToastBtn, ArrivingBannerBtn, FolioAddChargesBtn, GenerateInvoiceBtn } from "./booking-detail-islands";

export const metadata: Metadata = { title: "Booking Detail — Madhuban Admin" };

// ─── local types ────────────────────────────────────────────────────────────

type StaffNote = { text: string; author_email: string; created_at: string };

type GuestRow = {
  id: string; name: string; email: string; mobile: string | null;
  id_type: string | null; id_number: string | null; gstin: string | null; address: string | null;
};

type RoomRow = {
  id: string; name: string; slug: string;
  description_short: string | null;
  base_price_per_night: number;
  gst_rate: number | null;
  hero_image: unknown; gallery: unknown;
  max_occupancy: number;
};

type BookingRow = {
  id: string; booking_ref: string; status: string; payment_status: string;
  checkin: string; checkout: string;
  num_adults: number; num_children: number;
  base_amount: number; gst_amount: number; total_amount: number; discount_amount: number;
  coupon_code: string | null; source: string;
  special_requests: string | null; internal_notes: string | null;
  staff_notes: StaffNote[] | null;
  cancellation_reason: string | null; cancelled_at: string | null;
  assigned_unit: string | null;
  created_at: string; updated_at: string;
  guests: GuestRow | null; rooms: RoomRow | null;
};

type PaymentRow = {
  id: string; amount: number; status: string; payment_type: string;
  method: string | null; razorpay_payment_id: string | null; razorpay_order_id: string | null;
  reference_number: string | null; notes: string | null;
  captured_at: string | null; refund_amount: number; refunded_at: string | null; created_at: string;
};

type AuditEntry = { id: string; action: string; details: unknown; created_at: string };

type TimelineStatus = "complete" | "inprogress" | "pending" | "cancelled";
type TimelineEvent = {
  id: string; title: string; subtitle?: string; time?: string; status: TimelineStatus;
};

// ─── helpers ────────────────────────────────────────────────────────────────

const SOURCE_LABELS: Record<string, string> = {
  website: "Direct Website", airbnb: "Airbnb", mmt: "MakeMyTrip",
  goibibo: "Goibibo", walkin: "Walk-in", phone: "Phone", agent: "Travel Agent",
};

const METHOD_LABELS: Record<string, string> = {
  razorpay: "Razorpay", cash: "Cash", upi: "UPI",
  bank_transfer: "Bank Transfer", cheque: "Cheque", card: "Card",
};

const ID_TYPE_LABELS: Record<string, string> = {
  Passport: "Passport", Aadhar: "Aadhaar Card", DL: "Driving Licence",
  Pan: "PAN Card", Visa: "Visa",
};

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

function fmtDateLong(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function fmtAmt(n: number) { return n.toLocaleString("en-IN"); }

function maskIdNumber(raw: string | null): string {
  if (!raw) return "—";
  const stripped = raw.replace(/\s+/g, "");
  if (stripped.length <= 4) return stripped;
  const visible = stripped.slice(-4);
  const masked = "X".repeat(stripped.length - 4);
  return (masked + visible).replace(/(.{4})(?!$)/g, "$1 ");
}

function getRoomThumbnail(room: RoomRow | null): string | null {
  if (!room) return null;
  if (room.hero_image && typeof room.hero_image === "object") {
    const h = room.hero_image as { webp?: { desktop?: string } };
    if (h.webp?.desktop) return h.webp.desktop;
  }
  if (Array.isArray(room.gallery) && room.gallery.length > 0) {
    const first = room.gallery[0] as { webp?: { desktop?: string } } | undefined;
    if (first?.webp?.desktop) return first.webp.desktop;
  }
  return null;
}

function buildTimeline(
  booking: BookingRow,
  payments: PaymentRow[],
  auditLog: AuditEntry[],
): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const today = new Date().toISOString().slice(0, 10);

  events.push({ id: "received", title: "Booking Received", time: fmtDateTime(booking.created_at), status: "complete" });

  const adv = payments.find(p => p.payment_type === "advance" && p.status === "captured");
  if (adv) {
    events.push({
      id: "deposit", title: "Deposit Paid",
      subtitle: `₹${fmtAmt(Number(adv.amount))} via ${METHOD_LABELS[adv.method ?? ""] ?? (adv.method ?? "Razorpay")}`,
      time: fmtDateTime(adv.captured_at ?? adv.created_at),
      status: "complete",
    });
  }

  const checkInAudit = auditLog.find(e => e.action === "check_in");
  if (checkInAudit) {
    events.push({ id: "checkin", title: "Checked In", time: fmtDateTime(checkInAudit.created_at), status: "complete" });
  } else if (!["CANCELLED", "NO_SHOW", "CHECKED_OUT"].includes(booking.status)) {
    const isToday = booking.checkin === today;
    const isPast = booking.checkin < today;
    events.push({
      id: "arriving",
      title: isToday ? "Arriving Today" : isPast ? "Arrival Overdue" : "Expected Arrival",
      subtitle: `Scheduled ${fmtDate(booking.checkin)}`,
      time: isToday ? fmtDateLong(booking.checkin) : undefined,
      status: isToday ? "inprogress" : "pending",
    });
  }

  const checkOutAudit = auditLog.find(e => e.action === "check_out");
  if (checkOutAudit) {
    events.push({ id: "checkout", title: "Checked Out", time: fmtDateTime(checkOutAudit.created_at), status: "complete" });
  } else if (booking.status === "CHECKED_IN") {
    events.push({
      id: "departure", title: "Departure",
      subtitle: `Scheduled ${fmtDate(booking.checkout)}`,
      status: "pending",
    });
  }

  if (!["CANCELLED", "NO_SHOW"].includes(booking.status)) {
    events.push({
      id: "invoice", title: "Final Invoice",
      subtitle: booking.status === "CHECKED_OUT" ? "Pending generation — Phase A7" : "Generated on checkout",
      status: "pending",
    });
  }

  if (booking.status === "CANCELLED") {
    const cancelAudit = auditLog.find(e => e.action === "cancelled");
    events.push({
      id: "cancelled", title: "Booking Cancelled",
      subtitle: booking.cancellation_reason ?? "No reason provided",
      time: booking.cancelled_at
        ? fmtDateTime(booking.cancelled_at)
        : cancelAudit ? fmtDateTime(cancelAudit.created_at) : undefined,
      status: "cancelled",
    });
  }

  if (booking.status === "NO_SHOW") {
    const nsAudit = auditLog.find(e => e.action === "no_show");
    events.push({
      id: "noshow", title: "No-Show",
      time: nsAudit ? fmtDateTime(nsAudit.created_at) : undefined,
      status: "cancelled",
    });
  }

  return events;
}

// ─── sub-components (server) ─────────────────────────────────────────────────

function DlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="font-body text-xs text-charcoal/60 pt-0.5">{label}</dt>
      <dd className="font-body text-sm text-charcoal">{children}</dd>
    </>
  );
}

function TimelineDot({ status }: { status: TimelineStatus }) {
  if (status === "complete") return (
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-forest-green flex items-center justify-center">
      <CheckCircle2 className="w-4 h-4 text-ivory" />
    </div>
  );
  if (status === "inprogress") return (
    <div className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-[var(--color-gold-accent,#C9A84C)] bg-amber-50 flex items-center justify-center animate-pulse">
      <Zap className="w-3.5 h-3.5 text-amber-600" />
    </div>
  );
  if (status === "cancelled") return (
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-error flex items-center justify-center">
      <XCircle className="w-4 h-4 text-ivory" />
    </div>
  );
  return (
    <div className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-warm-beige bg-admin-card-bg flex items-center justify-center">
      <Circle className="w-3 h-3 text-charcoal/30" />
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

interface Props { params: Promise<{ id: string }> }

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: bookingRaw } = await supabase
    .from("bookings")
    .select(`
      *,
      guests!guest_id ( id, name, email, mobile, id_type, id_number, gstin, address ),
      rooms!room_id ( id, name, slug, description_short, base_price_per_night, gst_rate, hero_image, gallery, max_occupancy )
    `)
    .eq("id", id)
    .single();

  if (!bookingRaw) notFound();

  const booking = bookingRaw as unknown as BookingRow;
  const guest  = Array.isArray(booking.guests) ? booking.guests[0] ?? null : booking.guests;
  const room   = Array.isArray(booking.rooms)  ? booking.rooms[0]  ?? null : booking.rooms;

  const { data: paymentsRaw } = await supabase
    .from("payments").select("*").eq("booking_id", id).order("created_at", { ascending: true });
  const payments = (paymentsRaw ?? []) as unknown as PaymentRow[];

  const { data: auditRaw } = await supabase
    .from("audit_log").select("id, action, details, created_at, admin_user_id")
    .eq("entity_id", id).order("created_at", { ascending: true });
  const auditLog = (auditRaw ?? []) as unknown as AuditEntry[];

  // Check for existing invoice (for the button state)
  const { data: invoiceRow } = await supabase
    .from("invoices")
    .select("id")
    .eq("booking_id", id)
    .maybeSingle();
  const existingInvoiceId = invoiceRow?.id ?? null;

  // derived
  const nights = Math.max(1, Math.round(
    (new Date(booking.checkout).getTime() - new Date(booking.checkin).getTime()) / 86400000,
  ));
  const derivedGstRate = room ? computeRoomGstRate(room.base_price_per_night) : 0;
  const totalPaid = payments
    .filter(p => p.status === "captured")
    .reduce((s, p) => s + Number(p.amount), 0);
  const balanceDue = Math.max(0, Number(booking.total_amount) - totalPaid);
  const today = new Date().toISOString().slice(0, 10);
  const isArrivingToday = booking.status === "CONFIRMED" && booking.checkin === today;
  const isCancelled = booking.status === "CANCELLED";
  const roomThumb = getRoomThumbnail(room);
  const staffNotes = Array.isArray(booking.staff_notes) ? (booking.staff_notes as StaffNote[]) : [];
  const timeline = buildTimeline(booking, payments, auditLog);
  const statusVariant = bookingStatusVariant(booking.status);
  const statusLabel = bookingStatusLabel(booking.status);
  const guestName = guest?.name ?? "Guest";
  const roomName = room?.name ?? "Room";
  const initials = initialsFromName(guestName);
  const avatarCls = avatarColor(guestName);

  return (
    <div className="space-y-6">

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/bookings"
            className="font-body text-xs text-charcoal/50 hover:text-earth-brown transition-colors"
          >
            ← All Reservations
          </Link>
          <h1 className="mt-1 font-display text-2xl font-medium italic text-charcoal">
            {booking.booking_ref}
          </h1>
          <p className="mt-0.5 font-body text-xs text-charcoal/50">
            Received {fmtDateTime(booking.created_at)}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <TopbarToastBtn label="Print" msg="Coming in Phase A8 — Operations Polish" variant="secondary" />
          {!isCancelled && (
            <GenerateInvoiceBtn bookingId={booking.id} existingInvoiceId={existingInvoiceId} />
          )}
        </div>
      </div>

      {/* ── Status banner ────────────────────────────────────────────────── */}
      {isArrivingToday && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Zap className="mt-0.5 w-5 h-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="font-body text-sm font-semibold text-amber-800">Arriving Today</p>
              <p className="font-body text-xs text-amber-700">
                {guestName} is expected today, {fmtDateLong(booking.checkin)}
              </p>
            </div>
          </div>
          <ArrivingBannerBtn bookingId={booking.id} guestName={guestName} roomName={roomName} checkin={booking.checkin} />
        </div>
      )}

      {isCancelled && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <XCircle className="mt-0.5 w-5 h-5 flex-shrink-0 text-error" />
          <div>
            <p className="font-body text-sm font-semibold text-error">Booking Cancelled</p>
            <p className="font-body text-xs text-red-700">
              {booking.cancellation_reason ?? "No reason provided"}
              {booking.cancelled_at && (
                <span className="ml-1">— {fmtDateTime(booking.cancelled_at)}</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* ── 3-column grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">

        {/* Left: Guest Info + Notes */}
        <div className="flex flex-col gap-6">

          {/* Guest Info */}
          <Card>
            <h2 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-charcoal/50">
              Guest Information
            </h2>

            {/* Avatar + name */}
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full font-body text-sm font-semibold ${avatarCls}`}>
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg font-medium text-charcoal truncate">{guestName}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <Badge variant={statusVariant}>{statusLabel}</Badge>
                  <span className="font-body text-xs text-charcoal/50">
                    {SOURCE_LABELS[booking.source] ?? booking.source}
                  </span>
                </div>
              </div>
            </div>

            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5">
              <DlRow label="Phone">{guest?.mobile ?? "—"}</DlRow>
              <DlRow label="Email">
                {guest?.email
                  ? <a href={`mailto:${guest.email}`} className="text-earth-brown hover:underline break-all">{guest.email}</a>
                  : "—"}
              </DlRow>
              <DlRow label="ID Type">
                {guest?.id_type ? (ID_TYPE_LABELS[guest.id_type] ?? guest.id_type) : "—"}
              </DlRow>
              <DlRow label="ID Number">
                <span className="font-mono">{maskIdNumber(guest?.id_number ?? null)}</span>
              </DlRow>
              {guest?.gstin && <DlRow label="GSTIN"><span className="font-mono text-xs">{guest.gstin}</span></DlRow>}
            </dl>

            {booking.special_requests && (
              <blockquote className="mt-4 rounded-xl border-l-2 border-earth-brown/40 bg-cream/60 px-3 py-2 font-body text-sm italic text-charcoal/70">
                {booking.special_requests}
              </blockquote>
            )}
          </Card>

          {/* Internal Notes */}
          <Card>
            <div className="mb-1">
              <h2 className="font-body text-xs font-semibold uppercase tracking-widest text-charcoal/50">
                Internal Staff Notes
              </h2>
              <p className="mt-0.5 font-body text-xs text-charcoal/40">
                Visible only to staff. Never shown to guest.
              </p>
            </div>
            <div className="mt-4">
              <StaffNotesPanel bookingId={booking.id} initialNotes={staffNotes} />
            </div>
          </Card>
        </div>

        {/* Middle: Folio */}
        <div>
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-body text-xs font-semibold uppercase tracking-widest text-charcoal/50">
                Guest Folio — Running Charges
              </h2>
              <FolioAddChargesBtn />
            </div>

            {/* Line items */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-body text-sm font-medium text-charcoal">
                    {roomName} ({nights} night{nights !== 1 ? "s" : ""})
                  </p>
                  <p className="font-body text-xs text-charcoal/50">
                    ₹{fmtAmt(room?.base_price_per_night ?? 0)}/night
                    {room ? ` + ${derivedGstRate}% GST` : ""}
                  </p>
                </div>
                <span className="flex-shrink-0 font-body text-sm font-medium text-charcoal">
                  ₹{fmtAmt(Number(booking.base_amount))}
                </span>
              </div>

              {Number(booking.discount_amount) > 0 && (
                <div className="flex justify-between gap-2">
                  <p className="font-body text-sm text-forest-green">
                    Discount{booking.coupon_code ? ` (${booking.coupon_code})` : ""}
                  </p>
                  <span className="font-body text-sm text-forest-green">
                    −₹{fmtAmt(Number(booking.discount_amount))}
                  </span>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="mt-4 space-y-1.5 border-t border-admin-card-border pt-4">
              <div className="flex justify-between font-body text-sm text-charcoal/70">
                <span>Subtotal</span>
                <span>₹{fmtAmt(Number(booking.base_amount) - Number(booking.discount_amount))}</span>
              </div>
              <div className="flex justify-between font-body text-sm text-charcoal/70">
                <span>GST ({derivedGstRate}%)</span>
                <span>₹{fmtAmt(Number(booking.gst_amount))}</span>
              </div>
              <div className="flex justify-between border-t border-admin-card-border pt-2">
                <span className="font-display text-lg font-medium text-charcoal">Total</span>
                <span className="font-display text-lg font-medium text-charcoal">₹{fmtAmt(Number(booking.total_amount))}</span>
              </div>
            </div>

            {/* Paid / Balance */}
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between font-body text-sm">
                <span className="text-charcoal/60">Paid</span>
                <span className="font-medium text-forest-green">₹{fmtAmt(totalPaid)}</span>
              </div>
              {balanceDue > 0 ? (
                <div className="flex justify-between rounded-xl bg-amber-50 px-3 py-2 font-body text-sm">
                  <span className="font-semibold text-amber-800">Balance Due</span>
                  <span className="font-bold text-amber-800">₹{fmtAmt(balanceDue)}</span>
                </div>
              ) : (
                <div className="flex justify-between font-body text-sm">
                  <span className="text-charcoal/60">Balance Due</span>
                  <span className="font-medium text-forest-green">Fully Paid</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Actions + Timeline */}
        <div className="flex flex-col gap-6">

          {/* Actions */}
          <Card>
            <h2 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-charcoal/50">
              Actions
            </h2>
            <BookingActionsPanel
              bookingId={booking.id}
              status={booking.status}
              checkin={booking.checkin}
              guestName={guestName}
              roomName={roomName}
              totalAmount={Number(booking.total_amount)}
            />
          </Card>

          {/* Activity Timeline */}
          <Card>
            <h2 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-charcoal/50">
              Activity Timeline
            </h2>
            <ol className="space-y-0">
              {timeline.map((event, i) => (
                <li key={event.id} className="flex gap-3">
                  {/* dot + line */}
                  <div className="flex flex-col items-center">
                    <TimelineDot status={event.status} />
                    {i < timeline.length - 1 && (
                      <div className="w-px flex-1 bg-warm-beige/60 my-1" style={{ minHeight: "16px" }} />
                    )}
                  </div>
                  {/* content */}
                  <div className="pb-4 min-w-0">
                    <p className={`font-body text-sm font-semibold leading-tight ${
                      event.status === "cancelled" ? "text-error" :
                      event.status === "inprogress" ? "text-amber-700" :
                      event.status === "complete" ? "text-charcoal" : "text-charcoal/50"
                    }`}>
                      {event.title}
                    </p>
                    {event.subtitle && (
                      <p className="mt-0.5 font-body text-xs text-charcoal/50">{event.subtitle}</p>
                    )}
                    {event.time && (
                      <p className="mt-0.5 font-body text-xs text-charcoal/40">{event.time}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>

      {/* ── Bottom 2-col grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Room & Stay Details */}
        <Card>
          <h2 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-charcoal/50">
            Room &amp; Stay Details
          </h2>
          <div className="flex gap-4">
            {/* Room thumbnail */}
            <div className="flex-shrink-0">
              {roomThumb ? (
                <div className="relative h-24 w-24 overflow-hidden rounded-xl">
                  <Image
                    src={roomThumb}
                    alt={roomName}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-admin-status-neutral-bg">
                  <BedDouble className="w-8 h-8 text-charcoal/20" />
                </div>
              )}
            </div>
            {/* Room info */}
            <div className="min-w-0 flex-1">
              <p className="font-display text-base font-medium text-charcoal truncate">{roomName}</p>
              {room?.description_short && (
                <p className="mt-0.5 font-body text-xs text-charcoal/60 line-clamp-2">{room.description_short}</p>
              )}
            </div>
          </div>

          {/* Stay stats */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-admin-status-neutral-bg p-3 text-center">
              <CalendarDays className="mx-auto mb-1 w-4 h-4 text-charcoal/40" />
              <p className="font-body text-xs text-charcoal/50">Check-in</p>
              <p className="mt-0.5 font-body text-xs font-semibold text-charcoal">
                {new Date(booking.checkin + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </p>
              <p className="font-body text-xs text-charcoal/40">
                {new Date(booking.checkin + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short" })}
              </p>
            </div>
            <div className="rounded-xl bg-admin-status-neutral-bg p-3 text-center">
              <CalendarDays className="mx-auto mb-1 w-4 h-4 text-charcoal/40" />
              <p className="font-body text-xs text-charcoal/50">Check-out</p>
              <p className="mt-0.5 font-body text-xs font-semibold text-charcoal">
                {new Date(booking.checkout + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </p>
              <p className="font-body text-xs text-charcoal/40">
                {new Date(booking.checkout + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short" })}
              </p>
            </div>
            <div className="rounded-xl bg-admin-status-neutral-bg p-3 text-center">
              <Users className="mx-auto mb-1 w-4 h-4 text-charcoal/40" />
              <p className="font-body text-xs text-charcoal/50">Guests</p>
              <p className="mt-0.5 font-body text-xs font-semibold text-charcoal">
                {booking.num_adults}A{booking.num_children > 0 ? ` + ${booking.num_children}C` : ""}
              </p>
              <p className="font-body text-xs text-charcoal/40">{nights}N</p>
            </div>
          </div>
          {booking.assigned_unit && (
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 border-t border-admin-card-border pt-4">
              <DlRow label="Assigned Unit">
                <span className="font-mono text-xs">{booking.assigned_unit}</span>
              </DlRow>
            </dl>
          )}
        </Card>

        {/* Payment History */}
        <Card>
          <h2 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-charcoal/50">
            Payment History
          </h2>

          {payments.length === 0 ? (
            <p className="font-body text-sm text-charcoal/50">No payments recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {payments.map((p) => (
                <div key={p.id} className="flex items-start justify-between rounded-xl border border-admin-card-border p-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {p.method === "razorpay" || (!p.method && p.razorpay_payment_id)
                        ? <CreditCard className="w-3.5 h-3.5 flex-shrink-0 text-charcoal/40" />
                        : <Banknote className="w-3.5 h-3.5 flex-shrink-0 text-charcoal/40" />
                      }
                      <p className="font-body text-sm font-medium text-charcoal">
                        {METHOD_LABELS[p.method ?? ""] ?? (p.method ?? "Razorpay")}
                        {p.payment_type === "advance" ? " — Advance" : " — Balance"}
                      </p>
                    </div>
                    <p className="mt-0.5 font-body text-xs text-charcoal/50">
                      {p.captured_at ? fmtDateTime(p.captured_at) : fmtDateTime(p.created_at)}
                      {(p.razorpay_payment_id ?? p.reference_number) && (
                        <span className="ml-1 font-mono">· {p.razorpay_payment_id ?? p.reference_number}</span>
                      )}
                    </p>
                    {p.notes && <p className="mt-0.5 font-body text-xs text-charcoal/40 italic">{p.notes}</p>}
                    {Number(p.refund_amount) > 0 && (
                      <p className="mt-0.5 font-body text-xs text-error">
                        Refunded ₹{fmtAmt(Number(p.refund_amount))}
                        {p.refunded_at && ` on ${fmtDateTime(p.refunded_at)}`}
                      </p>
                    )}
                  </div>
                  <div className="ml-3 flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="font-body text-sm font-semibold text-charcoal">
                      ₹{fmtAmt(Number(p.amount))}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 font-body text-xs font-medium ${
                      p.status === "captured" ? "bg-admin-status-confirmed-bg text-admin-status-confirmed-fg"
                      : p.status === "pending"  ? "bg-admin-status-pending-bg text-admin-status-pending-fg"
                      : "bg-admin-status-neutral-bg text-admin-status-neutral-fg"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Totals + record payment */}
          <div className="mt-4 space-y-1.5 border-t border-admin-card-border pt-4">
            <div className="flex justify-between font-body text-sm">
              <span className="text-charcoal/60">Total Paid</span>
              <span className="font-medium text-forest-green">₹{fmtAmt(totalPaid)}</span>
            </div>
            {balanceDue > 0 ? (
              <div className="flex justify-between rounded-xl bg-amber-50 px-3 py-2 font-body text-sm">
                <span className="font-semibold text-amber-800">Balance Due</span>
                <span className="font-bold text-amber-800">₹{fmtAmt(balanceDue)}</span>
              </div>
            ) : (
              <div className="flex justify-between font-body text-sm">
                <span className="text-charcoal/60">Balance Due</span>
                <span className="font-medium text-forest-green">Fully Paid</span>
              </div>
            )}
            <div className="pt-2">
              <RecordPaymentSection bookingId={booking.id} balanceDue={balanceDue} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
