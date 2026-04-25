import Link from 'next/link';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';

export function NewsletterCta() {
  return (
    <Section label="Newsletter" id="newsletter-cta" className="bg-cream">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 font-body text-sm font-semibold uppercase tracking-widest text-earth-brown">
            Stay Connected
          </p>
          <h2 className="font-display text-3xl font-medium text-charcoal md:text-4xl">
            Stories from the Forest, in Your Inbox
          </h2>
          <p className="mt-6 font-body text-base leading-relaxed text-charcoal/70">
            Monthly notes on bird sightings, monsoon arrivals, harvest news, and quiet weekend
            openings. No spam, ever.
          </p>
          <div className="mt-8">
            <Link
              href="#footer-newsletter"
              className="inline-flex h-12 items-center justify-center rounded-md bg-earth-brown px-8 text-sm font-medium text-ivory transition-colors duration-200 hover:bg-blush-dusk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
