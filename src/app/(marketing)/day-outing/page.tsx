import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  UtensilsCrossed,
  Coffee,
  Waves,
  Trees,
  Mountain,
  Gamepad2,
  TreePine,
  Leaf,
  Users,
  MapPin,
  Briefcase,
  Heart,
  Binoculars,
  Tag,
  Wine,
  Banknote,
  CalendarCheck,
  Salad,
  Car,
  Navigation,
  Recycle,
  Phone,
  ChevronRight,
} from 'lucide-react';

import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { lodgingBusiness } from '@/lib/schema/lodging-business';
import { breadcrumbList } from '@/lib/schema/breadcrumb-list';
import { DAY_OUTING } from '@/lib/content/day-outing';
import { DayOutingVideo } from '@/components/marketing/day-outing/day-outing-video';
import { DayOutingWaForm } from '@/components/marketing/day-outing/day-outing-wa-form';

// ── SEO — exact title + description preserved from old site (currently ranking) ─
export const metadata: Metadata = buildMetadata({
  title: 'Day Outing',
  titleOverride: 'Resorts Near Bhopal for Day Outing | Madhuban Eco Retreat',
  description:
    'Looking for resorts near Bhopal for day outing? Enjoy breakfast, lunch, pool access, nature walk & activities at Madhuban Eco Retreat.',
  path: '/day-outing',
  ogImage: DAY_OUTING.hero.image.desktop,
  keywords: [
    'resorts near bhopal for day outing',
    'one day picnic near bhopal',
    'day visit resort near bhopal',
    'pool day package near bhopal',
    'nature resort day outing',
  ],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.madhubanecoretreat.com';

// ── JSON-LD schemas ──────────────────────────────────────────────────────────
const productSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Madhuban Day Outing Package',
  description:
    'Complete day outing at Madhuban Eco Retreat — breakfast, lunch, high tea, swimming pool, nature walk, obstacle course, outdoor games. No overnight stay required.',
  brand: { '@type': 'Brand', name: 'Madhuban Eco Retreat' },
  offers: {
    '@type': 'Offer',
    price: '1300',
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    url: `${BASE_URL}/day-outing`,
    priceValidUntil: '2026-12-31',
  },
};

const videoSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'Day Outing Experience at Madhuban Eco Retreat',
  description:
    'Watch guests enjoying the day outing package at Madhuban Eco Retreat — pool, nature trails, and gourmet meals near Bhopal.',
  thumbnailUrl: DAY_OUTING.hero.image.desktop,
  contentUrl: DAY_OUTING.video.src,
  uploadDate: '2025-01-01',
  publisher: {
    '@type': 'Organization',
    name: 'Madhuban Eco Retreat',
    url: BASE_URL,
  },
};

const breadcrumbSchema = breadcrumbList({
  items: [
    { name: 'Home', path: '/' },
    { name: 'Day Outing', path: '/day-outing' },
  ],
});

// ── Icon map (resolved at render time — keeps data/render cleanly separated) ─
type IconName =
  | 'UtensilsCrossed'
  | 'Coffee'
  | 'Waves'
  | 'Trees'
  | 'Mountain'
  | 'Gamepad2'
  | 'TreePine'
  | 'Leaf'
  | 'Users'
  | 'MapPin'
  | 'Briefcase'
  | 'Heart'
  | 'Binoculars'
  | 'Tag'
  | 'Wine'
  | 'Banknote'
  | 'CalendarCheck'
  | 'Salad'
  | 'Car'
  | 'Navigation'
  | 'Recycle';

const ICON_MAP: Record<
  IconName,
  React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
> = {
  UtensilsCrossed,
  Coffee,
  Waves,
  Trees,
  Mountain,
  Gamepad2,
  TreePine,
  Leaf,
  Users,
  MapPin,
  Briefcase,
  Heart,
  Binoculars,
  Tag,
  Wine,
  Banknote,
  CalendarCheck,
  Salad,
  Car,
  Navigation,
  Recycle,
};

