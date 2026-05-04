'use client';

import { useState, type FormEvent } from 'react';

interface FormState {
  name: string;
  phone: string;
  experience: string;
  date: string;
}

interface FieldError {
  name?: string;
  phone?: string;
  experience?: string;
  date?: string;
}

const EXPERIENCE_OPTIONS = [
  { value: 'Bush Dining (₹3,000+)', label: 'Bush Dining (₹3,000+)' },
  { value: 'Alfresco Forest Dining (₹5,500+)', label: 'Alfresco Forest Dining (₹5,500+)' },
  { value: 'Not Sure - Recommend Me', label: 'Not Sure — Recommend Me' },
] as const;

const todayStr = () => new Date().toISOString().split('T')[0] ?? '';

export function DiningWaForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    experience: '',
    date: '',
  });
  const [errors, setErrors] = useState<FieldError>({});

  function validate(): boolean {
    const next: FieldError = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!form.phone.trim()) {
      next.phone = 'Please enter your WhatsApp number.';
    } else if (!/^\d{7,12}$/.test(form.phone.trim())) {
      next.phone = 'Please enter a valid 10-digit number.';
    }
    if (!form.experience) next.experience = 'Please select an experience.';
    if (!form.date) {
      next.date = 'Please select a preferred date.';
    } else if (form.date <= todayStr()) {
      next.date = 'Please select a future date.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    const msg =
      "Hi Madhuban, I'd like to reserve a dining experience.\n" +
      `Name: ${form.name.trim()}\n` +
      `WhatsApp: +91${form.phone.trim()}\n` +
      `Experience: ${form.experience}\n` +
      `Preferred Date: ${form.date}`;

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
      aria-label="Reserve a private dining experience via WhatsApp"
    >
      {/* Name */}
      <div>
        <label htmlFor="din-name" className={labelCls}>
          Name *
        </label>
        <input
          id="din-name"
          type="text"
          autoComplete="name"
          className={inputCls}
          placeholder="Your full name"
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          aria-describedby={errors.name ? 'din-name-err' : undefined}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p id="din-name-err" className={errorCls} role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* WhatsApp Number */}
      <div>
        <label htmlFor="din-phone" className={labelCls}>
          WhatsApp Number *
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center font-body text-sm text-charcoal/50">
            +91
          </span>
          <input
            id="din-phone"
            type="tel"
            autoComplete="tel"
            className={`${inputCls} pl-12`}
            placeholder="98765 43210"
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value)}
            aria-describedby={errors.phone ? 'din-phone-err' : undefined}
            aria-invalid={!!errors.phone}
          />
        </div>
        {errors.phone && (
          <p id="din-phone-err" className={errorCls} role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Experience */}
      <div>
        <label htmlFor="din-experience" className={labelCls}>
          Experience *
        </label>
        <select
          id="din-experience"
          className={`${inputCls} appearance-none`}
          value={form.experience}
          onChange={(e) => setField('experience', e.target.value)}
          aria-describedby={errors.experience ? 'din-experience-err' : undefined}
          aria-invalid={!!errors.experience}
        >
          <option value="" disabled>
            Select an experience
          </option>
          {EXPERIENCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.experience && (
          <p id="din-experience-err" className={errorCls} role="alert">
            {errors.experience}
          </p>
        )}
      </div>

      {/* Preferred Date */}
      <div>
        <label htmlFor="din-date" className={labelCls}>
          Preferred Date *
        </label>
        <input
          id="din-date"
          type="date"
          className={inputCls}
          min={(() => {
            const d = new Date();
            d.setDate(d.getDate() + 1);
            return d.toISOString().split('T')[0] ?? '';
          })()}
          value={form.date}
          onChange={(e) => setField('date', e.target.value)}
          aria-describedby={errors.date ? 'din-date-err' : undefined}
          aria-invalid={!!errors.date}
        />
        {errors.date && (
          <p id="din-date-err" className={errorCls} role="alert">
            {errors.date}
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
        Clicking submit opens WhatsApp with your details ready to send. We&#39;ll confirm
        availability and share the full menu within a few hours.
      </p>
    </form>
  );
}
