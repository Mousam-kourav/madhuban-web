'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IconButtonProps {
  icon: ReactNode;
  label: string;
  variant?: 'default' | 'ghost';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const variantClasses: Record<NonNullable<IconButtonProps['variant']>, string> = {
  default: 'bg-admin-card-bg border border-admin-card-border text-charcoal hover:border-charcoal/30 hover:bg-charcoal/5',
  ghost:   'bg-transparent text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5',
};

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  onClick,
  disabled,
  type = 'button',
  className,
}: IconButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-lg',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal/20',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        className
      )}
    >
      {icon}
    </button>
  );
}
