'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import { Bell, User } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';

function segmentToTitle(segment: string | null): string {
  if (!segment) return 'Dashboard';
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
}

export function TopBar() {
  const segment = useSelectedLayoutSegment();
  const title = segmentToTitle(segment);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-admin-card-border bg-admin-canvas-bg/95 backdrop-blur-sm px-6 py-3">
      <div className="flex flex-col gap-0.5">
        {/* Breadcrumb sits above the title on deeper pages */}
        <Breadcrumb />
        <h1 className="font-display text-2xl font-medium text-charcoal leading-tight">
          {title}
        </h1>
      </div>

      {/* Right: placeholder actions (wired in A8) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications (coming soon)"
          disabled
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-charcoal/40 hover:bg-charcoal/5 hover:text-charcoal transition-colors disabled:cursor-not-allowed"
        >
          <Bell className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label="User menu (coming soon)"
          disabled
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-charcoal/40 hover:bg-charcoal/5 hover:text-charcoal transition-colors disabled:cursor-not-allowed"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
