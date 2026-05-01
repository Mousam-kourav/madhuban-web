import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { EXPERIENCES } from '@/lib/content/experiences';
import { faqPage, breadcrumbListFromPath } from '@/lib/schema';

export const metadata = buildMetadata({
  title: 'Experiences & Activities',
  description:
    'Explore guided forest walks, bird watching, and eco-friendly recreation at Madhuban Eco Retreat — 60 km from Bhopal in the Ratapani forest belt.',
  path: '/experiences',
});

const INDEX_FAQS = [
  {
    question: 'What experiences can I enjoy near Bhopal at Madhuban Eco Retreat?',
    answer:
      'You can enjoy guided forest walks, nature trails, bird watching, wilderness sessions, and eco-friendly recreational activities including cycling, indoor games, hammocks, and campfire evenings.',
  },
  {
    question: 'Are the forest walks safe for families and seniors?',
    answer:
      'Yes, all trails are guided, well-marked, and suitable for children, seniors, and beginners. No prior fitness or nature experience is needed.',
  },
  {
    question: 'What birds can I expect to see during bird watching?',
    answer:
      'You may spot species like the Indian paradise flycatcher, golden oriole, kingfisher, peacocks, drongos, woodpeckers, and several migratory birds — 70+ species total in the Ratapani forest.',
  },
  {
    question: 'Are the experiences part of eco-tourism in Ratapani?',
    answer:
      'Yes, every activity follows eco-friendly, low-impact practices aligned with responsible tourism and the conservation values of the Ratapani Tiger Reserve belt.',
  },
  {
    question: 'Do I need to pre-book the experiences?',
    answer:
      'Pre-booking is recommended for forest walks and bird watching to ensure guide availability. Recreational facilities are open to all guests during their stay.',
  },
  {
    question: 'Is Madhuban close to Satpura & Ratapani forest regions?',
    answer:
      'Yes, Madhuban is located in the Ratapani belt, adjacent to the Ratapani Tiger Reserve — part of MP\'s rich central Indian wilderness corridor, 60 km from Bhopal.',
  },
];

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';

// TODO (Phase 9b — BLOCKING for launch): Upload dedicated experiences index banner to R2.
// Expected path: ${R2_BASE}/experiences/banner/hero-{800,1280}.{webp,jpg}
// Source on old R2: pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/banner/
// Temporary fallback: using forest-walks card image (landscape-friendly) until banner is uploaded.
const HERO_IMAGE = {
  src: `${R2_BASE}/home/experiences/forest-walks-and-nature-trails-1280.webp`,
  alt: 'Guided forest walk through teak woodland at Madhuban Eco Retreat near Ratapani Tiger Reserve',
};

const collectionPageSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/experiences#collection-page`,
  name: 'Experiences at Madhuban Eco Retreat',
  description:
    'Guided forest walks, bird watching, and eco-friendly recreational activities in the Ratapani forest belt near Bhopal, Madhya Pradesh.',
  url: `${process.env.NEXT_PUBLIC_SITE_URL}/experiences`,
  provider: {
    '@type': 'LodgingBusiness',
    name: 'Madhuban Eco Retreat',
    url: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

const itemListSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Experiences at Madhuban Eco Retreat',
  numberOfItems: EXPERIENCES.length,
  itemListElement: EXPERIENCES.map((exp, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: exp.name,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}${exp.href}`,
    description: exp.description,
  })),
};

export default function ExperiencesPage() {
  return (
    <>
      <Seo
        schemas={[
          collectionPageSchema,
          itemListSchema,
          faqPage({ items: INDEX_FAQS }),
          breadcrumbListFromPath('/experiences'),
        ]}
      />

      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <section
        aria-label="Experiences hero"
        className="relative h-[75svh] min-h-[400px] overflow-hidden"
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
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <p className="mb-3 font-body text-xs uppercase tracking-[0.25em] text-ivory/80">
            Madhuban Eco Retreat
          </p>
          <h1 className="font-display text-4xl font-medium italic text-ivory md:text-6xl lg:text-7xl">
            Experience Life at Nature&#8217;s Rhythm
          </h1>
          <p className="mt-4 max-w-2xl font-body text-base text-ivory/90 md:text-lg">
            Explore mindful, eco-friendly experiences designed around forests, wildlife, and peaceful
            living near Bhopal
          </p>
        </div>
      </section>

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="bg-cream py-3">
        <Container>
          <Breadcrumb pathname="/experiences" />
        </Container>
      </div>

      {/* ── 2. Answer Block (AEO) ──────────────────────────────────────────── */}
      <section className="bg-cream py-14" aria-label="About our experiences">
        <Container>
          <p
            className="mx-auto max-w-3xl text-center font-body text-base leading-relaxed text-charcoal md:text-lg"
            data-speakable="true"
          >
            Madhuban Eco Retreat offers three immersive experiences — guided forest walks through
            Ratapani&#8217;s teak woodland, early-morning bird watching with 70+ species, and
            eco-friendly recreation for all ages. Every activity is led by trained naturalists and
            designed for low-impact, mindful exploration just 60 km from Bhopal.
          </p>
        </Container>
      </section>

      {/* ── 3. Experience Cards ─────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20" aria-label="All experiences">
        <Container>
          <Heading as="h2" text="Our Experiences" subheading="Inspired by Nature" />
          <p className="mt-4 max-w-2xl font-body text-base text-charcoal/80">
            Connect with nature, wildlife, and local culture through thoughtfully curated experiences
            that bring you closer to the soul of Madhya Pradesh.
          </p>

          <ul
            role="list"
            className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {EXPERIENCES.map((exp) => (
              <li key={exp.slug}>
                <article
                  aria-labelledby={`exp-${exp.slug}-title`}
                  className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-border bg-cream shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={exp.image.webp.tablet}
                      alt={exp.image.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3
                      id={`exp-${exp.slug}-title`}
                      className="font-display text-xl font-medium text-earth-brown"
                    >
                      {exp.name}
                    </h3>
                    <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-charcoal/80 line-clamp-4">
                      {exp.description}
                    </p>
                    <p className="mt-3 font-body text-xs text-muted">
                      <span className="font-medium text-charcoal">Ideal for:</span> {exp.idealFor}
                    </p>
                    <Link
                      href={exp.href}
                      className="mt-5 inline-flex items-center gap-1 font-body text-sm font-medium text-earth-brown transition hover:text-blush-dusk"
                    >
                      Explore {exp.name}
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── 4. FAQs ─────────────────────────────────────────────────────────── */}
      <section className="bg-warm-beige/20 py-16 md:py-20" aria-label="Frequently asked questions">
        <Container>
          <Heading as="h2" text="Frequently Asked Questions" subheading="Common questions answered" />
          <div className="mt-10 mx-auto max-w-3xl divide-y divide-border overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            {INDEX_FAQS.map((faq, i) => (
              <details key={i} className="group" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-body text-base font-medium text-charcoal transition hover:bg-cream [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown
                    className="h-4 w-4 flex-shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div
                  className="px-5 pb-4 font-body text-[15px] leading-relaxed text-charcoal/70"
                  data-speakable="true"
                >
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 5. CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-forest-green py-20 text-center md:py-24" aria-label="Book a stay">
        <Container>
          <p className="mb-2 font-body text-xs uppercase tracking-[0.2em] text-ivory/60">
            Madhuban Eco Retreat · 60 km from Bhopal
          </p>
          <h2 className="mb-4 font-display text-3xl font-medium italic text-ivory md:text-5xl">
            Ready to Experience the Wild?
          </h2>
          <p className="mx-auto mb-8 max-w-xl font-body text-base text-ivory/80">
            Book a stay at Madhuban and let the forest do the rest.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/enquire"
              className="inline-flex h-12 items-center justify-center rounded-md bg-ivory px-8 font-body text-sm font-medium text-earth-brown transition hover:bg-warm-beige"
            >
              Plan Your Retreat
            </Link>
            <a
              href="https://wa.me/919770558419?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20experiences%20at%20Madhuban%20Eco%20Retreat."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-md border border-ivory/50 px-8 font-body text-sm font-medium text-ivory transition hover:bg-ivory/10"
            >
              Chat on WhatsApp
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
