import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { Plus, BedDouble } from "lucide-react";
import { RoomListClient } from "./room-list-client";
import type { DbRoom } from "@/lib/types/rooms";

export default async function AdminRoomsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("rooms")
    .select("id, slug, name, base_price_per_night, is_active, sort_order, hero_image, gallery, updated_at")
    .order("sort_order", { ascending: true });

  const rooms = (data ?? []) as Pick<
    DbRoom,
    "id" | "slug" | "name" | "base_price_per_night" | "is_active" | "sort_order" | "hero_image" | "gallery" | "updated_at"
  >[];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display italic text-4xl text-[var(--color-charcoal)] mb-1">
            Rooms
          </h1>
          <p className="font-body text-sm text-[var(--color-muted)]">
            {rooms.length} {rooms.length === 1 ? "room" : "rooms"} total
          </p>
        </div>
        <Link
          href="/admin/rooms/new"
          className="flex items-center gap-2 px-5 py-3 bg-[var(--color-forest-green)] text-[var(--color-ivory)] rounded-xl font-body text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Room
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-16 text-center">
          <BedDouble className="w-8 h-8 text-[var(--color-muted)] mx-auto mb-4" />
          <p className="font-display italic text-xl text-[var(--color-charcoal)] mb-2">
            No rooms yet
          </p>
          <Link
            href="/admin/rooms/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--color-forest-green)] text-[var(--color-ivory)] rounded-xl font-body text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Room
          </Link>
        </div>
      ) : (
        <RoomListClient initialRooms={rooms} />
      )}
    </div>
  );
}
