// TODO: Replace bhojpur-temple image when proper Bhojpur photo arrives. Current uses Saru Maru Caves as placeholder per slug naming.

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';
if (!R2_BASE) {
  if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'production') {
    console.warn('[nearby.ts] NEXT_PUBLIC_R2_BASE is not set. Nearby attraction images will 404.');
  }
}

export type NearbyAttractionImage = {
  alt: string;
  webp: { mobile: string; desktop: string };
  jpg:  { mobile: string; desktop: string };
};

export type NearbyAttraction = {
  slug: string;
  name: string;
  /** e.g. "30 km" or "Adjacent" */
  distance: string;
  /** 1-2 sentences, max 120 chars */
  description: string;
  image: NearbyAttractionImage;
};

function nearbyImage(slug: string, alt: string): NearbyAttractionImage {
  return {
    alt,
    webp: {
      mobile:  `${R2_BASE}/home/nearby/${slug}-480.webp`,
      desktop: `${R2_BASE}/home/nearby/${slug}-800.webp`,
    },
    jpg: {
      mobile:  `${R2_BASE}/home/nearby/${slug}-480.jpg`,
      desktop: `${R2_BASE}/home/nearby/${slug}-800.jpg`,
    },
  };
}

export const NEARBY_ATTRACTIONS: readonly NearbyAttraction[] = [
  {
    slug: 'bhimbetka',
    name: 'Bhimbetka Rock Shelters',
    distance: '50 km',
    description: 'UNESCO World Heritage site with prehistoric rock paintings dating back 30,000 years.',
    image: nearbyImage(
      'bhimbetka',
      'Visitors exploring the prehistoric rock shelters at Bhimbetka, a UNESCO World Heritage Site',
    ),
  },
  {
    slug: 'ratapani',
    name: 'Ratapani Wildlife Sanctuary',
    distance: 'Adjacent',
    description: `India's newest tiger reserve, home to leopards, sloth bears, and 200+ bird species.`,
    image: nearbyImage(
      'ratapani',
      'Calm waters and dense forest of Ratapani Wildlife Sanctuary',
    ),
  },
  {
    slug: 'salkanpur-devi-temple',
    name: 'Salkanpur Devi Temple',
    distance: '30 km',
    description: 'Hilltop Hindu temple dedicated to Goddess Bijasan Devi with panoramic valley views.',
    image: nearbyImage(
      'salkanpur-devi-temple',
      'Pilgrims at the Salkanpur Devi Temple complex',
    ),
  },
  {
    slug: 'bhojpur-temple',
    name: 'Bhojpur Temple',
    distance: '45 km',
    description: '11th-century Shiva temple housing one of the largest stone shiva lingams in India.',
    image: nearbyImage(
      'bhojpur-temple',
      'Ancient stone architecture of the Bhojpur Temple region',
    ),
  },
] as const;
