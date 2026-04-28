import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Bookings — Madhuban Admin" };

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  PENDING_PAYMENT: { label: "Pending Payment", cls: "bg-yellow-100 text-yellow-800" },
  CONFIRMED:       { label: "Confirmed",        cls: "bg-green-100 text-green-800" },
  CHECKED_IN:      { label: "Checked In",       cls: "bg-blue-100 text-blue-800" },
  CHECKED_OUT:     { label: "Checked Out",      cls: "bg-gray-100 text-gray-700" },
  CANCELLED:       { label: "Cancelled",        cls: "bg-red-100 text-red-800" },
  NO_SHOW:         { label: "No-Show",          cls: "bg-orange-100 text-orange-800" },
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending:  "Pending",
  partial:  "50% Paid",
  paid:     "Fully Paid",
  refunded: "Refunded",
};

type BookingRow = {
  id: string;
  booking_ref: string;
  checkin: string;
  checkout: string;
  status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
  guests: { name: string; email: string } | null;
  rooms: { name: string; slug: string } | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function BookingsListPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("bookings")
    .select(`
      id, booking_ref, checkin, checkout, status, payment_status, total_amount, created_at,
      guests!guest_id ( name, email ),
      rooms!room_id ( name, slug )
    `)
    .order("checkin", { ascending: false });

  const bookings = (data ?? []) as unknown as BookingRow[];

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
            Admin · Bookings
          </p>
          <h1 className="mt-1 font-display text-3xl font-medium italic text-charcoal">
            All Bookings
          </h1>
        </div>
        <p className="font-body text-sm text-muted-foreground">{bookings.length} total</p>
      </div>

      {bookings.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">No bookings yet.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-border bg-cream text-xs">
                  <th className="px-4 py-3 text-left font-semibold text-charcoal/70">Ref</th>
                  <th className="px-4 py-3 text-left font-semibold text-charcoal/70">Guest</th>
                  <th className="px-4 py-3 text-left font-semibold text-charcoal/70">Room</th>
                  <th className="px-4 py-3 text-left font-semibold text-charcoal/70">Check-in</th>
                  <th className="px-4 py-3 text-left font-semibold text-charcoal/70">Check-out</th>
                  <th className="px-4 py-3 text-right font-semibold text-charcoal/70">Total</th>
                  <th className="px-4 py-3 text-left font-semibold text-charcoal/70">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-charcoal/70">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map((b) => {
                  const statusInfo = STATUS_LABELS[b.status] ?? { label: b.status, cls: "bg-gray-100 text-gray-700" };
                  return (
                    <tr key={b.id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="font-semibold text-earth-brown hover:underline underline-offset-4 tracking-wide"
                        >
                          {b.booking_ref}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-charcoal">{b.guests?.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{b.guests?.email ?? "—"}</p>
                      </td>
                      <td className="px-4 py-3 text-charcoal/70">{b.rooms?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-charcoal">{formatDate(b.checkin)}</td>
                      <td className="px-4 py-3 text-charcoal/70">{formatDate(b.checkout)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-charcoal">
                        ₹{Number(b.total_amount).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.cls}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-charcoal/70">
                        {PAYMENT_STATUS_LABELS[b.payment_status] ?? b.payment_status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
