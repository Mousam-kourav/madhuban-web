import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { breadcrumbListFromPath } from '@/lib/schema/breadcrumb-list';
import { getActiveSouvenirs } from '@/lib/souvenirs/queries';
import { getCategoryLabel } from '@/lib/souvenirs/categories';
import { FilterBar } from './filter-bar';

const R2 = process.env.NEXT_PUBLIC_R2_BASE ?? '';

export const metadata: Metadata = buildMetadata({
  titleOverride: 'The Shop — Handicrafts & Souvenirs at Madhuban',
  title: 'The Shop',
  description:
    'Hand-crafted objects from the artisans of central India, available at Madhuban Eco Retreat. Tribal craft, Gond art, forest-sourced items.',
  path: '/souvenir-shop',
  ogImage: `${R2}/souvenir-shop/hero-1280.webp`,
  keywords: [
    'madhuban souvenir shop',
    'tribal handicrafts bhopal',
    'local crafts ratapani',
    'eco retreat gift shop',
    'regional food spices madhya pradesh',
    'souvenirs near bhopal',
  ],
});

const collectionSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Souvenir Shop — Madhuban Eco Retreat',
  description:
    "Browse Madhuban's curated souvenir shop — local handicrafts, books, regional food & spices, wellness products from artisans near Ratapani.",
  url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.madhubanecoretreat.com'}/souvenir-shop`,
};

export default async function SouvenirShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const activeCategory = category ?? 'all';
  const query = q ?? '';

  const souvenirs = await getActiveSouvenirs({
    category: activeCategory !== 'all' ? activeCategory : undefined,
    q: query || undefined,
  });

  const breadcrumbSchema = breadcrumbListFromPath('/souvenir-shop');

  return (
    <>
      <Seo schemas={[collectionSchema, breadcrumbSchema]} />

      {/* ── Section 1: Brand panel hero ──────────────────────────────────── */}
      <section
        aria-label="Souvenir Shop hero"
        className="relative flex min-h-[45svh] flex-col items-center justify-end pb-12 text-center md:min-h-[52svh]"
      >
        <Image
          src={`${R2}/souvenir-shop/hero-1280.webp`}
          alt="Madhuban Eco Retreat souvenir shop interior"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-charcoal/25 to-transparent" />
        <Container className="relative z-10">
          <p className="mb-2 font-body text-xs font-semibold uppercase tracking-[0.2em] text-ivory/80">
            Madhuban Eco Retreat
          </p>
          <h1 className="font-display text-4xl font-light text-ivory md:text-6xl">
            The shop
          </h1>
          <p className="mx-auto mt-3 max-w-lg font-body text-sm text-ivory/85 md:text-base">
            Hand-crafted objects from the artisans of central India. Sourced, supported, sold
            without markup.
          </p>
        </Container>
      </section>

      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-cream">
        <Container>
          <Breadcrumb pathname="/souvenir-shop" />
        </Container>
      </div>

      {/* ── Section 2: Filter + Search (sticky) ──────────────────────────── */}
      <div className="sticky top-0 z-20 border-b border-border bg-cream/95 py-4 backdrop-blur-sm">
        <Container>
          <FilterBar activeCategory={activeCategory} query={query} />
        </Container>
      </div>

      {/* ── Section 3: Product grid ───────────────────────────────────────── */}
      <section aria-label="Product listing" className="py-12 md:py-16">
        <Container>
          {souvenirs.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-body text-base text-charcoal/60">
                No products match your filters.
              </p>
              <Link
                href="/souvenir-shop"
                className="mt-4 inline-block font-body text-sm font-medium text-earth-brown underline underline-offset-4"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <ul
              role="list"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {souvenirs.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/souvenir-shop/${s.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:shadow-md"
                  >
                    {/* Cover image */}
                    <div className="relative aspect-square overflow-hidden bg-warm-beige/40">
                      {s.coverImage ? (
                        <Image
                          src={s.coverImage}
                          alt={s.name}
                          fill
                          sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-charcoal/30 font-body text-xs">
                          No image
                        </div>
                      )}
                      <span className="absolute left-2 top-2 rounded-full bg-earth-brown/90 px-2 py-0.5 font-body text-xs font-medium text-ivory">
                        {getCategoryLabel(s.category)}
                      </span>
                    </div>

                    {/* Card info */}
                    <div className="flex flex-1 flex-col p-4">
                      <h2 className="font-display text-lg font-light text-charcoal line-clamp-2">
                        {s.name}
                      </h2>
                      {s.shortDescription && (
                        <p className="mt-1 font-body text-xs text-charcoal/65 line-clamp-2">
                          {s.shortDescription}
                        </p>
                      )}
                      <p className="mt-auto pt-3 font-body text-sm font-semibold text-earth-brown">
                        {s.showPrice && s.price != null
                          ? `₹${s.price.toLocaleString('en-IN')}`
                          : 'Ask for price'}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      {/* ── Section 4: Footer hint ────────────────────────────────────────── */}
      <div className="border-t border-border bg-cream py-8 text-center">
        <Container>
          <p className="mx-auto max-w-lg font-body text-sm text-charcoal/60">
            Visit the shop in person at Madhuban, or WhatsApp us about any item to arrange purchase
            or shipping.{' '}
            <a
              href="https://wa.me/919770558419"
              className="font-medium text-earth-brown underline underline-offset-4 hover:text-charcoal"
              target="_blank"
              rel="noopener noreferrer"
            >
              +91 9770558419
            </a>
          </p>
        </Container>
      </div>
    </>
  );
}
