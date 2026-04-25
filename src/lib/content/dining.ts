// TODO: Phase 3B follow-up — upload dining photo. URL is pre-wired; just add files to R2 at
// home/dining/dining-hero-{480,800,1280}.{webp,jpg}.
//
// Dev environment will show a broken image until upload happens — intentional, not a bug.

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';
if (!R2_BASE) {
  if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'production') {
    console.warn('[dining.ts] NEXT_PUBLIC_R2_BASE is not set. Dining image will 404.');
  }
}

export const DINING_PREVIEW = {
  heading: 'Forest-to-Table Dining',
  body: 'Organic produce from our farm, traditional recipes from local kitchens. Vegetarian and alcohol-free, by Somaiya Group philosophy.',
  cta: { label: 'Explore Dining', href: '/dining' },
  image: {
    alt: 'Madhuban dining hall with forest views',
    webp: {
      mobile:  `${R2_BASE}/home/dining/dining-hero-480.webp`,
      tablet:  `${R2_BASE}/home/dining/dining-hero-800.webp`,
      desktop: `${R2_BASE}/home/dining/dining-hero-1280.webp`,
    },
    jpg: {
      mobile:  `${R2_BASE}/home/dining/dining-hero-480.jpg`,
      tablet:  `${R2_BASE}/home/dining/dining-hero-800.jpg`,
      desktop: `${R2_BASE}/home/dining/dining-hero-1280.jpg`,
    },
  },
} as const;
