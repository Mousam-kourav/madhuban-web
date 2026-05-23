import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { nearbyAttractionSchema } from '@/lib/schema/nearby-attraction';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { R2_BASE } from '@/lib/r2';
import { ATTRACTIONS, getAttractionBySlug, getOtherAttractions } from '@/lib/attractions/data';
import { ClosingCta } from '../page';

export async function generateStaticParams() {
  try {
    return ATTRACTIONS.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const attraction = getAttractionBySlug(slug);
  if (!attraction) return {};

  const description = (attraction.intro[0] ?? '').slice(0, 155).trimEnd() + '…';

  return buildMetadata({
    title: `${attraction.name} | Nearby Attractions`,
    description,
    path: `/nearby-attractions/${slug}`,
    ogImage: `${R2_BASE}/attractions/${slug}/hero.webp`,
  });
}

export default async function AttractionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const attraction = getAttractionBySlug(slug);
  if (!attraction) notFound();

  const heroUrl = `${R2_BASE}/attractions/${attraction.slug}/hero.webp`;
  const cardImage = (s: string) => `${R2_BASE}/attractions/${s}/card.webp`;

  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Nearby Attractions', path: '/nearby-attractions' },
    { name: attraction.shortName ?? attraction.name, path: `/nearby-attractions/${attraction.slug}` },
  ];

  const others = getOtherAttractions(attraction.slug, 3);

  return (
    <>
      <Seo
        schemas={nearbyAttractionSchema({
          slug: attraction.slug,
          name: attraction.name,
          description: (attraction.intro[0] ?? '').slice(0, 155),
          heroImageUrl: heroUrl,
          tags: attraction.tags,
          geo: attraction.geo,
          breadcrumbs: breadcrumbItems,
        })}
      />

      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
      <div className="bg-cream px-4 pt-6 pb-2">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* ── Hero image ───────────────────────────────────────────────────── */}
      <section className="relative h-[50vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        <Image
          src={heroUrl}
          alt={attraction.imageAlt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl w-full mx-auto px-4 pb-10 md:pb-16">
            <p className="text-xs uppercase tracking-[0.2em] font-body font-medium text-gold-accent mb-3">
              {attraction.tags.join(' · ')}
            </p>
            <h1 className="text-4xl md:text-7xl font-display font-light text-cream leading-tight mb-4 break-words">
              {attraction.name}
            </h1>
            <p className="max-w-2xl text-lg md:text-xl font-body text-cream/90">
              {attraction.heroSubhead}
            </p>
          </div>
        </div>
      </section>

      {/* ── Quick facts bar ──────────────────────────────────────────────── */}
      <section aria-label="Quick facts" className="bg-warm-beige/40 py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
          {attraction.quickFacts.map((fact, i) => (
            <div
              key={fact.label}
              className={`text-center ${i > 0 ? 'md:border-l md:border-warm-beige' : ''}`}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-earth-brown/70 font-body">
                {fact.label}
              </p>
              <p className="text-lg md:text-xl font-display text-charcoal mt-1">{fact.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Intro + Key Facts ────────────────────────────────────────────── */}
      <section className="bg-cream py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Prose */}
          <div className="lg:col-span-2 space-y-6 text-base md:text-lg font-body text-earth-brown leading-relaxed">
            {attraction.intro.map((paragraph, i) => (
              <p key={i}>
                {i === 0 ? (
                  <>
                    <span
                      className="float-left font-display text-7xl font-light leading-none text-gold-accent mr-3 mt-1"
                      aria-hidden="true"
                    >
                      {paragraph.charAt(0)}
                    </span>
                    {paragraph.slice(1)}
                  </>
                ) : (
                  paragraph
                )}
              </p>
            ))}
          </div>

          {/* Key Facts card */}
          <aside
            aria-label="Key facts"
            className="lg:col-span-1 lg:sticky lg:top-24 self-start bg-ivory border border-warm-beige rounded-2xl p-8"
          >
            <p className="text-xs uppercase tracking-[0.2em] font-body font-medium text-gold-accent mb-6">
              Key Facts
            </p>
            <dl className="space-y-0">
              {attraction.keyFacts.map((fact, i) => (
                <div
                  key={fact.label}
                  className={`py-3 ${i > 0 ? 'border-t border-warm-beige/50' : ''}`}
                >
                  <dt className="text-xs uppercase tracking-[0.15em] text-earth-brown/70 font-body">
                    {fact.label}
                  </dt>
                  <dd className="text-base font-body text-charcoal mt-1">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* ── Content sections ─────────────────────────────────────────────── */}
      <div className="bg-cream px-4 pb-16 md:pb-20">
        <div className="max-w-3xl mx-auto space-y-16">

          {/* Section divider */}
          <SectionDivider />

          {/* What to See and Do */}
          <ContentSection
            eyebrow="What to Expect"
            heading="What You'll See and Do"
          >
            <ul className="space-y-3">
              {attraction.whatToSeeAndDo.map((item) => (
                <li key={item} className="flex gap-3 text-base md:text-lg font-body text-earth-brown leading-relaxed">
                  <span className="text-gold-accent font-display text-lg leading-relaxed mt-0.5 shrink-0" aria-hidden="true">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ContentSection>

          <SectionDivider />

          {/* How to Get There */}
          <ContentSection
            eyebrow="Reaching the Site"
            heading="How to Get There from Madhuban"
          >
            <p className="text-base md:text-lg font-body text-earth-brown leading-relaxed">
              {attraction.howToGetThere}
            </p>
          </ContentSection>

          <SectionDivider />

          {/* Best Time to Visit */}
          <ContentSection
            eyebrow="Timing Your Visit"
            heading="Best Time to Visit"
          >
            <p className="text-base md:text-lg font-body text-earth-brown leading-relaxed">
              {attraction.bestTimeToVisit}
            </p>
          </ContentSection>

          <SectionDivider />

          {/* Good to Know */}
          <ContentSection
            eyebrow="Practical Notes"
            heading="Good to Know"
          >
            <ul className="space-y-3">
              {attraction.goodToKnow.map((item) => (
                <li key={item} className="flex gap-3 text-base md:text-lg font-body text-earth-brown leading-relaxed">
                  <span className="text-gold-accent font-display text-lg leading-relaxed mt-0.5 shrink-0" aria-hidden="true">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ContentSection>
        </div>
      </div>

      {/* ── Continue Exploring ───────────────────────────────────────────── */}
      {others.length > 0 && (
        <section aria-labelledby="continue-heading" className="bg-warm-beige/20 py-20 md:py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs uppercase tracking-[0.2em] font-body font-medium text-gold-accent mb-3 text-center">
              Continue Exploring
            </p>
            <h2
              id="continue-heading"
              className="text-3xl md:text-4xl font-display font-light text-charcoal text-center mb-12"
            >
              More Places Worth the Trip
            </h2>
            <ul role="list" className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/nearby-attractions/${other.slug}`}
                    className="group block hover:-translate-y-1 transition-transform duration-200"
                    aria-label={`Explore ${other.name}`}
                  >
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                      <Image
                        src={cardImage(other.slug)}
                        alt={other.imageAlt}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-4 right-4 bg-charcoal/80 text-ivory text-xs uppercase tracking-wider rounded-full px-3 py-1.5">
                        <span className="sr-only">Distance: </span>
                        {other.distanceBadge}
                      </div>
                    </div>
                    <div className="pt-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gold-accent font-medium font-body">
                        {other.tags.join(' · ')}
                      </p>
                      <h3 className="text-xl font-display font-medium text-charcoal mt-1 group-hover:text-forest-green transition-colors duration-200">
                        {other.name}
                      </h3>
                      <span className="inline-flex items-center gap-2 mt-3 text-sm font-body uppercase tracking-[0.15em] text-forest-green">
                        Explore{' '}
                        <ArrowRight
                          className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <ClosingCta />
    </>
  );
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center" aria-hidden="true">
      <div className="size-2 bg-gold-accent rotate-45" />
    </div>
  );
}

function ContentSection({
  eyebrow,
  heading,
  children,
}: {
  eyebrow: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] font-body font-medium text-gold-accent mb-2">
        {eyebrow}
      </p>
      <h2 className="text-3xl md:text-4xl font-display font-light text-charcoal mb-6">{heading}</h2>
      {children}
    </div>
  );
}
