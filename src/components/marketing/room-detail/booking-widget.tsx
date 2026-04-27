"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

interface BookingWidgetProps {
  slug: string;
  pricePerNight: number;
  maxAdults: number;
  maxChildren: number;
  minNights?: number;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function diffDays(a: string, b: string): number {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / 86400000,
  );
}

export function BookingWidget({
  slug,
  pricePerNight,
  maxAdults,
  maxChildren,
  minNights = 1,
}: BookingWidgetProps) {
  const router = useRouter();
  const today = todayStr();
  const defaultCheckOut = addDays(today, Math.max(minNights, 1));

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const nights = checkIn && checkOut && checkOut > checkIn
    ? diffDays(checkIn, checkOut)
    : 0;

  const estimatedTotal = nights > 0 ? pricePerNight * nights : 0;

  const handleCheckInChange = useCallback(
    (val: string) => {
      setCheckIn(val);
      if (val && checkOut <= val) {
        setCheckOut(addDays(val, Math.max(minNights, 1)));
      }
    },
    [checkOut, minNights],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || checkOut <= checkIn) return;
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      adults: String(adults),
      children: String(children),
    });
    router.push(`/book/${slug}?${params.toString()}`);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <p className="font-display text-3xl font-medium text-earth-brown">
        &#8377;{formatPrice(pricePerNight)}
      </p>
      <p className="mt-1 font-body text-xs text-muted-foreground">
        per night, GST inclusive
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3" noValidate>
        {/* Date row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="widget-checkin"
              className="mb-1 block font-body text-xs font-medium text-charcoal"
            >
              Check-in
            </label>
            <input
              id="widget-checkin"
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => handleCheckInChange(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-body text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-earth-brown"
            />
          </div>
          <div>
            <label
              htmlFor="widget-checkout"
              className="mb-1 block font-body text-xs font-medium text-charcoal"
            >
              Check-out
            </label>
            <input
              id="widget-checkout"
              type="date"
              value={checkOut}
              min={checkIn ? addDays(checkIn, minNights) : today}
              onChange={(e) => setCheckOut(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-body text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-earth-brown"
            />
          </div>
        </div>

        {/* Guests row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="widget-adults"
              className="mb-1 block font-body text-xs font-medium text-charcoal"
            >
              Adults
            </label>
            <select
              id="widget-adults"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-body text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-earth-brown"
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
              <label
                htmlFor="widget-children"
                className="mb-1 block font-body text-xs font-medium text-charcoal"
              >
                Children
              </label>
              <select
                id="widget-children"
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-body text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-earth-brown"
              >
                {Array.from({ length: maxChildren + 1 }, (_, i) => i).map(
                  (n) => (
                    <option key={n} value={n}>
                      {n === 0 ? "No children" : `${n} child${n > 1 ? "ren" : ""}`}
                    </option>
                  ),
                )}
              </select>
            </div>
          )}
        </div>

        {/* Price estimate */}
        {nights > 0 && (
          <p className="font-body text-sm text-charcoal/70">
            {nights} night{nights > 1 ? "s" : ""} ·{" "}
            <span className="font-medium text-charcoal">
              &#8377;{formatPrice(estimatedTotal)}
            </span>{" "}
            est. total
          </p>
        )}

        <button
          type="submit"
          disabled={!checkIn || !checkOut || checkOut <= checkIn}
          className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-lg bg-earth-brown font-body text-sm font-medium text-ivory transition-colors duration-200 hover:bg-earth-brown/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
        >
          Check Availability
        </button>
      </form>

      <a
        href={`https://wa.me/919770558419?text=${encodeURIComponent(
          `Hi, I'm interested in booking ${slug.replace(/-/g, " ")} at Madhuban Eco Retreat.`,
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block text-center font-body text-xs text-earth-brown underline-offset-4 hover:underline"
      >
        Or chat on WhatsApp
      </a>
    </div>
  );
}
