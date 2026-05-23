import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Leaf, Wine, Sprout, UtensilsCrossed, Check } from 'lucide-react';

import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { faqPage } from '@/lib/schema/faq-page';
import { breadcrumbListFromPath } from '@/lib/schema/breadcrumb-list';
import { DINING } from '@/lib/content/dining';
import { DiningWaForm } from '@/components/marketing/dining/dining-wa-form';

// ── SEO ───────────────────────────────────────────────────────────────────────
export const metadata: Metadata = buildMetadata({
  titleOverride:
    'Farm-to-Table Dining Ratapani | Pure Veg Buffet Near Bhopal',
  title: 'Dining',
  description:
    'Experience fresh farm-to-table dining at Madhuban Eco Retreat. Pure veg meals, organic produce, sustainable cuisine & clean eating near Ratapani.',
  path: '/dining',
  ogImage: DINING.hero.image.desktop,
  keywords: [
    'veg food near ratapani',
    'buffet near ratapani',
    'madhuban eco retreat menu',
    'farm to table dining bhopal',
    'organic food retreat mp',
    'sustainable cuisine ratapani',
    'best dinner in ratapani',
  ],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.madhubanecoretreat.com';

// ── JSON-LD ───────────────────────────────────────────────────────────────────
const restaurantSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: 'Madhuban Eco Retreat — Dining',
  url: `${BASE_URL}/dining`,
  image: DINING.hero.image.desktop,
  servesCuisine: ['Vegetarian', 'Indian', 'Madhya Pradeshi'],
  priceRange: '₹₹',
  acceptsReservations: true,
  smokingAllowed: false,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '07:00',
      closes: '22:00',
    },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Near Ratapani Wildlife Sanctuary, Village Bori, Salkanpur Road',
    addressLocality: 'Rehti',
    addressRegion: 'Madhya Pradesh',
    postalCode: '466446',
    addressCountry: 'IN',
  },
  hasMenu: {
    '@type': 'Menu',
    hasMenuSection: {
      '@type': 'MenuSection',
      name: 'Regional Vegetarian Cuisine',
      hasMenuItem: DINING.menu.dishes.map((d) => ({
        '@type': 'MenuItem',
        name: d.name,
        description: d.description,
        image: d.image,
      })),
    },
  },
};

const faqSchema = faqPage({ items: [...DINING.faqs] });
const breadcrumbSchema = breadcrumbListFromPath('/dining');

