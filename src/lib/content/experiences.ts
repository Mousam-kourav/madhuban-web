// TODO: Phase 8 follow-up — upload experience images to new R2 bucket.
// Source files are at pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/{folder}/*
// Target paths listed as comments next to each gallery item below.
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

export type ExperienceGalleryImage = {
  alt: string;
  webp: { mobile: string; desktop: string };
  jpg:  { mobile: string; desktop: string };
};

export type ExperienceFaq = {
  question: string;
  answer: string;
};

export type Experience = {
  /** Matches the terminal URL segment exactly — href is `/experiences/${slug}` */
  slug: string;
  name: string;
  /** Short tagline shown in hero */
  tagline: string;
  /** Verbatim from live site per CLAUDE.md §10.3 */
  description: string;
  /** "Ideal For" single-line string for card display */
  idealFor: string;
  href: string;
  image: ExperienceImage;
  /** Full 3-paragraph description for detail page — verbatim from live site */
  longDescription: readonly string[];
  /** Bullet list for "What to Expect" section */
  whatToExpect: readonly string[];
  /** Bullet list for "Ideal For" section on detail page */
  idealForList: readonly string[];
  /** Gallery images for detail page */
  gallery: readonly ExperienceGalleryImage[];
  /** FAQs for detail page */
  faqs: readonly ExperienceFaq[];
  /** SEO title — max 38 chars (brand suffix auto-appended) */
  seoTitle: string;
  /** SEO description — max 160 chars */
  seoDescription: string;
  /** Optional SEO keywords */
  keywords?: string[];
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

// Uses the same homepage card image (already on R2) as a placeholder until
// dedicated experience gallery images are uploaded.
function homepageImageAsGallery(slug: string, alt: string): ExperienceGalleryImage {
  return {
    alt,
    webp: {
      mobile:  `${R2_BASE}/home/experiences/${slug}-800.webp`,
      desktop: `${R2_BASE}/home/experiences/${slug}-1280.webp`,
    },
    jpg: {
      mobile:  `${R2_BASE}/home/experiences/${slug}-800.jpg`,
      desktop: `${R2_BASE}/home/experiences/${slug}-1280.jpg`,
    },
  };
}

export const EXPERIENCES: readonly Experience[] = [
  {
    slug: 'forest-walks-and-nature-trails',
    name: 'Forest walks and nature trails',
    tagline: 'Walks shaped by the season and the time of day, led by naturalists who know this twenty acres by heart.',
    description:
      'Reconnect with the wilderness through guided forest walks and nature trails inside the Ratapani region. Learn about native plants, medicinal herbs, butterflies, and eco-systems while enjoying peaceful, device-free moments in the forest.',
    idealFor: 'Nature lovers, wellness travelers, families, photographers',
    href: '/experiences/forest-walks-and-nature-trails',
    image: experienceImage(
      'forest-walks-and-nature-trails',
      'Guests on a guided forest walk through the teak woodland at Madhuban Eco Retreat',
    ),
    longDescription: [
      'Step into the quiet, refreshing world of Ratapani with our Forest Walks & Nature Trails experience. Designed for travelers who love calm, nature, and mindful exploration, this guided walk takes you through the lush wilderness surrounding Madhuban Eco Retreat.',
      'Discover medicinal plants, native trees, butterflies, birds, and the natural ecosystem that thrives in this part of Madhya Pradesh. Every trail is led by trained naturalists who help you understand the forest, its rhythm, and the life it nurtures. These trails are safe, scenic, and suitable for families, seniors, solo travelers, and nature lovers.',
      'Whether you\'re looking for forest walks near Bhopal, peaceful eco-tourism, or an offbeat nature experience, this trail offers a chance to reconnect with yourself and the wild.',
    ],
    whatToExpect: [
      'Guided eco-trails with trained naturalists',
      'Learning about local flora, herbs, and forest ecology',
      'Mindful walking sessions to improve calmness & focus',
      'Device-free experience to help you disconnect',
      'Safe, well-marked routes for all age groups',
    ],
    idealForList: [
      'Nature enthusiasts & eco-tourists',
      'Wellness travelers',
      'Families & children',
      'Photographers & bird watchers',
      'Travelers seeking offbeat experiences near Bhopal',
    ],
    gallery: [
      // Placeholder: homepage card image (already on R2). Replace with dedicated gallery images once uploaded.
      homepageImageAsGallery('forest-walks-and-nature-trails', 'Guests on a guided forest walk through the teak woodland at Madhuban Eco Retreat'),
    ],
    faqs: [
      {
        question: 'Are the forest walks safe for beginners?',
        answer: 'Yes, all trails are beginner-friendly, guided, and suitable for families and seniors.',
      },
      {
        question: 'How long does a forest walk take?',
        answer: 'Most walks last between 45 minutes to 1.5 hours, depending on the trail.',
      },
      {
        question: 'What can I see during the nature trail?',
        answer: 'Guests can spot medicinal herbs, butterflies, native trees, insects, bird species, and natural forest formations.',
      },
      {
        question: 'Is this the best forest walk experience near Bhopal?',
        answer: 'Yes, Madhuban Eco Retreat offers one of the most peaceful and eco-friendly forest walks near Bhopal, inside the Ratapani region.',
      },
      {
        question: 'Do I need to book in advance?',
        answer: 'Pre-booking is recommended to ensure naturalist availability.',
      },
      {
        question: 'Are the trails suitable for children?',
        answer: 'Yes, children enjoy the nature learning experience and the easy, safe trails.',
      },
    ],
    seoTitle: 'Forest Walks in Ratapani — Nature Trails near Bhopal',
    seoDescription: 'Naturalist-led forest walks and nature trails at Madhuban Eco Retreat. Routes shaped by the season, the time of day, and what the forest is doing.',
    keywords: [
      'forest walks near bhopal',
      'nature trails bhopal',
      'ratapani forest walk',
      'eco nature trails ratapani',
      'offbeat nature trails bhopal',
      'forest trekking near bhopal',
      'eco tourism ratapani',
    ],
  },
  {
    slug: 'bird-watching-and-wilderness',
    name: 'Birdwatching at the edge of the reserve',
    tagline: 'Seventy-plus species across the forest and the seasonal Sankhera stream. Best at first light.',
    description:
      'Witness over 70+ species of birds across pristine landscapes — from paradise flycatchers to orioles and kingfishers. Our guided birding sessions offer a serene wilderness experience ideal for enthusiasts and researchers.',
    idealFor: 'Bird watchers, wildlife photographers, students, silent nature seekers',
    href: '/experiences/bird-watching-and-wilderness',
    image: experienceImage(
      'bird-watching-and-wilderness',
      'A paradise flycatcher perched on a branch in the forests near Ratapani Wildlife Sanctuary',
    ),
    longDescription: [
      'Escape into the peaceful wilderness of Ratapani with our Bird Watching & Wilderness experience at Madhuban Eco Retreat. Surrounded by untouched forest, this region is home to over 70+ species of native and migratory birds — making it one of the best bird-watching locations near Bhopal.',
      'Our guided birding sessions take place during early mornings and golden-hour evenings, when the forest is most alive. With no urban noise and minimal human disturbance, you can witness the beauty of birds in their natural habitat — from the graceful Indian Paradise Flycatcher to colorful orioles, kingfishers, drongos, peacocks, and seasonal visitors.',
      'If you\'re seeking a silent wilderness experience, a nature-based activity for families, or an ideal spot for wildlife photography, this trail offers a rare chance to slow down, observe, and connect deeply with the forest.',
    ],
    whatToExpect: [
      'Guided sessions at sunrise and sunset',
      'Spot native & migratory birds across forest zones',
      'Learn bird calls, seasonal patterns & behaviors',
      'Low-impact wilderness exploration',
      'Photography-friendly viewing points',
    ],
    idealForList: [
      'Bird watchers & ornithologists',
      'Wildlife photographers',
      'Nature lovers & quiet travelers',
      'Families & students',
      'Anyone exploring eco-tourism near Bhopal',
    ],
    gallery: [
      // Placeholder: homepage card image (already on R2). Replace with dedicated gallery images once uploaded.
      homepageImageAsGallery('bird-watching-and-wilderness', 'A paradise flycatcher perched on a branch in the forests near Ratapani Wildlife Sanctuary'),
    ],
    faqs: [
      {
        question: 'What birds can I spot in Ratapani during bird watching?',
        answer: 'You may see the paradise flycatcher, golden oriole, kingfisher, drongo, peacock, woodpeckers, and various migratory species.',
      },
      {
        question: 'Is this the best bird watching spot near Bhopal?',
        answer: 'Yes. Madhuban Eco Retreat is considered one of the top bird-watching zones near Bhopal due to its peaceful forest surroundings and rich biodiversity.',
      },
      {
        question: 'Are the bird watching sessions guided?',
        answer: 'Yes, all sessions are led by experienced naturalists familiar with local bird species and their behavior.',
      },
      {
        question: 'What time is ideal for bird watching?',
        answer: 'Early mornings and sunset hours are the most active and recommended times for bird watching.',
      },
      {
        question: 'Is bird watching suitable for children and beginners?',
        answer: 'Absolutely. The sessions are easy, educational, and enjoyable for all age groups.',
      },
      {
        question: 'Do I need binoculars or a camera?',
        answer: 'You may bring your own binoculars or camera, but even without equipment, the bird watching experience remains enriching.',
      },
    ],
    seoTitle: 'Bird Watching in Ratapani — 70+ Species near Bhopal',
    seoDescription: 'Seventy-plus native and migratory bird species at Madhuban Eco Retreat. Naturalist-led birdwatching at the edge of Ratapani Tiger Reserve, near Bhopal.',
    keywords: [
      'bird watching near bhopal',
      'ratapani bird watching',
      'wilderness near bhopal',
      'forest birding mp',
      'migratory birds ratapani',
      'wildlife trails bhopal',
      'eco tourism ratapani',
    ],
  },
  {
    slug: 'recreational-facilities',
    name: 'Recreation, between the trails',
    tagline: 'An obstacle course, cycling, badminton, indoor games, an infinity pool, and a library for the slow afternoons.',
    description:
      'Relax and unwind with eco-friendly recreation — from indoor games and cycling tracks to hammocks, swings, open-air seating, children zones, and quiet reading corners.',
    idealFor: 'Families, corporate retreats, wellness travelers, groups',
    href: '/experiences/recreational-facilities',
    image: experienceImage(
      'recreational-facilities',
      'Open-air hammock area and seating at the Madhuban Eco Retreat recreational grounds',
    ),
    longDescription: [
      'At Madhuban Eco Retreat, recreation blends beautifully with nature. Our thoughtfully designed activity spaces allow you to unwind, move freely, and enjoy moments of joy at your own pace. Whether you\'re looking for quiet relaxation, fun indoor games, or light outdoor adventures, our eco-conscious recreational facilities offer something for every traveler.',
      'Surrounded by the peaceful wilderness of Ratapani, these activities help you reset your mind, refresh your body, and reconnect with the simple pleasures of slow living. From cycling trails to hammocks and open-air reading corners, everything here is crafted for comfort, calmness, and family-friendly fun.',
      'If you\'re searching for recreational activities near Bhopal, this is one of the most relaxing, nature-integrated spaces to unwind.',
    ],
    whatToExpect: [
      'Indoor games (chess, carrom, board games)',
      'Cycling on scenic forest paths',
      'Hammocks, swings & open-air seating zones',
      'Campfire evenings and storytelling corners',
      'Nature-inspired activity spaces for kids and families',
      'Calm reading areas surrounded by greenery',
    ],
    idealForList: [
      'Families looking for relaxing nature-friendly activities',
      'Solo travelers & groups seeking quiet downtime',
      'Corporate & wellness retreats',
      'Kids and seniors',
      'Guests wanting a peaceful eco-resort recreation experience in Ratapani',
    ],
    gallery: [
      // Placeholder: homepage card image (already on R2). Replace with dedicated gallery images once uploaded.
      homepageImageAsGallery('recreational-facilities', 'Open-air hammock area and seating at the Madhuban Eco Retreat recreational grounds'),
    ],
    faqs: [
      {
        question: 'What recreational activities are available at Madhuban Eco Retreat?',
        answer: 'Guests can enjoy indoor games, cycling, hammocks, open-air seating, campfire zones, reading areas, and nature-inspired kid-friendly spaces.',
      },
      {
        question: 'Are these activities suitable for families?',
        answer: 'Yes, the activities are safe, peaceful, and perfect for families, children, and seniors.',
      },
      {
        question: 'Do I need to pay extra for recreational activities?',
        answer: 'Most activities are included with your stay. Some group sessions may require pre-booking.',
      },
      {
        question: 'Are outdoor recreation options available near Bhopal?',
        answer: 'Yes, Madhuban offers one of the most relaxing and nature-integrated recreational experiences near Bhopal.',
      },
      {
        question: 'Can corporate groups use the recreational facilities?',
        answer: 'Absolutely. Many corporate and wellness groups use these spaces for relaxation and team bonding.',
      },
      {
        question: 'Is cycling included in the stay?',
        answer: 'Yes, cycles are available for guests to explore the scenic eco-paths.',
      },
    ],
    seoTitle: 'Recreational Activities at Madhuban Eco Retreat, Ratapani',
    seoDescription: 'Cycling, an obstacle course, badminton, indoor games, infinity pool, library, and bonfire evenings at Madhuban Eco Retreat. Family-friendly recreation near Bhopal.',
    keywords: [
      'recreational activities near bhopal',
      'ratapani recreation',
      'outdoor activities bhopal',
      'eco resort recreation mp',
      'family activities bhopal',
      'nature recreation ratapani',
    ],
  },
] as const;
