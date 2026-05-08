import { BUSINESS } from '@/lib/content/business';

interface GalleryImageInput {
  url: string;
  name: string;
  description?: string;
  width?: number | null;
  height?: number | null;
}

export function imageGallerySchema(items: GalleryImageInput[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Madhuban Eco Retreat — Gallery',
    description:
      'A visual journey through Madhuban Eco Retreat — from safari tents and forest trails to Aranyashala yoga sessions, farm dining, and curated events.',
    url: `${BUSINESS.url}/gallery`,
    author: {
      '@type': 'Organization',
      name: BUSINESS.name,
      url: BUSINESS.url,
    },
    image: items.map((item) => ({
      '@type': 'ImageObject',
      contentUrl: item.url,
      name: item.name,
      ...(item.description && { description: item.description }),
      ...(item.width && { width: item.width }),
      ...(item.height && { height: item.height }),
    })),
  };
}
