'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-forest-green text-ivory hover:bg-forest-green/90 focus-visible:ring-forest-green/40',
  secondary: 'border border-warm-beige bg-transparent text-charcoal hover:bg-warm-beige/40 focus-visible:ring-charcoal/20',
  ghost:     'bg-transparent text-charcoal hover:bg-charcoal/5 focus-visible:ring-charcoal/20',
  danger:    'bg-error text-ivory hover:bg-error/90 focus-visible:ring-error/40',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-6 text-base rounded-xl',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  href,
  type = 'button',
  onClick,
  className,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const base = cn(
    'inline-flex items-center justify-center gap-2 font-body font-medium',
    'transition-colors focus-visible:outline-none focus-visible:ring-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={base} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={base}
      aria-label={ariaLabel}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
