import { BUSINESS } from '@/lib/content/business';

interface RoomInput {
  name: string;
  description: string;
  /** Full URL path, e.g. '/stay/safari-tent'. Base URL is prepended. */
  path: string;
  /** GST-inclusive nightly rate in INR. */
  pricePerNight: number;
  maxOccupancy?: number;
  amenities?: string[];
  /** Full image URL. */
  image?: string;
}

/**
 * Generates HotelRoom schema for an individual accommodation page.
 * Use on each /stay/[slug] page alongside LodgingBusiness and FAQPage.
 *
 * @example
 * <Seo schemas={[room({ name: 'Safari Tent', path: '/stay/safari-tent', pricePerNight: 5000, ... })]} />
 */
export function room({
  name,
  description,
  path,
  pricePerNight,
  maxOccupancy = 2,
  amenities = [],
  image,
}: RoomInput): Record<string, unknown> {
  const url = `${BUSINESS.url}${path}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'HotelRoom',
    name,
    description,
    url,
    ...(image && { image }),
    occupancy: {
      '@type': 'QuantitativeValue',
      minValue: 1,
      maxValue: maxOccupancy,
    },
    amenityFeature: amenities.map((feature) => ({
      '@type': 'LocationFeatureSpecification',
      name: feature,
      value: true,
    })),
    offers: {
      '@type': 'Offer',
      price: pricePerNight,
      priceCurrency: 'INR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: pricePerNight,
        priceCurrency: 'INR',
        unitText: 'NIGHT',
        description: 'GST inclusive',
      },
    },
  };
}
