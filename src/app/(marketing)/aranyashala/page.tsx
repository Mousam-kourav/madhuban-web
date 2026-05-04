import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Trees,
  Mountain,
  Bug,
  Footprints,
  Star,
  GitFork,
  Waves,
  Home,
  Bird,
  Hexagon,
  Landmark,
  Droplets,
  CircleAlert,
  Droplet,
  Flower,
  Link as LinkIcon,
  CheckCircle,
  Compass,
  Wind,
  Tent,
  Map,
  Activity,
  Bike,
  Check,
  Phone,
  Mail,
} from 'lucide-react';

import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { faqPage } from '@/lib/schema/faq-page';
import { breadcrumbList } from '@/lib/schema/breadcrumb-list';
import { ARANYASHALA } from '@/lib/content/aranyashala';
import { AranyashalaWaForm } from '@/components/marketing/aranyashala/aranyashala-wa-form';

// ── SEO ───────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Aranyashala',
    titleOverride:
      'Aranyashala | Nature School Camp Near Bhopal | Madhuban Eco Retreat',
    description:
      'Aranyashala — Madhuban’s nature school program. Multi-day naturalist courses for schools & colleges. Forest learning, life skills, heritage awareness near Ratapani.',
    path: '/aranyashala',
    ogImage: ARANYASHALA.hero.image.desktop,
  }),
  keywords: [
    'nature school near bhopal',
    'aranyashala madhuban',
    'school nature camp bhopal',
    'naturalist course bhopal',
    'school nature program ratapani',
    'outdoor education camp bhopal',
    'school field trip madhya pradesh',
  ],
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.madhubanecoretreat.com';

// ── JSON-LD schemas ───────────────────────────────────────────────────────────
const courseSchemas: Record<string, unknown>[] = ARANYASHALA.courses.map((c) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: `${c.tier} — Aranyashala Nature School`,
  description: `${c.tier}: ${c.duration} naturalist course. Includes: ${c.includes.join('; ')}.`,
  provider: {
    '@type': 'EducationalOrganization',
    name: 'Aranyashala — The Nature School at Madhuban Eco Retreat',
    url: `${BASE_URL}/aranyashala`,
  },
  timeRequired: c.duration,
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'onsite',
    location: {
      '@type': 'Place',
      name: 'Madhuban Eco Retreat',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Near Ratapani Wildlife Sanctuary, Village Bori, Salkanpur Road',
        addressLocality: 'Rehti',
        addressRegion: 'Madhya Pradesh',
        postalCode: '466446',
        addressCountry: 'IN',
      },
    },
  },
}));

const educationalOrgSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Aranyashala — The Nature School',
  description:
    'Aranyashala is Madhuban Eco Retreat\'s nature-based education program — multi-day naturalist courses combining forest interpretation, life-skills development, and heritage awareness.',
  url: `${BASE_URL}/aranyashala`,
  parentOrganization: {
    '@type': 'LodgingBusiness',
    name: 'Madhuban Eco Retreat',
    url: BASE_URL,
  },
};

const placeSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'Place',
  name: 'Madhuban Eco Retreat',
  description:
    'Eco-luxury forest resort adjacent to Ratapani Tiger Reserve, 60 km from Bhopal.',
  url: BASE_URL,
  geo: { '@type': 'GeoCoordinates', latitude: 22.88, longitude: 77.52 },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Near Ratapani Wildlife Sanctuary, Village Bori, Salkanpur Road',
    addressLocality: 'Rehti',
    addressRegion: 'Madhya Pradesh',
    postalCode: '466446',
    addressCountry: 'IN',
  },
};

const breadcrumbSchema = breadcrumbList({
  items: [
    { name: 'Home', path: '/' },
    { name: 'Aranyashala', path: '/aranyashala' },
  ],
});

const faqSchema = faqPage({
  items: ARANYASHALA.faqs.map((f) => ({ question: f.question, answer: f.answer })),
});

