import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ ref?: string }>;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatAmount(n: number): string {
  return n.toLocaleString("en-IN");
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const { ref } = await searchParams;

  if (!ref) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="font-body text-sm text-charcoal/70">No booking reference provided.</p>
          <Link href="/stay" className="mt-4 inline-block font-body text-sm text-earth-brown underline-offset-4 hover:underline">
            Browse rooms
          </Link>
        </div>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      id, booking_ref, status, total_amount, checkin, checkout,
      num_adults, num_children, special_requests, created_at,
      guests!guest_id ( name, email, mobile ),
      rooms!room_id ( name, slug )
    `)
    .eq("booking_ref", ref)
    .single();

  if (!booking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="font-body text-sm text-charcoal/70">Booking not found.</p>
          <Link href="/stay" className="mt-4 inline-block font-body text-sm text-earth-brown underline-offset-4 hover:underline">
            Browse rooms
          </Link>
        </div>
      </div>
    );
  }

  if (booking.status === "PENDING_PAYMENT") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-earth-brown border-t-transparent" />
          <h1 className="font-display text-2xl font-medium italic text-charcoal">
            Payment Processing
          </h1>
          <p className="mt-3 font-body text-sm text-charcoal/70">
            Your payment is being processed. This page will update shortly.
          </p>
          <p className="mt-2 font-body text-xs text-muted-foreground">
            Booking ref: <strong>{ref}</strong>
          </p>
        </div>
      </div>
    );
  }

  const guest = Array.isArray(booking.guests) ? booking.guests[0] : booking.guests as unknown as {
    name: string; email: string; mobile: string | null;
  } | null;
  const room = Array.isArray(booking.rooms) ? booking.rooms[0] : booking.rooms as unknown as {
    name: string; slug: string;
  } | null;

  const totalAmount = Number(booking.total_amount);
  const advanceAmount = +(totalAmount * 0.5).toFixed(2);
  const balanceDue = +(totalAmount - advanceAmount).toFixed(2);
  const nights = Math.round(
    (new Date(booking.checkout).getTime() - new Date(booking.checkin).getTime()) / 86400000,
  );

  return (
    <div className="py-12 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Success banner */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-moss-green)]/10">
            <svg className="h-8 w-8 text-[var(--color-moss-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
            Booking Confirmed
          </p>
          <h1 className="mt-2 font-display text-4xl font-medium italic text-charcoal">
            See you in the forest!
          </h1>
          <p className="mt-3 font-body text-sm text-charcoal/70">
            A confirmation email has been sent to {guest?.email ?? "your email"}.
          </p>
        </div>

        {/* Booking ref */}
        <div className="mb-6 rounded-2xl border border-border bg-white p-6 text-center shadow-sm">
          <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
            Your booking reference
          </p>
          <p className="mt-1 font-body text-2xl font-bold tracking-widest text-earth-brown">
            {booking.booking_ref}
          </p>
          <p className="mt-2 font-body text-xs text-muted-foreground">
            Please save this reference for check-in and any queries.
          </p>
        </div>

        {/* Stay details */}
        <section className="mb-6 rounded-xl border border-border bg-white p-6">
          <h2 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Stay Details
          </h2>
          <dl className="grid grid-cols-2 gap-y-3 font-body text-sm">
            <dt className="text-muted-foreground">Room</dt>
            <dd className="font-medium text-charcoal">{room?.name ?? "—"}</dd>
            <dt className="text-muted-foreground">Check-in</dt>
            <dd className="font-medium text-charcoal">{formatDate(booking.checkin)}</dd>
            <dt className="text-muted-foreground">Check-out</dt>
            <dd className="font-medium text-charcoal">{formatDate(booking.checkout)}</dd>
            <dt className="text-muted-foreground">Duration</dt>
            <dd className="font-medium text-charcoal">{nights} night{nights !== 1 ? "s" : ""}</dd>
            <dt className="text-muted-foreground">Guests</dt>
            <dd className="font-medium text-charcoal">
              {booking.num_adults} adult{booking.num_adults !== 1 ? "s" : ""}
              {booking.num_children > 0 && `, ${booking.num_children} child${booking.num_children !== 1 ? "ren" : ""}`}
            </dd>
            {guest && (
              <>
                <dt className="text-muted-foreground">Guest</dt>
                <dd className="font-medium text-charcoal">{guest.name}</dd>
              </>
            )}
          </dl>
        </section>

        {/* Payment summary */}
        <section className="mb-6 rounded-xl border border-border bg-white p-6">
          <h2 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Payment Summary
          </h2>
          <div className="space-y-2 font-body text-sm">
            <div className="flex justify-between">
              <span className="text-charcoal/70">Total Stay Amount</span>
              <span className="font-medium">₹{formatAmount(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-[var(--color-moss-green)]">
              <span>Advance Paid (50%)</span>
              <span className="font-medium">₹{formatAmount(advanceAmount)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-semibold text-earth-brown">
              <span>Balance Due at Check-in</span>
              <span>₹{formatAmount(balanceDue)}</span>
            </div>
          </div>
        </section>

        {/* What to expect */}
        <section className="mb-6 rounded-xl bg-warm-beige/40 p-6">
          <h2 className="mb-3 font-body text-sm font-semibold text-charcoal">
            What to Expect
          </h2>
          <ul className="space-y-2 font-body text-sm text-charcoal/70">
            <li>• Check-in from 2:00 PM · Check-out by 11:00 AM</li>
            <li>• Balance of ₹{formatAmount(balanceDue)} collected at check-in (cash / UPI)</li>
            <li>• Directions and driving route will be shared via WhatsApp</li>
            <li>• 60 km from Bhopal via NH-46 · GPS: 22.88°N, 77.52°E</li>
          </ul>
        </section>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-4">
          <a
            href={`https://wa.me/919770558419?text=${encodeURIComponent(`Hi, I have a confirmed booking at Madhuban (ref: ${booking.booking_ref}). Looking forward to my stay!`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-earth-brown font-body text-sm font-medium text-ivory transition-colors hover:bg-earth-brown/90"
          >
            WhatsApp Us
          </a>
          {room && (
            <Link
              href={`/stay/${room.slug}`}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-earth-brown font-body text-sm font-medium text-earth-brown transition-colors hover:bg-earth-brown hover:text-ivory"
            >
              View Room Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
