"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";
import { Card, Button } from "@/components/admin/ui";
import type { NotificationRow } from "@/lib/supabase/database.types";

interface NotificationsResponse {
  notifications: NotificationRow[];
  unreadCount: number;
}

function typeLabel(type: NotificationRow["type"]): string {
  const map: Record<NotificationRow["type"], string> = {
    booking_created: "Booking Created",
    payment_received: "Payment Received",
    check_in_today: "Check-in Today",
    booking_cancelled: "Booking Cancelled",
    lead_received: "New Lead",
    newsletter_subscribed: "Newsletter",
  };
  return map[type] ?? type;
}

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

export function NotificationsClient() {
  const router = useRouter();
  const [data, setData] = useState<NotificationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      const json = (await res.json()) as NotificationsResponse;
      setData(json);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchNotifications(); }, [fetchNotifications]);

  async function markRead(id: string, linkUrl: string | null) {
    await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    void fetchNotifications();
    if (linkUrl) router.push(linkUrl);
  }

  async function markAllRead() {
    setMarkingAll(true);
    await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    void fetchNotifications();
    setMarkingAll(false);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium text-charcoal">Notifications</h1>
          {data && data.unreadCount > 0 && (
            <p className="mt-1 font-body text-sm text-charcoal/60">
              {data.unreadCount} unread
            </p>
          )}
        </div>
        {data && data.unreadCount > 0 && (
          <Button variant="secondary" size="sm" loading={markingAll} onClick={() => void markAllRead()}>
            <CheckCheck className="w-4 h-4" /> Mark all read
          </Button>
        )}
      </div>

      {loading && (
        <div className="space-y-3">
          {[1,2,3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-warm-beige/30" />
          ))}
        </div>
      )}

      {!loading && (!data?.notifications?.length) && (
        <Card>
          <div className="flex flex-col items-center py-8 text-center">
            <Bell className="h-8 w-8 text-charcoal/20 mb-3" />
            <p className="font-body text-sm text-charcoal/50">No notifications yet.</p>
          </div>
        </Card>
      )}

      {!loading && data?.notifications?.map((n) => (
        <button
          key={n.id}
          type="button"
          onClick={() => void markRead(n.id, n.link_url)}
          className={`w-full text-left rounded-xl border p-4 transition-colors hover:bg-warm-beige/20 ${
            n.read_at ? "border-admin-card-border bg-admin-card-bg opacity-60" : "border-gold-accent/40 bg-admin-card-bg"
          }`}
        >
          <div className="flex items-start gap-3">
            {!n.read_at && <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-gold-accent" />}
            {n.read_at && <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-transparent" />}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                  {typeLabel(n.type)}
                </p>
                <p className="flex-shrink-0 font-body text-xs text-charcoal/40">
                  {fmtTime(n.created_at)}
                </p>
              </div>
              <p className="mt-0.5 font-body text-sm font-medium text-charcoal">{n.title}</p>
              <p className="mt-0.5 font-body text-xs text-charcoal/60">{n.body}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
