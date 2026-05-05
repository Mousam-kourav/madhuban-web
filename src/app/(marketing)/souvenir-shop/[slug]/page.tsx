import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { breadcrumbList } from '@/lib/schema/breadcrumb-list';
import { getSouvenirBySlug, getRelatedSouvenirs, getAllActiveSlugs } from '@/lib/souvenirs/queries';
import { getCategoryLabel } from '@/lib/souvenirs/categories';
import { ImageGallery } from './image-gallery';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllActiveSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getSouvenirBySlug(slug);
  if (!product) return {};
  return buildMetadata({
    title: product.name,
    description:
      product.shortDescription ??
      `${product.name} — available at Madhuban Eco Retreat souvenir shop near Ratapani.`,
    path: `/souvenir-shop/${slug}`,
    ogImage: product.coverImage ?? undefined,
  });
}

export default async function SouvenirDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, related] = await Promise.all([
    getSouvenirBySlug(slug),
    getSouvenirBySlug(slug).then((p) =>
      p ? getRelatedSouvenirs(slug, p.category, 4) : Promise.resolve([]),
    ),
  ]);

  if (!product) notFound();

  // Build image list for gallery
  const images = [
    product.coverImage ? { src: product.coverImage, alt: product.name } : null,
    product.detailImage2 ? { src: product.detailImage2, alt: `${product.name} — view 2` } : null,
    product.detailImage3 ? { src: product.detailImage3, alt: `${product.name} — view 3` } : null,
  ].filter((x): x is { src: string; alt: string } => x !== null);

  const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.madhubanecoretreat.com';

  // JSON-LD
  const productSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription ?? product.longDescription ?? undefined,
    image: images.map((i) => i.src),
    brand: { '@type': 'Brand', name: 'Madhuban Eco Retreat' },
    url: `${BASE_URL}/souvenir-shop/${product.slug}`,
    ...(product.showPrice && product.price != null
      ? {
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: `${BASE_URL}/souvenir-shop/${product.slug}`,
          },
        }
      : {}),
  };

  const breadcrumbSchema = breadcrumbList({
    items: [
      { name: 'Home', path: '/' },
      { name: 'Souvenir Shop', path: '/souvenir-shop' },
      { name: getCategoryLabel(product.category), path: `/souvenir-shop?category=${product.category}` },
      { name: product.name, path: `/souvenir-shop/${product.slug}` },
    ],
  });

  const waMsg = encodeURIComponent(
    `Hi Madhuban, I'm interested in ${product.name}. Can you share more details?`,
  );

  return (
    <>
      <Seo schemas={[productSchema, breadcrumbSchema]} />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-cream">
        <Container>
          <Breadcrumb
            items={[
              { name: 'Home', path: '/' },
              { name: 'Souvenir Shop', path: '/souvenir-shop' },
              { name: getCategoryLabel(product.category), path: `/souvenir-shop?category=${product.category}` },
              { name: product.name, path: `/souvenir-shop/${product.slug}` },
            ]}
          />
        </Container>
      </div>

      {/* Product detail */}
      <section aria-label={product.name} className="py-12 md:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            {/* Left: image gallery */}
            <ImageGallery images={images} productName={product.name} />

            {/* Right: product info */}
            <div>
              {/* Category badge */}
              <span className="inline-block rounded-full bg-earth-brown/10 px-3 py-1 font-body text-xs font-medium text-earth-brown">
                {getCategoryLabel(product.category)}
              </span>

              {/* Name */}
              <h1 className="mt-3 font-display text-4xl font-light text-charcoal md:text-5xl">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-4">
                {product.showPrice && product.price != null ? (
                  <p className="font-display text-3xl font-light text-earth-brown">
                    ₹{product.price.toLocaleString('en-IN')}
                  </p>
                ) : (
                  <p className="font-body text-base text-charcoal/60">Ask for price</p>
                )}
              </div>

              {/* Long description */}
              {product.longDescription && (
                <div className="mt-6 space-y-3">
                  {product.longDescription.split('\n\n').map((para, i) => (
                    <p key={i} className="font-body text-base leading-relaxed text-charcoal/80">
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {/* Artisan credit */}
              {product.artisanCredit && (
                <p className="mt-4 font-body text-sm italic text-charcoal/60">
                  Made by {product.artisanCredit}
                </p>
              )}

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/919770558419?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-earth-brown font-body text-sm font-semibold uppercase tracking-wider text-ivory transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
              >
                Inquire on WhatsApp
              </a>
              <p className="mt-3 text-center font-body text-xs text-charcoal/50">
                Or visit our shop on the property during your stay.
              </p>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-16 border-t border-border pt-12">
              <h2 className="mb-8 font-display text-2xl font-light text-charcoal">
                More from the Souvenir Shop
              </h2>
              <ul
                role="list"
                className="grid grid-cols-2 gap-5 md:grid-cols-4"
              >
                {related.map((rel) => (
                  <li key={rel.id}>
                    <Link
                      href={`/souvenir-shop/${rel.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:shadow-md"
                    >
                      <div className="relative aspect-square overflow-hidden bg-warm-beige/40">
                        {rel.coverImage ? (
                          <Image
                            src={rel.coverImage}
                            alt={rel.name}
                            fill
                            sizes="(max-width:768px) 50vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-charcoal/30 font-body text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-3">
                        <h3 className="font-display text-base font-light text-charcoal line-clamp-2">
                          {rel.name}
                        </h3>
                        <p className="mt-auto pt-2 font-body text-sm font-semibold text-earth-brown">
                          {rel.showPrice && rel.price != null
                            ? `₹${rel.price.toLocaleString('en-IN')}`
                            : 'Ask for price'}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
