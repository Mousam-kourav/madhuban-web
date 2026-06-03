import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Check } from 'lucide-react';

import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { breadcrumbList } from '@/lib/schema/breadcrumb-list';

export const metadata: Metadata = buildMetadata({
  title: 'Corporate Offsite',
  titleOverride: 'Corporate Offsite near Bhopal — Team Retreats at Madhuban',
  description:
    'Corporate offsites and team retreats at Madhuban Eco Retreat. Full-property buyouts, conference space, structured programmes near Bhopal.',
  path: '/corporate-offsite',
  keywords: [
    'corporate offsite near bhopal',
    'team retreat madhya pradesh',
    'company offsite ratapani',
    'conference venue near bhopal',
    'team building retreat bhopal',
  ],
});

const breadcrumbSchema = breadcrumbList({
  items: [
    { name: 'Home', path: '/' },
    { name: 'Corporate Offsite', path: '/corporate-offsite' },
  ],
});

const INCLUDED = [
  'Full-property buyout option (sleeps up to 56 across rooms, tents, and villas)',
  'Conference and breakout meeting space, configured to your agenda',
  'Structured retreat formats — half-day, one-day, two-day, or longer',
  'All 20+ resort experiences accessible to the team without extra booking',
  'Naturalist-led group walks, forest immersions, and birding sessions',
  'Custom dining: farm-to-table buffets, plated dinners, bonfire evenings',
];

export default function CorporateOffsitePage() {
  return (
    <>
      <Seo schemas={[breadcrumbSchema]} />

      {/* Hero */}
      <section
        aria-label="Corporate offsite hero"
        className="relative bg-forest-green py-20 md:py-28"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-ivory/15 px-4 py-1 font-body text-xs font-medium uppercase tracking-[0.2em] text-ivory">
              For Teams
            </span>
            <h1 className="font-display text-4xl font-medium text-ivory md:text-5xl lg:text-6xl">
              Offsites in the forest
            </h1>
            <h2 className="mt-5 max-w-2xl mx-auto font-body text-base font-normal leading-relaxed text-ivory/85 md:text-lg">
              Full-property buyouts, conference space, structured retreat formats — for teams that
              need uninterrupted time together.
            </h2>
            <Link
              href="/enquire?context=corporate-offsite"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-earth-brown px-8 font-body text-sm font-semibold text-ivory transition hover:bg-earth-brown/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-forest-green"
            >
              Plan your offsite
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Breadcrumb */}
      <div className="bg-cream py-3">
        <Container>
          <Breadcrumb pathname="/corporate-offsite" />
        </Container>
      </div>

      {/* Intro */}
      <Section className="bg-cream" label="About corporate offsites at Madhuban">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-medium leading-tight text-charcoal md:text-4xl">
              Designed for teams that need real time together
            </h2>
            <div className="my-5 flex items-center gap-3" aria-hidden="true">
              <span className="block h-px w-8 bg-earth-brown" />
              <span className="block size-1.5 rotate-45 bg-earth-brown" />
              <span className="block h-px w-8 bg-earth-brown" />
            </div>
            <p className="font-body text-base leading-relaxed text-charcoal/80 md:text-lg">
              Madhuban hosts company offsites and structured team retreats adjacent to Ratapani
              Tiger Reserve, 90 minutes from Bhopal. You get the full property and a team on the
              ground that handles agenda, meals, and logistics — so leadership can focus on the
              conversations that actually need to happen, surrounded by forest instead of meeting
              rooms.
            </p>
          </div>
        </Container>
      </Section>

      {/* What's included */}
      <Section className="bg-white" label="What's included in a corporate offsite">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-medium leading-tight text-charcoal md:text-4xl">
              What&rsquo;s included
            </h2>
            <ul role="list" className="mt-8 space-y-4">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-earth-brown/10">
                    <Check className="size-3.5 text-earth-brown" aria-hidden="true" />
                  </span>
                  <span className="font-body text-base leading-relaxed text-charcoal/80">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <section
        aria-label="Plan a corporate offsite"
        className="bg-forest-green py-16 text-center md:py-20"
      >
        <Container>
          <h2 className="font-display text-3xl font-medium text-ivory md:text-4xl">
            Tell us what your team needs
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-base text-ivory/80">
            Share dates, group size, and the kind of retreat you have in mind. We&rsquo;ll put
            together a programme proposal within a day.
          </p>
          <Link
            href="/enquire?context=corporate-offsite"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-earth-brown px-8 font-body text-sm font-semibold text-ivory transition hover:bg-earth-brown/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-forest-green"
          >
            Plan your offsite
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Container>
      </section>
    </>
  );
}
