"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogIn, LogOut, XCircle, Plus, Mail, Pencil, Printer, FileText } from "lucide-react";
import { Button, Modal, Select, Input, TextArea } from "@/components/admin/ui";
import { AddChargesModal } from "./add-charges-modal";

const CANCEL_REASON_OPTIONS = [
  { value: "Guest requested cancellation", label: "Guest requested cancellation" },
  { value: "No-show",                      label: "No-show" },
  { value: "Resort closure",               label: "Resort closure" },
  { value: "Payment failure",              label: "Payment failure" },
  { value: "Other",                        label: "Other" },
];

interface Props {
  bookingId: string;
  status: string;
  checkin: string;
  guestName: string;
  roomName: string;
  totalAmount: number;
}

export function BookingActionsPanel({
  bookingId, status, checkin, guestName, roomName,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [checkInOpen, setCheckInOpen]   = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [cancelOpen, setCancelOpen]     = useState(false);
  const [chargesOpen, setChargesOpen]   = useState(false);

  const [checkInLoading, setCheckInLoading]   = useState(false);
  const [checkOutLoading, setCheckOutLoading] = useState(false);
  const [cancelLoading, setCancelLoading]     = useState(false);

  const [cancelReason, setCancelReason]   = useState("");
  const [cancelOther, setCancelOther]     = useState("");
  const [cancelNotes, setCancelNotes]     = useState("");
  const [cancelError, setCancelError]     = useState("");

  const today = new Date().toISOString().slice(0, 10);
  const canCheckIn  = status === "CONFIRMED" && checkin <= today;
  const canCheckOut = status === "CHECKED_IN";
  const canCancel   = ["PENDING_PAYMENT", "CONFIRMED"].includes(status);

  async function doAction(action: string, extra?: Record<string, unknown>) {
    const res = await fetch(`/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok) throw new Error(data.error ?? "Action failed");
  }

  async function handleCheckIn() {
    setCheckInLoading(true);
    try {
      await doAction("CHECKED_IN");
      toast.success("Guest checked in successfully");
      setCheckInOpen(false);
      startTransition(() => router.refresh());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Check-in failed");
    } finally {
      setCheckInLoading(false);
    }
  }

  async function handleCheckOut() {
    setCheckOutLoading(true);
    try {
      await doAction("CHECKED_OUT");
      toast.success("Guest checked out successfully");
      setCheckOutOpen(false);
      startTransition(() => router.refresh());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Check-out failed");
    } finally {
      setCheckOutLoading(false);
    }
  }

  async function handleCancel() {
    const reason = cancelReason === "Other" ? cancelOther.trim() : cancelReason;
    if (!reason) { setCancelError("Please select a reason"); return; }
    setCancelLoading(true);
    setCancelError("");
    try {
      await doAction("CANCELLED", { reason, notes: cancelNotes });
      toast.success("Booking cancelled");
      setCancelOpen(false);
      startTransition(() => router.refresh());
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : "Cancellation failed");
    } finally {
      setCancelLoading(false);
    }
  }

  function fmtDate(iso: string) {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
  }

  return (
    <>
      <div className="space-y-2">
        {/* Primary action — conditional */}
        {canCheckIn && (
          <Button variant="primary" size="lg" className="w-full" onClick={() => setCheckInOpen(true)}>
            <LogIn className="w-4 h-4" /> Check In Now
          </Button>
        )}
        {canCheckOut && (
          <Button variant="primary" size="lg" className="w-full" onClick={() => setCheckOutOpen(true)}>
            <LogOut className="w-4 h-4" /> Check Out Now
          </Button>
        )}

        {/* Always-shown actions */}
        <Button variant="secondary" size="md" className="w-full" onClick={() => toast.info("Edit booking flow — coming soon")}>
          <Pencil className="w-4 h-4" /> Modify Booking
        </Button>
        <Button variant="secondary" size="md" className="w-full" onClick={() => toast.info("Coming in Phase A8 — Operations Polish")}>
          <Mail className="w-4 h-4" /> Send Confirmation
        </Button>
        <Button variant="secondary" size="md" className="w-full" onClick={() => toast.info("Coming in Phase A8 — Operations Polish")}>
          <Printer className="w-4 h-4" /> Print Voucher
        </Button>
        <Button variant="ghost" size="md" className="w-full" onClick={() => setChargesOpen(true)}>
          <Plus className="w-4 h-4" /> Add Charges
        </Button>
        <Button variant="secondary" size="md" className="w-full" onClick={() => toast.info("Coming in Phase A7 — Invoices & GST")}>
          <FileText className="w-4 h-4" /> Generate Invoice
        </Button>

        {canCancel && (
          <Button variant="danger" size="md" className="w-full" onClick={() => setCancelOpen(true)}>
            <XCircle className="w-4 h-4" /> Cancel Booking
          </Button>
        )}
      </div>

      {/* Check In Modal */}
      <Modal open={checkInOpen} onClose={() => !checkInLoading && setCheckInOpen(false)} title="Check In Guest">
        <div className="space-y-4">
          <p className="font-body text-sm text-charcoal/70">
            Confirm check-in for <span className="font-semibold text-charcoal">{guestName}</span>?
          </p>
          <dl className="grid grid-cols-2 gap-y-2 rounded-xl bg-admin-status-neutral-bg p-4 font-body text-sm">
            <dt className="text-charcoal/60">Room</dt>
            <dd className="font-medium text-charcoal">{roomName}</dd>
            <dt className="text-charcoal/60">Check-in date</dt>
            <dd className="text-charcoal">{fmtDate(checkin)}</dd>
          </dl>
          <div className="flex justify-end gap-3 pt-2 border-t border-admin-card-border">
            <Button variant="secondary" onClick={() => setCheckInOpen(false)} disabled={checkInLoading}>Back</Button>
            <Button variant="primary" loading={checkInLoading} onClick={() => void handleCheckIn()}>
              Confirm Check In
            </Button>
          </div>
        </div>
      </Modal>

      {/* Check Out Modal */}
      <Modal open={checkOutOpen} onClose={() => !checkOutLoading && setCheckOutOpen(false)} title="Check Out Guest">
        <div className="space-y-4">
          <p className="font-body text-sm text-charcoal/70">
            Confirm check-out for <span className="font-semibold text-charcoal">{guestName}</span>?
          </p>
          <dl className="grid grid-cols-2 gap-y-2 rounded-xl bg-admin-status-neutral-bg p-4 font-body text-sm">
            <dt className="text-charcoal/60">Room</dt>
            <dd className="font-medium text-charcoal">{roomName}</dd>
          </dl>
          <div className="flex justify-end gap-3 pt-2 border-t border-admin-card-border">
            <Button variant="secondary" onClick={() => setCheckOutOpen(false)} disabled={checkOutLoading}>Back</Button>
            <Button variant="primary" loading={checkOutLoading} onClick={() => void handleCheckOut()}>
              Confirm Check Out
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal open={cancelOpen} onClose={() => !cancelLoading && setCancelOpen(false)} title="Cancel Booking">
        <div className="space-y-4">
          <p className="font-body text-sm text-charcoal/70">
            Are you sure you want to cancel this booking? <strong className="text-error">This action cannot be undone.</strong>
          </p>
          {cancelError && (
            <p className="rounded-xl bg-error/10 px-4 py-3 font-body text-sm text-error">{cancelError}</p>
          )}
          <Select
            label="Reason"
            required
            placeholder="Select a reason…"
            options={CANCEL_REASON_OPTIONS}
            value={cancelReason}
            onChange={(e) => { setCancelReason(e.target.value); setCancelError(""); }}
          />
          {cancelReason === "Other" && (
            <Input
              label="Specify reason"
              required
              placeholder="Describe the reason…"
              value={cancelOther}
              onChange={(e) => setCancelOther(e.target.value)}
            />
          )}
          <TextArea
            label="Refund handling note"
            placeholder="e.g. ₹5,000 refunded via Razorpay on Apr 22 (optional)"
            value={cancelNotes}
            onChange={(e) => setCancelNotes(e.target.value)}
            rows={2}
          />
          <div className="flex justify-end gap-3 pt-2 border-t border-admin-card-border">
            <Button variant="secondary" onClick={() => setCancelOpen(false)} disabled={cancelLoading}>
              Keep Booking
            </Button>
            <Button variant="danger" loading={cancelLoading} onClick={() => void handleCancel()}>
              Cancel Booking
            </Button>
          </div>
        </div>
      </Modal>

      <AddChargesModal open={chargesOpen} onClose={() => setChargesOpen(false)} />

      {isPending && null}
    </>
  );
}