// ── Icon map ──────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  Leaf,
  Wine,
  Sprout,
  UtensilsCrossed,
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DiningPage() {
  return (
    <>
      <Seo schemas={[restaurantSchema, faqSchema, breadcrumbSchema]} />

      {/* ── Section 1: Hero ────────────────────────────────────────────────── */}
      <section
        aria-label="Dining hero"
        className="relative flex min-h-[85svh] flex-col items-center justify-end pb-16 text-center"
      >
        <Image
          src={DINING.hero.image.desktop}
          alt={DINING.hero.image.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/30 to-transparent" />
        <Container className="relative z-10">
          <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.2em] text-ivory/80">
            {DINING.hero.eyebrow}
          </p>
          <h1 className="font-display text-4xl font-light text-ivory md:text-6xl lg:text-7xl break-words">
            {DINING.hero.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-body text-base text-ivory/90 md:text-lg">
            {DINING.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <a
              href="#reserve"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-earth-brown px-8 font-body text-sm font-semibold uppercase tracking-wider text-ivory transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2"
            >
              Reserve a Private Setup
            </a>
            <a
              href="#open-air"
              className="font-body text-sm text-ivory/70 underline-offset-4 hover:underline"
            >
              or just walk in for a meal
            </a>
          </div>
        </Container>
      </section>

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-cream">
        <Container>
          <Breadcrumb pathname="/dining" />
        </Container>
      </div>

      {/* ── Section 2: Philosophy strip ────────────────────────────────────── */}
      <Section aria-label="Our dining philosophy" className="bg-cream">
        <Container>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {DINING.philosophy.map((pillar) => {
              const Icon = ICON_MAP[pillar.icon] ?? Leaf;
              return (
                <div
                  key={pillar.title}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-6 text-center shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-earth-brown/10">
                    <Icon className="h-5 w-5 text-earth-brown" strokeWidth={1.5} />
                  </div>
                  <p className="font-body text-sm font-semibold text-charcoal">{pillar.title}</p>
                  <p className="font-body text-xs text-charcoal/60">{pillar.note}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ── Section 3: Open Air Dining ─────────────────────────────────────── */}
      <Section id="open-air" aria-label="Open Air Dining">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* image: stacks first on mobile, goes right on desktop */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:order-2">
              <Image
                src={DINING.openAir.image.desktop}
                alt={DINING.openAir.image.alt}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="lg:order-1">
              <p className="mb-2 font-body text-xs font-semibold uppercase tracking-[0.2em] text-earth-brown">
                {DINING.openAir.eyebrow}
              </p>
              <h2 className="font-display text-4xl font-light text-charcoal md:text-5xl">
                {DINING.openAir.title}
              </h2>
              <div className="mt-6 space-y-4">
                {DINING.openAir.paragraphs.map((p, i) => (
                  <p key={i} className="font-body text-base leading-relaxed text-charcoal/80">
                    {p}
                  </p>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {DINING.openAir.pills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-earth-brown/30 bg-earth-brown/5 px-3 py-1 font-body text-xs font-medium text-earth-brown"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Section 4: Bush Dining ─────────────────────────────────────────── */}
      <Section aria-label="Bush Dining Package" className="bg-warm-beige/30">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={DINING.bushDining.image.desktop}
                alt={DINING.bushDining.image.alt}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-display text-4xl font-light text-charcoal md:text-5xl">
                {DINING.bushDining.title}
              </h2>
              <p className="mt-2 font-body text-sm font-medium text-earth-brown">
                {DINING.bushDining.pricingTag}
              </p>
              <p className="mt-5 font-body text-base leading-relaxed text-charcoal/80">
                {DINING.bushDining.body}
              </p>
              <ul className="mt-5 space-y-2">
                {DINING.bushDining.inclusions.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 font-body text-sm text-charcoal/80"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-earth-brown" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#reserve"
                className="mt-7 inline-flex h-11 items-center justify-center rounded-xl border border-earth-brown px-6 font-body text-sm font-semibold text-earth-brown transition hover:bg-earth-brown hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
              >
                Reserve Bush Dining
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Section 5: Alfresco / Forest Dining ───────────────────────────── */}
      <Section aria-label="Alfresco Forest Dining Package">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* mobile: image first; desktop: image right */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:order-2">
              <Image
                src={DINING.alfresco.image.desktop}
                alt={DINING.alfresco.image.alt}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="lg:order-1">
              <h2 className="font-display text-4xl font-light text-charcoal md:text-5xl">
                {DINING.alfresco.title}
              </h2>
              <p className="mt-2 font-body text-sm font-medium text-earth-brown">
                {DINING.alfresco.pricingTag}
              </p>
              <div className="mt-5 space-y-4">
                {DINING.alfresco.paragraphs.map((p, i) => (
                  <p key={i} className="font-body text-base leading-relaxed text-charcoal/80">
                    {p}
                  </p>
                ))}
              </div>
              <ul className="mt-5 space-y-2">
                {DINING.alfresco.inclusions.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 font-body text-sm text-charcoal/80"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-earth-brown" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <p className="w-full font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                  Best for:
                </p>
                {DINING.alfresco.bestFor.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-earth-brown/10 px-3 py-1 font-body text-xs font-medium text-earth-brown"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href="#reserve"
                className="mt-7 inline-flex h-11 items-center justify-center rounded-xl border border-earth-brown px-6 font-body text-sm font-semibold text-earth-brown transition hover:bg-earth-brown hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
              >
                Reserve Alfresco Dining
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Section 6: Comparison table ───────────────────────────────────── */}
      <Section aria-label="Compare dining experiences" className="bg-cream">
        <Container>
          <h2 className="mb-10 text-center font-display text-3xl font-light text-charcoal md:text-4xl">
            Compare the Three Experiences
          </h2>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-border md:block">
            <table className="w-full text-left font-body text-sm">
              <thead>
                <tr className="bg-earth-brown text-ivory">
                  {DINING.comparison.headers.map((h, i) => (
                    <th
                      key={i}
                      scope="col"
                      className={`px-5 py-4 font-semibold ${i === 0 ? 'w-32' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DINING.comparison.rows.map((row, ri) => (
                  <tr key={row.label} className={ri % 2 === 0 ? 'bg-white' : 'bg-cream'}>
                    <th scope="row" className="px-5 py-4 font-semibold text-charcoal">
                      {row.label}
                    </th>
                    {row.values.map((v, vi) => (
                      <td key={vi} className="px-5 py-4 text-charcoal/80">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards — one card per experience */}
          <div className="grid grid-cols-1 gap-6 md:hidden">
            {(['Open Air', 'Bush Dining', 'Alfresco Forest'] as const).map((expName, colIdx) => (
              <div
                key={expName}
                className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
              >
                <div className="bg-earth-brown px-5 py-3">
                  <p className="font-body text-sm font-semibold text-ivory">{expName}</p>
                </div>
                <dl className="divide-y divide-border">
                  {DINING.comparison.rows.map((row) => (
                    <div key={row.label} className="flex flex-col gap-0.5 px-5 py-3">
                      <dt className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                        {row.label}
                      </dt>
                      <dd className="font-body text-sm text-charcoal/80">{row.values[colIdx]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Section 7: Sample Menu / Dish gallery ─────────────────────────── */}
      <Section aria-label="Sample menu">
        <Container>
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-light text-charcoal md:text-4xl">
              {DINING.menu.title}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl font-body text-base text-charcoal/70">
              {DINING.menu.subtitle}
            </p>
          </div>

          {/* 3-col desktop, 2-col tablet, 1-col mobile */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DINING.menu.dishes.map((dish) => (
              <article
                key={dish.name}
                className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-body text-base font-semibold text-charcoal">{dish.name}</h3>
                  <p className="mt-1 font-body text-sm text-charcoal/70">{dish.description}</p>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-8 text-center font-body text-sm text-charcoal/60">
            {DINING.menu.footnote}
          </p>
        </Container>
      </Section>

      {/* ── Section 8: Farm-to-Fork story ─────────────────────────────────── */}
      <Section aria-label="Farm-to-fork philosophy" className="bg-warm-beige/30">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-4xl font-light text-charcoal md:text-5xl">
                {DINING.philosophyStory.title}
              </h2>
              <div className="mt-6 space-y-4">
                {DINING.philosophyStory.paragraphs.map((p, i) => (
                  <p key={i} className="font-body text-base leading-relaxed text-charcoal/80">
                    {p}
                  </p>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {DINING.philosophyStory.pills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-earth-brown/30 bg-earth-brown/5 px-3 py-1 font-body text-xs font-medium text-earth-brown"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={DINING.philosophyStory.image.desktop}
                alt={DINING.philosophyStory.image.alt}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Section 9: WhatsApp Lead Form ─────────────────────────────────── */}
      <Section id="reserve" aria-label="Reserve a private dining experience">
        <Container>
          <div className="mx-auto max-w-lg text-center">
            <h2 className="font-display text-3xl font-light text-charcoal md:text-4xl">
              Reserve a Private Dining Experience
            </h2>
            <p className="mt-3 font-body text-base text-charcoal/70">
              Bush and Alfresco setups require advance booking. Send a quick WhatsApp and we&#39;ll
              confirm availability.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-md rounded-2xl border border-border bg-cream p-6 shadow-sm md:p-8">
            <DiningWaForm />
          </div>
          <p className="mt-5 text-center font-body text-xs text-charcoal/50">
            Outside guests are welcome — you don&#39;t need to be staying at Madhuban to book.
          </p>
        </Container>
      </Section>

      {/* ── Section 10: FAQs ──────────────────────────────────────────────── */}
      <Section aria-label="Frequently asked questions" className="bg-cream">
        <Container>
          <h2 className="mb-8 text-center font-display text-3xl font-light text-charcoal md:text-4xl">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto max-w-2xl divide-y divide-border">
            {DINING.faqs.map((faq, i) => (
              <details key={faq.question} open={i === 0} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-body text-base font-semibold text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2">
                  {faq.question}
                  <span className="shrink-0 text-earth-brown transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 font-body text-sm leading-relaxed text-charcoal/70">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Forest-green CTA strip ─────────────────────────────────────────── */}
      <section
        aria-label="Book a dining experience"
        className="bg-forest-green py-16 text-center"
      >
        <Container>
          <h2 className="font-display text-3xl font-light text-ivory md:text-4xl">
            Ready for a forest meal?
          </h2>
          <p className="mx-auto mt-3 max-w-md font-body text-base text-ivory/80">
            Walk in for everyday dining, or reserve a private setup in advance.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#reserve"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-ivory px-8 font-body text-sm font-semibold uppercase tracking-wider text-forest-green transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2"
            >
              Reserve a Private Setup
            </a>
            <Link
              href="/stay"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-ivory/50 px-8 font-body text-sm font-semibold uppercase tracking-wider text-ivory transition hover:border-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2"
            >
              Explore Stays
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
