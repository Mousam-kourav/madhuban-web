import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: EmptyStateAction;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="mb-4 rounded-2xl bg-admin-status-neutral-bg p-4 text-admin-status-neutral-fg">
        {icon}
      </div>
      <h3 className="mb-2 font-display text-xl font-medium text-charcoal">{title}</h3>
      <p className="max-w-sm font-body text-sm text-charcoal/60">{description}</p>
      {action && (
        <div className="mt-6">
          {action.href ? (
            <a
              href={action.href}
              className="inline-flex h-10 items-center rounded-xl bg-forest-green px-4 font-body text-sm font-medium text-ivory transition-colors hover:bg-forest-green/90"
            >
              {action.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="inline-flex h-10 items-center rounded-xl bg-forest-green px-4 font-body text-sm font-medium text-ivory transition-colors hover:bg-forest-green/90"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
