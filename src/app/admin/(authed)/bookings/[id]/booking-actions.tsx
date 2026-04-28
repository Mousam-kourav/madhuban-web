"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  bookingId: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
}

const DANGER_BTN = "inline-flex h-10 items-center rounded-lg border border-red-300 bg-red-50 px-4 font-body text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50";
const PRIMARY_BTN = "inline-flex h-10 items-center rounded-lg bg-earth-brown px-4 font-body text-sm font-medium text-ivory transition-colors hover:bg-earth-brown/90 disabled:opacity-50";
const SECONDARY_BTN = "inline-flex h-10 items-center rounded-lg border border-border bg-white px-4 font-body text-sm font-medium text-charcoal transition-colors hover:bg-cream disabled:opacity-50";

export function BookingActions({ bookingId, status, paymentStatus, totalAmount }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Balance paid form state
  const [showBalanceForm, setShowBalanceForm] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState(String(+(totalAmount * 0.5).toFixed(0)));
  const [balanceMethod, setBalanceMethod] = useState("cash");

  // Cancel form state
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [refundAmount, setRefundAmount] = useState("0");

  const callAction = async (action: string, extra?: Record<string, unknown>) => {
    setLoading(action);
    setError("");
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) { setError(data.error ?? "Action failed"); }
      else { router.refresh(); setShowBalanceForm(false); setShowCancelForm(false); }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 font-body text-sm text-red-600">{error}</p>
      )}

      <div className="flex flex-wrap gap-3">
        {status === "CONFIRMED" && (
          <button
            className={PRIMARY_BTN}
            disabled={!!loading}
            onClick={() => void callAction("CHECKED_IN")}
          >
            {loading === "CHECKED_IN" ? "Saving…" : "✓ Mark Checked In"}
          </button>
        )}

        {status === "CHECKED_IN" && (
          <>
            <button
              className={SECONDARY_BTN}
              disabled={!!loading}
              onClick={() => void callAction("CHECKED_OUT")}
            >
              {loading === "CHECKED_OUT" ? "Saving…" : "Mark Checked Out"}
            </button>
            {paymentStatus !== "paid" && (
              <button
                className={SECONDARY_BTN}
                disabled={!!loading}
                onClick={() => setShowBalanceForm(!showBalanceForm)}
              >
                Record Balance Payment
              </button>
            )}
          </>
        )}

        {["CONFIRMED", "CHECKED_IN"].includes(status) && (
          <button
            className={SECONDARY_BTN}
            disabled={!!loading}
            onClick={() => {
              if (!["CONFIRMED", "PENDING_PAYMENT"].includes(status)) {
                setError("Can only mark no-show for confirmed bookings.");
                return;
              }
              void callAction("NO_SHOW");
            }}
          >
            {loading === "NO_SHOW" ? "Saving…" : "Mark No-Show"}
          </button>
        )}

        {["PENDING_PAYMENT", "CONFIRMED"].includes(status) && (
          <button
            className={DANGER_BTN}
            disabled={!!loading}
            onClick={() => setShowCancelForm(!showCancelForm)}
          >
            Cancel Booking
          </button>
        )}
      </div>

      {showBalanceForm && (
        <div className="rounded-xl border border-border bg-cream p-4 space-y-3">
          <p className="font-body text-sm font-semibold text-charcoal">Record Balance Payment</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-body text-xs font-medium text-charcoal/70">Amount (₹)</label>
              <input
                type="number"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-earth-brown"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-xs font-medium text-charcoal/70">Method</label>
              <select
                value={balanceMethod}
                onChange={(e) => setBalanceMethod(e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-earth-brown"
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="razorpay">Razorpay</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className={PRIMARY_BTN}
              disabled={!!loading}
              onClick={() => void callAction("BALANCE_PAID", {
                amount: Number(balanceAmount),
                method: balanceMethod,
              })}
            >
              {loading === "BALANCE_PAID" ? "Saving…" : "Confirm Payment"}
            </button>
            <button className={SECONDARY_BTN} onClick={() => setShowBalanceForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {showCancelForm && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
          <p className="font-body text-sm font-semibold text-red-800">Cancel Booking</p>
          <div>
            <label className="mb-1 block font-body text-xs font-medium text-red-700">
              Refund Amount (₹) — process manually in Razorpay, then enter here
            </label>
            <input
              type="number"
              min="0"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <p className="mt-1 font-body text-xs text-red-600">Enter 0 for no refund.</p>
          </div>
          <div className="flex gap-2">
            <button
              className={DANGER_BTN}
              disabled={!!loading}
              onClick={() => void callAction("CANCELLED", { refundAmount: Number(refundAmount) })}
            >
              {loading === "CANCELLED" ? "Cancelling…" : "Confirm Cancellation"}
            </button>
            <button className={SECONDARY_BTN} onClick={() => setShowCancelForm(false)}>
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
