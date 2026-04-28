import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { PaymentClient } from "./payment-client";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string }>;
}

export default async function PaymentPage({ params, searchParams }: Props) {
  const [{ slug }, { id }] = await Promise.all([params, searchParams]);

  if (!id) {
    return <NotFound slug={slug} message="No booking ID provided." />;
  }

  const supabase = createAdminClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      id, booking_ref, status, total_amount, created_at,
      guests!guest_id ( name, email, mobile ),
      rooms!room_id ( name )
    `)
    .eq("id", id)
    .single();

  if (!booking) {
    return <NotFound slug={slug} message="Booking not found." />;
  }

  if (booking.status !== "PENDING_PAYMENT") {
    const statusMessages: Record<string, string> = {
      CONFIRMED: "This booking has already been confirmed and paid.",
      CANCELLED: "This booking has been cancelled.",
      CHECKED_IN: "This booking is checked in.",
      CHECKED_OUT: "This booking has checked out.",
      NO_SHOW: "This booking was marked as no-show.",
    };
    const msg = statusMessages[booking.status] ?? `Booking status: ${booking.status}`;
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
        <div className="mx-auto max-w-md text-center">
          <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
            {booking.status === "CONFIRMED" ? "Payment Complete" : "Booking Status"}
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium italic text-charcoal">
            {booking.status === "CONFIRMED" ? "You&apos;re all set!" : "Booking Update"}
          </h1>
          <p className="mt-4 font-body text-sm text-charcoal/70">{msg}</p>
          {booking.status === "CONFIRMED" && (
            <Link
              href={`/book/confirmation?ref=${booking.booking_ref}`}
              className="mt-6 inline-flex h-12 items-center rounded-lg bg-earth-brown px-6 font-body text-sm font-medium text-ivory transition-colors hover:bg-earth-brown/90"
            >
              View Confirmation
            </Link>
          )}
        </div>
      </div>
    );
  }

  const guest = Array.isArray(booking.guests) ? booking.guests[0] : booking.guests as unknown as {
    name: string; email: string; mobile: string | null;
  } | null;
  const room = Array.isArray(booking.rooms) ? booking.rooms[0] : booking.rooms as unknown as {
    name: string;
  } | null;

  const totalAmount = Number(booking.total_amount);
  const advanceAmountRupees = +(totalAmount * 0.5).toFixed(2);

  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Booking steps" className="mb-8">
          <ol className="flex items-center gap-2 font-body text-xs">
            <li className="text-muted-foreground">1. Your Details</li>
            <li aria-hidden="true" className="text-muted-foreground">→</li>
            <li className="text-muted-foreground">2. Review</li>
            <li aria-hidden="true" className="text-muted-foreground">→</li>
            <li className="font-semibold text-earth-brown">3. Payment</li>
          </ol>
        </nav>

        <div className="mb-8 text-center">
          <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
            Step 3 of 3
          </p>
          <h1 className="font-display text-3xl font-medium italic text-charcoal md:text-4xl">
            Secure Payment
          </h1>
          <p className="mt-2 font-body text-sm text-charcoal/70">
            Pay 50% advance to confirm your stay at {room?.name ?? "Madhuban Eco Retreat"}.
          </p>
        </div>

        <PaymentClient
          bookingId={booking.id}
          roomSlug={slug}
          advanceAmountRupees={advanceAmountRupees}
          guestName={guest?.name ?? ""}
          guestEmail={guest?.email ?? ""}
          guestMobile={guest?.mobile ?? ""}
          roomName={room?.name ?? ""}
          bookingRef={booking.booking_ref}
        />
      </div>
    </div>
  );
}

function NotFound({ slug, message }: { slug: string; message: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="font-body text-sm text-charcoal/70">{message}</p>
        <Link
          href={`/stay/${slug}`}
          className="mt-4 inline-block font-body text-sm text-earth-brown underline-offset-4 hover:underline"
        >
          ← Back to room
        </Link>
      </div>
    </div>
  );
}
