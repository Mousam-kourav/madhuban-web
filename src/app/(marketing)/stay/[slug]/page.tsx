import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ROOMS } from '@/lib/content/rooms';
import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { hotelRoom } from '@/lib/schema/room';
import { faqPage } from '@/lib/schema/faq-page';
import { breadcrumbListFromPath } from '@/lib/schema/breadcrumb-list';
import { RoomDetailPage } from '@/components/marketing/room-detail/room-detail-page';
import { MobileStickyBar } from '@/components/marketing/room-detail/mobile-sticky-bar';

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';

export function generateStaticParams() {
  return ROOMS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = ROOMS.find((room) => room.slug === slug);
  if (!r) return {};

  return buildMetadata({
    title: r.name,
    description: r.longDescription[0]?.slice(0, 155) ?? '',
    path: `/stay/${r.slug}`,
    ogImage: `${R2_BASE}/home/rooms/${r.slug}-1-1280.jpg`,
  });
}

export default async function StayDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = ROOMS.find((room) => room.slug === slug);
  if (!r) notFound();

  return (
    <>
      <Seo
        schemas={[
          hotelRoom(r),
          faqPage({ items: [...r.faqs] }),
          breadcrumbListFromPath(`/stay/${r.slug}`),
        ]}
      />
      <RoomDetailPage room={r} />
      <MobileStickyBar pricePerNight={r.pricePerNight} slug={r.slug} />
    </>
  );
}
