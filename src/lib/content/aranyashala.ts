const R2 = process.env.NEXT_PUBLIC_R2_BASE ?? '';

type ImageVariants = {
  readonly desktop: string;
  readonly mobile: string;
  readonly alt: string;
};

type Aranyashala = {
  hero: { eyebrow: string; title: string; subtitle: string; image: ImageVariants };
  missionQuote: string;
  missionPillars: ReadonlyArray<{ title: string; description: string }>;
  modules: {
    forestWildlife: {
      title: string;
      body: string;
      activities: readonly string[];
      image: ImageVariants;
    };
    lifeSkill: {
      title: string;
      body: string;
      activities: ReadonlyArray<{ icon: string; label: string; description: string }>;
      image: ImageVariants;
    };
    heritage: {
      title: string;
      body: string;
      highlights: readonly string[];
      image: ImageVariants;
    };
  };
  natureTrail: {
    title: string;
    subtitle: string;
    stops: ReadonlyArray<{ name: string; icon: string }>;
    footer: string;
  };
  camping: {
    title: string;
    paragraphs: readonly string[];
    features: readonly string[];
    image: ImageVariants;
  };
  resourcePersons: ReadonlyArray<{ name: string; role: string; image: string }>;
  testimonials: {
    featured: { quote: string; role: string; image: string };
    others: ReadonlyArray<{ quote: string; role: string; image: string }>;
  };
  courses: ReadonlyArray<{ tier: string; duration: string; includes: readonly string[] }>;
  faqs: ReadonlyArray<{ question: string; answer: string }>;
  cta: { phone: string; email: string };
};

