import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { BookingActions } from "./booking-actions";
import { InternalNoteForm } from "./internal-note-form";

export const metadata: Metadata = { title: "Booking Detail — Madhuban Admin" };

type GuestRow = { name: string; email: string; mobile: string | null; id_type: string | null; id_number: string | null; gstin: string | null; address: string | null };
type RoomRow = { name: string; slug: string };
type BookingRow = {
  id: string; booking_ref: string; status: string; payment_status: string;
  checkin: string; checkout: string; num_adults: number; num_children: number;
  base_amount: number; gst_amount: number; total_amount: number; discount_amount: number;
  coupon_code: string | null; source: string; special_requests: string | null;
  internal_notes: string | null; created_at: string; updated_at: string;
  guests: GuestRow | null; rooms: RoomRow | null;
};
type PaymentRow = { id: string; amount: number; status: string; payment_type: string; method: string | null; razorpay_payment_id: string | null; razorpay_order_id: string | null; captured_at: string | null; refund_amount: number; refunded_at: string | null; created_at: string };
type AuditEntry = { id: string; action: string; details: unknown; created_at: string; admin_user_id: string };

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  PENDING_PAYMENT: { label: "Pending Payment", cls: "bg-yellow-100 text-yellow-800" },
  CONFIRMED:       { label: "Confirmed",        cls: "bg-green-100 text-green-800" },
  CHECKED_IN:      { label: "Checked In",       cls: "bg-blue-100 text-blue-800" },
  CHECKED_OUT:     { label: "Checked Out",      cls: "bg-gray-100 text-gray-700" },
  CANCELLED:       { label: "Cancelled",        cls: "bg-red-100 text-red-800" },
  NO_SHOW:         { label: "No-Show",          cls: "bg-orange-100 text-orange-800" },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}
function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
function fmtAmt(n: number) { return n.toLocaleString("en-IN"); }

