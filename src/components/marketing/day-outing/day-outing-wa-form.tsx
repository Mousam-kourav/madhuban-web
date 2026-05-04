'use client';

import { useState, type FormEvent } from 'react';

interface FormState {
  name: string;
  phone: string;
  guests: string;
  date: string;
}

interface FieldError {
  name?: string;
  phone?: string;
  guests?: string;
  date?: string;
}

const todayStr = () => new Date().toISOString().split('T')[0] ?? '';

export function DayOutingWaForm() {
  const [form, setForm] = useState<FormState>({ name: '', phone: '', guests: '', date: '' });
  const [errors, setErrors] = useState<FieldError>({});

  function validate(): boolean {
    const next: FieldError = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!form.phone.trim()) {
      next.phone = 'Please enter your WhatsApp number.';
    } else if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone.trim())) {
      next.phone = 'Please enter a valid phone number.';
    }
    if (!form.guests) next.guests = 'Please select number of guests.';
    if (!form.date) {
      next.date = 'Please select a preferred date.';
    } else if (form.date < todayStr()) {
      next.date = 'Date must be today or in the future.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    const msg =
      `Hi Madhuban, I'd like to book a Day Outing.\n` +
      `Name: ${form.name.trim()}\n` +
      `WhatsApp: +91${form.phone.trim()}\n` +
      `Guests: ${form.guests}\n` +
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
      aria-label="WhatsApp day outing booking form"
    >
      {/* Full Name */}
      <div>
        <label htmlFor="do-name" className={labelCls}>
          Full Name *
        </label>
        <input
          id="do-name"
          type="text"
          autoComplete="name"
          className={inputCls}
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          aria-describedby={errors.name ? 'do-name-err' : undefined}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p id="do-name-err" className={errorCls} role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* WhatsApp Number */}
      <div>
        <label htmlFor="do-phone" className={labelCls}>
          WhatsApp Number *
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center font-body text-sm text-charcoal/50">
            +91
          </span>
          <input
            id="do-phone"
            type="tel"
            autoComplete="tel"
            className={`${inputCls} pl-12`}
            placeholder="98765 43210"
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value)}
            aria-describedby={errors.phone ? 'do-phone-err' : undefined}
            aria-invalid={!!errors.phone}
          />
        </div>
        {errors.phone && (
          <p id="do-phone-err" className={errorCls} role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Number of Guests */}
      <div>
        <label htmlFor="do-guests" className={labelCls}>
          Number of Guests *
        </label>
        <select
          id="do-guests"
          className={`${inputCls} appearance-none`}
          value={form.guests}
          onChange={(e) => setField('guests', e.target.value)}
          aria-describedby={errors.guests ? 'do-guests-err' : undefined}
          aria-invalid={!!errors.guests}
        >
          <option value="" disabled>
            Select guests
          </option>
          {Array.from({ length: 50 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'guest' : 'guests'}
            </option>
          ))}
        </select>
        {errors.guests && (
          <p id="do-guests-err" className={errorCls} role="alert">
            {errors.guests}
          </p>
        )}
      </div>

      {/* Preferred Date */}
      <div>
        <label htmlFor="do-date" className={labelCls}>
          Preferred Date *
        </label>
        <input
          id="do-date"
          type="date"
          className={inputCls}
          min={todayStr()}
          value={form.date}
          onChange={(e) => setField('date', e.target.value)}
          aria-describedby={errors.date ? 'do-date-err' : undefined}
          aria-invalid={!!errors.date}
        />
        {errors.date && (
          <p id="do-date-err" className={errorCls} role="alert">
            {errors.date}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center rounded-xl bg-earth-brown font-body text-sm font-semibold uppercase tracking-wider text-ivory transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
      >
        SEND BY WHATSAPP
      </button>

      <p className="text-center font-body text-xs text-charcoal/50">
        Clicking submit opens WhatsApp with your details ready to send.
      </p>
    </form>
  );
}
