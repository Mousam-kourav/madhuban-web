import { BUSINESS } from '@/lib/content/business';

/**
 * Generates Resort schema for the property.
 * Use on Homepage and Stay index page alongside LodgingBusiness.
 *
 * @example
 * <Seo schemas={[lodgingBusiness(), resort()]} />
 */
export function resort(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Resort',
    name: BUSINESS.name,
    url: BUSINESS.url,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
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
    description:
      'Eco-luxury forest resort with 6 accommodation types — safari tents, mud houses, pool villa and glamping — inside a private forest adjacent to Ratapani Tiger Reserve.',
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Swimming Pool', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Restaurant', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Nature Trails', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Bird Watching', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Campfire', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Outdoor Activities', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Solar Power', value: true },
    ],
    numberOfRooms: 6,
    starRating: {
      '@type': 'Rating',
      ratingValue: 4,
    },
  };
}
