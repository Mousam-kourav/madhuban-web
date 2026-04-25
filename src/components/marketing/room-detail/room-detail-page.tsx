import Image from 'next/image';
import Link from 'next/link';
import {
  Tent,
  BedDouble,
  Trees,
  ShowerHead,
  Bath,
  Palette,
  Home,
  Thermometer,
  Tag,
  Waves,
  Maximize,
  Heart,
  Sparkles,
  Flame,
  Check,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import type { Room } from '@/lib/content/rooms';

const ICON_MAP: Record<string, LucideIcon> = {
  Tent,
  BedDouble,
  Trees,
  ShowerHead,
  Bath,
  Palette,
  Home,
  Thermometer,
  Tag,
  Waves,
  Maximize,
  Heart,
  Sparkles,
  Flame,
};

export function RoomDetailPage({ room }: { room: Room }) {
  const primaryImg = room.gallery[0];
  if (!primaryImg) return null;

  const whatsappUrl = `https://wa.me/919770558419?text=${encodeURIComponent(
    `Hi, I'm interested in booking ${room.name} at Madhuban Eco Retreat.`,
  )}`;

  return (
    <article className="pb-[72px] md:pb-0">
      {/* ── 1. Hero ───────────────────────────────────────────────────────── */}
      <section
        id="room-hero"
        aria-label={`${room.name} hero image`}
        className="relative aspect-[4/3] overflow-hidden md:aspect-[16/9]"
      >
        <Image
          src={primaryImg.webp.desktop}
          alt={primaryImg.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"
          aria-hidden="true"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <p className="mb-2 font-body text-xs uppercase tracking-[0.2em] text-ivory/70">
            Stay / {room.name}
          </p>
          <h1 className="font-display text-4xl font-medium italic text-ivory md:text-6xl">
            {room.name}
          </h1>
          <p className="mt-2 max-w-sm font-body text-sm text-ivory/75">{room.tagline}</p>
        </div>
      </section>

      {/* ── 2. Booking band ───────────────────────────────────────────────── */}
      <Section className="bg-cream" label="Room overview and booking">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
            {/* LEFT: genre + meta */}
            <div>
              <p className="mb-4 font-body text-sm uppercase tracking-[0.15em] text-muted-foreground">
                {room.genre}
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-charcoal/70">
                <span>
                  <strong className="font-medium text-charcoal">Occupancy:</strong>{' '}
                  {room.occupancy.adults} adults
                  {room.occupancy.children > 0 && ` · ${room.occupancy.children} child`}
                </span>
                <span>
                  <strong className="font-medium text-charcoal">Bed:</strong> {room.bedConfig}
                </span>
                <span>
                  <strong className="font-medium text-charcoal">Size:</strong> {room.size}
                </span>
              </div>
            </div>

            {/* RIGHT: booking card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="font-display text-3xl font-medium text-earth-brown">
                &#8377;{formatPrice(room.pricePerNight)}
              </p>
              <p className="mt-1 font-body text-xs text-muted-foreground">
                per night, GST inclusive
              </p>
              <Link
                href={`/booking?room=${room.slug}`}
                className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-lg bg-earth-brown font-body text-sm font-medium text-ivory transition-colors duration-200 hover:bg-earth-brown/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
              >
                Check Availability
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-center font-body text-xs text-earth-brown underline-offset-4 hover:underline"
              >
                Or chat on WhatsApp
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 3. Long description (drop-cap) ────────────────────────────────── */}
      <Section className="bg-cream pt-0" label="About this room">
        <Container>
          <div className="drop-cap mx-auto max-w-[720px]">
            {room.longDescription.map((para, i) => (
              <p
                key={i}
                className="mb-5 font-body text-base leading-relaxed text-charcoal/80 last:mb-0"
              >
                {para}
              </p>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 4. Highlights ─────────────────────────────────────────────────── */}
      <Section className="bg-warm-beige/30" label="Room highlights">
        <Container>
          <Heading as="h2" text={`Why Choose ${room.name}`} className="mb-12" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {room.highlights.map((h) => {
              const Icon: LucideIcon = ICON_MAP[h.icon] ?? Sparkles;
              return (
                <div key={h.title} className="flex flex-col items-center p-4 text-center">
                  <div className="mb-4 rounded-full bg-earth-brown/10 p-3">
                    <Icon className="size-6 text-earth-brown" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-medium text-charcoal">
                    {h.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-charcoal/70">
                    {h.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ── 5. Gallery ────────────────────────────────────────────────────── */}
      <Section className="bg-cream" label="Room gallery">
        <Container>
          <Heading as="h2" text="The Room" className="mb-8" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {room.gallery.map((img, i) => (
              <div
                key={i}
                className={cn(
                  'relative overflow-hidden rounded-lg',
                  'aspect-[3/2]',
                  i === 0 && 'lg:col-span-2 lg:aspect-[16/7]',
                  'transition-transform duration-300 md:hover:scale-[1.02]',
                )}
              >
                <Image
                  src={img.webp.desktop}
                  alt={img.alt}
                  fill
                  loading={i === 0 ? 'eager' : 'lazy'}
                  sizes={
                    i === 0
                      ? '(min-width: 1024px) 100vw, (min-width: 640px) 50vw, 100vw'
                      : '(min-width: 640px) 50vw, 100vw'
                  }
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 6. Amenities ──────────────────────────────────────────────────── */}
      <Section className="bg-warm-beige/30" label="Amenities">
        <Container>
          <Heading as="h2" text="What's Included" className="mb-10" />
          <ul
            role="list"
            className="mx-auto grid max-w-[800px] grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {room.amenities.map((amenity) => (
              <li key={amenity} className="flex items-center gap-3 font-body text-sm text-charcoal/80">
                <Check className="size-4 shrink-0 text-earth-brown" aria-hidden="true" />
                {amenity}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── 7. FAQ ────────────────────────────────────────────────────────── */}
      <Section className="bg-cream" label="Frequently asked questions">
        <Container>
          <Heading as="h2" text="Frequently Asked Questions" className="mb-10" />
          <div className="mx-auto max-w-[720px] divide-y divide-border">
            {room.faqs.map((faq, i) => (
              <details key={i} open={i === 0} className="group py-4">
                <summary className="flex cursor-pointer items-start justify-between gap-4 font-body font-medium text-charcoal transition-colors duration-150 hover:text-earth-brown">
                  <span>{faq.question}</span>
                  <ChevronDown
                    className="size-5 shrink-0 text-earth-brown transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 pr-9 font-body text-sm leading-relaxed text-charcoal/70">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 8. CTA ────────────────────────────────────────────────────────── */}
      <section className="bg-forest-green py-16 md:py-24" aria-label="Book your stay">
        <Container>
          <div className="mx-auto max-w-[640px] text-center">
            <p className="mb-4 font-body text-xs uppercase tracking-[0.2em] text-ivory/60">
              Book Your Stay
            </p>
            <h2 className="mb-6 font-display text-3xl font-medium italic text-ivory md:text-5xl">
              Begin Your Journey
            </h2>
            <p className="mb-8 font-body text-base text-ivory/75">
              {room.name} awaits. Secure your dates today for the best available rates — directly,
              with no middleman.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href={`/booking?room=${room.slug}`}
                className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-lg bg-ivory px-6 font-body text-sm font-medium text-forest-green transition-colors duration-200 hover:bg-ivory/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2"
              >
                Check Availability
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-lg border border-ivory/40 px-6 font-body text-sm font-medium text-ivory transition-colors duration-200 hover:bg-ivory/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </Container>
      </section>
    </article>
  );
}