// ── Icon map ──────────────────────────────────────────────────────────────────
type TrailIconName =
  | 'Compass' | 'Trees' | 'Wind' | 'Mountain' | 'Bug' | 'Footprints'
  | 'Star' | 'GitFork' | 'Waves' | 'Home' | 'Bird' | 'Hexagon'
  | 'Landmark' | 'Droplets' | 'CircleAlert' | 'Droplet' | 'Flower'
  | 'Link' | 'CheckCircle';

type ActivityIconName = 'Tent' | 'Map' | 'Activity' | 'Bike';

const TRAIL_ICONS: Record<
  TrailIconName,
  React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
> = {
  Compass, Trees, Wind, Mountain, Bug, Footprints, Star, GitFork, Waves,
  Home, Bird, Hexagon, Landmark, Droplets, CircleAlert, Droplet, Flower,
  Link: LinkIcon, CheckCircle,
};

const ACTIVITY_ICONS: Record<
  ActivityIconName,
  React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
> = { Tent, Map, Activity, Bike };

function TrailIcon({ name, className }: { name: string; className?: string }) {
  const Comp = TRAIL_ICONS[name as TrailIconName] ?? Compass;
  return <Comp className={className} aria-hidden="true" />;
}

function ActivityIcon({ name, className }: { name: string; className?: string }) {
  const Comp = ACTIVITY_ICONS[name as ActivityIconName] ?? Tent;
  return <Comp className={className} aria-hidden="true" />;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AranyashalaPage() {
  return (
    <>
      <Seo
        schemas={[
          ...courseSchemas,
          educationalOrgSchema,
          placeSchema,
          faqSchema,
          breadcrumbSchema,
        ]}
      />

      {/* ── 1. Hero ───────────────────────────────────────────────────────────── */}
      <section
        aria-label="Aranyashala hero"
        className="relative h-[80svh] min-h-[480px] overflow-hidden"
      >
        <Image
          src={ARANYASHALA.hero.image.desktop}
          alt={ARANYASHALA.hero.image.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        {/* Gradient: cream-to-transparent at 50% from bottom */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2]/80 via-black/20 to-black/60"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <span className="mb-4 inline-block rounded-full bg-earth-brown/80 px-5 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.25em] text-ivory">
            {ARANYASHALA.hero.eyebrow}
          </span>
          <h1 className="max-w-3xl font-display text-4xl font-medium italic text-ivory drop-shadow-sm md:text-5xl lg:text-6xl">
            {ARANYASHALA.hero.title}
          </h1>
          <p className="mt-5 max-w-2xl font-body text-base text-ivory/90 md:text-lg">
            {ARANYASHALA.hero.subtitle}
          </p>
          <a
            href="#contact"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-earth-brown px-8 font-body text-sm font-semibold text-ivory transition hover:bg-earth-brown/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Plan a Group Visit
          </a>
        </div>
      </section>

      {/* ── Breadcrumb ────────────────────────────────────────────────────────── */}
      <div className="bg-cream py-3">
        <Container>
          <Breadcrumb pathname="/aranyashala" />
        </Container>
      </div>

      {/* ── 2. Mission / Pull Quote ───────────────────────────────────────────── */}
      <Section className="bg-cream" label="Aranyashala mission">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            {/* Decorative ornament */}
            <div className="mb-6 flex items-center justify-center gap-3" aria-hidden="true">
              <span className="block h-px w-12 bg-earth-brown/40" />
              <span className="block size-2 rotate-45 bg-earth-brown" />
              <span className="block h-px w-12 bg-earth-brown/40" />
            </div>
            <blockquote>
              <p className="font-display text-2xl font-light italic leading-relaxed text-charcoal md:text-3xl">
                &ldquo;{ARANYASHALA.missionQuote}&rdquo;
              </p>
            </blockquote>
            <div className="mt-8 flex items-center justify-center gap-3" aria-hidden="true">
              <span className="block h-px w-12 bg-earth-brown/40" />
              <span className="block size-2 rotate-45 bg-earth-brown" />
              <span className="block h-px w-12 bg-earth-brown/40" />
            </div>
          </div>

          {/* 3 mission pillars */}
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {ARANYASHALA.missionPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm"
              >
                <h3 className="font-display text-xl font-medium text-charcoal">
                  {pillar.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-charcoal/70">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 3. Forest & Wildlife Interpretation ──────────────────────────────── */}
      <Section label="Forest and wildlife interpretation module">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text: left on desktop */}
            <div className="order-2 lg:order-1">
              <span className="mb-3 inline-block font-body text-xs font-semibold uppercase tracking-widest text-earth-brown">
                Module 1
              </span>
              <h2 className="font-display text-3xl font-medium leading-tight text-charcoal md:text-4xl">
                {ARANYASHALA.modules.forestWildlife.title}
              </h2>
              <div className="my-5 flex items-center gap-3" aria-hidden="true">
                <span className="block h-px w-8 bg-earth-brown" />
                <span className="block size-1.5 rotate-45 bg-earth-brown" />
                <span className="block h-px w-8 bg-earth-brown" />
              </div>
              <p className="font-body text-base leading-relaxed text-charcoal/80">
                {ARANYASHALA.modules.forestWildlife.body}
              </p>
              <ul className="mt-6 space-y-2">
                {ARANYASHALA.modules.forestWildlife.activities.map((act) => (
                  <li key={act} className="flex items-start gap-2 font-body text-sm text-charcoal/80">
                    <Check className="mt-0.5 size-4 shrink-0 text-earth-brown" aria-hidden="true" />
                    {act}
                  </li>
                ))}
              </ul>
            </div>

            {/* Image: right on desktop, first on mobile */}
            <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl lg:order-2">
              <Image
                src={ARANYASHALA.modules.forestWildlife.image.desktop}
                alt={ARANYASHALA.modules.forestWildlife.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 4. Madhuban Nature Trail ──────────────────────────────────────────── */}
      <Section className="bg-warm-beige/30" label="The Madhuban Nature Trail">
        <Container>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-medium leading-tight text-charcoal md:text-4xl">
              {ARANYASHALA.natureTrail.title}
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-charcoal/70">
              {ARANYASHALA.natureTrail.subtitle}
            </p>
          </div>

          {/* 19 stops — 2-col desktop (10+9 split), 1-col mobile */}
          <ol className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {ARANYASHALA.natureTrail.stops.map((stop, i) => (
              <li key={stop.name} className="flex items-center gap-3">
                <span className="shrink-0 font-display text-2xl font-medium text-earth-brown">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <TrailIcon name={stop.icon} className="size-4 shrink-0 text-earth-brown/70" />
                <span className="font-body text-sm text-charcoal/80">{stop.name}</span>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-center font-body text-xs font-medium uppercase tracking-widest text-earth-brown/80">
            {ARANYASHALA.natureTrail.footer}
          </p>
        </Container>
      </Section>

      {/* ── 5. Life Skill Development ─────────────────────────────────────────── */}
      <Section label="Life skill development module">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Image: left on desktop */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={ARANYASHALA.modules.lifeSkill.image.desktop}
                alt={ARANYASHALA.modules.lifeSkill.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Text: right on desktop */}
            <div>
              <span className="mb-3 inline-block font-body text-xs font-semibold uppercase tracking-widest text-earth-brown">
                Module 2
              </span>
              <h2 className="font-display text-3xl font-medium leading-tight text-charcoal md:text-4xl">
                {ARANYASHALA.modules.lifeSkill.title}
              </h2>
              <div className="my-5 flex items-center gap-3" aria-hidden="true">
                <span className="block h-px w-8 bg-earth-brown" />
                <span className="block size-1.5 rotate-45 bg-earth-brown" />
                <span className="block h-px w-8 bg-earth-brown" />
              </div>
              <p className="font-body text-base leading-relaxed text-charcoal/80">
                {ARANYASHALA.modules.lifeSkill.body}
              </p>
              {/* 4-card mini-grid */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {ARANYASHALA.modules.lifeSkill.activities.map((act) => (
                  <div
                    key={act.label}
                    className="flex items-start gap-3 rounded-xl border border-border bg-cream p-4"
                  >
                    <ActivityIcon
                      name={act.icon}
                      className="mt-0.5 size-5 shrink-0 text-earth-brown"
                    />
                    <div>
                      <p className="font-body text-sm font-semibold text-charcoal">{act.label}</p>
                      <p className="mt-0.5 font-body text-xs text-charcoal/60">{act.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 6. Heritage & Cultural Awareness ─────────────────────────────────── */}
      <Section className="bg-cream" label="Heritage and cultural awareness module">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Image: left on desktop */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={ARANYASHALA.modules.heritage.image.desktop}
                alt={ARANYASHALA.modules.heritage.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Text: right on desktop */}
            <div>
              <span className="mb-3 inline-block font-body text-xs font-semibold uppercase tracking-widest text-earth-brown">
                Module 3
              </span>
              <h2 className="font-display text-3xl font-medium leading-tight text-charcoal md:text-4xl">
                {ARANYASHALA.modules.heritage.title}
              </h2>
              <div className="my-5 flex items-center gap-3" aria-hidden="true">
                <span className="block h-px w-8 bg-earth-brown" />
                <span className="block size-1.5 rotate-45 bg-earth-brown" />
                <span className="block h-px w-8 bg-earth-brown" />
              </div>
              <p className="font-body text-base leading-relaxed text-charcoal/80">
                {ARANYASHALA.modules.heritage.body}
              </p>
              {/* 3 highlight badges */}
              <div className="mt-6 flex flex-wrap gap-3">
                {ARANYASHALA.modules.heritage.highlights.map((h) => (
                  <span
                    key={h}
                    className="inline-flex items-center rounded-full border border-earth-brown/30 bg-earth-brown/10 px-4 py-1.5 font-body text-xs font-semibold text-earth-brown"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 7. Camping Experience ─────────────────────────────────────────────── */}
      <Section label="Camping experience at Aranyashala">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text */}
            <div>
              <h2 className="font-display text-3xl font-medium italic leading-tight text-charcoal md:text-4xl">
                {ARANYASHALA.camping.title}
              </h2>
              <div className="my-5 flex items-center gap-3" aria-hidden="true">
                <span className="block h-px w-8 bg-earth-brown" />
                <span className="block size-1.5 rotate-45 bg-earth-brown" />
                <span className="block h-px w-8 bg-earth-brown" />
              </div>
              <div className="space-y-4">
                {ARANYASHALA.camping.paragraphs.map((p, i) => (
                  <p key={i} className="font-body text-base leading-relaxed text-charcoal/80">
                    {p}
                  </p>
                ))}
              </div>
              {/* Feature pills */}
              <div className="mt-6 flex flex-wrap gap-3">
                {ARANYASHALA.camping.features.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center rounded-full bg-earth-brown/10 px-4 py-1.5 font-body text-xs font-semibold text-earth-brown ring-1 ring-earth-brown/20"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={ARANYASHALA.camping.image.desktop}
                alt={ARANYASHALA.camping.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 8. Resource Persons ───────────────────────────────────────────────── */}
      <Section className="bg-warm-beige/30" label="Aranyashala expert faculty">
        <Container>
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-medium text-charcoal md:text-4xl">
              Led by Wildlife Experts and Educators
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-body text-base text-charcoal/70">
              Aranyashala is delivered by a hand-picked team of forest experts, naturalists, and
              adventure educators.
            </p>
          </div>

          <ul
            role="list"
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          >
            {ARANYASHALA.resourcePersons.map((person) => (
              <li
                key={person.name}
                className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-white p-6 text-center shadow-sm"
              >
                {/* Circular portrait — 140px */}
                <div className="relative size-[140px] shrink-0 overflow-hidden rounded-full ring-2 ring-earth-brown/20">
                  <Image
                    src={person.image}
                    alt={`Portrait of ${person.name}`}
                    fill
                    sizes="140px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-display text-lg font-medium text-charcoal">{person.name}</h3>
                  <p className="mt-1 font-body text-xs leading-relaxed text-charcoal/60">
                    {person.role}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── 9. Testimonial Wall ───────────────────────────────────────────────── */}
      <Section
        className="relative overflow-hidden bg-warm-beige"
        label="Voices from the forest — Aranyashala testimonials"
      >
        {/* Subtle decorative gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at 20% 80%, #6E6146 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #D1C8C1 0%, transparent 50%)',
          }}
          aria-hidden="true"
        />
        <Container className="relative">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-medium text-charcoal md:text-4xl">
              Voices from the Forest
            </h2>
            <p className="mx-auto mt-3 max-w-xl font-body text-base text-charcoal/70">
              What students, teachers, and educators tell us after Aranyashala.
            </p>
          </div>

          {/* Editorial testimonial wall — NO carousel, pure CSS grid */}
          <div className="grid gap-6 md:grid-cols-12">
            {/* Featured quote — 7 cols on desktop */}
            <article
              aria-label={`Featured testimonial from ${ARANYASHALA.testimonials.featured.role}`}
              className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-md md:col-span-7 md:p-10"
            >
              {/* Oversized decorative opening quote mark */}
              <span
                className="pointer-events-none absolute left-6 top-4 select-none font-display text-[8rem] leading-none text-earth-brown/15"
                aria-hidden="true"
              >
                &ldquo;
              </span>

              <div className="relative flex flex-col items-start gap-6">
                {/* Portrait */}
                <div className="relative size-[80px] overflow-hidden rounded-full ring-2 ring-earth-brown/20 sm:size-[100px]">
                  <Image
                    src={ARANYASHALA.testimonials.featured.image}
                    alt={`Photo of ${ARANYASHALA.testimonials.featured.role}`}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>

                {/* Quote */}
                <blockquote>
                  <p className="font-display text-xl font-light italic leading-relaxed text-charcoal sm:text-2xl md:text-3xl">
                    &ldquo;{ARANYASHALA.testimonials.featured.quote}&rdquo;
                  </p>
                  <footer className="mt-5">
                    <cite className="not-italic">
                      <span className="font-body text-sm font-semibold uppercase tracking-widest text-earth-brown">
                        {ARANYASHALA.testimonials.featured.role}
                      </span>
                    </cite>
                  </footer>
                </blockquote>
              </div>
            </article>

            {/* 4 smaller testimonial cards — 5 cols, 2×2 grid on desktop */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-5 md:grid-cols-2">
              {ARANYASHALA.testimonials.others.map((t, i) => (
                <article
                  key={i}
                  aria-label={`Testimonial from ${t.role}`}
                  className="flex flex-col gap-4 rounded-2xl bg-cream p-5 shadow-sm"
                >
                  {/* Portrait + role */}
                  <div className="flex items-center gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-full ring-1 ring-earth-brown/20">
                      <Image
                        src={t.image}
                        alt={`Photo of ${t.role}`}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <span className="font-body text-xs font-semibold uppercase tracking-widest text-earth-brown">
                      {t.role}
                    </span>
                  </div>

                  {/* Quote */}
                  <blockquote>
                    <p className="font-body text-sm italic leading-relaxed text-charcoal/80">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </blockquote>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 10. Naturalist Courses ────────────────────────────────────────────── */}
      <Section label="Aranyashala naturalist courses">
        <Container>
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-medium text-charcoal md:text-4xl">
              Naturalist Courses
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-base text-charcoal/70">
              Choose a duration that fits your group&apos;s calendar.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {ARANYASHALA.courses.map((course, i) => (
              <div
                key={course.tier}
                className={`flex flex-col rounded-2xl border p-7 shadow-sm ${
                  i === 1
                    ? 'border-earth-brown/40 bg-earth-brown/5 ring-1 ring-earth-brown/30'
                    : 'border-border bg-white'
                }`}
              >
                {i === 1 && (
                  <span className="mb-4 inline-block self-start rounded-full bg-earth-brown px-3 py-0.5 font-body text-[10px] font-semibold uppercase tracking-widest text-ivory">
                    Popular
                  </span>
                )}
                <h3 className="font-display text-2xl font-medium text-charcoal">{course.tier}</h3>
                <p className="mt-1 font-body text-sm font-medium text-earth-brown">
                  {course.duration}
                </p>
                <ul className="mt-5 grow space-y-2">
                  {course.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 font-body text-sm text-charcoal/80">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-earth-brown"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="mt-7 inline-flex h-11 items-center justify-center rounded-lg border border-earth-brown px-6 font-body text-sm font-medium text-earth-brown transition hover:bg-earth-brown hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
                >
                  Inquire
                </a>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center font-body text-xs text-charcoal/50">
            All courses include mandatory quiz component. Successful students receive a completion
            certificate.
          </p>
        </Container>
      </Section>

      {/* ── 11. WhatsApp Lead Form ────────────────────────────────────────────── */}
      <Section id="contact" className="bg-cream" label="Contact Aranyashala for group visit">
        <Container>
          <div className="mx-auto max-w-xl">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-medium text-charcoal md:text-4xl">
                Bring Your Group to Aranyashala
              </h2>
              <p className="mx-auto mt-4 font-body text-base text-charcoal/70">
                Schools, colleges, and corporate teams welcome. Customized programs available.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-7 shadow-sm md:p-9">
              <AranyashalaWaForm />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 12. FAQs ──────────────────────────────────────────────────────────── */}
      <Section label="Aranyashala frequently asked questions">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-8 text-center font-display text-3xl font-medium text-charcoal md:text-4xl">
              Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {ARANYASHALA.faqs.map((faq, i) => (
                <details
                  key={faq.question}
                  open={i === 0}
                  className="group rounded-xl border border-border bg-cream"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-body text-sm font-semibold text-charcoal hover:text-earth-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-inset">
                    {faq.question}
                    <span
                      className="ml-2 shrink-0 font-body text-xl font-light leading-none text-earth-brown transition-transform group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-5">
                    <p className="font-body text-sm leading-relaxed text-charcoal/70">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 13. Final CTA ─────────────────────────────────────────────────────── */}
      <section
        aria-label="Plan a group visit to Aranyashala"
        className="bg-forest-green py-16 md:py-24"
      >
        <Container>
          <div className="text-center">
            <h2 className="font-display text-3xl font-medium italic text-ivory md:text-4xl lg:text-5xl">
              Plan a Group Visit
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-base text-ivory/80">
              Reach out and let us help you design the right Aranyashala program for your group.
            </p>

            {/* Two CTAs */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-earth-brown px-8 font-body text-sm font-semibold text-ivory transition hover:bg-earth-brown/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-forest-green"
              >
                Send WhatsApp Enquiry
              </a>
              <Link
                href={`mailto:${ARANYASHALA.cta.email}`}
                className="inline-flex h-12 items-center gap-2 rounded-md border border-ivory/40 px-8 font-body text-sm font-medium text-ivory/90 transition hover:border-ivory hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-forest-green"
              >
                <Mail className="size-4" aria-hidden="true" />
                {ARANYASHALA.cta.email}
              </Link>
            </div>

            {/* Phone strip */}
            <div className="mt-6 flex items-center justify-center gap-2 font-body text-sm text-ivory/70">
              <Phone className="size-4" aria-hidden="true" />
              <span>Or call {ARANYASHALA.cta.phone}</span>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
