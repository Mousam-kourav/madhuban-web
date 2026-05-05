"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserPlus, CalendarX, ListChecks, FileSpreadsheet, AlertTriangle } from "lucide-react";
import { Card } from "@/components/admin/ui";

// ─── Quick Actions ────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    icon: UserPlus,
    label: "Walk-in",
    description: "Manual booking entry",
    toastMsg: "Coming in Phase A4 — Manual Booking Creation",
    href: null,
  },
  {
    icon: CalendarX,
    label: "Block Dates",
    description: "Reserve dates for maintenance or events",
    toastMsg: "Coming in Phase A6 — Availability Calendar",
    href: null,
  },
  {
    icon: ListChecks,
    label: "Check-in List",
    description: "Today's arrivals",
    toastMsg: null,
    href: "/admin/bookings",
  },
  {
    icon: FileSpreadsheet,
    label: "GST Report",
    description: "Download tax summary",
    toastMsg: "Coming in Phase A7 — Invoices & GST",
    href: null,
  },
] as const;

export function QuickActions() {
  const router = useRouter();

  return (
    <Card>
      <h2 className="mb-4 font-display text-lg font-medium text-charcoal">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {QUICK_ACTIONS.map(({ icon: Icon, label, description, toastMsg, href }) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              if (href) {
                router.push(href);
              } else if (toastMsg) {
                toast.info(toastMsg);
              }
            }}
            className="group flex flex-col items-start gap-1.5 rounded-xl border border-admin-card-border
              bg-transparent p-4 text-left transition-colors hover:bg-admin-canvas-bg cursor-pointer"
          >
            <div className="rounded-lg bg-gold-accent/10 p-2 text-gold-accent transition-colors group-hover:bg-gold-accent/20">
              <Icon className="h-4 w-4" />
            </div>
            <p className="font-body text-sm font-semibold text-charcoal">{label}</p>
            <p className="font-body text-xs text-charcoal/60">{description}</p>
          </button>
        ))}
      </div>
    </Card>
  );
}

// ─── Weekend Occupancy Alert ──────────────────────────────────────────────────

interface WeekendAlertProps {
  saturday: string;
  sunday: string;
  pct: number;
}

function formatAlertDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function WeekendOccupancyAlert({ saturday, sunday, pct }: WeekendAlertProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-[var(--admin-sidebar-bg)] p-6 text-[var(--color-cream)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 flex-shrink-0 rounded-lg bg-gold-accent/20 p-2 text-gold-accent">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <p className="font-body text-sm font-semibold text-[var(--color-cream)]">
            Weekend Occupancy Alert
          </p>
          <p className="mt-1 font-body text-sm text-[var(--color-cream)]/70">
            Your estate is{" "}
            <span className="font-semibold text-gold-accent">{pct}%</span> booked for the coming
            weekend ({formatAlertDate(saturday)} – {formatAlertDate(sunday)}). Consider increasing
            staff presence.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => toast.info("Coming in Phase A8 — Operations")}
        className="flex-shrink-0 rounded-xl border border-[var(--color-cream)]/20 px-4 py-2.5
          font-body text-sm font-medium text-[var(--color-cream)] transition-colors
          hover:bg-[var(--color-cream)]/10 whitespace-nowrap"
      >
        Manage Roster →
      </button>
    </div>
  );
}
