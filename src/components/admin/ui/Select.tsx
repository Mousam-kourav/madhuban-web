'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, id, required, options, placeholder, className, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal">
            {label}
            {required && <span className="ml-0.5 text-error" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-hint` : undefined}
            className={cn(
              'h-10 w-full appearance-none rounded-xl border bg-admin-card-bg pl-3 pr-9 font-body text-sm text-charcoal',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-forest-green/30 focus:border-forest-green',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error
                ? 'border-error focus:ring-error/30 focus:border-error'
                : 'border-admin-card-border',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40"
            aria-hidden="true"
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} role="alert" className="font-body text-xs text-error">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-hint`} className="font-body text-xs text-charcoal/60">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
