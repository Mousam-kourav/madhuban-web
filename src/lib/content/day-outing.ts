const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';

export const DAY_OUTING = {
  hero: {
    eyebrow: 'Madhuban Eco Retreat',
    h1: 'A day in the forest',
    subheading:
      'Full property access for the day — meals, infinity pool, guided walks, recreation. 90 minutes from Bhopal, back home by night.',
    image: {
      desktop: `${R2_BASE}/home/day-outing/day-outing-hero-image-1280px.webp`,
      mobile: `${R2_BASE}/home/day-outing/day-outing-hero-image-800px.webp`,
      alt: 'Guests enjoying a day outing at Madhuban Eco Retreat surrounded by lush forest near Bhopal',
    },
  },

  video: {
    src: `${R2_BASE}/home/day-outing/day-outing-madhuban.mp4`,
    poster: `${R2_BASE}/home/day-outing/day-outing-hero-image-1280px.webp`,
  },

  intro: {
    heading: 'A Perfect One-Day Escape into Nature Near Bhopal',
    paragraphs: [
      'Looking for the best resorts near Bhopal for day outing that offer nature, comfort, great food, and peaceful surroundings — all without an overnight stay? Welcome to Madhuban Eco Retreat, a forest-side eco-luxury destination near Ratapani Wildlife Sanctuary, designed for meaningful one-day experiences close to nature.',
      'Our thoughtfully curated Day Outing Package is perfect for families, corporate groups, friends, and travelers from Bhopal and Indore who want to escape the city, unwind in a natural setting, and return refreshed — all in a single day.',
    ],
    highlights: [
      {
        title: 'Forest-Side Luxury',
        description: 'Elegant spaces nestled right at the edge of the wilderness.',
      },
      {
        title: 'Tranquil Environment',
        description: 'A peaceful escape from the noise and hustle of city life.',
      },
    ] as const,
  },

  package: {
    heading: 'Day Outing Package',
    subheading: 'One price. All-inclusive luxury. Memories for a lifetime.',
    price: '₹1,300',
    priceUnit: 'PERSON',
    inclusionsHeading: 'Complete Day Outing Inclusions',
    inclusions: [
      { label: 'Breakfast & Lunch', icon: 'UtensilsCrossed' },
      { label: 'High Tea & Snacks', icon: 'Coffee' },
      { label: 'Swimming Pool Access', icon: 'Waves' },
      { label: 'Nature Walk & Trails', icon: 'Trees' },
      { label: 'Obstacle Course', icon: 'Mountain' },
      { label: 'Outdoor Games', icon: 'Gamepad2' },
    ] as const,
    closingLine:
      'This makes Madhuban one of the most complete resorts near Bhopal for day outing with lunch and pool access.',
    image: {
      desktop: `${R2_BASE}/home/day-outing/Complete-Day-Outing-Inclusions-image-1-1200px.webp`,
      mobile: `${R2_BASE}/home/day-outing/Complete-Day-Outing-Inclusions-image-1-800px.webp`,
      alt: 'Complete day outing inclusions at Madhuban Eco Retreat — pool access, nature walk, and gourmet meals near Bhopal',
    },
  },

  whyChooseUs: {
    heading: 'Why Choose Us',
    subheading:
      'What sets Madhuban apart from typical day-visit resorts is the experience itself.',
    cards: [
      {
        title: 'Nature-Centered Experience',
        description:
          'Immerse yourself in authentic wilderness where the rustling leaves are the only soundtrack to your day.',
        icon: 'TreePine',
      },
      {
        title: 'Eco-Friendly & Peaceful',
        description:
          'Sustainable practices and minimal disruption to the local ecosystem ensure a guilt-free luxury experience.',
        icon: 'Leaf',
      },
      {
        title: 'Ideal for All Groups',
        description:
          'Tailored experiences for kids, families, corporate teams looking for offsites, and friends seeking adventure.',
        icon: 'Users',
      },
    ] as const,
  },

  idealFor: {
    heading: 'Who Should Choose This Day Outing Package',
    subheading:
      'Escape the bustle of Bhopal and reconnect with nature in a sanctuary designed for every kind of explorer.',
    image: {
      // These filenames contain spaces — URL-encoded as %20 per R2 upload
      desktop: `${R2_BASE}/home/day-outing/Complete%20Day%20Outing%20Inclusions%20image%202%201200%20px.webp`,
      mobile: `${R2_BASE}/home/day-outing/Complete%20Day%20Outing%20Inclusions%20image%202%20800%20px.webp`,
      alt: 'Families and groups enjoying the day outing package at Madhuban Eco Retreat near Bhopal',
    },
    cards: [
      {
        title: 'One Day Picnickers',
        description:
          'Perfect for those seeking a quick escape near Bhopal without the commitment of an overnight stay. Rejuvenate your spirit in a single day.',
        icon: 'MapPin',
      },
      {
        title: 'Corporate Teams',
        description:
          'Boost morale with tailored corporate day outings designed for team bonding in the lap of nature. Professional yet profoundly refreshing.',
        icon: 'Briefcase',
      },
      {
        title: 'Families',
        description:
          'A safe, hygienic, and serene environment where children and elders alike can relax. Create memories that bridge generations.',
        icon: 'Heart',
      },
      {
        title: 'Nature Lovers',
        description:
          'Immerse yourself in a short forest escape with lush greenery and tranquil vibes. Discover rare flora and fauna just outside the city.',
        icon: 'Binoculars',
      },
      {
        title: 'Pool & Lunch Seekers',
        description:
          'Enjoy full access to our crystal-clear pool followed by a gourmet buffet lunch. The ultimate combination for a relaxing weekend or weekday break.',
        icon: 'Waves',
      },
    ] as const,
  },

  importantInfo: {
    heading: 'Important Information',
    items: [
      { label: 'Package Type', value: 'Day Outing (No Stay)', icon: 'Tag' },
      { label: 'Alcohol', value: 'Not served', icon: 'Wine' },
      { label: 'Price', value: '₹1,300 per person', icon: 'Banknote' },
      { label: 'Advance Booking', value: 'Recommended for groups', icon: 'CalendarCheck' },
      { label: 'Food', value: 'Pure Vegetarian', icon: 'Salad' },
    ] as const,
  },

  easyAccess: {
    heading: 'Easy Access from Bhopal, Indore & Nearby Regions',
    subheading:
      'Madhuban Eco Retreat is conveniently reachable for day travelers seeking a peaceful escape from the city bustle.',
    locations: [
      {
        from: 'From Bhopal',
        description: 'Ideal same-day return for urban explorers.',
        distance: 'Approx. 45-minute drive',
        icon: 'Car',
      },
      {
        from: 'From Indore',
        description: 'Popular choice for planned weekend group outings.',
        distance: 'Approx. 3-hour drive',
        icon: 'Navigation',
      },
      {
        from: 'Near Ratapani & Satpura',
        description: "Perfect nature setting integrated within MP's finest reserves.",
        distance: 'Nature at your doorstep',
        icon: 'TreePine',
      },
    ] as const,
    closingLine:
      'If you are searching online for resorts near Bhopal for day outing, Madhuban offers the perfect balance of distance, comfort, and experience.',
  },

  contact: {
    heading: 'Book Your Day Outing at Madhuban Eco Retreat',
    subheading:
      "If you're exploring resorts near Bhopal for a day outing that offers genuine nature, good food, open spaces, and meaningful activities — Madhuban Eco Retreat is the right choice. Spend a day surrounded by forests, enjoy mindful experiences, and return home relaxed and refreshed.",
    formHeading: 'Contact us to book your Day Outing Package',
  },

  trustItems: [
    { label: 'Mindful Nature', icon: 'Leaf' },
    { label: 'Organic Dining', icon: 'UtensilsCrossed' },
    { label: 'Eco-Friendly', icon: 'Recycle' },
  ] as const,
} as const;
