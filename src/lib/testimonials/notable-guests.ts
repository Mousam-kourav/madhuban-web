export interface NotableGuest {
  slug: string;
  name: string;
  role: string;
  /** R2 path relative to R2_BASE, e.g. "testimonials/vidya-balan/portrait.webp". */
  image: string;
}

export const NOTABLE_GUESTS: readonly NotableGuest[] = [
  {
    slug: 'vidya-balan',
    name: 'Vidya Balan',
    role: 'Indian Actress',
    image: 'testimonials/vidya-balan/portrait.webp',
  },
  {
    slug: 'vijay-raaz',
    name: 'Vijay Raaz',
    role: 'Indian Actor',
    image: 'testimonials/vijay-raaz/portrait.webp',
  },
  {
    slug: 'samir-somaiya',
    name: 'Samir Somaiya',
    role: 'President, Somaiya Group',
    image: 'testimonials/samir-somaiya/portrait.webp',
  },
] as const;