interface Props { params: Promise<{ id: string }> }

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: bookingRaw } = await supabase
    .from("bookings")
    .select(`*, guests!guest_id ( * ), rooms!room_id ( name, slug )`)
    .eq("id", id)
    .single();

  if (!bookingRaw) notFound();

  const booking = bookingRaw as unknown as BookingRow;
  const guest = Array.isArray(booking.guests) ? booking.guests[0] : booking.guests;
  const room = Array.isArray(booking.rooms) ? booking.rooms[0] : booking.rooms;

  const { data: paymentsRaw } = await supabase
    .from("payments").select("*").eq("booking_id", id).order("created_at");
  const payments = (paymentsRaw ?? []) as unknown as PaymentRow[];

  const { data: auditRaw } = await supabase
    .from("audit_log").select("id, action, details, created_at, admin_user_id")
    .eq("entity_id", id).order("created_at", { ascending: false }).limit(20);
  const auditLog = (auditRaw ?? []) as unknown as AuditEntry[];

  const nights = Math.round(
    (new Date(booking.checkout).getTime() - new Date(booking.checkin).getTime()) / 86400000,
  );
  const statusInfo = STATUS_LABELS[booking.status] ?? { label: booking.status, cls: "bg-gray-100 text-gray-700" };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/bookings"
            className="font-body text-xs text-earth-brown hover:underline underline-offset-4"
          >
            ← All Bookings
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="font-display text-3xl font-medium italic text-charcoal">
              {booking.booking_ref}
            </h1>
            <span className={`rounded-full px-3 py-1 font-body text-xs font-medium ${statusInfo.cls}`}>
              {statusInfo.label}
            </span>
          </div>
          <p className="mt-1 font-body text-sm text-muted-foreground">
            Created {fmtDateTime(booking.created_at)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: booking + guest + payment */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stay details */}
          <section className="rounded-xl border border-border bg-white p-6">
            <h2 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Stay Details
            </h2>
            <dl className="grid grid-cols-2 gap-y-3 font-body text-sm">
              <dt className="text-muted-foreground">Room</dt>
              <dd className="font-medium text-charcoal">{room?.name ?? "—"}</dd>
              <dt className="text-muted-foreground">Check-in</dt>
              <dd className="text-charcoal">{fmtDate(booking.checkin)}</dd>
              <dt className="text-muted-foreground">Check-out</dt>
              <dd className="text-charcoal">{fmtDate(booking.checkout)}</dd>
              <dt className="text-muted-foreground">Duration</dt>
              <dd className="text-charcoal">{nights} night{nights !== 1 ? "s" : ""}</dd>
              <dt className="text-muted-foreground">Guests</dt>
              <dd className="text-charcoal">
                {booking.num_adults} adult{booking.num_adults !== 1 ? "s" : ""}
                {booking.num_children > 0 ? `, ${booking.num_children} child${booking.num_children !== 1 ? "ren" : ""}` : ""}
              </dd>
              <dt className="text-muted-foreground">Source</dt>
              <dd className="text-charcoal">{booking.source}</dd>
              {booking.coupon_code && (
                <>
                  <dt className="text-muted-foreground">Coupon</dt>
                  <dd className="font-medium text-[var(--color-moss-green)]">{booking.coupon_code}</dd>
                </>
              )}
              {booking.special_requests && (
                <>
                  <dt className="text-muted-foreground">Requests</dt>
                  <dd className="text-charcoal">{booking.special_requests}</dd>
                </>
              )}
            </dl>
          </section>

          {/* Guest */}
          {guest && (
            <section className="rounded-xl border border-border bg-white p-6">
              <h2 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Guest
              </h2>
              <dl className="grid grid-cols-2 gap-y-3 font-body text-sm">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium text-charcoal">{guest.name}</dd>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="break-all text-charcoal">
                  <a href={`mailto:${guest.email}`} className="text-earth-brown hover:underline">{guest.email}</a>
                </dd>
                {guest.mobile && (
                  <>
                    <dt className="text-muted-foreground">Mobile</dt>
                    <dd className="text-charcoal">{guest.mobile}</dd>
                  </>
                )}
                {guest.gstin && (
                  <>
                    <dt className="text-muted-foreground">GSTIN</dt>
                    <dd className="text-charcoal">{guest.gstin}</dd>
                  </>
                )}
              </dl>
            </section>
          )}

          {/* Pricing */}
          <section className="rounded-xl border border-border bg-white p-6">
            <h2 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Pricing
            </h2>
            <div className="space-y-2 font-body text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal/70">Base amount</span>
                <span>₹{fmtAmt(Number(booking.base_amount))}</span>
              </div>
              {Number(booking.discount_amount) > 0 && (
                <div className="flex justify-between text-[var(--color-moss-green)]">
                  <span>Discount</span>
                  <span>−₹{fmtAmt(Number(booking.discount_amount))}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-charcoal/70">GST</span>
                <span>₹{fmtAmt(Number(booking.gst_amount))}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-semibold text-charcoal">
                <span>Total</span>
                <span>₹{fmtAmt(Number(booking.total_amount))}</span>
              </div>
              <div className="flex justify-between text-charcoal/70">
                <span>Advance (50%)</span>
                <span>₹{fmtAmt(+(Number(booking.total_amount) * 0.5).toFixed(0))}</span>
              </div>
              <div className="flex justify-between font-medium text-earth-brown">
                <span>Balance at check-in</span>
                <span>₹{fmtAmt(+(Number(booking.total_amount) * 0.5).toFixed(0))}</span>
              </div>
            </div>
          </section>

          {/* Payments */}
          <section className="rounded-xl border border-border bg-white p-6">
            <h2 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Payment History
            </h2>
            {payments.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">No payments recorded.</p>
            ) : (
              <div className="space-y-3">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-start justify-between rounded-lg border border-border p-3 font-body text-sm">
                    <div>
                      <p className="font-medium text-charcoal">
                        {p.payment_type === "advance" ? "Advance" : "Balance"} — ₹{fmtAmt(Number(p.amount))}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {p.method ?? "Razorpay"} ·{" "}
                        {p.captured_at ? fmtDateTime(p.captured_at) : fmtDateTime(p.created_at)}
                      </p>
                      {p.razorpay_payment_id && (
                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">{p.razorpay_payment_id}</p>
                      )}
                      {(p.refund_amount ?? 0) > 0 && (
                        <p className="mt-0.5 text-xs text-red-600">
                          Refunded ₹{fmtAmt(Number(p.refund_amount))} on {p.refunded_at ? fmtDateTime(p.refunded_at) : "—"}
                        </p>
                      )}
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.status === "captured" ? "bg-green-100 text-green-800"
                      : p.status === "pending" ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-700"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right column: actions + notes + audit */}
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-white p-6">
            <h2 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Actions
            </h2>
            <BookingActions
              bookingId={booking.id}
              status={booking.status}
              paymentStatus={booking.payment_status}
              totalAmount={Number(booking.total_amount)}
            />
          </section>

          <section className="rounded-xl border border-border bg-white p-6">
            <h2 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Internal Notes
            </h2>
            <InternalNoteForm bookingId={booking.id} initialNote={booking.internal_notes ?? ""} />
          </section>

          <section className="rounded-xl border border-border bg-white p-6">
            <h2 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Audit Log
            </h2>
            {auditLog.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">No audit entries.</p>
            ) : (
              <ul className="space-y-2">
                {auditLog.map((entry) => (
                  <li key={entry.id} className="font-body text-xs">
                    <p className="font-medium text-charcoal">{entry.action}</p>
                    <p className="text-muted-foreground">{fmtDateTime(entry.created_at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
