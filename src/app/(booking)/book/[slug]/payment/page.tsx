import Link from "next/link";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string }>;
}

export default async function PaymentPage({ params, searchParams }: Props) {
  const [{ slug }, { id }] = await Promise.all([params, searchParams]);

  let referenceNumber: string | null = null;
  if (id) {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("bookings")
        .select("booking_ref")
        .eq("id", id)
        .single();
      referenceNumber = data?.booking_ref ?? null;
    } catch {
      // non-fatal — show generic message
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-earth-brown/10">
          <svg
            className="h-8 w-8 text-earth-brown"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
          Booking Received
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium italic text-charcoal">
          Almost Done!
        </h1>

        {referenceNumber && (
          <div className="mt-4 rounded-xl border border-border bg-warm-beige/30 px-6 py-4">
            <p className="font-body text-xs text-muted-foreground">
              Your booking reference
            </p>
            <p className="mt-1 font-body text-xl font-semibold tracking-wider text-earth-brown">
              {referenceNumber}
            </p>
          </div>
        )}

        <p className="mt-6 font-body text-sm leading-relaxed text-charcoal/70">
          Your booking is held and pending payment. Our team will contact you
          within a few hours to confirm your reservation and collect payment.
        </p>

        <div className="mt-8 space-y-3">
          <a
            href={`https://wa.me/919770558419?text=${encodeURIComponent(
              `Hi, I just made a booking at Madhuban Eco Retreat${referenceNumber ? ` (ref: ${referenceNumber})` : ""}. Please confirm.`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-earth-brown font-body text-sm font-medium text-ivory transition-colors duration-200 hover:bg-earth-brown/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
          >
            Confirm via WhatsApp
          </a>
          <Link
            href={`/stay/${slug}`}
            className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-earth-brown font-body text-sm font-medium text-earth-brown transition-colors duration-200 hover:bg-earth-brown hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
          >
            Back to Room Details
          </Link>
        </div>

        <p className="mt-6 font-body text-xs text-muted-foreground">
          Online payment integration coming soon. For immediate confirmation,
          please use WhatsApp above.
        </p>
      </div>
    </div>
  );
}
