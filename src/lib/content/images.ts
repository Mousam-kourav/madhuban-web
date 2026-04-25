// NEXT_PUBLIC_R2_BASE must be set in .env.local.
// Leaving it blank produces relative /home/hero/... paths → 404s in dev, build still passes.
const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';
if (!R2_BASE) {
  // Dev-mode fallback. In production, missing R2_BASE means hero images will 404.
  // Promote to a hard throw once .env.local is reliably populated across machines.
  if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'production') {
    console.warn('[images.ts] NEXT_PUBLIC_R2_BASE is not set. Hero images will fall back to relative paths and 404.');
  }
}

type ImageVariant = { src: string; width: number };

export type HeroImage = {
  alt: string;
  webp: { mobile: ImageVariant; tablet: ImageVariant; desktop: ImageVariant };
  jpg: { mobile: ImageVariant; tablet: ImageVariant; desktop: ImageVariant };
};

function heroVariants(
  prefix: string,
  ext: 'webp' | 'jpg',
): HeroImage['webp'] {
  return {
    mobile: { src: `${R2_BASE}/home/hero/${prefix}-800.${ext}`, width: 800 },
    tablet: { src: `${R2_BASE}/home/hero/${prefix}-1280.${ext}`, width: 1280 },
    desktop: { src: `${R2_BASE}/home/hero/${prefix}-1920.${ext}`, width: 1920 },
  };
}

function heroImage(prefix: string, alt: string): HeroImage {
  return {
    alt,
    webp: heroVariants(prefix, 'webp'),
    jpg: heroVariants(prefix, 'jpg'),
  };
}

export const HERO_IMAGES: readonly [HeroImage, HeroImage, HeroImage] = [
  heroImage(
    'hero-aerial-sunset',
    'Aerial view of Madhuban Eco Retreat at sunset, with forested hills of Ratapani Tiger Reserve in the distance',
  ),
  heroImage(
    'hero-bamboo-cafe-dusk',
    'The Bamboo Cafe at dusk, lit by garden lanterns and surrounded by native trees',
  ),
  heroImage(
    'hero-aerial-day',
    'Daytime aerial view of Madhuban Eco Retreat showing safari tents, mud houses, and the natural pond',
  ),
];