function Icon({ name, className }: { name: string; className?: string }) {
  const Comp = ICON_MAP[name as IconName] ?? TreePine;
  return <Comp className={className} aria-hidden="true" />;
}

// ────────────────────────────────────────────────────────────────────────────

export default function DayOutingPage() {
  return (
    <>
      <Seo schemas={[lodgingBusiness(), productSchema, videoSchema, breadcrumbSchema]} />

      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <section
        aria-label="Day outing hero"
        className="relative h-[75svh] min-h-[420px] overflow-hidden"
      >
        <Image
          src={DAY_OUTING.hero.image.desktop}
          alt={DAY_OUTING.hero.image.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <span className="mb-4 inline-block rounded-full bg-earth-brown/80 px-4 py-1 font-body text-xs font-medium uppercase tracking-[0.2em] text-ivory">
            {DAY_OUTING.hero.eyebrow}
          </span>
          <h1 className="max-w-3xl font-display text-4xl font-medium text-ivory md:text-5xl lg:text-6xl">
            {DAY_OUTING.hero.h1}
          </h1>
          <p className="mt-5 max-w-2xl font-body text-base text-ivory/90 md:text-lg">
            {DAY_OUTING.hero.subheading}
          </p>
          <a
            href="#contact"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-earth-brown px-8 font-body text-sm font-medium text-ivory transition hover:bg-earth-brown/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Book Your Day Outing
          </a>
        </div>
      </section>

      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <div className="bg-cream py-3">
        <Container>
          <Breadcrumb pathname="/day-outing" />
        </Container>
      </div>

      {/* ── 2. Intro with Video ─────────────────────────────────────────────── */}
      <Section className="bg-cream" label="About day outing at Madhuban">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left: text + highlight cards */}
            <div>
              <h2 className="font-display text-3xl font-medium leading-tight text-charcoal md:text-4xl">
                {DAY_OUTING.intro.heading}
              </h2>
              <div className="my-5 flex items-center gap-3" aria-hidden="true">
                <span className="block h-px w-8 bg-earth-brown" />
                <span className="block size-1.5 rotate-45 bg-earth-brown" />
                <span className="block h-px w-8 bg-earth-brown" />
              </div>
              <div className="space-y-4 font-body text-base leading-relaxed text-charcoal/80">
                {DAY_OUTING.intro.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {/* 2-card mini-grid */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {DAY_OUTING.intro.highlights.map((h) => (
                  <div
                    key={h.title}
                    className="rounded-xl border border-border bg-white p-5 shadow-sm"
                  >
                    <h3 className="mb-1 font-display text-lg font-medium text-charcoal">
                      {h.title}
                    </h3>
                    <p className="font-body text-sm leading-relaxed text-charcoal/70">
                      {h.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: vertical video */}
            <div className="flex justify-center lg:justify-end">
              <DayOutingVideo src={DAY_OUTING.video.src} poster={DAY_OUTING.video.poster} />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 3. Day Outing Package ───────────────────────────────────────────── */}
      <Section className="bg-white" label="Day outing package inclusions">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left: image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] shadow-md">
              <Image
                src={DAY_OUTING.package.image.desktop}
                alt={DAY_OUTING.package.image.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Right: price + inclusions grid */}
            <div>
              <p className="mb-2 font-body text-xs uppercase tracking-[0.2em] text-earth-brown/70">
                {DAY_OUTING.package.heading}
              </p>
              <h2 className="font-display text-3xl font-medium leading-tight text-charcoal md:text-4xl">
                {DAY_OUTING.package.subheading}
              </h2>

              {/* Price display */}
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-5xl font-medium text-earth-brown">
                  {DAY_OUTING.package.price}
                </span>
                <span className="font-body text-base font-semibold uppercase tracking-widest text-charcoal/60">
                  / {DAY_OUTING.package.priceUnit}
                </span>
              </div>

              <p className="mt-5 font-display text-xl font-medium text-charcoal">
                {DAY_OUTING.package.inclusionsHeading}
              </p>

              {/* 6-item grid: mobile 2-col, desktop 3-col */}
              <ul role="list" className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                {DAY_OUTING.package.inclusions.map((item) => (
                  <li
                    key={item.label}
                    className="flex flex-col items-center gap-2 rounded-xl border border-border bg-cream p-4 text-center"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-earth-brown/10">
                      <Icon name={item.icon} className="h-5 w-5 text-earth-brown" />
                    </span>
                    <span className="font-body text-xs font-medium text-charcoal">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 font-body text-sm leading-relaxed text-charcoal/70">
                {DAY_OUTING.package.closingLine}
              </p>

              <a
                href="#contact"
                className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-earth-brown px-8 font-body text-sm font-medium text-ivory transition hover:bg-earth-brown/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
              >
                Contact Us
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 4. Why Choose Us ────────────────────────────────────────────────── */}
      <Section className="bg-warm-beige/20" label="Why choose Madhuban for day outing">
        <Container>
          <div className="text-center">
            <h2 className="font-display text-3xl font-medium text-charcoal md:text-4xl">
              {DAY_OUTING.whyChooseUs.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-body text-base text-charcoal/70">
              {DAY_OUTING.whyChooseUs.subheading}
            </p>
          </div>
          <ul role="list" className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {DAY_OUTING.whyChooseUs.cards.map((card) => (
              <li key={card.title}>
                <article className="flex h-full flex-col items-center rounded-[16px] border border-border bg-white p-8 text-center shadow-sm">
                  <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-earth-brown/10">
                    <Icon name={card.icon} className="h-6 w-6 text-earth-brown" />
                  </span>
                  <h3 className="mb-3 font-display text-xl font-medium text-charcoal">
                    {card.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-charcoal/70">
                    {card.description}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── 5. Who Should Choose This ───────────────────────────────────────── */}
      <Section className="bg-cream" label="Who should choose this day outing package">
        <Container>
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
            {/* Left: heading + cards */}
            <div>
              <h2 className="font-display text-3xl font-medium leading-tight text-charcoal md:text-4xl">
                {DAY_OUTING.idealFor.heading}
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-charcoal/70">
                {DAY_OUTING.idealFor.subheading}
              </p>
              <ul role="list" className="mt-8 space-y-4">
                {DAY_OUTING.idealFor.cards.map((card) => (
                  <li key={card.title}>
                    <article className="flex gap-4 rounded-xl border border-border bg-white p-5 shadow-sm">
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-earth-brown/10">
                        <Icon name={card.icon} className="h-5 w-5 text-earth-brown" />
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-medium text-charcoal">
                          {card.title}
                        </h3>
                        <p className="mt-1 font-body text-sm leading-relaxed text-charcoal/70">
                          {card.description}
                        </p>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-[16px] shadow-md lg:sticky lg:top-8">
              <Image
                src={DAY_OUTING.idealFor.image.desktop}
                alt={DAY_OUTING.idealFor.image.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 6. Important Information ────────────────────────────────────────── */}
      <Section className="bg-white" label="Important information about day outing">
        <Container>
          <div className="text-center">
            <h2 className="font-display text-3xl font-medium text-charcoal md:text-4xl">
              {DAY_OUTING.importantInfo.heading}
            </h2>
          </div>
          <ul
            role="list"
            className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5"
          >
            {DAY_OUTING.importantInfo.items.map((item) => (
              <li key={item.label}>
                <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-cream p-5 text-center shadow-sm">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-earth-brown/10">
                    <Icon name={item.icon} className="h-5 w-5 text-earth-brown" />
                  </span>
                  <div>
                    <p className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                      {item.label}
                    </p>
                    <p className="mt-1 font-display text-base font-medium text-charcoal">
                      {item.value}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── 7. Easy Access ──────────────────────────────────────────────────── */}
      <Section className="bg-warm-beige/20" label="How to reach Madhuban for day outing">
        <Container>
          <div className="text-center">
            <h2 className="font-display text-3xl font-medium text-charcoal md:text-4xl">
              {DAY_OUTING.easyAccess.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-body text-base text-charcoal/70">
              {DAY_OUTING.easyAccess.subheading}
            </p>
          </div>
          <ul role="list" className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {DAY_OUTING.easyAccess.locations.map((loc) => (
              <li key={loc.from}>
                <article className="flex h-full flex-col items-center rounded-[16px] border border-border bg-white p-8 text-center shadow-sm">
                  <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-earth-brown/10">
                    <Icon name={loc.icon} className="h-6 w-6 text-earth-brown" />
                  </span>
                  <h3 className="mb-2 font-display text-xl font-medium text-charcoal">
                    {loc.from}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-charcoal/70">
                    {loc.description}
                  </p>
                  <span className="mt-3 inline-block rounded-full bg-earth-brown/10 px-3 py-1 font-body text-xs font-medium text-earth-brown">
                    {loc.distance}
                  </span>
                </article>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-10 max-w-3xl text-center font-body text-sm leading-relaxed text-charcoal/70">
            {DAY_OUTING.easyAccess.closingLine}
          </p>
        </Container>
      </Section>

      {/* ── 8. WhatsApp Lead Form (id="contact" for anchor links) ───────────── */}
      <section id="contact" aria-label="Book your day outing">
        <Section className="bg-cream" label="Book your day outing at Madhuban">
          <Container>
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
              {/* Left: copy */}
              <div>
                <h2 className="font-display text-3xl font-medium leading-tight text-charcoal md:text-4xl">
                  {DAY_OUTING.contact.heading}
                </h2>
                <div className="my-5 flex items-center gap-3" aria-hidden="true">
                  <span className="block h-px w-8 bg-earth-brown" />
                  <span className="block size-1.5 rotate-45 bg-earth-brown" />
                  <span className="block h-px w-8 bg-earth-brown" />
                </div>
                <p className="font-body text-base leading-relaxed text-charcoal/80">
                  {DAY_OUTING.contact.subheading}
                </p>
                <ul role="list" className="mt-8 space-y-3">
                  {DAY_OUTING.trustItems.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center gap-3 font-body text-sm text-charcoal/70"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-earth-brown/10">
                        <Icon name={item.icon} className="h-4 w-4 text-earth-brown" />
                      </span>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: form */}
              <div>
                <p className="mb-5 font-display text-xl font-medium text-charcoal">
                  {DAY_OUTING.contact.formHeading}
                </p>
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
                  <DayOutingWaForm />
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </section>

      {/* ── 9. Trust Strip ──────────────────────────────────────────────────── */}
      <div className="border-y border-border bg-white py-6">
        <Container>
          <ul
            role="list"
            className="flex flex-wrap items-center justify-center gap-6 md:gap-12"
          >
            {DAY_OUTING.trustItems.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 font-body text-sm font-medium text-charcoal/70"
              >
                <Icon name={item.icon} className="h-4 w-4 text-earth-brown" />
                {item.label}
              </li>
            ))}
          </ul>
        </Container>
      </div>

      {/* ── 10. Final CTA ───────────────────────────────────────────────────── */}
      <section className="bg-forest-green py-20 text-center md:py-24" aria-label="Call now">
        <Container>
          <p className="mb-2 font-body text-xs uppercase tracking-[0.2em] text-ivory/60">
            Available 9 AM – 6 PM daily
          </p>
          <h2 className="mb-4 font-display text-3xl font-medium text-ivory md:text-5xl">
            Ready for Your Day Outing?
          </h2>
          <p className="mb-6 font-display text-4xl font-medium text-ivory/90 md:text-5xl">
            +91 9770558419
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="tel:+919770558419"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-ivory px-8 font-body text-sm font-semibold uppercase tracking-wider text-earth-brown transition hover:bg-warm-beige focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-forest-green"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              CALL NOW
            </a>
            <Link
              href="/contact-us"
              className="inline-flex h-12 items-center justify-center gap-1 rounded-xl border border-ivory/50 px-8 font-body text-sm font-medium text-ivory transition hover:bg-ivory/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory"
            >
              Send an Enquiry
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
