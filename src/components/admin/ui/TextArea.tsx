'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  currentLength?: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, helperText, error, id, required, maxLength, currentLength, className, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    const charCount = currentLength ?? 0;
    const showCounter = typeof maxLength === 'number';
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal">
            {label}
            {required && <span className="ml-0.5 text-error" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          required={required}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-hint` : undefined}
          className={cn(
            'min-h-24 w-full resize-y rounded-xl border bg-admin-card-bg px-3 py-2.5 font-body text-sm text-charcoal',
            'placeholder:text-charcoal/40 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-forest-green/30 focus:border-forest-green',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-error focus:ring-error/30 focus:border-error'
              : 'border-admin-card-border',
            className
          )}
          {...props}
        />
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
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
          {showCounter && (
            <p
              className={cn(
                'flex-shrink-0 font-body text-xs tabular-nums',
                charCount > maxLength * 0.9 ? 'text-warning' : 'text-charcoal/40'
              )}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);
TextArea.displayName = 'TextArea';
