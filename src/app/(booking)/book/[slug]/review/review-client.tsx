"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { BookingDraft } from "@/lib/booking/types";
import { formatPrice } from "@/lib/utils";

interface ReviewClientProps {
  slug: string;
}

export function ReviewClient({ slug }: ReviewClientProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Reading from sessionStorage (external system) and syncing to state.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("booking_draft");
      if (!raw) { router.replace(`/book/${slug}`); return; }
      const parsed = JSON.parse(raw) as BookingDraft;
      if (parsed.pricing.roomSlug !== slug) { router.replace(`/book/${slug}`); return; }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDraft(parsed);
    } catch {
      router.replace(`/book/${slug}`);
    }
  }, [slug, router]);

  const handleConfirm = async () => {
    if (!draft) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomSlug: draft.pricing.roomSlug,
          checkIn: draft.pricing.checkIn,
          checkOut: draft.pricing.checkOut,
          adults: draft.pricing.adults,
          children: draft.pricing.children,
          guestName: draft.guest.name,
          guestEmail: draft.guest.email,
          guestPhone: draft.guest.phone,
          specialRequests: draft.guest.specialRequests,
          couponCode: draft.pricing.couponCode ?? undefined,
        }),
      });

      const data = (await res.json()) as { bookingId?: string; referenceNumber?: string; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Could not create booking. Please try again.");
        setSubmitting(false);
        return;
      }

      sessionStorage.removeItem("booking_draft");
      router.push(`/book/${slug}/payment?id=${data.bookingId}`);
    } catch {
      setError("A network error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  if (!draft) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-body text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const { guest, pricing } = draft;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Stay summary */}
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 font-body text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Your Stay
        </h2>
        <dl className="grid grid-cols-2 gap-y-3 font-body text-sm">
          <dt className="text-muted-foreground">Room</dt>
          <dd className="font-medium text-charcoal">{pricing.roomName}</dd>
          <dt className="text-muted-foreground">Check-in</dt>
          <dd className="font-medium text-charcoal">
            {new Date(pricing.checkIn).toLocaleDateString("en-IN", {
              weekday: "short", day: "numeric", month: "long", year: "numeric",
            })}
          </dd>
          <dt className="text-muted-foreground">Check-out</dt>
          <dd className="font-medium text-charcoal">
            {new Date(pricing.checkOut).toLocaleDateString("en-IN", {
              weekday: "short", day: "numeric", month: "long", year: "numeric",
            })}
          </dd>
          <dt className="text-muted-foreground">Duration</dt>
          <dd className="font-medium text-charcoal">
            {pricing.nights} night{pricing.nights > 1 ? "s" : ""}
          </dd>
          <dt className="text-muted-foreground">Guests</dt>
          <dd className="font-medium text-charcoal">
            {pricing.adults} adult{pricing.adults > 1 ? "s" : ""}
            {pricing.children > 0 &&
              `, ${pricing.children} child${pricing.children > 1 ? "ren" : ""}`}
          </dd>
        </dl>
      </section>

      {/* Guest details */}
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 font-body text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Guest Details
        </h2>
        <dl className="grid grid-cols-2 gap-y-3 font-body text-sm">
          <dt className="text-muted-foreground">Name</dt>
          <dd className="font-medium text-charcoal">{guest.name}</dd>
          <dt className="text-muted-foreground">Email</dt>
          <dd className="break-all font-medium text-charcoal">{guest.email}</dd>
          <dt className="text-muted-foreground">Phone</dt>
          <dd className="font-medium text-charcoal">{guest.phone}</dd>
          {guest.specialRequests && (
            <>
              <dt className="text-muted-foreground">Requests</dt>
              <dd className="font-medium text-charcoal">{guest.specialRequests}</dd>
            </>
          )}
        </dl>
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-4 font-body text-xs text-earth-brown underline-offset-4 hover:underline"
        >
          Edit details
        </button>
      </section>

      {/* Price breakdown */}
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 font-body text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Price Breakdown
        </h2>
        <div className="space-y-2 font-body text-sm">
          <div className="flex justify-between text-charcoal/70">
            <span>
              &#8377;{formatPrice(pricing.pricePerNight)} × {pricing.nights}{" "}
              night{pricing.nights > 1 ? "s" : ""}
            </span>
            <span>&#8377;{formatPrice(pricing.baseNightlyTotal)}</span>
          </div>

          {pricing.discountAmount > 0 && (
            <div className="flex justify-between text-[var(--color-moss-green)]">
              <span>Coupon discount ({pricing.couponCode})</span>
              <span>−&#8377;{formatPrice(pricing.discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between border-t border-border pt-3 font-semibold text-charcoal">
            <span>Total (incl. {pricing.gstRate}% GST)</span>
            <span>&#8377;{formatPrice(pricing.totalAmount)}</span>
          </div>

          <div className="flex justify-between text-charcoal/50">
            <span>GST included</span>
            <span>&#8377;{formatPrice(pricing.gstAmount)}</span>
          </div>

          <div className="mt-4 rounded-lg bg-warm-beige/40 p-4 text-xs text-charcoal/70">
            <p>
              <strong className="text-charcoal">Due now (full payment):</strong>{" "}
              &#8377;{formatPrice(pricing.totalAmount)}
            </p>
            <p className="mt-1">No balance due at check-in.</p>
          </div>
        </div>
      </section>

      {/* Cancellation policy */}
      <section className="rounded-xl bg-warm-beige/30 p-6">
        <h2 className="mb-3 font-body text-sm font-semibold text-charcoal">
          Cancellation Policy
        </h2>
        <ul className="space-y-1.5 font-body text-xs text-charcoal/70">
          <li>7 or more days before check-in: 90% refund</li>
          <li>3 to 7 days before check-in: 50% refund</li>
          <li>Less than 3 days: no refund</li>
        </ul>
      </section>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 font-body text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => void handleConfirm()}
        disabled={submitting}
        className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-earth-brown font-body text-base font-medium text-ivory transition-colors duration-200 hover:bg-earth-brown/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
      >
        {submitting ? "Creating booking…" : "Confirm & Proceed to Payment"}
      </button>

      <p className="text-center font-body text-xs text-muted-foreground">
        By confirming, you agree to our{" "}
        <a
          href="/terms-and-condition"
          target="_blank"
          className="text-earth-brown underline-offset-4 hover:underline"
        >
          Terms & Conditions
        </a>
        .
      </p>
    </div>
  );
}
