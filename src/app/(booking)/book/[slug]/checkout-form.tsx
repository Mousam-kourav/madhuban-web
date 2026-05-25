"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import type { PricingBreakdown, GuestDetails } from "@/lib/booking/types";
import { formatPrice } from "@/lib/utils";

const TRUST_BADGES = [
  "Best rate, guaranteed",
  "No booking fees, ever",
  "Free cancellation up to 7 days before arrival",
  "Instant confirmation by email",
] as const;

interface CheckoutFormProps {
  slug: string;
  roomName: string;
  defaultCheckIn: string;
  defaultCheckOut: string;
  defaultAdults: number;
  defaultChildren: number;
  minNights: number;
  maxAdults: number;
  maxChildren: number;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function addDays(d: string, n: number) {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
}

const INPUT_BASE =
  "w-full rounded-lg border bg-background px-3 py-2.5 font-body text-sm text-charcoal placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-earth-brown";
const INPUT_CLS = `${INPUT_BASE} border-border`;
const INPUT_ERR_CLS = `${INPUT_BASE} border-border border-b-2 border-b-red-500`;
const LABEL_CLS = "mb-1 block font-body text-xs font-medium text-charcoal";
const ERROR_CLS = "mt-1 font-body text-xs text-red-600";
const NOTE_CLS = "mt-2 font-body text-xs text-earth-brown/80";

const PHONE_RE = /^\d{10,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CheckoutForm({
  slug,
  roomName,
  defaultCheckIn,
  defaultCheckOut,
  defaultAdults,
  defaultChildren,
  minNights,
  maxAdults,
  maxChildren,
}: CheckoutFormProps) {
  const router = useRouter();
  const today = todayStr();

  // Booking params
  const [checkIn, setCheckIn] = useState(defaultCheckIn || today);
  const [checkOut, setCheckOut] = useState(
    defaultCheckOut || addDays(defaultCheckIn || today, Math.max(minNights, 1)),
  );
  const [adults, setAdults] = useState(defaultAdults || 2);
  const [children, setChildren] = useState(defaultChildren || 0);
  const [couponCode, setCouponCode] = useState("");

  // Guest details
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Pricing state
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [pricingError, setPricingError] = useState("");
  const [loadingPrice, setLoadingPrice] = useState(false);

  // Form errors
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  // Mobile sticky-bar expanded breakdown panel (only used on <lg viewports)
  const [mobilePriceExpanded, setMobilePriceExpanded] = useState(false);

  const fetchPrice = useCallback(async () => {
    if (!checkIn || !checkOut || checkOut <= checkIn) return;
    setLoadingPrice(true);
    setPricingError("");
    try {
      const res = await fetch("/api/booking/calculate-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomSlug: slug,
          checkIn,
          checkOut,
          adults,
          children,
          couponCode: couponCode.trim().toUpperCase() || undefined,
        }),
      });
      const data = (await res.json()) as PricingBreakdown & { error?: string };
      if (!res.ok) {
        setPricingError(data.error ?? "Could not calculate price");
        setPricing(null);
      } else {
        setPricing(data);
      }
    } catch {
      setPricingError("Could not calculate price. Please try again.");
    } finally {
      setLoadingPrice(false);
    }
  }, [slug, checkIn, checkOut, adults, children, couponCode]);

  // Fetch price on mount and when booking params change.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void fetchPrice(); }, [fetchPrice]);

  // Field-level validators — return error string or empty for "valid"
  const validateName = (v: string) => (v.trim() ? "" : "Name is required");
  const validateEmail = (v: string) =>
    !v.trim() || !EMAIL_RE.test(v.trim()) ? "Enter a valid email address" : "";
  const validatePhone = (v: string) => {
    const digits = v.replace(/\D/g, "");
    return PHONE_RE.test(digits)
      ? ""
      : "Enter a 10-digit mobile number (or include country code)";
  };
  const validateDates = (ci: string, co: string) => {
    if (!ci || !co) return "Select both dates";
    if (co <= ci) return "Check-out must be after check-in";
    const n = Math.round((new Date(co).getTime() - new Date(ci).getTime()) / 86400000);
    if (n < minNights)
      return `Minimum stay is ${minNights} night${minNights > 1 ? "s" : ""}`;
    return "";
  };

  const setFieldError = (key: string, value: string) =>
    setErrors((prev) => {
      const next = { ...prev };
      if (value) next[key] = value;
      else delete next[key];
      return next;
    });

  const clearFieldError = (key: string) => {
    if (errors[key]) setFieldError(key, "");
  };

  const validate = (): boolean => {
    const e: Partial<Record<string, string>> = {};
    const nameErr = validateName(guestName);
    const emailErr = validateEmail(guestEmail);
    const phoneErr = validatePhone(guestPhone);
    const dateErr = validateDates(checkIn, checkOut);
    if (nameErr) e.guestName = nameErr;
    if (emailErr) e.guestEmail = emailErr;
    if (phoneErr) e.guestPhone = phoneErr;
    if (dateErr) e.checkOut = dateErr;
    if (!pricing) e.pricing = "Please wait for price calculation";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !pricing) return;
    setSubmitting(true);

    const guest: GuestDetails = {
      name: guestName.trim(),
      email: guestEmail.trim(),
      phone: guestPhone.trim(),
      specialRequests: specialRequests.trim() || undefined,
    };

    // Save draft to sessionStorage, then redirect to review
    const draft = { guest, pricing };
    try {
      sessionStorage.setItem("booking_draft", JSON.stringify(draft));
      router.push(`/book/${slug}/review`);
    } catch {
      setErrors({ submit: "Could not save booking. Please try again." });
      setSubmitting(false);
    }
  };

  const nights = checkIn && checkOut && checkOut > checkIn
    ? Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
    : 0;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-8 pb-36 lg:grid-cols-[1fr_360px] lg:pb-0">
        {/* ── Left column: details form ─────────────────────────────── */}
        <div className="space-y-6">
          {/* Stay dates */}
          <fieldset className="rounded-xl border border-border p-6">
            <legend className="px-1 font-body text-sm font-semibold text-charcoal">
              Your Stay
            </legend>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="checkIn" className={LABEL_CLS}>
                  Check-in
                </label>
                <input
                  id="checkIn"
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (e.target.value >= checkOut)
                      setCheckOut(addDays(e.target.value, Math.max(minNights, 1)));
                    clearFieldError("checkOut");
                  }}
                  onBlur={(e) =>
                    setFieldError("checkOut", validateDates(e.target.value, checkOut))
                  }
                  className={errors.checkOut ? INPUT_ERR_CLS : INPUT_CLS}
                  required
                />
              </div>
              <div>
                <label htmlFor="checkOut" className={LABEL_CLS}>
                  Check-out
                </label>
                <input
                  id="checkOut"
                  type="date"
                  value={checkOut}
                  min={checkIn ? addDays(checkIn, minNights) : today}
                  onChange={(e) => {
                    setCheckOut(e.target.value);
                    clearFieldError("checkOut");
                  }}
                  onBlur={(e) =>
                    setFieldError("checkOut", validateDates(checkIn, e.target.value))
                  }
                  className={errors.checkOut ? INPUT_ERR_CLS : INPUT_CLS}
                  required
                />
                {errors.checkOut && <p className={ERROR_CLS}>{errors.checkOut}</p>}
              </div>
            </div>

            {minNights > 1 && (
              <p className={NOTE_CLS}>
                Minimum stay: {minNights} nights for this room.
              </p>
            )}

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="adults" className={LABEL_CLS}>
                  Adults
                </label>
                <select
                  id="adults"
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className={INPUT_CLS}
                >
                  {Array.from({ length: maxAdults }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} adult{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              {maxChildren > 0 && (
                <div>
                  <label htmlFor="children" className={LABEL_CLS}>
                    Children
                  </label>
                  <select
                    id="children"
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className={INPUT_CLS}
                  >
                    {Array.from({ length: maxChildren + 1 }, (_, i) => i).map((n) => (
                      <option key={n} value={n}>
                        {n === 0 ? "No children" : `${n} child${n > 1 ? "ren" : ""}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </fieldset>

          {/* Guest details */}
          <fieldset className="rounded-xl border border-border p-6">
            <legend className="px-1 font-body text-sm font-semibold text-charcoal">
              Guest Details
            </legend>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="guestName" className={LABEL_CLS}>
                  Full name
                </label>
                <input
                  id="guestName"
                  type="text"
                  autoComplete="name"
                  value={guestName}
                  onChange={(e) => {
                    setGuestName(e.target.value);
                    clearFieldError("guestName");
                  }}
                  onBlur={(e) =>
                    setFieldError("guestName", validateName(e.target.value))
                  }
                  placeholder="Your full name"
                  className={errors.guestName ? INPUT_ERR_CLS : INPUT_CLS}
                  required
                />
                {errors.guestName && <p className={ERROR_CLS}>{errors.guestName}</p>}
              </div>
              <div>
                <label htmlFor="guestEmail" className={LABEL_CLS}>
                  Email
                </label>
                <input
                  id="guestEmail"
                  type="email"
                  autoComplete="email"
                  value={guestEmail}
                  onChange={(e) => {
                    setGuestEmail(e.target.value);
                    clearFieldError("guestEmail");
                  }}
                  onBlur={(e) =>
                    setFieldError("guestEmail", validateEmail(e.target.value))
                  }
                  placeholder="you@example.com"
                  className={errors.guestEmail ? INPUT_ERR_CLS : INPUT_CLS}
                  required
                />
                {errors.guestEmail && <p className={ERROR_CLS}>{errors.guestEmail}</p>}
              </div>
              <div>
                <label htmlFor="guestPhone" className={LABEL_CLS}>
                  Mobile number
                </label>
                <input
                  id="guestPhone"
                  type="tel"
                  autoComplete="tel"
                  value={guestPhone}
                  onChange={(e) => {
                    setGuestPhone(e.target.value);
                    clearFieldError("guestPhone");
                  }}
                  onBlur={(e) =>
                    setFieldError("guestPhone", validatePhone(e.target.value))
                  }
                  placeholder="+91 98765 43210"
                  className={errors.guestPhone ? INPUT_ERR_CLS : INPUT_CLS}
                  required
                />
                {errors.guestPhone && <p className={ERROR_CLS}>{errors.guestPhone}</p>}
              </div>
              <div>
                <label htmlFor="specialRequests" className={LABEL_CLS}>
                  Special requests{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="specialRequests"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={3}
                  maxLength={2000}
                  placeholder="Dietary needs, accessibility requirements, celebrating a special occasion..."
                  className={INPUT_CLS}
                />
              </div>
            </div>
          </fieldset>

          {/* Coupon */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="couponCode" className={LABEL_CLS}>
                Coupon code
              </label>
              <input
                id="couponCode"
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="FOREST20"
                className={INPUT_CLS}
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => void fetchPrice()}
                className="h-[42px] rounded-lg border border-earth-brown px-4 font-body text-sm font-medium text-earth-brown transition-colors hover:bg-earth-brown hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Why book direct? — trust block above Continue (BOOKING audit) */}
          <aside
            aria-label="Why book direct"
            className="rounded-xl border border-earth-brown/10 bg-warm-beige p-5"
          >
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-earth-brown/80">
              Why book direct?
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-4">
              {TRUST_BADGES.map((badge) => (
                <li
                  key={badge}
                  className="flex items-start gap-2 font-body text-sm font-medium text-earth-brown"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-earth-brown"
                    aria-hidden="true"
                  />
                  <span>{badge}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {/* ── Right column: price summary (desktop only) ────────────── */}
        <div className="hidden space-y-4 lg:block">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-xl font-medium text-charcoal">
              Price Summary
            </h2>
            <p className="mt-1 font-body text-sm text-muted-foreground">
              {roomName}
            </p>

            {loadingPrice ? (
              <div className="mt-6 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-4 animate-pulse rounded bg-warm-beige/60"
                  />
                ))}
              </div>
            ) : pricingError ? (
              <p className="mt-4 font-body text-sm text-red-600">{pricingError}</p>
            ) : pricing ? (
              <div className="mt-6 space-y-3 font-body text-sm">
                <div className="flex justify-between text-charcoal/70">
                  <span>
                    &#8377;{formatPrice(pricing.pricePerNight)} × {pricing.nights} night
                    {pricing.nights > 1 ? "s" : ""}
                  </span>
                  <span>&#8377;{formatPrice(pricing.baseNightlyTotal)}</span>
                </div>

                {pricing.discountAmount > 0 && (
                  <div className="flex justify-between text-moss-green">
                    <span>Coupon ({pricing.couponCode})</span>
                    <span>−&#8377;{formatPrice(pricing.discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-charcoal/70">
                  <span>GST ({pricing.gstRate}%)</span>
                  <span>&#8377;{formatPrice(pricing.gstAmount)}</span>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex justify-between font-semibold text-charcoal">
                    <span>Total</span>
                    <span>&#8377;{formatPrice(pricing.totalAmount)}</span>
                  </div>
                </div>

                <div className="rounded-lg bg-warm-beige/40 p-3 text-xs text-charcoal/70">
                  <p>
                    <strong className="text-charcoal">Due now (full payment):</strong>{" "}
                    &#8377;{formatPrice(pricing.totalAmount)}
                  </p>
                  <p className="mt-1">No balance due at check-in.</p>
                </div>
              </div>
            ) : nights > 0 ? (
              <p className="mt-4 font-body text-sm text-muted-foreground">
                Calculating...
              </p>
            ) : (
              <p className="mt-4 font-body text-sm text-muted-foreground">
                Select dates to see pricing.
              </p>
            )}

            {errors.pricing && (
              <p className={`mt-2 ${ERROR_CLS}`}>{errors.pricing}</p>
            )}
            {errors.submit && (
              <p className={`mt-2 ${ERROR_CLS}`}>{errors.submit}</p>
            )}

            <button
              type="submit"
              disabled={submitting || loadingPrice || !pricing}
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-earth-brown font-body text-sm font-medium text-ivory transition-colors duration-200 hover:bg-earth-brown/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
            >
              {submitting ? "Please wait…" : "Continue to Review"}
            </button>

            <p className="mt-3 text-center font-body text-xs text-muted-foreground">
              No payment charged yet. Review on the next step.
            </p>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar: Continue + collapsible price ─── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-ivory shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)] lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Expanded breakdown panel (above the compact row) */}
        {mobilePriceExpanded && pricing && (
          <div
            id="mobile-price-breakdown"
            className="border-b border-border bg-warm-beige/40 px-4 py-3"
          >
            <div className="space-y-2 font-body text-sm">
              <div className="flex justify-between text-charcoal/70">
                <span>
                  &#8377;{formatPrice(pricing.pricePerNight)} × {pricing.nights}{" "}
                  night{pricing.nights > 1 ? "s" : ""}
                </span>
                <span>&#8377;{formatPrice(pricing.baseNightlyTotal)}</span>
              </div>
              {pricing.discountAmount > 0 && (
                <div className="flex justify-between text-moss-green">
                  <span>Coupon ({pricing.couponCode})</span>
                  <span>−&#8377;{formatPrice(pricing.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-charcoal/70">
                <span>GST ({pricing.gstRate}%)</span>
                <span>&#8377;{formatPrice(pricing.gstAmount)}</span>
              </div>
              <p className="pt-1 text-xs text-charcoal/60">
                Full payment now. No balance at check-in.
              </p>
            </div>
          </div>
        )}

        {/* Compact row: Continue on top, tappable total below */}
        <div className="space-y-2 px-4 py-3">
          <button
            type="submit"
            disabled={submitting || loadingPrice || !pricing}
            className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-earth-brown font-body text-sm font-medium text-ivory transition-colors duration-200 hover:bg-earth-brown/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
          >
            {submitting ? "Please wait…" : "Continue to Review"}
          </button>

          <button
            type="button"
            onClick={() => setMobilePriceExpanded((v) => !v)}
            aria-expanded={mobilePriceExpanded}
            aria-controls="mobile-price-breakdown"
            disabled={!pricing}
            className="flex w-full items-center justify-between rounded-lg px-1 py-1 font-body text-sm text-charcoal disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown"
          >
            <span className="flex items-center gap-1.5 text-charcoal/70">
              Total
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  mobilePriceExpanded ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </span>
            <span className="font-semibold text-charcoal">
              {loadingPrice
                ? "Calculating…"
                : pricing
                ? `₹${formatPrice(pricing.totalAmount)}`
                : "—"}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}
