// DEPRECATED Phase 5B: Source of truth moved to Supabase rooms + room_faqs tables.
// This file is retained for emergency fallback and reference for 1 week post-deploy.
// Do not import from app code — public pages now use @/lib/rooms/queries + @/lib/rooms/mapper.

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

export type RoomGalleryImage = {
  alt: string;
  webp: { mobile: string; desktop: string };
  jpg:  { mobile: string; desktop: string };
};

export type RoomFaq = {
  question: string;
  answer: string;
};

type RoomHighlight = {
  /** lucide-react icon name — resolved at render time via ICON_MAP in room-detail-page.tsx */
  icon: string;
  title: string;
  description: string;
};

export type Room = {
  // ── Existing fields (homepage card + nav) ───────────────────────────────
  slug: string;
  name: string;
  /** INR, GST-inclusive. Phase 4A corrected values. */
  pricePerNight: number;
  tagline: string;
  href: string;
  /** Single card image for homepage/stay listing. */
  image: RoomImage;

  // ── Detail page fields ──────────────────────────────────────────────────
  /** Booking-band eyebrow e.g. "Eco-Luxury · Mud Architecture" */
  genre: string;
  /** 3 paragraphs for the detail page, rendered separately. */
  longDescription: readonly string[];
  occupancy: { adults: number; children: number };
  bedConfig: string;
  /** e.g. "Approx. 350 sq ft". "Not specified" if unknown. */
  size: string;
  amenities: readonly string[];
  /** 4 highlights with contextual lucide icon name. */
  highlights: readonly RoomHighlight[];
  /** 5 images for the detail page gallery. */
  gallery: readonly RoomGalleryImage[];
  /** 7 FAQs per room for FAQPage JSON-LD + on-page accordion. */
  faqs: readonly RoomFaq[];
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

function galleryImages(slug: string, alts: readonly string[]): readonly RoomGalleryImage[] {
  return alts.map((alt, i) => ({
    alt,
    webp: {
      mobile:  `${R2_BASE}/home/rooms/${slug}-${i + 1}-800.webp`,
      desktop: `${R2_BASE}/home/rooms/${slug}-${i + 1}-1280.webp`,
    },
    jpg: {
      mobile:  `${R2_BASE}/home/rooms/${slug}-${i + 1}-800.jpg`,
      desktop: `${R2_BASE}/home/rooms/${slug}-${i + 1}-1280.jpg`,
    },
  }));
}

// mud-house-1 and mud-house-2 share gallery alt text (identical rooms visually).
// Each uses its own slug in R2 paths — both file sets confirmed uploaded.
const MUD_HOUSE_GALLERY_ALTS = [
  'Orange-walled bedroom in a Madhuban mud house',
  'Wide view of the mud house bedroom with red zigzag motifs',
  'Tea service on the table in the mud house lounge',
  'Full mud house room with king bed and traditional decor',
  'Bedroom with red-trimmed windows in the mud house',
] as const;

export const ROOMS: readonly Room[] = [
  {
    slug: 'safari-tent',
    name: 'Safari Tent',
    pricePerNight: 12000,
    tagline: 'Open-to-sky showers, forest views, and crafted cane interiors.',
    href: '/stay/safari-tent',
    genre: 'Eco-Luxury · Canvas Tent',
    image: roomImage(
      'safari-tent',
      'Stilted Safari Tent at Madhuban Eco Retreat with a guest birdwatching from the balcony',
    ),
    longDescription: [
      "Madhuban's Safari Tents are built for travelers who want the romance of canvas without giving up comfort. Each tent features a vaulted ceiling, four-poster bed, en-suite bathroom with rainfall shower, and a private veranda overlooking the forest.",
      "Air-conditioned, fully serviced, and quietly luxurious — these tents are designed for the way modern travelers stay close to nature: with binoculars in hand and a hot shower at sunset.",
      "Located on the edge of the property where the canopy thickens, Safari Tents offer the most direct forest immersion of any room at Madhuban — without sacrificing any modern comfort.",
    ],
    occupancy: { adults: 2, children: 1 },
    bedConfig: '1 King Bed',
    size: 'Approx. 350 sq ft',
    amenities: [
      'Air conditioning',
      'En-suite bathroom with rainfall shower',
      'Four-poster king bed',
      'Private veranda',
      'Forest views',
      'Daily housekeeping',
      'Lantern lighting',
      'Premium linens',
      'Tea and coffee setup',
      'Pet friendly',
      'WiFi',
      'Pool access',
      'Breakfast included',
    ],
    highlights: [
      { icon: 'Tent',       title: 'Vaulted Canvas Ceiling', description: 'Sleep beneath a soaring tent ceiling, with mesh windows for stargazing.' },
      { icon: 'BedDouble',  title: 'Four-Poster King Bed',   description: 'Hand-crafted bed frame with premium linens for restorative sleep.' },
      { icon: 'Trees',      title: 'Private Forest Veranda', description: 'Step out to a deck overlooking the Ratapani forest at any hour.' },
      { icon: 'ShowerHead', title: 'Modern Bathroom',        description: 'Rainfall shower, hot water, and luxury fittings — no glamping compromises.' },
    ],
    gallery: galleryImages('safari-tent', [
      'Bathroom sink in a luxury safari tent at Madhuban',
      'Modern rainfall shower in the safari tent bathroom',
      'Guest on the safari tent veranda with binoculars',
      'Interior view from the king bed of the safari tent',
      'Wooden writing desk and lounge area inside the safari tent',
    ]),
    faqs: [
      { question: 'What is the price of Safari Tent stay at Madhuban?',       answer: 'Safari Tent is priced at ₹12,000 per night, including GST.' },
      { question: 'Is the Safari Tent the best safari stay near Bhopal?',      answer: "Madhuban's Safari Tents are among the most authentic eco-luxury safari stays in the Ratapani region, with direct forest immersion and modern amenities at every stay." },
      { question: 'Are Safari Tents suitable for families or couples?',        answer: 'Yes. Safari Tents accommodate 2 adults and 1 child comfortably with a king bed and additional bedding available on request.' },
      { question: 'Does the Safari Tent have AC?',                             answer: 'Yes, every Safari Tent includes air conditioning, ceiling fan, and lantern-style lighting.' },
      { question: 'Is the Safari Tent pet friendly?',                          answer: 'Yes, Safari Tents are pet friendly. Inform us at the time of booking so we can prepare your stay.' },
      { question: 'Do guests staying in Safari Tents get access to the pool?', answer: 'Yes, all Madhuban guests including Safari Tent stays have full access to the swimming pool and recreation areas.' },
      { question: 'Can I book the Safari Tent online?',                        answer: 'Yes, Safari Tent bookings can be made directly through this website to secure the best available rates.' },
    ],
  },

  {
    slug: 'mud-house-1',
    name: 'Mud House 1',
    pricePerNight: 10000,
    tagline: 'Inspired by Gond tribal art — with private bathtub for deeper rest.',
    href: '/stay/mud-house-1',
    genre: 'Eco-Luxury · Mud Architecture',
    image: roomImage(
      'mud-house-1',
      'Mud House 1 at Madhuban — terracotta walls with Gond tribal mural artwork',
    ),
    longDescription: [
      "Mud House 1 is Madhuban's most distinctive room — built with traditional rammed-earth walls, decorated with hand-painted Gond murals, and featuring a private bathtub for slow soaks after long forest walks.",
      "The earthen architecture keeps the room cool in summer and warm in winter, naturally. Inside, you'll find a king bed, vintage lantern lighting, and windows that frame the forest like living paintings.",
      "Designed for travelers who want the deepest version of Madhuban's slow-living philosophy — with the indulgence of a private bathtub at the end of every day.",
    ],
    occupancy: { adults: 2, children: 1 },
    bedConfig: '1 King Bed',
    size: 'Approx. 320 sq ft',
    amenities: [
      'Air conditioning',
      'Private bathtub',
      'Rainfall shower',
      'Hand-painted Gond murals',
      'Mud architecture (naturally insulated)',
      'King bed with premium linens',
      'Vintage lantern lighting',
      'Tea and coffee setup',
      'Daily housekeeping',
      'Forest views',
      'Pet friendly',
      'WiFi',
      'Pool access',
      'Breakfast included',
    ],
    highlights: [
      { icon: 'Bath',     title: 'Private Bathtub',          description: 'Soak in a deep tub after a day of forest walks — the difference between Mud House 1 and 2.' },
      { icon: 'Palette',  title: 'Gond Tribal Murals',       description: 'Hand-painted artworks by local artisans depicting forest spirits and tribal life.' },
      { icon: 'Home',     title: 'Rammed Earth Walls',       description: 'Naturally cooling in summer, warming in winter — architecture that breathes.' },
      { icon: 'Trees',    title: 'Forest Framing Windows',   description: 'Floor-to-ceiling windows that turn the surrounding forest into living art.' },
    ],
    gallery: galleryImages('mud-house-1', MUD_HOUSE_GALLERY_ALTS),
    faqs: [
      { question: 'What is the price of Mud House 1 stay at Madhuban?',        answer: 'Mud House 1, with private bathtub, is priced at ₹10,000 per night, including GST.' },
      { question: "What's the difference between Mud House 1 and Mud House 2?", answer: 'Mud House 1 includes a private bathtub for slow soaks; Mud House 2 has a rainfall shower instead. All other amenities are identical.' },
      { question: 'Are Mud Houses suitable for families or couples?',           answer: 'Yes. Mud Houses accommodate 2 adults and 1 child, with king bedding and a peaceful, naturally insulated atmosphere.' },
      { question: 'Does Mud House 1 have AC?',                                  answer: 'Yes, Mud House 1 has air conditioning, vintage-style lantern lighting, and a ceiling fan.' },
      { question: 'Is Mud House 1 pet friendly?',                               answer: 'Yes, Mud Houses are pet friendly. Please inform us at the time of booking.' },
      { question: 'Do guests staying in Mud Houses get access to the pool?',    answer: 'Yes, all Madhuban guests including Mud House stays have full access to the swimming pool and recreation areas.' },
      { question: 'Can I book Mud House 1 online?',                             answer: 'Yes, Mud House 1 bookings can be made directly through this website to secure the best available rates.' },
    ],
  },

  {
    slug: 'mud-house-2',
    name: 'Mud House 2',
    pricePerNight: 9000,
    tagline: 'Mud-cottage warmth, hand-painted murals, and slow forest mornings.',
    href: '/stay/mud-house-2',
    genre: 'Eco-Luxury · Mud Architecture',
    image: roomImage(
      'mud-house-2',
      'Mud House 2 at Madhuban with hand-painted Gond murals and tiled roof',
    ),
    longDescription: [
      "Mud House 2 shares the soul of its sister room — same rammed-earth construction, same Gond murals, same forest-framing windows — at a more accessible price point.",
      "The trade-off is the bathtub: Mud House 2 features a generous rainfall shower instead. Everything else that makes a Mud House special — the natural insulation, the artisanal interiors, the slow-living atmosphere — is here.",
      "Choose Mud House 2 when you want the full Mud House experience without the bathtub indulgence — a thoughtful middle ground between Madhuban's tents and its premium villa.",
    ],
    occupancy: { adults: 2, children: 1 },
    bedConfig: '1 King Bed',
    size: 'Approx. 320 sq ft',
    amenities: [
      'Air conditioning',
      'Rainfall shower',
      'Hand-painted Gond murals',
      'Mud architecture (naturally insulated)',
      'King bed with premium linens',
      'Vintage lantern lighting',
      'Tea and coffee setup',
      'Daily housekeeping',
      'Forest views',
      'Pet friendly',
      'WiFi',
      'Pool access',
      'Breakfast included',
    ],
    highlights: [
      { icon: 'Home',        title: 'Authentic Mud Architecture',    description: 'Traditional rammed-earth construction inspired by Gond tribal heritage.' },
      { icon: 'Palette',     title: 'Gond Tribal Murals',            description: 'Hand-painted artworks depicting forest spirits and tribal stories.' },
      { icon: 'Thermometer', title: 'Naturally Climate-Controlled',  description: 'Cool in summer, warm in winter — architecture as comfort.' },
      { icon: 'Tag',         title: 'Friendly Price Point',          description: 'All the Mud House character at a more accessible nightly rate.' },
    ],
    gallery: galleryImages('mud-house-2', MUD_HOUSE_GALLERY_ALTS),
    faqs: [
      { question: 'What is the price of Mud House 2 stay at Madhuban?',        answer: 'Mud House 2 is priced at ₹9,000 per night, including GST.' },
      { question: "What's the difference between Mud House 1 and Mud House 2?", answer: 'Mud House 2 has a rainfall shower; Mud House 1 has a private bathtub. All other features and amenities are identical.' },
      { question: 'Are Mud Houses suitable for families or couples?',           answer: 'Yes. Mud Houses accommodate 2 adults and 1 child, with king bedding and a peaceful, naturally insulated atmosphere.' },
      { question: 'Does Mud House 2 have AC?',                                  answer: 'Yes, Mud House 2 has air conditioning, vintage-style lantern lighting, and a ceiling fan.' },
      { question: 'Is Mud House 2 pet friendly?',                               answer: 'Yes, Mud Houses are pet friendly. Please inform us at the time of booking.' },
      { question: 'Do guests staying in Mud Houses get access to the pool?',    answer: 'Yes, all Madhuban guests including Mud House stays have full access to the swimming pool and recreation areas.' },
      { question: 'Can I book Mud House 2 online?',                             answer: 'Yes, Mud House 2 bookings can be made directly through this website to secure the best available rates.' },
    ],
  },

  {
    slug: 'pool-side-villa',
    name: 'Pool Side Villa',
    pricePerNight: 12000,
    tagline: 'Scenic poolside seclusion with panoramic forest views.',
    href: '/stay/pool-side-villa',
    genre: 'Eco-Luxury · Pool Villa',
    image: roomImage(
      'pool-side-villa',
      'Aerial view of the Pool Side Villa at Madhuban Eco Retreat with surrounding forest',
    ),
    longDescription: [
      "The Pool Side Villa is Madhuban's signature suite — a standalone mud-architecture villa with direct pool access, a wraparound deck, and uninterrupted forest views.",
      "Step out of bed and into the water. Designed for couples on anniversaries, families on extended stays, or anyone who wants the property's quietest corner with the best amenity within ten paces.",
      "The largest accommodation at Madhuban, the Pool Side Villa offers a level of privacy and indulgence that sets it apart — your own villa, your own deck, your own pool corner.",
    ],
    occupancy: { adults: 2, children: 2 },
    bedConfig: '1 King Bed',
    size: 'Approx. 450 sq ft',
    amenities: [
      'Direct pool access',
      'Air conditioning',
      'En-suite bathroom with rainfall shower',
      'King bed with premium linens',
      'Wraparound deck',
      'Lounge seating',
      'Forest views',
      'Tea and coffee setup',
      'Daily housekeeping',
      'Lantern lighting',
      'Pet friendly',
      'WiFi',
      'Pool access',
      'Breakfast included',
    ],
    highlights: [
      { icon: 'Waves',    title: 'Direct Pool Access',       description: 'Step from your villa straight into the pool — your private corner of the water.' },
      { icon: 'Maximize', title: 'Largest Accommodation',    description: "Madhuban's most spacious room, with a wraparound deck for slow mornings." },
      { icon: 'Home',     title: 'Standalone Villa',         description: 'Mud architecture as a private retreat — no shared walls, only forest.' },
      { icon: 'Heart',    title: 'Designed for Two',         description: 'Built around couples and small families seeking the property\'s premium experience.' },
    ],
    gallery: galleryImages('pool-side-villa', [
      'Bedroom interior with bamboo ceiling at the Pool Side Villa',
      'Lobby and entry hall of the Pool Side Villa',
      'Pool Side Villa exterior in daylight',
      'Pool reflection of the villa during golden hour',
      'Wide view of the swimming pool at the Pool Side Villa',
    ]),
    faqs: [
      { question: 'What is the price of Pool Side Villa stay at Madhuban?',        answer: 'Pool Side Villa is priced at ₹12,000 per night, including GST.' },
      { question: 'Is the Pool Side Villa the best villa near Bhopal?',            answer: 'Pool Side Villa is Madhuban\'s most spacious accommodation with direct pool access — among the most distinctive eco-luxury villa stays in the Ratapani region.' },
      { question: 'Is Pool Side Villa suitable for families or couples?',          answer: 'Yes. The Pool Side Villa accommodates 2 adults and 2 children with a king bed and lounge seating area.' },
      { question: 'Does Pool Side Villa have AC?',                                 answer: 'Yes, Pool Side Villa includes air conditioning, ceiling fan, and ambient lantern lighting.' },
      { question: 'Is Pool Side Villa pet friendly?',                              answer: 'Yes, Pool Side Villa is pet friendly. Please inform us at the time of booking.' },
      { question: 'Does Pool Side Villa have its own pool access?',                answer: 'Yes — the villa opens directly onto the swimming pool with a private deck.' },
      { question: 'Can I book Pool Side Villa online?',                            answer: 'Yes, Pool Side Villa bookings can be made directly through this website to secure the best available rates.' },
    ],
  },

  {
    slug: 'glamping-tents',
    name: 'Glamping Tent',
    pricePerNight: 7500,
    tagline: 'Boutique glamping with chic décor and private sit-outs.',
    href: '/stay/glamping-tents',
    genre: 'Eco-Luxury · Canvas Glamping',
    image: roomImage(
      'glamping-tents',
      'Glamping Tent at Madhuban with green canopy curtains and cane porch chairs',
    ),
    longDescription: [
      "Glamping at Madhuban means sleeping under canvas without the camping work. Our glamping tents come fully furnished with proper beds, electric lighting, fans, and an attached private bathroom.",
      "Open the canvas flaps in the morning and the forest is right there — no walls between you and the birdsong.",
      "Perfect for first-time campers, couples, or anyone who wants the romance of a tent and the comfort of a hotel.",
    ],
    occupancy: { adults: 2, children: 1 },
    bedConfig: '1 Queen Bed',
    size: 'Approx. 220 sq ft',
    amenities: [
      'Attached private bathroom',
      'Air conditioning',
      'Ceiling fan',
      'Electric lighting',
      'Premium bedding',
      'Canopy bed',
      'Daily housekeeping',
      'Tea setup',
      'Power outlets',
      'Mosquito netting',
      'Forest views',
      'Pet friendly',
      'WiFi',
      'Pool access',
      'Breakfast included',
    ],
    highlights: [
      { icon: 'BedDouble',  title: 'Real Beds, Real Bathrooms', description: 'None of the camping discomfort — just the romance of canvas.' },
      { icon: 'Trees',      title: 'Forest Immersion',          description: 'Wake to birdsong with only a canvas wall between you and the trees.' },
      { icon: 'Sparkles',   title: 'First-Timer Friendly',      description: 'Designed for travelers new to outdoor stays — full comforts included.' },
      { icon: 'ShowerHead', title: 'Private Bathroom',          description: 'Attached, en-suite, with hot water and modern fittings.' },
    ],
    gallery: galleryImages('glamping-tents', [
      'Interior of a glamping tent with king bed at Madhuban',
      'Exterior of a glamping tent in daylight',
      "Front view of the glamping tent's canvas entrance",
      'Bathroom shower inside the glamping tent',
      'Bathroom view inside the glamping tent',
    ]),
    faqs: [
      { question: 'What is the price of Glamping Tent stay at Madhuban?',              answer: 'Glamping Tent is priced at ₹7,500 per night, including GST.' },
      { question: 'Is Glamping at Madhuban good for first-time campers?',              answer: "Yes. Madhuban's glamping tents include real beds, AC, and attached bathrooms — designed for travelers who want forest immersion without camping discomfort." },
      { question: 'Are Glamping Tents suitable for families or couples?',              answer: 'Yes. Glamping Tents accommodate 2 adults and 1 child, with a comfortable queen bed and lounge seating.' },
      { question: 'Does the Glamping Tent have AC?',                                   answer: 'Yes, Glamping Tents include air conditioning, ceiling fan, and electric lighting.' },
      { question: 'Is the Glamping Tent pet friendly?',                                answer: 'Yes, Glamping Tents are pet friendly. Please inform us at the time of booking.' },
      { question: 'Do guests staying in Glamping Tents get access to the pool?',       answer: 'Yes, all Madhuban guests including Glamping Tent stays have full access to the swimming pool.' },
      { question: 'Can I book a Glamping Tent online?',                                answer: 'Yes, Glamping Tent bookings can be made directly through this website to secure the best available rates.' },
    ],
  },

  {
    slug: 'camping-tent',
    name: 'Camping Tent',
    pricePerNight: 2500,
    tagline: 'Off-grid stays under starry skies for true adventure-seekers.',
    href: '/stay/camping-tent',
    genre: 'Nature Stay · Camping',
    image: roomImage(
      'camping-tent',
      'Camping Tent pitched on grass in the Madhuban camping ground',
    ),
    longDescription: [
      "For the traveler who wants the real thing: a proper tent, a bonfire pit, a sky full of stars.",
      "Camping tents at Madhuban use sturdy waterproof shells with comfortable bedding inside, and shared bathroom facilities a short walk away.",
      "Wake to birdsong, sleep to crickets. The most affordable way to stay at Madhuban — and arguably the most authentic.",
    ],
    occupancy: { adults: 2, children: 0 },
    bedConfig: 'Twin sleeping mats with bedding',
    size: 'Approx. 100 sq ft',
    amenities: [
      'Waterproof tent shell',
      'Sleeping mats with bedding',
      'Pillows and blankets',
      'Shared bathroom facilities',
      'Bonfire pit access',
      'Lantern lighting',
      'Daily cleaning',
      'Forest setting',
      'Pet friendly',
      'WiFi',
      'Pool access',
      'Breakfast included',
    ],
    highlights: [
      { icon: 'Tag',   title: 'Most Affordable Stay', description: "Madhuban's nature experience at the most accessible price." },
      { icon: 'Tent',  title: 'Authentic Camping',    description: 'Real tents under real stars — outdoor stays the way they should be.' },
      { icon: 'Flame', title: 'Bonfire Nights',       description: 'Communal fire pit, songs, and stargazing — Madhuban at its most social.' },
      { icon: 'Trees', title: 'Forest Front Row',     description: 'Set among the trees with morning birdsong as your alarm clock.' },
    ],
    gallery: galleryImages('camping-tent', [
      'Three camping tents in a row under tree shade',
      'Camping tents on a grassy clearing at Madhuban',
      'Two camping tents with a mountain backdrop',
      'Outdoor seating chair near the campsite',
      'Private outdoor shower at the camping site',
    ]),
    faqs: [
      { question: 'What is the price of Camping Tent stay at Madhuban?',          answer: 'Camping Tent is priced at ₹2,500 per night, including GST.' },
      { question: 'Is Camping at Madhuban a real outdoor experience?',            answer: 'Yes. Camping Tents at Madhuban are authentic outdoor stays — real tents, sleeping mats, shared bathrooms, and bonfire pit access for the traditional experience.' },
      { question: 'Are Camping Tents suitable for families or couples?',          answer: 'Camping Tents are designed for 2 adults. Children and families seeking more comfort are recommended to book Glamping Tents or Mud Houses instead.' },
      { question: 'Does the Camping Tent have AC?',                               answer: 'Yes — even our most affordable Camping Tents are equipped with AC and lantern lighting.' },
      { question: 'Is the Camping Tent pet friendly?',                            answer: 'Yes, Camping Tents are pet friendly. Please inform us at the time of booking.' },
      { question: 'Do guests staying in Camping Tents get access to the pool?',   answer: 'Yes, all Madhuban guests including Camping Tent stays have full access to the swimming pool.' },
      { question: 'Can I book a Camping Tent online?',                            answer: 'Yes, Camping Tent bookings can be made directly through this website to secure the best available rates.' },
    ],
  },
];
