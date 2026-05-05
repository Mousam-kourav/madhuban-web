"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogIn, Plus } from "lucide-react";
import { Button } from "@/components/admin/ui";
import { AddChargesModal } from "./add-charges-modal";

// Print / Generate Invoice placeholder buttons
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
