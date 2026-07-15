import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRoomBySlug } from "@/lib/rooms/queries";
import { buildMetadata } from "@/lib/seo";
import { DataUnavailable } from "@/components/ui/data-unavailable";
import { CheckoutForm } from "./checkout-form";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    checkIn?: string;
    checkOut?: string;
    adults?: string;
    children?: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const room = await getRoomBySlug(slug).catch(() => null);
  if (!room) return {};
  return buildMetadata({
    title: `Book ${room.name}`,
    description: `Reserve ${room.name} at Madhuban Eco Retreat. Select your dates and guest details.`,
    path: `/book/${slug}`,
    noIndex: true,
  });
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function addDays(d: string, n: number) {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
}

export default async function BookCheckoutPage({ params, searchParams }: Props) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);

  // `notFound()` stays outside the try: it signals control flow by throwing.
  let room;
  try {
    room = await getRoomBySlug(slug);
  } catch (error) {
    console.error(`[book/${slug}] room fetch failed:`, error);
    return <DataUnavailable title="Booking Temporarily Unavailable" />;
  }

  if (!room) notFound();

  const today = todayStr();
  const minNights = room.min_nights ?? 1;
  const checkIn = sp.checkIn && sp.checkIn >= today ? sp.checkIn : today;
  const checkOut =
    sp.checkOut && sp.checkOut > checkIn
      ? sp.checkOut
      : addDays(checkIn, minNights);
  const adults = Math.min(
    Math.max(Number(sp.adults ?? 2), 1),
    room.max_occupancy,
  );
  const children = Math.min(
    Math.max(Number(sp.children ?? 0), 0),
    room.max_occupancy_children,
  );

  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Booking steps" className="mb-8">
          <ol className="flex items-center gap-2 font-body text-xs">
            <li className="font-semibold text-earth-brown">1. Your Details</li>
            <li aria-hidden="true" className="text-muted-foreground">→</li>
            <li className="text-muted-foreground">2. Review</li>
            <li aria-hidden="true" className="text-muted-foreground">→</li>
            <li className="text-muted-foreground">3. Payment</li>
          </ol>
        </nav>

        <div className="mb-8">
          <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
            Booking
          </p>
          <h1 className="font-display text-3xl font-medium text-charcoal md:text-4xl">
            {room.name}
          </h1>
        </div>

        <CheckoutForm
          slug={slug}
          roomName={room.name}
          defaultCheckIn={checkIn}
          defaultCheckOut={checkOut}
          defaultAdults={adults}
          defaultChildren={children}
          minNights={minNights}
          maxAdults={room.max_occupancy}
          maxChildren={room.max_occupancy_children}
        />
      </div>
    </div>
  );
}
