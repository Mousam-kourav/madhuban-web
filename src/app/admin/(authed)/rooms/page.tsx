import { createAdminClient } from "@/lib/supabase/admin";
import type { Metadata } from "next";
import { RoomsAdminClient } from "./rooms-admin-client";

export const metadata: Metadata = { title: "Rooms — Madhuban Admin" };

export type AdminRoom = {
  id: string;
  slug: string;
  name: string;
  base_price_per_night: number;
  is_active: boolean;
  sort_order: number;
  inventory_count: number;
  hero_image: unknown;
  gallery: unknown;
  updated_at: string;
};

export default async function AdminRoomsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("rooms")
    .select("id, slug, name, base_price_per_night, is_active, sort_order, hero_image, gallery, updated_at, inventory_count")
    .order("sort_order", { ascending: true });

  const rooms = (data ?? []) as AdminRoom[];
  return <RoomsAdminClient initialRooms={rooms} />;
}
