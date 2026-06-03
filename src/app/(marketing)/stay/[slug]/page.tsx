import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getRoomBySlug, getRoomFaqs, getAllRoomSlugs } from '@/lib/rooms/queries';
import { dbRoomToRoom } from '@/lib/rooms/mapper';
import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { hotelRoom } from '@/lib/schema/room';
import { faqPage } from '@/lib/schema/faq-page';
import { RoomDetailPage } from '@/components/marketing/room-detail/room-detail-page';
import { MobileStickyBar } from '@/components/marketing/room-detail/mobile-sticky-bar';

export const revalidate = 60;

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';

// Rooms with curated 1200x630 OG images at og/{slug}-1200x630.jpg (Phase 12.E.2).
// Other rooms fall back to the standard room hero crop.
const CURATED_OG_ROOMS = new Set(['safari-tent', 'mud-house-1', 'pool-side-villa']);

const ROOM_OG_ALT: Record<string, string> = {
  'safari-tent': 'Madhuban Eco Retreat safari tent with private veranda overlooking the forest',
  'mud-house-1': 'Gond-inspired mud house bedroom at Madhuban Eco Retreat with terracotta walls',
  'pool-side-villa': 'Pool-side villa exterior at Madhuban Eco Retreat with infinity pool',
};

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

    const ogImage = CURATED_OG_ROOMS.has(dbRoom.slug)
      ? `${R2_BASE}/og/${dbRoom.slug}-1200x630.jpg`
      : `${R2_BASE}/home/rooms/${dbRoom.slug}-1-1280.jpg`;

    return buildMetadata({
      title: dbRoom.seo_title ?? dbRoom.name,
      description: dbRoom.seo_description ?? dbRoom.description_short ?? '',
      path: `/stay/${dbRoom.slug}`,
      ogImage,
      ogImageAlt: ROOM_OG_ALT[dbRoom.slug],
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
        ]}
      />
      <RoomDetailPage room={r} />
      <MobileStickyBar pricePerNight={r.pricePerNight} slug={r.slug} />
    </>
  );
}
