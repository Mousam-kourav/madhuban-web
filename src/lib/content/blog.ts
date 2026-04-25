// TODO Phase 5: Replace placeholder blog data with Supabase fetch. Image files at home/blog/ also need uploading.

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';

export type BlogImage = {
  alt: string;
  webp: { mobile: string; desktop: string };
  jpg:  { mobile: string; desktop: string };
};

export type BlogPost = {
  slug: string;
  title: string;
  /** ~140 chars, ends with ellipsis-style cliffhanger */
  excerpt: string;
  /** ISO 8601 date string */
  publishedAt: string;
  readMinutes: number;
  image: BlogImage;
  /** Canonical URL for the blog article */
  href: string;
};

function blogImage(slug: string, alt: string): BlogImage {
  return {
    alt,
    webp: {
      mobile:  `${R2_BASE}/home/blog/${slug}-480.webp`,
      desktop: `${R2_BASE}/home/blog/${slug}-800.webp`,
    },
    jpg: {
      mobile:  `${R2_BASE}/home/blog/${slug}-480.jpg`,
      desktop: `${R2_BASE}/home/blog/${slug}-800.jpg`,
    },
  };
}

export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: 'best-time-to-visit-ratapani-tiger-reserve',
    title: 'The Best Time to Visit Ratapani Tiger Reserve',
    excerpt: `From bird migration peaks in winter to monsoon greenery — a season-by-season guide to planning your visit.`,
    publishedAt: '2026-03-15',
    readMinutes: 6,
    href: '/blogs/best-time-to-visit-ratapani-tiger-reserve',
    image: blogImage(
      'best-time-to-visit-ratapani-tiger-reserve',
      'Tiger paw prints in dust at Ratapani Tiger Reserve',
    ),
  },
  {
    slug: 'weekend-getaway-from-bhopal',
    title: 'A Perfect Weekend Getaway 60 km from Bhopal',
    excerpt: `How to plan a 2-day forest escape from Bhopal with family, including drive time, day-trip options, and packing tips.`,
    publishedAt: '2026-02-28',
    readMinutes: 5,
    href: '/blogs/weekend-getaway-from-bhopal',
    image: blogImage(
      'weekend-getaway-from-bhopal',
      'Forest trail at Madhuban during golden hour',
    ),
  },
  {
    slug: '70-bird-species-madhuban',
    title: '70+ Bird Species You Can Spot at Madhuban',
    excerpt: `From paradise flycatchers to fan-throated lizards — a guide to the wildlife guests have spotted on our trails.`,
    publishedAt: '2026-02-10',
    readMinutes: 7,
    href: '/blogs/70-bird-species-madhuban',
    image: blogImage(
      '70-bird-species-madhuban',
      'Paradise flycatcher perched on a branch at Madhuban',
    ),
  },
] as const;
