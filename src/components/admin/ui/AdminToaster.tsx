'use client';

import { Toaster } from 'sonner';

export function AdminToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            'font-body text-sm bg-admin-card-bg border border-admin-card-border shadow-[var(--admin-card-shadow)] text-charcoal rounded-xl',
          title: 'font-medium text-charcoal',
          description: 'text-charcoal/60',
          success: 'border-l-4 border-l-admin-status-confirmed-fg',
          error: 'border-l-4 border-l-admin-status-cancelled-fg',
          info: 'border-l-4 border-l-admin-status-info-fg',
        },
      }}
    />
  );
}
