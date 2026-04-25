// TODO: Phase 3B follow-up — upload experience photos. URLs are pre-wired; just add files to R2 at
// home/experiences/{slug}-{480,800,1280}.{webp,jpg} for each of the three slugs below.
//
// Dev environment will show broken image icons until upload happens — intentional, not a bug.

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';
if (!R2_BASE) {
  if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'production') {
    console.warn('[experiences.ts] NEXT_PUBLIC_R2_BASE is not set. Experience images will 404.');
  }
}

export type ExperienceImage = {
  alt: string;
  webp: { mobile: string; tablet: string; desktop: string };
  jpg:  { mobile: string; tablet: string; desktop: string };
};

export type Experience = {
  /** Matches the terminal URL segment exactly — href is `/experiences/${slug}` */
  slug: string;
  name: string;
  /** Verbatim from live site per CLAUDE.md §10.3 */
  description: string;
  /** "Ideal For" string from live site */
  idealFor: string;
  href: string;
  image: ExperienceImage;
};

function experienceImage(slug: string, alt: string): ExperienceImage {
  return {
    alt,
    webp: {
      mobile:  `${R2_BASE}/home/experiences/${slug}-480.webp`,
      tablet:  `${R2_BASE}/home/experiences/${slug}-800.webp`,
      desktop: `${R2_BASE}/home/experiences/${slug}-1280.webp`,
    },
    jpg: {
      mobile:  `${R2_BASE}/home/experiences/${slug}-480.jpg`,
      tablet:  `${R2_BASE}/home/experiences/${slug}-800.jpg`,
      desktop: `${R2_BASE}/home/experiences/${slug}-1280.jpg`,
    },
  };
}

export const EXPERIENCES: readonly Experience[] = [
  {
    slug: 'forest-walks-and-nature-trails',
    name: 'Forest Walks & Nature Trails',
    description:
      'Reconnect with the wilderness through guided forest walks and nature trails inside the Ratapani region. Learn about native plants, medicinal herbs, butterflies, and eco-systems while enjoying peaceful, device-free moments in the forest.',
    idealFor: 'Nature lovers, wellness travelers, families, photographers',
    href: '/experiences/forest-walks-and-nature-trails',
    image: experienceImage(
      'forest-walks-and-nature-trails',
      'Guests on a guided forest walk through the teak woodland at Madhuban Eco Retreat',
    ),
  },
  {
    slug: 'bird-watching-and-wilderness',
    name: 'Bird Watching & Wilderness',
    description:
      'Witness over 70+ species of birds across pristine landscapes — from paradise flycatchers to orioles and kingfishers. Our guided birding sessions offer a serene wilderness experience ideal for enthusiasts and researchers.',
    idealFor: 'Bird watchers, wildlife photographers, students, silent nature seekers',
    href: '/experiences/bird-watching-and-wilderness',
    image: experienceImage(
      'bird-watching-and-wilderness',
      'A paradise flycatcher perched on a branch in the forests near Ratapani Wildlife Sanctuary',
    ),
  },
  {
    slug: 'recreational-facilities',
    name: 'Recreational Facilities',
    description:
      'Relax and unwind with eco-friendly recreation — from indoor games and cycling tracks to hammocks, swings, open-air seating, children zones, and quiet reading corners.',
    idealFor: 'Families, corporate retreats, wellness travelers, groups',
    href: '/experiences/recreational-facilities',
    image: experienceImage(
      'recreational-facilities',
      'Open-air hammock area and seating at the Madhuban Eco Retreat recreational grounds',
    ),
  },
] as const;
