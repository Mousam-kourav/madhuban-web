// NEXT_PUBLIC_R2_BASE must be set in .env.local.
// Leaving it blank produces relative /home/rooms/... paths → 404s in dev, build still passes.
const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';
if (!R2_BASE) {
  if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'production') {
    console.warn('[rooms.ts] NEXT_PUBLIC_R2_BASE is not set. Room images will fall back to relative paths and 404.');
  }
}

export type RoomImage = {
  alt: string;
  webp: { mobile: string; tablet: string; desktop: string };
  jpg:  { mobile: string; tablet: string; desktop: string };
};

export type Room = {
  slug: string;
  name: string;
  /** INR, GST-inclusive per CLAUDE.md §6 */
  pricePerNight: number;
  /** 1-line, max 80 chars */
  tagline: string;
  href: string;
  image: RoomImage;
};

function roomImage(slug: string, alt: string): RoomImage {
  return {
    alt,
    webp: {
      mobile:  `${R2_BASE}/home/rooms/${slug}-480.webp`,
      tablet:  `${R2_BASE}/home/rooms/${slug}-800.webp`,
      desktop: `${R2_BASE}/home/rooms/${slug}-1280.webp`,
    },
    jpg: {
      mobile:  `${R2_BASE}/home/rooms/${slug}-480.jpg`,
      tablet:  `${R2_BASE}/home/rooms/${slug}-800.jpg`,
      desktop: `${R2_BASE}/home/rooms/${slug}-1280.jpg`,
    },
  };
}

export const ROOMS: readonly Room[] = [
  {
    slug: 'safari-tent',
    name: 'Safari Tent',
    pricePerNight: 5000,
    tagline: 'Open-to-sky showers, forest views, and crafted cane interiors.',
    href: '/stay/safari-tent',
    image: roomImage(
      'safari-tent',
      'Stilted Safari Tent at Madhuban Eco Retreat with a guest birdwatching from the balcony',
    ),
  },
  {
    slug: 'mud-house-1',
    name: 'Mud House 1',
    pricePerNight: 6000,
    tagline: 'Inspired by Gond tribal art — with private bathtub for deeper rest.',
    href: '/stay/mud-house-1',
    image: roomImage(
      'mud-house-1',
      'Mud House 1 at Madhuban — terracotta walls with Gond tribal mural artwork',
    ),
  },
  {
    slug: 'mud-house-2',
    name: 'Mud House 2',
    pricePerNight: 5500,
    tagline: 'Mud-cottage warmth, hand-painted murals, and slow forest mornings.',
    href: '/stay/mud-house-2',
    image: roomImage(
      'mud-house-2',
      'Mud House 2 at Madhuban with hand-painted Gond murals and tiled roof',
    ),
  },
  {
    slug: 'pool-side-villa',
    name: 'Pool Side Villa',
    pricePerNight: 5500,
    tagline: 'Scenic poolside seclusion with panoramic forest views.',
    href: '/stay/pool-side-villa',
    image: roomImage(
      'pool-side-villa',
      'Aerial view of the Pool Side Villa at Madhuban Eco Retreat with surrounding forest',
    ),
  },
  {
    slug: 'glamping-tents',
    name: 'Glamping Tent',
    pricePerNight: 4500,
    tagline: 'Boutique glamping with chic décor and private sit-outs.',
    href: '/stay/glamping-tents',
    image: roomImage(
      'glamping-tents',
      'Glamping Tent at Madhuban with green canopy curtains and cane porch chairs',
    ),
  },
  {
    slug: 'camping-tent',
    name: 'Camping Tent',
    pricePerNight: 2500,
    tagline: 'Off-grid stays under starry skies for true adventure-seekers.',
    href: '/stay/camping-tent',
    image: roomImage(
      'camping-tent',
      'Camping Tent pitched on grass in the Madhuban camping ground',
    ),
  },
] as const;
