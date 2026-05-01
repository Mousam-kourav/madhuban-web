import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { contactPage } from '@/lib/schema/contact-page';
import { breadcrumbListFromPath } from '@/lib/schema/breadcrumb-list';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { BUSINESS } from '@/lib/content/business';
import { ContactForm } from '@/components/forms/contact-form';

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description:
    'Get in touch with Madhuban Eco Retreat, 60 km from Bhopal near Ratapani Tiger Reserve. Call, email, or WhatsApp us — we reply within one working day.',
  path: '/contact-us',
});

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';

const HERO_IMAGE = {
  src: `${R2_BASE}/home/contact/hero-1280.webp`,
  alt: 'Pool side area at Madhuban Eco Retreat near Bhopal — a serene eco-luxury resort near Ratapani Wildlife Sanctuary',
};

export default function ContactPage() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${BUSINESS.geo.latitude},${BUSINESS.geo.longitude}`;

  return (
    <>
      <Seo schemas={[contactPage(), breadcrumbListFromPath('/contact-us')]} />

      {/* ── 1. Hero Image ────────────────────────────────────────────────────── */}
      <section
        aria-label="Contact page hero"
        className="relative h-[50svh] min-h-[300px] overflow-hidden md:h-[60svh]"
      >
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/55"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <p className="mb-3 font-body text-xs uppercase tracking-[0.25em] text-ivory/80">
            Madhuban Eco Retreat
          </p>
          <h1 className="font-display text-4xl font-medium italic text-ivory md:text-6xl">
            Get in Touch
          </h1>
          <p className="mt-3 max-w-xl font-body text-base text-ivory/90">
            We reply within one working day. For a faster response, WhatsApp us.
          </p>
        </div>
      </section>

      {/* ── Breadcrumb ───────────────────────────────────────────────────────── */}
      <div className="bg-cream py-3">
        <Container>
          <Breadcrumb pathname="/contact-us" />
        </Container>
      </div>

      {/* ── 2. Intro ─────────────────────────────────────────────────────────── */}
      <Section className="bg-cream py-10 md:py-14" label="Contact introduction">
        <Container>
          <p
            className="mx-auto max-w-3xl text-center font-body text-base leading-relaxed text-charcoal md:text-lg"
            data-speakable="true"
          >
            Whether you&apos;re planning a stay, arranging a day outing, or simply curious about
            the forest — we&apos;d love to hear from you. Nestled near Ratapani Wildlife Sanctuary,
            Madhuban is 60&nbsp;km from Bhopal and reachable by road in under two hours.
          </p>
        </Container>
      </Section>

      {/* ── 3. Two-column: form + info ───────────────────────────────────────── */}
      <Section className="bg-cream pt-0" label="Contact form and details">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_340px]">

            {/* Form */}
            <div>
              <h2 className="mb-6 font-display text-2xl font-medium text-charcoal">
                Send a message
              </h2>
              <ContactForm />
            </div>

            {/* Info sidebar */}
            <aside aria-label="Contact details">
              <h2 className="mb-6 font-display text-2xl font-medium text-charcoal">
                Find us
              </h2>
              <div className="space-y-6">

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-earth-brown/10">
                    <Phone className="h-4 w-4 text-earth-brown" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="mb-1 font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                      Phone
                    </p>
                    <a
                      href={`tel:${BUSINESS.phone}`}
                      className="font-body text-sm text-charcoal transition-colors hover:text-earth-brown"
                    >
                      {BUSINESS.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-earth-brown/10">
                    <Mail className="h-4 w-4 text-earth-brown" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="mb-1 font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                      Email
                    </p>
                    <a
                      href={`mailto:${BUSINESS.email}`}
                      className="font-body text-sm text-charcoal transition-colors hover:text-earth-brown"
                    >
                      {BUSINESS.email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-earth-brown/10">
                    <MapPin className="h-4 w-4 text-earth-brown" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="mb-1 font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                      Address
                    </p>
                    <p className="font-body text-sm leading-relaxed text-charcoal">
                      {BUSINESS.address.streetAddress},<br />
                      {BUSINESS.address.locality}, {BUSINESS.address.region}&nbsp;&mdash;&nbsp;
                      {BUSINESS.address.postalCode}
                    </p>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block font-body text-xs text-earth-brown underline underline-offset-2 hover:no-underline"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>

                {/* WhatsApp card */}
                <div className="rounded-2xl border border-border bg-warm-beige/20 p-5">
                  <p className="mb-2 font-body text-sm font-medium text-charcoal">
                    Need a quick answer?
                  </p>
                  <p className="mb-4 font-body text-xs leading-relaxed text-charcoal/60">
                    WhatsApp is the fastest way to reach Shibajee and the team. We respond within 24 hours.
                  </p>
                  <a
                    href={`https://wa.me/${BUSINESS.phone.replace(/\D/g, '')}?text=Hi%2C%20I%20have%20a%20question%20about%20Madhuban%20Eco%20Retreat.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-earth-brown px-5 font-body text-xs font-medium text-ivory transition-opacity hover:opacity-90"
                  >
                    Chat on WhatsApp
                  </a>
                </div>

                {/* Enquiry form link */}
                <div className="pt-2">
                  <p className="font-body text-xs leading-relaxed text-charcoal/50">
                    Planning a retreat?{' '}
                    <Link
                      href="/enquire"
                      className="text-earth-brown underline underline-offset-2"
                    >
                      Use our booking enquiry form
                    </Link>{' '}
                    for dates, room preferences, and group size.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {/* ── 4. Digital Detox CTA ─────────────────────────────────────────────── */}
      <Section className="bg-forest-green text-center" label="Digital detox retreat">
        <Container>
          <p className="mb-2 font-body text-xs uppercase tracking-[0.2em] text-ivory/60">
            Weekend Getaway · Near Ratapani
          </p>
          <h2 className="mb-4 font-display text-3xl font-medium italic text-ivory md:text-4xl">
            Looking for a Digital Detox Stay?
          </h2>
          <p className="mx-auto mb-8 max-w-xl font-body text-base text-ivory/80">
            Escape the city, immerse yourself in nature, and rejuvenate your mind and body.
            Madhuban Eco Retreat is just 60&nbsp;km from Bhopal.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/enquire"
              className="inline-flex h-12 items-center justify-center rounded-md bg-ivory px-8 font-body text-sm font-medium text-earth-brown transition hover:bg-warm-beige"
            >
              Plan Your Retreat
            </Link>
            <Link
              href="/stay"
              className="inline-flex h-12 items-center justify-center rounded-md border border-ivory/50 px-8 font-body text-sm font-medium text-ivory transition hover:bg-ivory/10"
            >
              View Accommodations
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
