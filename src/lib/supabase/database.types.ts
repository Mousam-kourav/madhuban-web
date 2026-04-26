// Hand-maintained until: pnpm supabase gen types typescript --project-id <id> > src/lib/supabase/database.types.ts

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

type RoomRow = {
  id: string;
  slug: string;
  name: string;
  description_short: string | null;
  description_long: string | null;
  max_occupancy: number;
  max_occupancy_children: number;
  base_price_per_night: number;
  gst_rate: number | null;
  peak_multiplier: number | null;
  amenities: Json | null;
  images: Json | null;
  is_active: boolean;
  min_nights: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  tagline: string | null;
  genre: string | null;
  href: string | null;
  hero_image: Json | null;
  long_description: Json | null;
  bed_config: string | null;
  size_label: string | null;
  highlights: Json | null;
  gallery: Json | null;
  seo_title: string | null;
  seo_description: string | null;
};

type RoomFaqRow = {
  id: string;
  room_id: string;
  question: string;
  answer: string;
  display_order: number;
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
      rooms: {
        Row: RoomRow;
        Insert: {
          // Required (no DB default, NOT NULL in DB)
          slug: string;
          name: string;
          base_price_per_night?: number;
          // Optional — have DB defaults or are nullable
          id?: string;
          created_at?: string;
          updated_at?: string;
          max_occupancy?: number;
          max_occupancy_children?: number;
          is_active?: boolean;
          sort_order?: number;
          description_short?: string | null;
          description_long?: string | null;
          gst_rate?: number | null;
          peak_multiplier?: number | null;
          amenities?: Json | null;
          images?: Json | null;
          min_nights?: number | null;
          tagline?: string | null;
          genre?: string | null;
          href?: string | null;
          hero_image?: Json | null;
          long_description?: Json | null;
          bed_config?: string | null;
          size_label?: string | null;
          highlights?: Json | null;
          gallery?: Json | null;
          seo_title?: string | null;
          seo_description?: string | null;
        };
        Update: Partial<RoomRow>;
        Relationships: [];
      };
      room_faqs: {
        Row: RoomFaqRow;
        Insert: {
          room_id: string;
          question: string;
          answer: string;
          id?: string;
          created_at?: string;
          updated_at?: string;
          display_order?: number;
        };
        Update: Partial<RoomFaqRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
