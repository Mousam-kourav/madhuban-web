import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { imageGallerySchema } from '@/lib/schema/imageGallery';
import { getPublishedGalleryItems } from '@/lib/gallery/queries';
import type { GalleryItemRow } from '@/lib/gallery/queries';
import { GalleryView } from '@/components/marketing/gallery/GalleryView';

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: 'Gallery',
  titleOverride: 'Madhuban Eco Gallery | Nature, Culture & Retreat Photo Collection',
  description:
    'Explore Madhuban Eco Retreat through our gallery — forest trails, safari tents, Aranyashala nature school, farm dining, and curated events near Ratapani, Bhopal.',
  path: '/gallery',
  keywords: [
    'madhuban eco retreat gallery',
    'ratapani nature gallery',
    'eco retreat photos bhopal',
    'aranyashala nature school images',
    'forest retreat gallery madhya pradesh',
    'ratapani wildlife photos',
    'madhuban dining images',
    'eco luxury resort gallery',
  ],
});

export default async function GalleryPage() {
  let items: GalleryItemRow[] = [];
  try {
    items = await getPublishedGalleryItems({ limit: 300 });
  } catch {
    // DB unavailable — render empty state
  }

  const imageItems = items.filter((i) => i.type === 'image').slice(0, 50);

  return (
    <>
      <Seo
        schemas={imageItems.length > 0
          ? [imageGallerySchema(imageItems.map((i) => ({
              url: i.r2_url,
              name: i.alt_text || i.filename,
              description: i.caption ?? undefined,
              width: i.width,
              height: i.height,
            })))]
          : []}
      />

      {/* Breadcrumb */}
      <div className="border-b border-[var(--color-border,#e5e0d8)] bg-[var(--color-cream,#faf7f2)]">
        <Container>
          <div className="py-3">
            <Breadcrumb pathname="/gallery" />
          </div>
        </Container>
      </div>

      {/* Hero */}
      <Section className="bg-[var(--color-cream,#faf7f2)] pb-8" label="Gallery hero">
        <Container>
          <Heading
            as="h1"
            text="Gallery"
            subheading="A visual journey through Madhuban — from ancient forest trails to curated retreat moments."
          />
        </Container>
      </Section>

      {/* Gallery Grid + Filter (client) */}
      <GalleryView items={items} />

      {/* CTA */}
      <Section className="bg-[var(--color-earth-brown)] text-white" label="Gallery CTA">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-display text-3xl md:text-4xl">
              Ready to experience this in person?
            </p>
            <p className="mt-4 font-body text-base text-white/80">
              Every image tells a story. Come write yours at Madhuban.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/stay"
                className="inline-flex h-11 items-center rounded-full bg-white px-8 font-body text-sm font-medium text-[var(--color-earth-brown)] transition-opacity hover:opacity-90"
              >
                Explore Stays
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex h-11 items-center rounded-full border border-white/40 px-8 font-body text-sm text-white transition-colors hover:bg-white/10"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
