import Link from 'next/link';
import type { Metadata } from 'next';

import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';

const base = buildMetadata({
  title: 'Thank You',
  titleOverride: 'Thank You — Madhuban Eco Retreat',
  description: "Thanks for getting in touch. We'll respond within a day.",
  path: '/thank-you',
});

export const metadata: Metadata = {
  ...base,
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return (
    <Section className="bg-cream" label="Enquiry received">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-5 inline-block rounded-full bg-earth-brown/10 px-4 py-1 font-body text-xs font-medium uppercase tracking-[0.2em] text-earth-brown">
            Enquiry Received
          </span>
          <h1 className="font-display text-4xl font-medium text-charcoal md:text-5xl lg:text-6xl">
            Thank you
          </h1>
          <h2 className="mt-5 font-body text-base font-normal leading-relaxed text-charcoal/75 md:text-lg">
            We&rsquo;ve received your enquiry. Our team will be in touch within a day.
          </h2>

          <p className="mt-8 font-body text-base leading-relaxed text-charcoal/70">
            In the meantime, feel free to keep exploring. If you need to reach us sooner, WhatsApp
            us at +91 97705 58419 — we usually reply within a few hours during the day.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-md border border-earth-brown px-6 font-body text-sm font-medium text-earth-brown transition hover:bg-earth-brown hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
            >
              Back to home
            </Link>
            <Link
              href="/stay"
              className="inline-flex h-11 items-center justify-center rounded-md border border-earth-brown px-6 font-body text-sm font-medium text-earth-brown transition hover:bg-earth-brown hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
            >
              Browse stays
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
