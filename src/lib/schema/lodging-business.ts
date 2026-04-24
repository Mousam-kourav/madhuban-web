import { BUSINESS } from '@/lib/content/business';

interface LodgingBusinessInput {
  /** Override description (defaults to a generic brand description). */
  description?: string;
  /** AggregateRating if we have review data. */
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

/**
 * Generates LodgingBusiness + LocalBusiness schema for the property.
 * Use on Homepage, About, and Contact pages.
 *
 * @example
 * <Seo schemas={[lodgingBusiness()]} />
 */
export function lodgingBusiness({
  description,
  aggregateRating,
}: LodgingBusinessInput = {}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': ['LodgingBusiness', 'LocalBusiness'],
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: BUSINESS.url,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    description:
      description ??
      'Eco-luxury forest resort adjacent to Ratapani Tiger Reserve, 60 km from Bhopal, Madhya Pradesh. Safari tents, mud houses, pool villa, glamping, dining and nature experiences.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.streetAddress,
      addressLocality: BUSINESS.address.locality,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    sameAs: [...BUSINESS.sameAs],
    priceRange: '₹₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, UPI, Net Banking',
    ...(aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}
