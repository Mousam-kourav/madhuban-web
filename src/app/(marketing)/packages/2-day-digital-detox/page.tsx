import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { breadcrumbList } from '@/lib/schema/breadcrumb-list';

export const metadata: Metadata = buildMetadata({
  title: '2-Day Digital Detox',
  titleOverride: '2-Day Digital Detox Retreat near Bhopal at Madhuban',
  description:
    'A 48-hour digital detox at Madhuban Eco Retreat. Forest walks, slow meals, yoga, and zero screens. 90 minutes from Bhopal in Ratapani Tiger Reserve.',
  path: '/packages/2-day-digital-detox',
  keywords: [
    'digital detox retreat near bhopal',
    'phone free retreat madhya pradesh',
    'mindfulness retreat ratapani',
    'screen free getaway bhopal',
    '2 day wellness retreat',
  ],
});

const breadcrumbSchema = breadcrumbList({
  items: [
    { name: 'Home', path: '/' },
    { name: 'Packages', path: '/packages' },
    { name: '2-Day Digital Detox', path: '/packages/2-day-digital-detox' },
  ],
});

const STRUCTURE: { day: string; items: string[] }[] = [
  {
    day: 'Day 1',
    items: [
      'Arrival, phone handover, and welcome tea',
      'Slow farm-to-table dinner under the sal canopy',
      'Bonfire and stargazing — no notifications, just sky',
    ],
  },
  {
    day: 'Day 2',
    items: [
      'Naturalist-led morning walk through the buffer forest',
      'Organic breakfast and yoga or meditation in the grove',
      'Unstructured afternoon — pool, hammocks, books, rest',
      'Closing reflection circle, then departure',
    ],
  },
];

const LEFT_BEHIND = ['Phones', 'Laptops', 'News', 'The noise'];

export default function DigitalDetoxPage() {
  return (
    <>
      <Seo schemas={[breadcrumbSchema]} />

      {/* Hero */}
      <section
        aria-label="Digital detox retreat hero"
        className="relative bg-forest-green py-20 md:py-28"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-ivory/15 px-4 py-1 font-body text-xs font-medium uppercase tracking-[0.2em] text-ivory">
              48-Hour Retreat
            </span>
            <h1 className="font-display text-4xl font-medium text-ivory md:text-5xl lg:text-6xl">
              Two days, phones off
            </h1>
            <h2 className="mt-5 max-w-2xl mx-auto font-body text-base font-normal leading-relaxed text-ivory/85 md:text-lg">
              A structured 48-hour stay built around forest walks, slow meals, yoga, and zero
              screens.
            </h2>
            <Link
              href="/enquire?package=2-day-digital-detox"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-earth-brown px-8 font-body text-sm font-semibold text-ivory transition hover:bg-earth-brown/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-forest-green"
            >
              Reserve a detox stay
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Breadcrumb */}
      <div className="bg-cream py-3">
        <Container>
          <Breadcrumb pathname="/packages/2-day-digital-detox" />
        </Container>
      </div>

      {/* Intro */}
      <Section className="bg-cream" label="Why a digital detox">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-medium leading-tight text-charcoal md:text-4xl">
              Permission to put it down
            </h2>
            <div className="my-5 flex items-center gap-3" aria-hidden="true">
              <span className="block h-px w-8 bg-earth-brown" />
              <span className="block size-1.5 rotate-45 bg-earth-brown" />
              <span className="block h-px w-8 bg-earth-brown" />
            </div>
            <p className="font-body text-base leading-relaxed text-charcoal/80 md:text-lg">
              Most people don&rsquo;t actually rest on holiday — they just relocate their inbox. The
              48-hour digital detox is built differently: phones go into a lockbox at check-in, the
              day has a gentle structure so you don&rsquo;t have to make decisions, and the forest
              does the rest. You leave more rested than when you walked in.
            </p>
          </div>
        </Container>
      </Section>

      {/* The 48-hour structure */}
      <Section className="bg-white" label="The 48-hour structure">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-medium leading-tight text-charcoal md:text-4xl">
              The 48-hour structure
            </h2>
            <div className="mt-8 space-y-10">
              {STRUCTURE.map((block) => (
                <div key={block.day}>
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-earth-brown">
                    {block.day}
                  </p>
                  <ul role="list" className="mt-3 space-y-2.5">
                    {block.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 font-body text-base leading-relaxed text-charcoal/80"
                      >
                        <span
                          className="mt-2 block size-1.5 shrink-0 rotate-45 bg-earth-brown"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* What's left behind */}
      <Section className="bg-warm-beige/30" label="What is left behind during the detox">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="font-display text-2xl font-medium text-charcoal md:text-3xl">
              What&rsquo;s left behind
            </h3>
            <ul
              role="list"
              className="mt-6 flex flex-wrap items-center justify-center gap-3"
            >
              {LEFT_BEHIND.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center rounded-full border border-earth-brown/30 bg-cream px-4 py-1.5 font-body text-sm font-medium text-earth-brown"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <section
        aria-label="Reserve the digital detox retreat"
        className="bg-forest-green py-16 text-center md:py-20"
      >
        <Container>
          <h2 className="font-display text-3xl font-medium text-ivory md:text-4xl">
            Ready to put it down?
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-base text-ivory/80">
            Tell us your preferred dates. We&rsquo;ll confirm availability and send the prep
            details within a day.
          </p>
          <Link
            href="/enquire?package=2-day-digital-detox"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-earth-brown px-8 font-body text-sm font-semibold text-ivory transition hover:bg-earth-brown/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-forest-green"
          >
            Reserve a detox stay
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Container>
      </section>
    </>
  );
}