export const ARANYASHALA: Aranyashala = {
  hero: {
    eyebrow: 'Madhuban Eco Retreat · Ratapani Wildlife Sanctuary',
    title: 'Aranyashala — The Nature School',
    subtitle:
      'Imparting nature-based learning to the young generation through multi-day immersive forest camps.',
    image: {
      desktop: `${R2}/aranyashala/hero-1280.webp`,
      mobile: `${R2}/aranyashala/hero-800.webp`,
      alt: 'Students and staff gathered at the lakeside during an Aranyashala nature school camp at Madhuban Eco Retreat',
    },
  },

  missionQuote:
    'Nature Camps provide a unique opportunity beyond classrooms to explore and engage the natural environment, helping youth become responsible stewards of the planet — while aiding personal growth and self-discovery.',

  missionPillars: [
    {
      title: 'Forest & Wildlife Interpretation',
      description: 'Direct learning with the ecosystem',
    },
    {
      title: 'Life Skill Development',
      description: 'Teamwork, resilience, critical thinking',
    },
    {
      title: 'Heritage & Cultural Awareness',
      description: 'Tribal traditions, UNESCO heritage sites',
    },
  ],

  modules: {
    forestWildlife: {
      title: 'Forest and Wildlife Interpretation',
      body: 'This module facilitates students in understanding the theoretical aspect of environmental learning in fun and interactive manner. Nature walks, jungle safaris and open-air expert sessions on trees, birds and mammals help in nurturing their bond with nature.',
      activities: [
        'Guided forest interpretation walks',
        'Bird watching sessions with experts',
        'Animal track and pugmark identification',
        'Open-air sessions on trees, mammals, insects',
        'Nature journaling exercises',
      ],
      image: {
        desktop: `${R2}/aranyashala/wildlife-1280.webp`,
        mobile: `${R2}/aranyashala/wildlife-800.webp`,
        alt: 'Wildlife expert presenting a session on territorial animal behaviour to Aranyashala students',
      },
    },

    lifeSkill: {
      title: 'Life Skill Development',
      body: 'This aspect of the program is focused on imparting key learnings on jungle survival, team building and critical thinking. Students participate in camp pitching, treasure hunting and age-appropriate adventure activities to build rigour and confidence.',
      activities: [
        {
          icon: 'Tent',
          label: 'Tent Pitching',
          description: 'Set up camp in the wilderness',
        },
        {
          icon: 'Map',
          label: 'Treasure Hunts',
          description: 'Navigate and problem-solve outdoors',
        },
        {
          icon: 'Activity',
          label: 'Rope Climbing',
          description: 'Build grit and physical confidence',
        },
        {
          icon: 'Bike',
          label: 'Cycling Trails',
          description: 'Explore forest trails on two wheels',
        },
      ],
      image: {
        desktop: `${R2}/aranyashala/life-skills-1280.webp`,
        mobile: `${R2}/aranyashala/life-skills-800.webp`,
        alt: 'Student cycling through a forested trail during the life skill development module at Aranyashala',
      },
    },

    heritage: {
      title: 'Heritage and Cultural Awareness',
      body: 'Madhya Pradesh is home to flourishing tribal communities and provides a unique opportunity to sensitize our young generation about tribal culture and lifestyle. Tribal village tours, storytelling and folk-dance programs are some of the highlights of the program. Students also get the opportunity to visit UNESCO world heritage site Bhimbetka, a Paleolithic and Mesolithic age cavemen rock shelter site.',
      highlights: ['Tribal Village Tours', 'Folk Dance & Storytelling', 'UNESCO Bhimbetka Heritage Visit'],
      image: {
        desktop: `${R2}/aranyashala/heritage-1280.webp`,
        mobile: `${R2}/aranyashala/heritage-800.webp`,
        alt: 'Students visiting the Bhimbetka UNESCO World Heritage Site rock shelters as part of the Aranyashala heritage module',
      },
    },
  },

  natureTrail: {
    title: 'The Madhuban Nature Trail — A Living Classroom',
    subtitle:
      'A 2–3 km guided walk with 19 learning stops, completed in 1–2 hours. Each stop is a hands-on encounter with a different facet of forest life.',
    stops: [
      { name: 'Welcome and Orientation', icon: 'Compass' },
      { name: 'Story of Trees', icon: 'Trees' },
      { name: 'About Grasslands', icon: 'Wind' },
      { name: 'Rocks', icon: 'Mountain' },
      { name: 'Termites, Spiders and Insects', icon: 'Bug' },
      { name: 'Pugmark Identification', icon: 'Footprints' },
      { name: 'Antlers and Horns', icon: 'Star' },
      { name: "Porcupine's Fork", icon: 'GitFork' },
      { name: "Snakes' Skin", icon: 'Waves' },
      { name: 'Rock Shelters', icon: 'Home' },
      { name: 'Wetland Birds', icon: 'Bird' },
      { name: 'Ant Mounds and Beehives', icon: 'Hexagon' },
      { name: 'Places of Attraction', icon: 'Landmark' },
      { name: 'Water Body', icon: 'Droplets' },
      { name: "Wild Animals' Droppings", icon: 'CircleAlert' },
      { name: 'Water Hole', icon: 'Droplet' },
      { name: 'Medicinal Plants', icon: 'Flower' },
      { name: 'Symbiosis and Man-Animal Conflict', icon: 'Link' },
      { name: 'Debriefing and Dispersal', icon: 'CheckCircle' },
    ],
    footer: 'Length 2–3 km · Time 1–2 hours · Guided by trained naturalists',
  },

  camping: {
    title: 'A Unique Camping Experience Amidst Forests',
    paragraphs: [
      'Students and accompanying teachers can opt to stay in AC swiss tents or alpine tents — designed for comfort without compromising the wilderness experience.',
      'Healthy and nutritious meals are served in our farm-to-fork ethnic cafeteria, where local ingredients meet thoughtful kitchen craft.',
    ],
    features: ['AC Swiss Tents', 'Alpine Tents', 'Farm-to-Fork Cafeteria', 'Bonfire Evenings'],
    image: {
      desktop: `${R2}/aranyashala/camping-1280.webp`,
      mobile: `${R2}/aranyashala/camping-800.webp`,
      alt: 'Camouflage tent set up in a bamboo grove at Madhuban Eco Retreat for the Aranyashala camping experience',
    },
  },

  resourcePersons: [
    {
      name: 'Dr Yogesh Dubey',
      role: 'Professor, Indian Institute of Forest Management',
      image: `${R2}/aranyashala/expert-1.webp`,
    },
    {
      name: 'Dr Sudesh Waghmare',
      role: 'Ex-Deputy Director, Van Vihar National Park · Forestry Expert',
      image: `${R2}/aranyashala/expert-2.webp`,
    },
    {
      name: 'Ms Neelima Mishra',
      role: 'M.Phil. Environmental Policy, Cambridge University',
      image: `${R2}/aranyashala/expert-3.webp`,
    },
    {
      name: 'Mr Arun Rai',
      role: 'Adventure & Camping Expert',
      image: `${R2}/aranyashala/expert-4.webp`,
    },
    {
      name: 'Mr Shibajee Mitra',
      role: 'Herpetologist, Wildlife Expert',
      image: `${R2}/aranyashala/expert-5.webp`,
    },
  ],

  testimonials: {
    featured: {
      quote:
        'Children who come from cities have Nature Deficit Syndrome. Only when we give them meaningful experiences in Nature, will they develop pro-environmental attitudes.',
      role: 'Principal',
      image: `${R2}/aranyashala/testimonial-1.webp`,
    },
    others: [
      {
        quote:
          'We kind of live in a cocoon and believe that we cannot get out of our comfort zone. Once you come here you start believing you can do it.',
        role: 'Student',
        image: `${R2}/aranyashala/testimonial-2.webp`,
      },
      {
        quote:
          'I am carrying double the weight home, because I have collected grass and stones from the Nature walk.',
        role: 'Student',
        image: `${R2}/aranyashala/testimonial-3.webp`,
      },
      {
        quote:
          'Coming here was like unplugging from daily routine. I have never seen such majestic and colorful birds ever.',
        role: 'Student',
        image: `${R2}/aranyashala/testimonial-4.webp`,
      },
      {
        quote:
          'The next generation, custodians of the planet, need to understand the complex nature of human and nature. For that to happen they need to be brought out in the lap of nature.',
        role: 'Educator',
        image: `${R2}/aranyashala/testimonial-5.webp`,
      },
    ],
  },

  courses: [
    {
      tier: 'Young Naturalist',
      duration: '1–2 Days · 1 Night',
      includes: [
        'Guided Madhuban Nature Trail (19 stops)',
        'Introduction to bird watching',
        'Basic camp pitching experience',
        'Farm-to-fork meals included',
        'Campfire evening in bamboo grove',
      ],
    },
    {
      tier: 'Amateur Naturalist',
      duration: '3 Days · 2 Nights',
      includes: [
        'All Young Naturalist activities',
        'Jungle safari & pugmark identification',
        'Tribal village tour & folk dance program',
        'UNESCO Bhimbetka heritage site visit',
        'Treasure hunt & team-building activities',
        'Quiz + completion certificate',
      ],
    },
    {
      tier: 'Professional Naturalist',
      duration: '5 Days · 4 Nights',
      includes: [
        'All Amateur Naturalist activities',
        'Advanced wildlife identification sessions',
        'Herpetology session with Mr. Mitra',
        'Rope climbing & cycling adventure trails',
        'Environmental policy seminar',
        'Formal completion certificate with distinction',
      ],
    },
  ],

  faqs: [
    {
      question: 'How do you assess the learning outcomes of the program?',
      answer:
        'All Naturalist courses have a mandatory quiz component which helps in assessing the learnings of the students. Successful students also get a certificate at the end of the course.',
    },
    {
      question: 'Do you provide customised packages for school and college groups?',
      answer:
        'Yes — we provide customized packages for schools and colleges that fit into existing course curriculum.',
    },
    {
      question: 'What are the safety protocols in case of emergency?',
      answer:
        'We have first aid and CPR-trained personnel in our team. In case of emergency, on-call doctor facility is arranged. The nearest 24×7 government and private hospital is 7 km away — a 15-minute drive from Madhuban.',
    },
    {
      question: 'Is it safe for children in camps?',
      answer:
        'The camp site is fenced from all sides and regular pest treatment is conducted to ensure guest safety. A full-time security guard is also present inside the resort premises.',
    },
  ],

  cta: {
    phone: '+91 9770558419',
    email: 'madhubanresort@somaiya.com',
  },
} as const;
