export const CATEGORIES = [
  { slug: 'apparel',     label: 'Apparel' },
  { slug: 'books',       label: 'Books & Journals' },
  { slug: 'handicrafts', label: 'Handicrafts' },
  { slug: 'food-spices', label: 'Food & Spices' },
  { slug: 'wellness',    label: 'Wellness' },
  { slug: 'accessories', label: 'Accessories' },
  { slug: 'general',     label: 'General' },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

export function getCategoryLabel(slug: string): string {
  const found = CATEGORIES.find((c) => c.slug === slug);
  return found?.label ?? slug;
}
