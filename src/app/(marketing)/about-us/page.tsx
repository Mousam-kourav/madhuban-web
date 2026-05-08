import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { breadcrumbListFromPath } from '@/lib/schema';
import { BUSINESS } from '@/lib/content/business';
import { ChevronDown } from 'lucide-react';

export const metadata: Metadata = buildMetadata({
  title: 'About Us',
  titleOverride: 'About Madhuban Eco Retreat – Best Eco Resort Near Bhopal & Ratapani',
  description:
    'Discover Madhuban Eco Retreat near Bhopal—an eco-friendly jungle resort promoting slow tourism, sustainability, and meaningful nature-based experiences in Ratapani.',
  path: '/about-us',
  keywords: [
    'best resorts near ratapani',
    'jungle resort near bhopal',
    'eco tourism',
    'slow tourism',
    'detox retreat bhopal',
    'sustainable tourism india',
    'eco lodge near ratapani',
    'weekend getaway bhopal',
    'nature resort bhopal',
    'madhuban eco retreat',
  ],
});

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';

const IMAGES = {
  hero: {
    src800: `${R2_BASE}/home/about/hero-800.webp`,
    src1280: `${R2_BASE}/home/about/hero-1280.webp`,
    alt: 'Outdoor adventure activities at Madhuban Eco Retreat near Bhopal — guests exploring nature trails in the Ratapani forest',
  },
  story: {
    src800: `${R2_BASE}/home/about/story-800.webp`,
    src1280: `${R2_BASE}/home/about/story-1280.webp`,
    alt: 'Mud house accommodation at Madhuban Eco Retreat, built with traditional rammed-earth craft near Ratapani Wildlife Sanctuary',
  },
  eco: {
    src800: `${R2_BASE}/home/about/eco-800.webp`,
    src1280: `${R2_BASE}/home/about/eco-1280.webp`,
    alt: 'Farm-to-table dining at Madhuban Eco Retreat — organic, locally sourced meals served in a natural open-air setting',
  },
  founder: {
    src800: `${R2_BASE}/home/about/founder-800.webp`,
    src1280: `${R2_BASE}/home/about/founder-1280.webp`,
    alt: 'Guests on a jungle safari jeep at Madhuban Eco Retreat near Ratapani Tiger Reserve, Madhya Pradesh',
  },
};

const CORE_VALUES = [
  {
    title: 'Sustainability',
    body: 'Planet-first decision-making from construction to cuisine. Every choice — from building material to plate — is weighed against its ecological cost.',
  },
  {
    title: 'Community',
    body: 'Hand-in-hand collaboration with local artisans, farmers, and tribal communities of Sehore district. We exist because of this land and its people.',
  },
  {
    title: 'Simplicity',
    body: 'The most profound experiences often come from the simplest moments — a forest dawn, a wood-fire meal, an unplanned conversation under the stars.',
  },
  {
    title: 'Authenticity',
    body: 'Genuineness in food, architecture, and shared stories. Nothing is staged. The mud is real. The birdsong is real. The stillness is real.',
  },
  {
    title: 'Learning',
    body: 'Every guest leaves knowing a little more about forests, food, and slow living. Participate in organic farming, birdwatching, and cultural exchange.',
  },
] as const;

const ABOUT_FAQS = [
  {
    question: 'What is Madhuban Eco Retreat?',
    answer:
      'Madhuban Eco Retreat is a 20-acre regenerative forest resort located adjacent to the Ratapani Tiger Reserve, 60 km from Bhopal, Madhya Pradesh. It is a Somaiya Group initiative — their first hospitality venture — built around nature-based eco-tourism, community empowerment, and sustainable living.',
  },
  {
    question: 'Who owns and manages Madhuban Eco Retreat?',
    answer:
      'Madhuban is a Somaiya Group initiative. The Somaiya Group is an 80-year-old corporate group with expertise in education, healthcare, agriculture, social development, and sustainability across India. The property is managed on-ground by Shibajee and a team of local naturalists and hospitality staff.',
  },
  {
    question: 'What makes Madhuban eco-friendly?',
    answer:
      'Madhuban was built on 20 acres of previously barren, degraded land — and the retreat has actively regenerated it. Practices include efficient waste management, recycling, sustainable building materials, local sourcing of staff and ingredients, reduced carbon footprint operations, and responsible tourism principles that protect local biodiversity.',
  },
  {
    question: 'Is Madhuban suitable for families with children?',
    answer:
      'Yes. Madhuban welcomes families, solo travellers, couples, artists, researchers, nature lovers, and spiritual seekers. Guided forest walks are suitable for children and seniors. There are no age restrictions on any experience.',
  },
  {
    question: 'How far is Madhuban from Bhopal?',
    answer:
      'Madhuban Eco Retreat is approximately 60 km from Bhopal city. It sits near Rehti, Sehore district, on the edge of the Ratapani Wildlife Sanctuary. The drive takes roughly 1.5–2 hours depending on traffic and route.',
  },
] as const;

const aboutPageSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Madhuban Eco Retreat',
  url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/about-us`,
  description:
    'Madhuban Eco Retreat is a 20-acre regenerative forest retreat near Ratapani Tiger Reserve, 60 km from Bhopal — a Somaiya Group initiative where sustainability meets hospitality.',
  about: {
    '@type': 'LodgingBusiness',
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? '',
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.streetAddress,
      addressLocality: BUSINESS.address.locality,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    sameAs: [...BUSINESS.sameAs],
    description:
      'A 20-acre regenerative eco-luxury forest retreat adjacent to Ratapani Tiger Reserve, 60 km from Bhopal. A Somaiya Group initiative combining sustainable hospitality with community empowerment.',
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Forest Walks', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Bird Watching', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Swimming Pool', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Farm-to-Table Dining', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Campfire', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Eco-friendly Operations', value: true },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <Seo schemas={[aboutPageSchema, breadcrumbListFromPath('/about-us')]} />

      {/* ── 1. Hero ──────────────────────────────────────────────────────────── */}
      <section
        aria-label="About Madhuban hero"
        className="relative h-[75svh] min-h-[400px] overflow-hidden"
      >
        <Image
          src={IMAGES.hero.src1280}
          alt={IMAGES.hero.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/65"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <p className="mb-3 font-body text-xs uppercase tracking-[0.25em] text-ivory/80">
            Madhuban Eco Retreat · A Somaiya Group Initiative
          </p>
          <h1 className="font-display text-4xl font-medium italic text-ivory md:text-6xl lg:text-7xl">
            Where Sustainability<br className="hidden lg:block" /> Meets Hospitality
          </h1>
          <p className="mt-4 max-w-2xl font-body text-base text-ivory/90 md:text-lg">
            A regenerative forest retreat on 20 acres near Ratapani Tiger Reserve, 60&nbsp;km from Bhopal
          </p>
        </div>
      </section>

      {/* ── Breadcrumb ───────────────────────────────────────────────────────── */}
      <div className="bg-cream py-3">
        <Container>
          <Breadcrumb pathname="/about-us" />
        </Container>
      </div>

      {/* ── 2. Answer Block (AEO) ────────────────────────────────────────────── */}
      <Section className="bg-cream py-14" label="About Madhuban Eco Retreat">
        <Container>
          <p
            className="mx-auto max-w-3xl text-center font-body text-base leading-relaxed text-charcoal md:text-lg"
            data-speakable="true"
          >
            Madhuban Eco Retreat is a 20-acre regenerative forest destination adjacent to Ratapani
            Tiger Reserve, 60&nbsp;km from Bhopal, Madhya Pradesh. A&nbsp;Somaiya Group initiative,
            Madhuban combines rustic, earth-rooted comfort with meaningful eco-tourism — welcoming
            families, solo travellers, nature lovers, and anyone seeking a genuine forest escape.
          </p>
        </Container>
      </Section>

      {/* ── 3. Our Story ─────────────────────────────────────────────────────── */}
      <Section className="bg-white" label="The Madhuban story">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

            {/* Text */}
            <div>
              <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-earth-brown/70">
                Our Story
              </p>
              <h2 className="font-display text-3xl font-medium leading-tight text-charcoal md:text-4xl">
                Born from Barren Land,<br className="hidden md:block" /> Grown into Forest
              </h2>
              <div
                aria-hidden="true"
                className="my-5 flex items-center gap-3"
              >
                <span className="block h-px w-8 bg-earth-brown" />
                <span className="block size-1.5 rotate-45 bg-earth-brown" />
                <span className="block h-px w-8 bg-earth-brown" />
              </div>
              <div className="space-y-4 font-body text-base leading-relaxed text-charcoal/80">
                <p>
                  Madhuban Eco Retreat was born from a deeply personal realisation — that modern
                  life had drifted far from nature, and the consequences were showing in how we
                  lived, worked, and felt.
                </p>
                <p>
                  The <strong className="text-charcoal">Somaiya Group</strong> — an 80-year-old
                  organisation with roots in education, healthcare, agriculture, and sustainability
                  — chose to answer that call. This is their first hospitality venture, and it
                  reflects everything they stand for: community, responsibility, and the long view.
                </p>
                <p>
                  What was once 20 acres of barren, degraded land near Ratapani is now a living
                  forest retreat, home to over 70 bird species, a productive organic kitchen garden,
                  and a team drawn almost entirely from surrounding villages.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] shadow-md lg:aspect-[3/4]">
              <Image
                src={IMAGES.story.src1280}
                alt={IMAGES.story.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 4. Eco Philosophy ────────────────────────────────────────────────── */}
      <Section className="bg-warm-beige/20" label="Eco philosophy">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

            {/* Image — left on desktop */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] shadow-md lg:order-1">
              <Image
                src={IMAGES.eco.src1280}
                alt={IMAGES.eco.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Text — right on desktop */}
            <div className="lg:order-2">
              <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-earth-brown/70">
                Eco Philosophy
              </p>
              <h2 className="font-display text-3xl font-medium leading-tight text-charcoal md:text-4xl">
                Live Lightly.<br className="hidden md:block" /> Protect Consciously.<br className="hidden md:block" /> Give Back Continuously.
              </h2>
              <div
                aria-hidden="true"
                className="my-5 flex items-center gap-3"
              >
                <span className="block h-px w-8 bg-earth-brown" />
                <span className="block size-1.5 rotate-45 bg-earth-brown" />
                <span className="block h-px w-8 bg-earth-brown" />
              </div>
              <div className="space-y-4 font-body text-base leading-relaxed text-charcoal/80">
                <p>
                  Eco-living at Madhuban is not a concept — it is a daily practice that shapes
                  how we grow, serve, and sustain.
                </p>
                <ul className="space-y-2">
                  {[
                    'Efficient waste management and active composting',
                    'Sustainable building materials; zero plastic policy in operations',
                    'Local sourcing of staff, produce, and materials from Sehore district',
                    'Reduced carbon footprint through conscious energy use',
                    'Responsible tourism practices that protect local biodiversity',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 block size-1.5 shrink-0 rotate-45 bg-earth-brown" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 5. Vision & Mission ──────────────────────────────────────────────── */}
      <Section className="bg-white" label="Vision and mission">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

            {/* Text */}
            <div>
              <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-earth-brown/70">
                Vision &amp; Mission
              </p>
              <h2 className="font-display text-3xl font-medium leading-tight text-charcoal md:text-4xl">
                Travel That Gives Back
              </h2>
              <div
                aria-hidden="true"
                className="my-5 flex items-center gap-3"
              >
                <span className="block h-px w-8 bg-earth-brown" />
                <span className="block size-1.5 rotate-45 bg-earth-brown" />
                <span className="block h-px w-8 bg-earth-brown" />
              </div>

              <div className="mb-6 space-y-3 font-body text-base leading-relaxed text-charcoal/80">
                <p className="font-medium text-charcoal">Our Vision</p>
                <p>
                  To become India&apos;s leading eco-luxury destination in the Ratapani belt —
                  where guests rediscover the joy of simple living, reconnect with nature, and
                  leave with a renewed sense of well-being.
                </p>
              </div>

              <div className="space-y-3 font-body text-base leading-relaxed text-charcoal/80">
                <p className="font-medium text-charcoal">Our Mission</p>
                <ul className="space-y-2">
                  {[
                    'Sustainable, eco-conscious accommodation',
                    'Organic, farm-to-table food from local produce',
                    'Nature-based activities: forest walks, meditation, yoga, cultural immersion',
                    'Strong local community partnerships',
                    'Experiences promoting mental clarity, wellness, and slow living',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 block size-1.5 shrink-0 rotate-45 bg-earth-brown" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] shadow-md">
              <Image
                src={IMAGES.founder.src1280}
                alt={IMAGES.founder.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 6. Core Values ───────────────────────────────────────────────────── */}
      <Section className="bg-cream" label="Core values">
        <Container>
          <Heading
            as="h2"
            text="Our Core Values"
            subheading="What we stand for at Madhuban"
            className="mb-12"
          />
          <ul
            role="list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {CORE_VALUES.map((value) => (
              <li key={value.title}>
                <article className="h-full rounded-[16px] border border-border bg-white p-6 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="block size-1.5 rotate-45 bg-earth-brown" aria-hidden="true" />
                    <h3 className="font-display text-xl font-medium text-earth-brown">
                      {value.title}
                    </h3>
                  </div>
                  <p className="font-body text-sm leading-relaxed text-charcoal/75">
                    {value.body}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── 7. FAQs ──────────────────────────────────────────────────────────── */}
      <Section className="bg-warm-beige/20" label="Frequently asked questions about Madhuban">
        <Container>
          <Heading
            as="h2"
            text="About Madhuban — FAQs"
            subheading="Common questions answered"
            className="mb-10"
          />
          <div className="mx-auto max-w-3xl divide-y divide-border overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            {ABOUT_FAQS.map((faq, i) => (
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
      </Section>

      {/* ── 8. CTA (forest-green, mirrors experiences/page.tsx pattern) ──────── */}
      <section className="bg-forest-green py-20 text-center md:py-24" aria-label="Plan your retreat">
        <Container>
          <p className="mb-2 font-body text-xs uppercase tracking-[0.2em] text-ivory/60">
            Madhuban Eco Retreat · 60&nbsp;km from Bhopal
          </p>
          <h2 className="mb-4 font-display text-3xl font-medium italic text-ivory md:text-5xl">
            Ready to Experience Slow Living?
          </h2>
          <p className="mx-auto mb-8 max-w-xl font-body text-base text-ivory/80">
            Come stay in the forest. Meet the birds. Eat from the garden. Leave lighter than you arrived.
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
      </section>
    </>
  );
}
