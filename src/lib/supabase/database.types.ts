// Stub until: pnpm supabase gen types typescript --project-id <id> > src/lib/supabase/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: Json | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  category: string | null;
  tags: string[] | null;
  seo_title: string | null;
  meta_description: string | null;
  status: "draft" | "published";
  published_at: string | null;
  read_time_minutes: number | null;
  author_name: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: BlogPostRow;
        Insert: Omit<BlogPostRow, "id" | "created_at" | "updated_at"> &
          Partial<Pick<BlogPostRow, "id" | "created_at" | "updated_at">>;
        Update: Partial<BlogPostRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
