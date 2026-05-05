import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'padded' | 'compact' | 'ghost';
  className?: string;
}

const variantClasses: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'p-6',
  padded: 'p-8',
  compact: 'p-4',
  ghost: 'p-6 border-transparent shadow-none bg-transparent',
};

export function Card({ children, variant = 'default', className }: CardProps) {
  return (
    <div
      className={cn(
        'bg-admin-card-bg rounded-xl border border-admin-card-border',
        'shadow-[var(--admin-card-shadow)]',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
