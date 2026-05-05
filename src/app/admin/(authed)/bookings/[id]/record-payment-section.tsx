"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, Modal, Input, Select, TextArea } from "@/components/admin/ui";

const METHOD_OPTIONS = [
  { value: "cash",          label: "Cash" },
  { value: "upi",           label: "UPI" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cheque",        label: "Cheque" },
  { value: "card",          label: "Card on Arrival" },
];

function fmtAmt(n: number) { return n.toLocaleString("en-IN"); }

interface Props {
  bookingId: string;
  balanceDue: number;
}

export function RecordPaymentSection({ bookingId, balanceDue }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(String(balanceDue));
  const [method, setMethod] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!amount || Number(amount) <= 0) e.amount = "Amount must be greater than 0";
    if (!method) e.method = "Payment method is required";
    return e;
  }

  function handleClose() {
    setOpen(false);
    setAmount(String(balanceDue));
    setMethod(""); setReference(""); setNotes(""); setErrors({});
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          method,
          reference_number: reference.trim() || null,
          notes: notes.trim() || null,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to record payment");
      toast.success("Payment recorded successfully");
      handleClose();
      startTransition(() => router.refresh());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to record payment");
    } finally {
      setLoading(false);
    }
  }

  const now = new Date().toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <>
      {balanceDue > 0 && (
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
          Record Offline Payment
        </Button>
      )}

      <Modal open={open} onClose={() => !loading && handleClose()} title="Record Offline Payment">
        <div className="space-y-4">
          <Input
            label="Amount (₹)"
            required
            type="number"
            min="0"
            step="1"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: "" })); }}
            helperText={`Balance due: ₹${fmtAmt(balanceDue)}`}
            error={errors.amount}
          />
          <Select
            label="Payment Method"
            required
            placeholder="Select method…"
            options={METHOD_OPTIONS}
            value={method}
            onChange={(e) => { setMethod(e.target.value); setErrors(p => ({ ...p, method: "" })); }}
            error={errors.method}
          />
          <Input
            label="Reference Number"
            placeholder="UPI ref, cheque #, etc. (optional)"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
          <TextArea
            label="Notes"
            placeholder="Optional notes…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
          <div className="rounded-xl bg-admin-status-neutral-bg px-4 py-2.5">
            <span className="font-body text-xs text-charcoal/60">Recorded at: </span>
            <span className="font-body text-xs font-medium text-charcoal">{now}</span>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-admin-card-border">
            <Button variant="secondary" onClick={handleClose} disabled={loading}>Cancel</Button>
            <Button variant="primary" loading={loading || isPending} onClick={() => void handleSubmit()}>
              Record Payment
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
