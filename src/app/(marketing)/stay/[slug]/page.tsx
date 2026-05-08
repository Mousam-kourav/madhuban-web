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

const SEO_OVERRIDES: Record<string, { title: string; description: string; keywords: string[] }> = {
  'safari-tent': {
    title: 'Safari Tent House Ratapani | Eco Luxury Safari Tent Near Bhopal',
    description: 'Experience eco-luxury in our safari tent house in Ratapani. Streamside views, open-sky shower, infinity pool, and premium amenities near Bhopal. Book your stay.',
    keywords: ['safari tent house ratapani', 'safari tent near bhopal', 'safari tent house price', 'safari tent house ratapani ticket price', 'madhuban eco retreat safari tent', 'family safari tent stay bhopal', 'ratapani jungle stay', 'eco safari tent mp'],
  },
  'mud-house-1': {
    title: 'Mud House Stay Ratapani | Eco Mud Cottage Near Bhopal',
    description: 'Stay in authentic mud houses inspired by Gond architecture. Orchard setting, 360° rooftop views, luxury amenities & eco-comfort near Bhopal. Book now.',
    keywords: ['mud house bhopal', 'Ratapani mud house price', 'mud house stay near bhopal', 'mud cottage mp', 'best mud house resort bhopal', 'madhuban mud house', 'Ratapani mud house booking', 'eco mud house stay'],
  },
  'pool-side-villa': {
    title: 'Pool Side Villa Ratapani | Luxury Pool Villa Stay Near Bhopal',
    description: 'Experience eco-luxury in our Pool Side Villa near Bhopal. Nature views, private comfort, infinity pool access, and boutique amenities. Book your stay today.',
    keywords: ['pool side villa near bhopal', 'private pool villa bhopal', 'pool villa ratapani', 'pool villa stay mp', 'pool villa in madhya pradesh', 'eco pool villa bhopal', 'madhuban pool villa', 'best pool villa bhopal'],
  },
  'glamping-tent': {
    title: 'Glamping Tent Stay Ratapani | Boutique Nature Stay Near Bhopal',
    description: 'Stay in stylish Glamping Tents near Bhopal. Private sit-out, nature views, AC rooms, infinity pool access & boutique comfort in Ratapani. Book now.',
    keywords: ['glamping tent near bhopal', 'glamping ratapani', 'nature glamping mp', 'glamping stay madhya pradesh', 'luxury tent stay bhopal', 'madhuban glamping tent', 'forest glamping stay ratapani'],
  },
  'camping-tent': {
    title: 'Camping in Ratapani | Night Camping Near Bhopal – ₹2500',
    description: 'Enjoy night camping in Ratapani at ₹2,500 per person. Includes food, pool, nature walk & adventure activities. Best jungle camping near Bhopal. Book now.',
    keywords: ['camping in ratapani', 'night camping ratapani price', 'camping near bhopal', 'jungle camping bhopal', 'best camping ratapani', 'tiger camping ratapani', 'night camping mp'],
  },
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

    const override = SEO_OVERRIDES[dbRoom.slug];
    return buildMetadata({
      title: dbRoom.seo_title ?? override?.title ?? dbRoom.name,
      description: dbRoom.seo_description ?? override?.description ?? dbRoom.description_short ?? '',
      path: `/stay/${dbRoom.slug}`,
      ogImage: `${R2_BASE}/home/rooms/${dbRoom.slug}-1-1280.jpg`,
      keywords: override?.keywords,
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
