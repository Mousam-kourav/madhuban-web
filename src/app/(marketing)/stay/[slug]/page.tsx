import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getRoomBySlug, getRoomFaqs, getAllRoomSlugs } from '@/lib/rooms/queries';
import { dbRoomToRoom } from '@/lib/rooms/mapper';
import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { hotelRoom } from '@/lib/schema/room';
import { faqPage } from '@/lib/schema/faq-page';
import { breadcrumbListFromPath } from '@/lib/schema/breadcrumb-list';
import { RoomDetailPage } from '@/components/marketing/room-detail/room-detail-page';
import { MobileStickyBar } from '@/components/marketing/room-detail/mobile-sticky-bar';

export const revalidate = 60;

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';

export async function generateStaticParams() {
  try {
    const slugs = await getAllRoomSlugs();
    return slugs.map((slug) => ({ slug }));
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
  try {
    const dbRoom = await getRoomBySlug(slug);
    if (!dbRoom) return {};

    return buildMetadata({
      title: dbRoom.seo_title ?? dbRoom.name,
      description: dbRoom.seo_description ?? dbRoom.description_short ?? '',
      path: `/stay/${dbRoom.slug}`,
      ogImage: `${R2_BASE}/home/rooms/${dbRoom.slug}-1-1280.jpg`,
    });
  } catch {
    return {};
  }
}

export default async function StayDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let dbRoom;
  let dbFaqs;
  try {
    dbRoom = await getRoomBySlug(slug);
    if (!dbRoom) notFound();
    dbFaqs = await getRoomFaqs(dbRoom.id);
  } catch {
    notFound();
  }

  const r = dbRoomToRoom(dbRoom, dbFaqs);

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
