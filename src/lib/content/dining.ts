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

// ─────────────────────────────────────────────────────────────────────────────
// Full /dining page data (Phase 9d-3)
// ─────────────────────────────────────────────────────────────────────────────

const R2 = R2_BASE;

type ImageVariants = {
  readonly desktop: string;
  readonly mobile: string;
  readonly alt: string;
};

type DiningData = {
  hero: { eyebrow: string; title: string; subtitle: string; image: ImageVariants };
  philosophy: ReadonlyArray<{ icon: string; title: string; note: string }>;
  openAir: {
    eyebrow: string;
    title: string;
    paragraphs: readonly string[];
    pills: readonly string[];
    image: ImageVariants;
  };
  bushDining: {
    title: string;
    pricingTag: string;
    body: string;
    inclusions: readonly string[];
    image: ImageVariants;
  };
  alfresco: {
    title: string;
    pricingTag: string;
    paragraphs: readonly string[];
    inclusions: readonly string[];
    bestFor: readonly string[];
    image: ImageVariants;
  };
  comparison: {
    headers: readonly string[];
    rows: ReadonlyArray<{ label: string; values: readonly string[] }>;
  };
  menu: {
    title: string;
    subtitle: string;
    dishes: ReadonlyArray<{ name: string; description: string; image: string }>;
    footnote: string;
  };
  philosophyStory: {
    title: string;
    paragraphs: readonly string[];
    pills: readonly string[];
    image: ImageVariants;
  };
  faqs: ReadonlyArray<{ question: string; answer: string }>;
};

