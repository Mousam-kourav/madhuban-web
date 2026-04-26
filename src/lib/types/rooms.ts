import type { Json } from "@/lib/supabase/database.types";

// Raw DB row shape — snake_case, matches Supabase columns exactly.
export type DbRoom = {
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
  amenities: Json | null;        // string[]
  images: Json | null;           // legacy booking-engine images
  is_active: boolean;
  min_nights: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Phase 5B additions
  tagline: string | null;
  genre: string | null;
  href: string | null;
  hero_image: Json | null;       // RoomImage shape from rooms.ts
  long_description: Json | null; // TiptapDoc
  bed_config: string | null;
  size_label: string | null;
  highlights: Json | null;       // RoomHighlight[]
  gallery: Json | null;          // RoomGalleryImage[]
  seo_title: string | null;
  seo_description: string | null;
};

export type DbRoomFaq = {
  id: string;
  room_id: string;
  question: string;
  answer: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

// Inline types matching the jsonb shapes stored by the seed script.
export type GalleryItem = {
  alt: string;
  webp: { mobile: string; desktop: string };
  jpg: { mobile: string; desktop: string };
};

export type HeroImageItem = {
  alt: string;
  webp: { mobile: string; tablet: string; desktop: string };
  jpg: { mobile: string; tablet: string; desktop: string };
};

export type HighlightItem = {
  icon: string;
  title: string;
  description: string;
};
