import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { DbRoom, DbRoomFaq } from "@/lib/types/rooms";

// Public: active rooms only, ordered by sort_order (anon key + RLS).
export async function getRooms(): Promise<DbRoom[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as DbRoom[];
}

// Public: single active room by slug.
export async function getRoomBySlug(slug: string): Promise<DbRoom | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (error) return null;
  return data as DbRoom;
}

// Public: FAQs for a room (ordered).
export async function getRoomFaqs(roomId: string): Promise<DbRoomFaq[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("room_faqs")
    .select("*")
    .eq("room_id", roomId)
    .order("display_order", { ascending: true });
  return (data ?? []) as DbRoomFaq[];
}

// Admin: all room slugs (for generateStaticParams — service role bypasses RLS).
export async function getAllRoomSlugs(): Promise<string[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("rooms")
    .select("slug")
    .eq("is_active", true);
  return (data ?? []).map((r: { slug: string }) => r.slug);
}
