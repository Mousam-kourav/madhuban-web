'use client';

import { useSelectedLayoutSegment, useRouter } from 'next/navigation';
import { Bell, User } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';
import { useEffect, useRef, useState, useCallback } from 'react';
import type { NotificationRow } from '@/lib/supabase/database.types';

interface NotificationsResponse {
  notifications: NotificationRow[];
  unreadCount: number;
}

function typeLabel(type: NotificationRow['type']): string {
  const map: Record<NotificationRow['type'], string> = {
    booking_created: 'Booking',
    payment_received: 'Payment',
    check_in_today: 'Check-in',
    booking_cancelled: 'Cancelled',
  };
  return map[type] ?? type;
}

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

function segmentToTitle(segment: string | null): string {
  if (!segment) return 'Dashboard';
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
}

export function TopBar() {
  const segment = useSelectedLayoutSegment();
  const title = segmentToTitle(segment);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [data, setData] = useState<NotificationsResponse | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) setData((await res.json()) as NotificationsResponse);
    } catch { /* silent — bell just stays at 0 */ }
  }, []);

  // Initial fetch + 30s polling
  useEffect(() => {
    void fetchNotifications();
    const id = setInterval(() => { void fetchNotifications(); }, 30_000);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  async function markRead(id: string, linkUrl: string | null) {
    setOpen(false);
    await fetch('/api/admin/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    void fetchNotifications();
    if (linkUrl) router.push(linkUrl);
  }

  async function markAllRead() {
    await fetch('/api/admin/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true }),
    });
    void fetchNotifications();
  }

  const unread = data?.unreadCount ?? 0;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-admin-card-border bg-admin-canvas-bg/95 backdrop-blur-sm px-6 py-3">
      <div className="flex flex-col gap-0.5">
        <Breadcrumb />
        <h1 className="font-display text-2xl font-medium text-charcoal leading-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2" ref={panelRef}>
        {/* Bell button */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => setOpen((v) => !v)}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gold-accent" aria-label={`${unread} unread`} />
            )}
          </button>

          {/* Dropdown panel */}
          {open && (
            <div className="absolute right-0 top-11 w-80 rounded-2xl border border-admin-card-border bg-admin-card-bg shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-admin-card-border px-4 py-3">
                <p className="font-body text-sm font-semibold text-charcoal">
                  Notifications {unread > 0 && <span className="ml-1 rounded-full bg-gold-accent px-1.5 py-0.5 text-[10px] text-white font-bold">{unread}</span>}
                </p>
                <div className="flex gap-2">
                  {unread > 0 && (
                    <button
                      type="button"
                      onClick={() => void markAllRead()}
                      className="font-body text-xs text-charcoal/50 hover:text-charcoal"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setOpen(false); router.push('/admin/notifications'); }}
                    className="font-body text-xs text-earth-brown hover:underline"
                  >
                    View all
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {(!data?.notifications?.length) && (
                  <p className="px-4 py-6 text-center font-body text-sm text-charcoal/40">No notifications</p>
                )}
                {data?.notifications?.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => void markRead(n.id, n.link_url)}
                    className={`w-full text-left px-4 py-3 border-b border-admin-card-border last:border-0 hover:bg-warm-beige/20 transition-colors ${!n.read_at ? 'bg-gold-accent/5' : ''}`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read_at && <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-accent" />}
                      {n.read_at && <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0" />}
                      <div className="min-w-0">
                        <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-charcoal/40">{typeLabel(n.type)} · {fmtTime(n.created_at)}</p>
                        <p className="font-body text-xs font-medium text-charcoal">{n.title}</p>
                        <p className="font-body text-xs text-charcoal/60 truncate">{n.body}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label="User menu"
          disabled
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-charcoal/40 hover:bg-charcoal/5 hover:text-charcoal transition-colors disabled:cursor-not-allowed"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
