const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.madhubanecoretreat.com';

interface NearbyAttractionSchemaInput {
  slug: string;
  name: string;
  description: string;
  heroImageUrl: string;
  tags: string[];
  geo?: { lat: number; lng: number };
  breadcrumbs: Array<{ name: string; path: string }>;
}

export function nearbyAttractionSchema({
  slug,
  name,
  description,
  heroImageUrl,
  tags,
  geo,
  breadcrumbs,
}: NearbyAttractionSchemaInput): Record<string, unknown>[] {
  const url = `${SITE_URL}/nearby-attractions/${slug}`;

  const touristAttraction: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': `${url}#tourist-attraction`,
    name,
    description,
    url,
    image: heroImageUrl,
    touristType: tags,
    isAccessibleForFree: true,
    ...(geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: geo.lat,
        longitude: geo.lng,
      },
    }),
  };

  const place: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `${url}#place`,
    name,
    description,
    url,
    image: heroImageUrl,
    ...(geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: geo.lat,
        longitude: geo.lng,
      },
    }),
    containedInPlace: {
      '@type': 'LodgingBusiness',
      name: 'Madhuban Eco Retreat',
      url: SITE_URL,
    },
  };

  const breadcrumbList: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };

  return [touristAttraction, place, breadcrumbList];
}