export const DINING: DiningData = {
  hero: {
    eyebrow: 'Madhuban Eco Retreat · Ratapani Wildlife Sanctuary',
    title: 'Dining at Madhuban',
    subtitle:
      'Pure vegetarian, regional, and rooted in the land. From everyday open-air meals to private forest setups for two.',
    image: {
      desktop: `${R2}/dining/hero-1280.webp`,
      mobile: `${R2}/dining/hero-800.webp`,
      alt: 'Full vegetarian feast spread on the veranda table at Madhuban Eco Retreat',
    },
  },

  philosophy: [
    {
      icon: 'Leaf',
      title: '100% Vegetarian',
      note: 'Always. No exceptions.',
    },
    {
      icon: 'Wine',
      title: 'No Alcohol Served',
      note: 'Family-friendly, distraction-free.',
    },
    {
      icon: 'Sprout',
      title: 'Farm-to-Fork',
      note: 'Local sourcing, seasonal menus.',
    },
    {
      icon: 'UtensilsCrossed',
      title: 'Regional Recipes',
      note: 'Madhya Pradesh kitchens, restored.',
    },
  ],

  openAir: {
    eyebrow: 'INCLUDED FOR ALL GUESTS',
    title: 'Open Air Dining',
    paragraphs: [
      'Our main restaurant is built for the climate and the place — bamboo-lantern ceilings, cane chairs, breeze running through low partitions. Open-air seating means meals happen with the forest as the backdrop, not a wall.',
      'Daily multi-cuisine vegetarian buffet for breakfast, lunch, and dinner. Regional specialties rotate by season. Special diets — Jain, vegan, gluten-free — accommodated with notice.',
    ],
    pills: ['Buffet & À la Carte', 'Indoor + Outdoor Seating', 'Special Diets on Request'],
    image: {
      desktop: `${R2}/dining/open-air-1280.webp`,
      mobile: `${R2}/dining/open-air-800.webp`,
      alt: 'Restaurant interior at Madhuban with bamboo lanterns and cane seating',
    },
  },

  bushDining: {
    title: 'Bush Dining',
    pricingTag: 'Starts at ₹3,000 per couple · Setup fee · Pre-booking required',
    body: "A private dining setup arranged in a quiet corner of the property — set table, lanterns, a server dedicated to your meal. Designed for couples who want the resort's food in a more intimate setting than the main restaurant.",
    inclusions: [
      'Private setup for two',
      'Choice of vegetarian regional menu',
      'Dedicated server for the duration',
      'Available with 24-hour notice',
    ],
    image: {
      desktop: `${R2}/dining/bush-dining-1280.webp`,
      mobile: `${R2}/dining/bush-dining-800.webp`,
      alt: 'Outdoor covered veranda set for a private bush dining experience at Madhuban',
    },
  },

  alfresco: {
    title: 'Alfresco Forest Dining',
    pricingTag: 'Starts at ₹5,500 per couple · Setup fee · Pre-booking required',
    paragraphs: [
      'The premium tier. A private dining setup placed where the resort meets the forest edge — string lights, candle lamps, cushioned seating, full table service.',
      'For anniversaries, proposals, or anyone who wants the most atmospheric meal we offer. Best at dusk, with the bird calls coming from Ratapani in the distance.',
    ],
    inclusions: [
      'Private forest-edge setup for two',
      'Curated multi-course vegetarian tasting menu',
      'String lights, candles, full table service',
      'Available with 48-hour notice',
    ],
    bestFor: ['Anniversaries', 'Proposals', 'Special Occasions'],
    image: {
      desktop: `${R2}/dining/alfresco-1280.webp`,
      mobile: `${R2}/dining/alfresco-800.webp`,
      alt: 'Atmospheric evening interior lighting for alfresco private dining at Madhuban',
    },
  },

  comparison: {
    headers: ['', 'Open Air', 'Bush Dining', 'Alfresco Forest'],
    rows: [
      {
        label: 'Setting',
        values: [
          'Main restaurant, indoor + outdoor seating',
          'Private outdoor corner of property',
          'Forest-edge private setup',
        ],
      },
      {
        label: 'Capacity',
        values: [
          'All guests, walk-in OK',
          'Couples (private setup for 2)',
          'Couples (private setup for 2)',
        ],
      },
      {
        label: 'Pricing',
        values: [
          'Included for stays / À la carte for visitors',
          'Starts at ₹3,000 per couple',
          'Starts at ₹5,500 per couple',
        ],
      },
      {
        label: 'Booking',
        values: [
          'Walk-in welcome',
          '24-hour pre-booking',
          '48-hour pre-booking',
        ],
      },
    ],
  },

  menu: {
    title: "What's on the Menu",
    subtitle:
      "Regional Madhya Pradesh dishes alongside familiar North Indian comfort food. Menus rotate seasonally with what's available from local farms.",
    dishes: [
      {
        name: 'Vegetable Pulao',
        description: 'Aromatic basmati with seasonal vegetables and whole spices',
        image: `${R2}/dining/dish-pulao.webp`,
      },
      {
        name: 'Paneer Makhani',
        description: 'Cottage cheese in a rich tomato-cashew gravy, with house-baked naan',
        image: `${R2}/dining/dish-paneer-makhani.webp`,
      },
      {
        name: 'Litti Chokha',
        description:
          'Roasted wheat dough balls with smoky mashed eggplant — a Madhya Pradesh & Bihar classic',
        image: `${R2}/dining/dish-litti-chokha.webp`,
      },
      {
        name: 'Hara Bhara Kebab',
        description: 'Spinach, peas, and potato patties with fresh chutneys',
        image: `${R2}/dining/dish-hara-bhara.webp`,
      },
      {
        name: "Chef's Table Setup",
        description: 'Every plate served on cane and ceramic, in our signature setting',
        image: `${R2}/dining/dish-table-setup.webp`,
      },
    ],
    footnote:
      'Menus subject to seasonal sourcing. Special diets — Jain, vegan, gluten-free — accommodated with notice.',
  },

  philosophyStory: {
    title: 'From Field to Forest Plate',
    paragraphs: [
      "Most of what's on your plate at Madhuban came from within 50 kilometers. Vegetables from village farms in the Ratapani buffer zone. Grains from cooperatives in the Vindhyan plateau. Spices traded from Bhopal's old-city markets, the same way home kitchens here have done it for generations.",
      "We don't buy from industrial suppliers. The kitchen plans menus around what arrived that morning, not what's on a national catalog.",
      "It's slower. It's also why the food tastes the way it does.",
    ],
    pills: ['Local Sourcing', 'Seasonal Menus', 'No Industrial Suppliers'],
    image: {
      desktop: `${R2}/dining/philosophy-1280.webp`,
      mobile: `${R2}/dining/philosophy-800.webp`,
      alt: 'Interior detail of the farm-to-fork dining setup at Madhuban Eco Retreat',
    },
  },

  faqs: [
    {
      question: "Is Madhuban's restaurant 100% vegetarian?",
      answer:
        'Yes — we serve vegetarian food only. No meat, fish, or eggs are cooked on the property. This applies to all dining experiences and to outside guests as well.',
    },
    {
      question: 'Do you serve alcohol?',
      answer:
        "No, alcohol is not served at Madhuban. We're a family-friendly, alcohol-free property. Outside alcohol is also not permitted.",
    },
    {
      question: 'Can I dine at Madhuban without staying overnight?',
      answer:
        'Yes. Walk-in dining is welcome at the main Open Air restaurant during meal hours. Bush Dining and Alfresco Forest Dining packages are also available to outside guests with pre-booking.',
    },
    {
      question: 'Do you accommodate Jain, vegan, or gluten-free diets?',
      answer:
        'Yes, with prior notice. Please mention dietary requirements when you book or at least one meal in advance for in-house guests. Our kitchen prepares Jain, vegan, and gluten-free meals regularly.',
    },
    {
      question: 'How far in advance do I need to book Bush or Alfresco Dining?',
      answer:
        "Bush Dining requires at least 24 hours' notice for setup. Alfresco Forest Dining requires 48 hours so we can prepare the forest-edge location. Both are subject to weather and may be moved to a covered alternative if needed.",
    },
    {
      question: 'What does the package price include?',
      answer:
        "The price covers the private setup, dedicated service, ambient lighting, and reservation of the location. Food and beverage are charged separately based on the menu you choose. We'll share full menu options when you book.",
    },
  ],
} as const;
