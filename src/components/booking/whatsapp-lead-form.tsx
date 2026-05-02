'use client';

import { useState, type FormEvent } from 'react';

interface FormState {
  name: string;
  phone: string;
  guests: string;
  checkin: string;
}

interface FieldError {
  name?: string;
  phone?: string;
  guests?: string;
  checkin?: string;
}

const today = () => new Date().toISOString().split('T')[0] ?? '';

export function WhatsAppLeadForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    guests: '',
    checkin: '',
  });
  const [errors, setErrors] = useState<FieldError>({});

  function validate(): boolean {
    const next: FieldError = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!form.phone.trim()) {
      next.phone = 'Please enter your WhatsApp number.';
    } else if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone.trim())) {
      next.phone = 'Please enter a valid phone number.';
    }
    if (!form.guests) {
      next.guests = 'Please select number of guests.';
    }
    if (!form.checkin) {
      next.checkin = 'Please select a check-in date.';
    } else if (form.checkin < today()) {
      next.checkin = 'Check-in date must be today or in the future.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    const msg = [
      `Hi Madhuban, I'd like a quote.`,
      `Name: ${form.name.trim()}`,
      `WhatsApp: ${form.phone.trim()}`,
      `Guests: ${form.guests}`,
      `Check-In: ${form.checkin}`,
    ].join('\n');

    const url = `https://wa.me/919770558419?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function field(id: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
  }

  const inputCls =
    'h-12 w-full rounded-xl border border-border bg-white px-4 font-body text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-earth-brown/50 transition';
  const labelCls = 'mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-charcoal/60';
  const errorCls = 'mt-1 font-body text-xs text-[#B84A4A]';

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
      aria-label="WhatsApp booking enquiry form"
    >
      {/* Full Name */}
      <div>
        <label htmlFor="wf-name" className={labelCls}>Full Name *</label>
        <input
          id="wf-name"
          type="text"
          autoComplete="name"
          className={inputCls}
          placeholder="Your name"
          value={form.name}
          onChange={(e) => field('name', e.target.value)}
          aria-describedby={errors.name ? 'wf-name-err' : undefined}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p id="wf-name-err" className={errorCls} role="alert">{errors.name}</p>
        )}
      </div>

      {/* WhatsApp Number */}
      <div>
        <label htmlFor="wf-phone" className={labelCls}>WhatsApp Number *</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center font-body text-sm text-charcoal/50 pointer-events-none">
            +91
          </span>
          <input
            id="wf-phone"
            type="tel"
            autoComplete="tel"
            className={`${inputCls} pl-12`}
            placeholder="98765 43210"
            value={form.phone}
            onChange={(e) => field('phone', e.target.value)}
            aria-describedby={errors.phone ? 'wf-phone-err' : undefined}
            aria-invalid={!!errors.phone}
          />
        </div>
        {errors.phone && (
          <p id="wf-phone-err" className={errorCls} role="alert">{errors.phone}</p>
        )}
      </div>

      {/* Guests */}
      <div>
        <label htmlFor="wf-guests" className={labelCls}>Number of Guests *</label>
        <select
          id="wf-guests"
          className={`${inputCls} appearance-none`}
          value={form.guests}
          onChange={(e) => field('guests', e.target.value)}
          aria-describedby={errors.guests ? 'wf-guests-err' : undefined}
          aria-invalid={!!errors.guests}
        >
          <option value="" disabled>Select guests</option>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
          ))}
        </select>
        {errors.guests && (
          <p id="wf-guests-err" className={errorCls} role="alert">{errors.guests}</p>
        )}
      </div>

      {/* Check-In Date */}
      <div>
        <label htmlFor="wf-checkin" className={labelCls}>Check-In Date *</label>
        <input
          id="wf-checkin"
          type="date"
          className={inputCls}
          min={today()}
          value={form.checkin}
          onChange={(e) => field('checkin', e.target.value)}
          aria-describedby={errors.checkin ? 'wf-checkin-err' : undefined}
          aria-invalid={!!errors.checkin}
        />
        {errors.checkin && (
          <p id="wf-checkin-err" className={errorCls} role="alert">{errors.checkin}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center rounded-xl bg-earth-brown font-body text-sm font-semibold uppercase tracking-wider text-ivory transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
      >
        Send by WhatsApp
      </button>

      <p className="text-center font-body text-xs text-charcoal/50">
        Clicking submit opens WhatsApp with your details ready to send.
      </p>
    </form>
  );
}
