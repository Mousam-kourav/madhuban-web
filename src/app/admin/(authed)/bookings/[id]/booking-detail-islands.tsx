"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogIn, Plus, FileText } from "lucide-react";
import { Button } from "@/components/admin/ui";
import { AddChargesModal } from "./add-charges-modal";

// Print placeholder button
interface ToastBtnProps {
  label: string;
  msg: string;
  variant?: "primary" | "secondary";
}

export function TopbarToastBtn({ label, msg, variant = "secondary" }: ToastBtnProps) {
  return (
    <Button variant={variant} size="sm" onClick={() => toast.info(msg)}>
      {label}
    </Button>
  );
}

// Generate Invoice button — calls POST /api/admin/invoices/generate
interface GenerateInvoiceBtnProps {
  bookingId: string;
  existingInvoiceId?: string | null;
}

export function GenerateInvoiceBtn({ bookingId, existingInvoiceId }: GenerateInvoiceBtnProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  // If invoice already exists, show a link directly
  if (existingInvoiceId) {
    return (
      <div className="flex gap-2">
        <a
          href={`/admin/invoices/${existingInvoiceId}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-charcoal/20 bg-admin-card-bg px-3 py-1.5 font-body text-sm text-charcoal transition-colors hover:bg-warm-beige/30"
        >
          <FileText className="w-3.5 h-3.5" /> View Invoice
        </a>
        <a
          href={`/api/admin/invoices/${existingInvoiceId}/pdf`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-forest-green px-3 py-1.5 font-body text-sm text-ivory transition-colors hover:bg-forest-green/90"
        >
          Download PDF
        </a>
      </div>
    );
  }

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invoices/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId }),
      });
      const data = (await res.json()) as {
        invoice_id?: string;
        invoice_number?: string;
        error?: string;
      };

      if (res.status === 409 && data.invoice_id) {
        toast.info("Invoice already exists for this booking.");
        window.open(`/admin/invoices/${data.invoice_id}`, "_blank");
        startTransition(() => router.refresh());
        return;
      }

      if (!res.ok) {
        toast.error(data.error ?? "Invoice generation failed");
        return;
      }

      toast.success(`Invoice ${data.invoice_number} generated`);
      window.open(`/admin/invoices/${data.invoice_id}/print`, "_blank");
      startTransition(() => router.refresh());
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="primary" size="sm" loading={loading} onClick={() => void handleGenerate()}>
      <FileText className="w-3.5 h-3.5" /> Generate Invoice
    </Button>
  );
}

// "Check In Now" button in the arriving-today banner
interface ArrivingBannerBtnProps {
  bookingId: string;
  guestName: string;
  roomName: string;
  checkin: string;
}

export function ArrivingBannerBtn({ bookingId }: ArrivingBannerBtnProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  async function handleCheckIn() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CHECKED_IN" }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Check-in failed");
      toast.success("Guest checked in successfully");
      startTransition(() => router.refresh());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Check-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="primary"
      size="md"
      loading={loading || isPending}
      onClick={() => void handleCheckIn()}
      className="whitespace-nowrap"
    >
      <LogIn className="w-4 h-4" /> Check In Now
    </Button>
  );
}

// "+ Add Charge" button inside folio card header
export function FolioAddChargesBtn() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <Plus className="w-3.5 h-3.5" /> Add Charge
      </Button>
      <AddChargesModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
