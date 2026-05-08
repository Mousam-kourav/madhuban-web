// TODO Phase 5: Update BlogPreview to fetch live posts from Supabase directly.

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

// Placeholder posts removed — they linked to slugs that don't exist in Supabase and caused 404s.
// BlogPreview on the homepage will hide itself when this array is empty.
// Phase 5 follow-up: update BlogPreview to fetch live posts from Supabase directly.
export const BLOG_POSTS: readonly BlogPost[] = [];
