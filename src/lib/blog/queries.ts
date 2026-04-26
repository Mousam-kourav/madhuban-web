import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BlogPost, BlogPostSummary } from "./types";

export async function getPublishedPosts(): Promise<BlogPostSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, cover_image_url, cover_image_alt, category, published_at, read_time_minutes, author_name",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as BlogPostSummary[];
}

export async function getPublishedPost(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as BlogPost;
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((p: { slug: string }) => p.slug);
}

export async function getRelatedPosts(
  currentSlug: string,
): Promise<BlogPostSummary[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, cover_image_url, cover_image_alt, category, published_at, read_time_minutes, author_name",
    )
    .eq("status", "published")
    .neq("slug", currentSlug)
    .order("published_at", { ascending: false })
    .limit(3);
  return (data ?? []) as BlogPostSummary[];
}
