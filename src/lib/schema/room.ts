import { BUSINESS } from '@/lib/content/business';
import type { Room } from '@/lib/content/rooms';

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';

/**
 * Generates HotelRoom schema for an individual accommodation page.
 * Use on each /stay/[slug] page alongside FAQPage and BreadcrumbList.
 *
 * @example
 * <Seo schemas={[hotelRoom(room), faqPage({ items: [...room.faqs] }), breadcrumbListFromPath(`/stay/${room.slug}`)]} />
 */
export function hotelRoom(room: Room): Record<string, unknown> {
  const url = `${BUSINESS.url}/stay/${room.slug}`;
  const images = [1, 2, 3].map(
    (n) => `${R2_BASE}/home/rooms/${room.slug}-${n}-1280.webp`,
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'HotelRoom',
    name: room.name,
    description: room.longDescription[0] ?? '',
    url,
    image: images,
    occupancy: {
      '@type': 'QuantitativeValue',
      minValue: 1,
      maxValue: room.occupancy.adults + room.occupancy.children,
    },
    amenityFeature: room.amenities.map((feature) => ({
      '@type': 'LocationFeatureSpecification',
      name: feature,
      value: true,
    })),
    offers: {
      '@type': 'Offer',
      price: room.pricePerNight,
      priceCurrency: 'INR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: room.pricePerNight,
        priceCurrency: 'INR',
        unitText: 'NIGHT',
        description: 'GST inclusive',
      },
    },
  };
}
