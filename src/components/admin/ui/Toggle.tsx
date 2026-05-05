'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function Toggle({ checked, onChange, label, description, disabled, id, className }: ToggleProps) {
  const generatedId = useId();
  const toggleId = id ?? generatedId;

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <button
        type="button"
        role="switch"
        id={toggleId}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent',
          'transition-colors duration-200 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-green/40 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          checked ? 'bg-forest-green' : 'bg-charcoal/20'
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm',
            'transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col gap-0.5 min-w-0">
          {label && (
            <label
              htmlFor={toggleId}
              className="font-body text-sm font-medium text-charcoal cursor-pointer select-none"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="font-body text-xs text-charcoal/60">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
