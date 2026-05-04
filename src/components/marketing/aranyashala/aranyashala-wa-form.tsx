'use client';

import { useState, type FormEvent } from 'react';

interface FormState {
  name: string;
  phone: string;
  groupType: string;
  groupSize: string;
}

interface FieldError {
  name?: string;
  phone?: string;
  groupType?: string;
  groupSize?: string;
}

const GROUP_TYPES = ['School', 'College', 'Corporate', 'Other'] as const;

export function AranyashalaWaForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    groupType: '',
    groupSize: '',
  });
  const [errors, setErrors] = useState<FieldError>({});

  function validate(): boolean {
    const next: FieldError = {};
    if (!form.name.trim()) next.name = 'Please enter a contact name.';
    if (!form.phone.trim()) {
      next.phone = 'Please enter a WhatsApp number.';
    } else if (!/^\d{7,12}$/.test(form.phone.trim())) {
      next.phone = 'Please enter a valid 10-digit number.';
    }
    if (!form.groupType) next.groupType = 'Please select a group type.';
    if (!form.groupSize) {
      next.groupSize = 'Please enter approximate group size.';
    } else {
      const n = parseInt(form.groupSize, 10);
      if (isNaN(n) || n < 5 || n > 200) {
        next.groupSize = 'Group size must be between 5 and 200.';
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    const msg =
      `Hi Madhuban, I'm interested in Aranyashala.\n` +
      `Contact: ${form.name.trim()}\n` +
      `WhatsApp: +91${form.phone.trim()}\n` +
      `Group Type: ${form.groupType}\n` +
      `Group Size: ${form.groupSize}`;

    window.open(
      `https://wa.me/919770558419?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  function setField(id: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
  }

  const inputCls =
    'h-12 w-full rounded-xl border border-border bg-white px-4 font-body text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-earth-brown/50 transition';
  const labelCls =
    'mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-charcoal/60';
  const errorCls = 'mt-1 font-body text-xs text-[#B84A4A]';

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
      aria-label="Aranyashala group enquiry via WhatsApp"
    >
      {/* Group Contact Name */}
      <div>
        <label htmlFor="ara-name" className={labelCls}>
          Group Contact Name *
        </label>
        <input
          id="ara-name"
          type="text"
          autoComplete="name"
          className={inputCls}
          placeholder="Your full name"
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          aria-describedby={errors.name ? 'ara-name-err' : undefined}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p id="ara-name-err" className={errorCls} role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* WhatsApp Number */}
      <div>
        <label htmlFor="ara-phone" className={labelCls}>
          WhatsApp Number *
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center font-body text-sm text-charcoal/50">
            +91
          </span>
          <input
            id="ara-phone"
            type="tel"
            autoComplete="tel"
            className={`${inputCls} pl-12`}
            placeholder="98765 43210"
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value)}
            aria-describedby={errors.phone ? 'ara-phone-err' : undefined}
            aria-invalid={!!errors.phone}
          />
        </div>
        {errors.phone && (
          <p id="ara-phone-err" className={errorCls} role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Group Type */}
      <div>
        <label htmlFor="ara-type" className={labelCls}>
          Group Type *
        </label>
        <select
          id="ara-type"
          className={`${inputCls} appearance-none`}
          value={form.groupType}
          onChange={(e) => setField('groupType', e.target.value)}
          aria-describedby={errors.groupType ? 'ara-type-err' : undefined}
          aria-invalid={!!errors.groupType}
        >
          <option value="" disabled>
            Select group type
          </option>
          {GROUP_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.groupType && (
          <p id="ara-type-err" className={errorCls} role="alert">
            {errors.groupType}
          </p>
        )}
      </div>

      {/* Approximate Group Size */}
      <div>
        <label htmlFor="ara-size" className={labelCls}>
          Approximate Group Size *
        </label>
        <input
          id="ara-size"
          type="number"
          min={5}
          max={200}
          className={inputCls}
          placeholder="e.g. 30"
          value={form.groupSize}
          onChange={(e) => setField('groupSize', e.target.value)}
          aria-describedby={errors.groupSize ? 'ara-size-err' : undefined}
          aria-invalid={!!errors.groupSize}
        />
        {errors.groupSize && (
          <p id="ara-size-err" className={errorCls} role="alert">
            {errors.groupSize}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center rounded-xl bg-earth-brown font-body text-sm font-semibold uppercase tracking-wider text-ivory transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
      >
        Send WhatsApp Enquiry
      </button>

      <p className="text-center font-body text-xs text-charcoal/50">
        Clicking submit opens WhatsApp with your details ready to send.
      </p>
    </form>
  );
}
