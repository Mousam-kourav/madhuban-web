import { BUSINESS } from '@/lib/content/business';
import type { ExperienceFaq } from '@/lib/content/experiences';
import { faqPage } from './faq-page';

interface TouristAttractionInput {
  name: string;
  description: string;
  path: string;
  heroImageUrl: string;
  touristTypes: readonly string[];
  faqs: readonly ExperienceFaq[];
}

export function touristAttraction({
  name,
  description,
  path,
  heroImageUrl,
  touristTypes,
  faqs,
}: TouristAttractionInput): Record<string, unknown>[] {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}${path}`;

  const attractionSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': `${url}#tourist-attraction`,
    name,
    description,
    url,
    image: heroImageUrl,
    touristType: touristTypes,
    availableLanguage: [
      { '@type': 'Language', name: 'English' },
      { '@type': 'Language', name: 'Hindi' },
    ],
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.streetAddress,
      addressLocality: BUSINESS.address.locality,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    containedInPlace: {
      '@type': 'LodgingBusiness',
      name: BUSINESS.name,
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
    isAccessibleForFree: true,
  };

  const tripSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': `${url}#tourist-trip`,
    name,
    description,
    url,
    image: heroImageUrl,
    touristType: touristTypes,
    itinerary: {
      '@type': 'City',
      name: 'Rehti, Sehore, Madhya Pradesh',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'INR',
      seller: {
        '@type': 'Organization',
        name: BUSINESS.name,
      },
    },
    provider: {
      '@type': 'Organization',
      name: BUSINESS.name,
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
  };

  return [attractionSchema, tripSchema, faqPage({ items: faqs.map(f => ({ question: f.question, answer: f.answer })) })];
}
