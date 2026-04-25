// TODO: Editorial pass post-launch. Live content has keyword-stuffed phrasing
// preserved per CLAUDE.md §10.3 client decision. Do not rewrite during code rebuild.

export const HERO_COPY = {
  h1: 'Connect With Wildlife & Nature',
  subhead:
    'Experience eco-luxury living amid the serene wilderness of Ratapani Tiger Reserve at Madhuban Eco Retreat — a peaceful forest stay offering sustainable comfort and mindful escapes.',
  ctaPrimary: { label: 'Book Your Stay', href: '/booking' },
  ctaSecondary: { label: 'Explore Experiences', href: '/experiences' },
} as const;

export const WELCOME_COPY = {
  heading: 'Welcome to "Madhuban Eco Retreat"',
  paragraph1:
    'Located just an hour from Bhopal, Madhuban is a premium eco resort near Bhopal designed for travelers who love nature, wellness, and responsible travel. As a leading Ratapani eco lodge, we are nestled beside the scenic teak forests of Ratapani Wildlife Sanctuary, offering a rare blend of sustainable hospitality and natural luxury.',
  paragraph2:
    "As one of the best forest resorts near Bhopal and a top choice for eco-tourism near Bhopal and Ratapani, Madhuban invites you to reconnect with the outdoors through forest walks, birdwatching, organic dining, and peaceful eco-friendly stays. Whether you're planning the best weekend getaway near Bhopal, a family vacation, or a quiet wellness escape, this nature resort in Ratapani is the perfect place to breathe, slow down, and reconnect with nature.",
  ctaSecondary: { label: 'About Madhuban', href: '/about-us' },
} as const;

/** Sourced from live site sustainability section — all figures are factual claims. */
export const STATS = [
  { value: '80%', label: 'of energy from solar' },
  { value: '80%', label: 'local community staff' },
  { value: '70+', label: 'bird species recorded' },
  { value: '60 km', label: 'from Bhopal' },
] as const;

/** AEO answer block — 40-80 words, speakable via .answer-block CSS selector. */
export const ANSWER_BLOCK =
  'Madhuban Eco Retreat is an eco-luxury forest resort located 60 km from Bhopal, Madhya Pradesh, beside Ratapani Wildlife Sanctuary. The property offers six accommodation types including safari tents, mud houses, glamping tents, a poolside villa, and a camping ground. Operated by the Somaiya Group, Madhuban combines sustainable hospitality, low-impact architecture, and immersive nature experiences in the teak forests of central India.' as const;
