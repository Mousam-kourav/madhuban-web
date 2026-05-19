import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { EXPERIENCES } from "@/lib/content/experiences";
import { ATTRACTIONS } from "@/lib/attractions/data";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.madhubanecoretreat.com";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}/`, changeFrequency: "monthly", priority: 1.0 },
  { url: `${BASE_URL}/stay`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/experiences`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/dining`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/day-outing`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/blogs`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/about-us`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/gallery`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/nearby-attractions`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/aranyashala`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE_URL}/souvenir-shop`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE_URL}/contact-us`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/enquire`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/booking`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/corporate-offsite`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/packages/2-day-digital-detox`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/privacy-policy`, changeFrequency: "monthly", priority: 0.4 },
  { url: `${BASE_URL}/terms-and-condition`, changeFrequency: "monthly", priority: 0.4 },
  { url: `${BASE_URL}/cookies-and-consent-policy`, changeFrequency: "monthly", priority: 0.4 },
  { url: `${BASE_URL}/disclaimer`, changeFrequency: "monthly", priority: 0.4 },
];

const EXPERIENCE_ROUTES: MetadataRoute.Sitemap = EXPERIENCES.map((exp) => ({
  url: `${BASE_URL}${exp.href}`,
  changeFrequency: "monthly" as const,
  priority: 0.6,
}));

const ATTRACTION_ROUTES: MetadataRoute.Sitemap = ATTRACTIONS.map((a) => ({
  url: `${BASE_URL}/nearby-attractions/${a.slug}`,
  changeFrequency: "monthly" as const,
  priority: 0.6,
}));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const roomRoutes: MetadataRoute.Sitemap = [];
  const blogRoutes: MetadataRoute.Sitemap = [];
  const souvenirRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabase = await createClient();

    const { data: rooms } = await supabase
      .from("rooms")
      .select("slug, updated_at")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    for (const room of rooms ?? []) {
      roomRoutes.push({
        url: `${BASE_URL}/stay/${room.slug}`,
        lastModified: room.updated_at ? new Date(room.updated_at) : undefined,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    for (const post of posts ?? []) {
      blogRoutes.push({
        url: `${BASE_URL}/blogs/${post.slug}`,
        lastModified: post.published_at ? new Date(post.published_at) : undefined,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    const { data: souvenirs } = await supabase
      .from("souvenirs")
      .select("slug, updated_at")
      .eq("is_active", true)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true });

    for (const item of souvenirs ?? []) {
      souvenirRoutes.push({
        url: `${BASE_URL}/souvenir-shop/${item.slug}`,
        lastModified: item.updated_at ? new Date(item.updated_at) : undefined,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  } catch {
    // Supabase unavailable at build time — return static routes only.
    // Dynamic routes will be crawled via internal links.
  }

  return [
    ...STATIC_ROUTES,
    ...roomRoutes,
    ...EXPERIENCE_ROUTES,
    ...ATTRACTION_ROUTES,
    ...blogRoutes,
    ...souvenirRoutes,
  ];
}
