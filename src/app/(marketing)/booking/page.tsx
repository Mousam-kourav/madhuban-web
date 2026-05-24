import Image from 'next/image';
import Link from 'next/link';
import { Check, Search, CalendarCheck, CreditCard, MailCheck, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { IconWhatsApp } from '@/components/ui/social-icons';
import { lodgingBusiness } from '@/lib/schema/lodging-business';
import { faqPage } from '@/lib/schema/faq-page';
import { breadcrumbList } from '@/lib/schema/breadcrumb-list';

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';

const PHONE_DISPLAY = '+91 9770558419';
const PHONE_TEL = '+919770558419';
const WHATSAPP_URL = `https://wa.me/919770558419?text=${encodeURIComponent(
  "Hi, I have a question about booking at Madhuban Eco Retreat.",
)}`;

export const metadata: Metadata = buildMetadata({
  title: 'Book',
  titleOverride: 'Book Madhuban Eco Retreat — Direct Booking, Best Rate',
  description:
    'Reserve your stay at Madhuban Eco Retreat in Ratapani. Direct online booking, best rate guaranteed, no booking fees. Two hours from Bhopal.',
  path: '/booking',
  ogImage: `${R2_BASE}/home/hero/hero-aerial-sunset-1280.webp`,
  keywords: [
    'book resort near ratapani jungle',
    'ratapani resort price',
    'madhuban eco retreat price',
    'ratapani resort booking',
    'book hotel near ratapani jungle lodge',
    'hotels near ratapani wildlife sanctuary',
    'book hotel near ratapani for family',
    'hotel in ratapani online booking',
  ],
});

const HERO_IMAGE = {
  src: `${R2_BASE}/home/hero/hero-aerial-sunset-1280.webp`,
  alt: 'Aerial view of Madhuban Eco Retreat at sunset, with forested hills of Ratapani Tiger Reserve in the distance',
};

const TRUST_BADGES = [
  'Best rate guaranteed',
  'No booking fees',
  'Free cancellation 7+ days',
] as const;

const STEPS = [
  {
    icon: Search,
    title: 'Browse',
    body: 'Choose from six accommodations on the Stay page — safari tents, mud houses, glamping, and a poolside villa.',
  },
  {
    icon: CalendarCheck,
    title: 'Select dates',
    body: 'Check availability for your travel window and pick the room that fits your group.',
  },
  {
    icon: CreditCard,
    title: 'Pay securely',
    body: 'Razorpay-powered checkout — UPI, cards, and net banking. Your card details stay with Razorpay.',
  },
  {
    icon: MailCheck,
    title: 'Confirmed',
    body: 'Instant confirmation by email with your booking reference and check-in details.',
  },
] as const;

// FAQ for FAQPage schema only — not rendered in the UI. Preserves
// rich-snippet eligibility for long-tail Ratapani/Bhopal queries.
const FAQS = [
  {
    question: "What's the price of a stay at Madhuban Eco Retreat?",
    answer:
      'Room rates start from ₹2,500/night (Camping Tent) up to ₹12,000/night (Safari Tent or Pool Side Villa), all inclusive of GST. Prices vary by room type and season. Browse rooms and live availability at madhubanecoretreat.com/stay.',
  },
  {
    question: 'How do I book a hotel near Ratapani Wildlife Sanctuary?',
    answer:
      "Book directly online at madhubanecoretreat.com — browse accommodations at /stay, pick your room and dates, and pay securely via Razorpay. You receive instant confirmation by email. For questions, WhatsApp +91 9770558419.",
  },
  {
    question: 'Is Madhuban Eco Retreat suitable for family bookings?',
    answer:
      'Yes. All rooms welcome families. The Pool Side Villa comfortably fits 2 adults + 2 children. Guided forest walks and recreational activities are designed for all ages — children, seniors, and beginners alike.',
  },
  {
    question: 'How far is Madhuban from Bhopal?',
    answer:
      'Madhuban Eco Retreat is approximately 60 km from Bhopal city, near Rehti, Sehore district. The drive takes 1.5 to 2 hours depending on route and traffic.',
  },
  {
    question: "What's the cancellation policy?",
    answer:
      'Free cancellation up to 7 days before arrival — you receive a 100% refund. 3–7 days before check-in: 50% refund. Less than 3 days or no-show: no refund. Full details at madhubanecoretreat.com/terms-and-condition.',
  },
  {
    question: 'Are there safari options near Madhuban Eco Retreat?',
    answer:
      'Yes. Madhuban is adjacent to the Ratapani Tiger Reserve. The resort organises guided jungle safaris and forest walks led by trained naturalists and forest guards. Pre-booking is recommended for safaris.',
  },
  {
    question: "What's included in the room rate?",
    answer:
      'All room rates at Madhuban include breakfast, Wi-Fi access, swimming pool access (where applicable), and parking. Additional meals, safaris, and activity bookings are available at extra cost.',
  },
] as const;

const breadcrumbSchema = breadcrumbList({
  items: [
    { name: 'Home', path: '/' },
    { name: 'Booking', path: '/booking' },
  ],
});

export default function BookingPage() {
  return (
    <>
      <Seo
        schemas={[
          lodgingBusiness(),
          breadcrumbSchema,
          faqPage({ items: FAQS.map((f) => ({ question: f.question, answer: f.answer })) }),
        ]}
      />

      {/* ── 1. Hero ──────────────────────────────────────────────────────────── */}
      <section
        aria-label="Reserve your stay at Madhuban Eco Retreat"
        className="relative h-[75svh] min-h-[480px] overflow-hidden"
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
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <span className="mb-4 inline-block rounded-full bg-earth-brown/80 px-4 py-1 font-body text-xs font-medium uppercase tracking-[0.2em] text-ivory">
            Direct Booking
          </span>
          <h1 className="max-w-3xl font-display text-4xl font-medium text-ivory md:text-5xl lg:text-6xl">
            Reserve your stay
          </h1>
          <p className="mt-5 max-w-2xl font-body text-base text-ivory/90 md:text-lg">
            Direct bookings. Best rate guaranteed. Free cancellation up to 7 days before arrival.
          </p>

          {/* Trust strip */}
          <ul
            role="list"
            aria-label="Booking guarantees"
            className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
          >
            {TRUST_BADGES.map((label) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-ivory/10 px-3 py-1 font-body text-xs font-medium text-ivory backdrop-blur-sm ring-1 ring-ivory/30"
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2.5} />
                {label}
              </li>
            ))}
          </ul>

          <Link
            href="/stay"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-earth-brown px-8 font-body text-sm font-medium text-ivory transition hover:bg-earth-brown/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Browse rooms and book online
          </Link>
          <p className="mt-3 font-body text-xs text-ivory/70">
            Direct online booking saves time and prevents back-and-forth.
          </p>
        </div>
      </section>

      {/* ── Breadcrumb ───────────────────────────────────────────────────────── */}
      <div className="bg-cream py-3">
        <Container>
          <Breadcrumb pathname="/booking" />
        </Container>
      </div>

      {/* ── 2. What to expect ────────────────────────────────────────────────── */}
      <Section className="bg-cream" label="What to expect when you book">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-medium leading-tight text-charcoal md:text-4xl">
              What to expect
            </h2>
            <div className="my-5 flex items-center justify-center gap-3" aria-hidden="true">
              <span className="block h-px w-8 bg-earth-brown" />
              <span className="block size-1.5 rotate-45 bg-earth-brown" />
              <span className="block h-px w-8 bg-earth-brown" />
            </div>
            <p className="font-body text-base leading-relaxed text-charcoal/70">
              Four simple steps from browsing to confirmation. Most guests complete a booking in
              under three minutes.
            </p>
          </div>

          <ol
            role="list"
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li
                key={title}
                className="relative rounded-2xl border border-border bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-earth-brown/10"
                  >
                    <Icon className="h-5 w-5 text-earth-brown" strokeWidth={1.75} />
                  </span>
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-earth-brown/70">
                    Step {i + 1}
                  </p>
                </div>
                <h3 className="mb-2 font-display text-xl font-medium text-charcoal">{title}</h3>
                <p className="font-body text-sm leading-relaxed text-charcoal/70">{body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 text-center">
            <Link
              href="/stay"
              className="inline-flex h-12 items-center justify-center rounded-md bg-earth-brown px-8 font-body text-sm font-medium text-ivory transition hover:bg-earth-brown/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
            >
              Browse rooms and book online
            </Link>
          </div>
        </Container>
      </Section>

      {/* ── 3. Need to talk to us first? ─────────────────────────────────────── */}
      <Section className="bg-warm-beige/30" label="Contact options before booking">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <h2 className="font-display text-3xl font-medium leading-tight text-charcoal md:text-4xl">
                Need to talk to us first?
              </h2>
              <div className="my-5 flex items-center justify-center gap-3" aria-hidden="true">
                <span className="block h-px w-8 bg-earth-brown" />
                <span className="block size-1.5 rotate-45 bg-earth-brown" />
                <span className="block h-px w-8 bg-earth-brown" />
              </div>
              <p className="font-body text-base leading-relaxed text-charcoal/70">
                Special requests, group bookings, or questions about the property — reach us the
                way you prefer.
              </p>
            </div>

            <ul
              role="list"
              className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3"
            >
              <li>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="flex h-full flex-col items-center rounded-xl border border-border bg-white p-6 text-center transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
                >
                  <span
                    aria-hidden="true"
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-earth-brown/10"
                  >
                    <Phone className="h-5 w-5 text-earth-brown" strokeWidth={1.75} />
                  </span>
                  <p className="mb-1 font-body text-xs font-semibold uppercase tracking-[0.15em] text-earth-brown/70">
                    Call us
                  </p>
                  <p className="font-display text-lg font-medium text-charcoal">{PHONE_DISPLAY}</p>
                  <p className="mt-1 font-body text-xs text-muted-foreground">
                    9 AM – 6 PM daily
                  </p>
                </a>
              </li>

              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full flex-col items-center rounded-xl border border-border bg-white p-6 text-center transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
                >
                  <span
                    aria-hidden="true"
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-earth-brown/10"
                  >
                    <IconWhatsApp className="h-5 w-5 text-earth-brown" />
                  </span>
                  <p className="mb-1 font-body text-xs font-semibold uppercase tracking-[0.15em] text-earth-brown/70">
                    WhatsApp
                  </p>
                  <p className="font-display text-lg font-medium text-charcoal">Chat with us</p>
                  <p className="mt-1 font-body text-xs text-muted-foreground">
                    Quick replies during office hours
                  </p>
                </a>
              </li>

              <li>
                <Link
                  href="/contact-us"
                  className="flex h-full flex-col items-center rounded-xl border border-border bg-white p-6 text-center transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
                >
                  <span
                    aria-hidden="true"
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-earth-brown/10"
                  >
                    <MailCheck className="h-5 w-5 text-earth-brown" strokeWidth={1.75} />
                  </span>
                  <p className="mb-1 font-body text-xs font-semibold uppercase tracking-[0.15em] text-earth-brown/70">
                    Contact form
                  </p>
                  <p className="font-display text-lg font-medium text-charcoal">Send a message</p>
                  <p className="mt-1 font-body text-xs text-muted-foreground">
                    We reply within one business day
                  </p>
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </Section>
    </>
  );
}
