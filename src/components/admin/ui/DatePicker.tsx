'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
  min?: string;
  max?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, helperText, error, id, required, min, max, className, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal">
            {label}
            {required && <span className="ml-0.5 text-error" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type="date"
          id={inputId}
          required={required}
          min={min}
          max={max}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-hint` : undefined}
          className={cn(
            'h-10 w-full rounded-xl border bg-admin-card-bg px-3 font-body text-sm text-charcoal',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-forest-green/30 focus:border-forest-green',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-error focus:ring-error/30 focus:border-error'
              : 'border-admin-card-border',
            className
          )}
          {...props}
        />
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
DatePicker.displayName = 'DatePicker';
