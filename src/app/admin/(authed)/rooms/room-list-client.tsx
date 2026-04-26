"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { GripVertical, Globe, Clock, Pencil } from "lucide-react";
import type { DbRoom } from "@/lib/types/rooms";

type ListRoom = Pick<
  DbRoom,
  "id" | "slug" | "name" | "base_price_per_night" | "is_active" | "sort_order" | "hero_image" | "gallery" | "updated_at"
>;

function getThumbnailUrl(room: ListRoom): string | null {
  // Try hero_image first, then first gallery item
  if (room.hero_image && typeof room.hero_image === "object") {
    const h = room.hero_image as { webp?: { desktop?: string } };
    if (h.webp?.desktop) return h.webp.desktop;
  }
  if (Array.isArray(room.gallery) && room.gallery.length > 0) {
    const first = room.gallery[0] as { webp?: { desktop?: string } } | undefined;
    if (first?.webp?.desktop) return first.webp.desktop;
  }
  return null;
}

function formatPrice(n: number) {
  return n.toLocaleString("en-IN");
}

export function RoomListClient({ initialRooms }: { initialRooms: ListRoom[] }) {
  const [rooms, setRooms] = useState<ListRoom[]>(initialRooms);
  const [saving, setSaving] = useState(false);
  const dragIndex = useRef<number | null>(null);

  function handleDragStart(index: number) {
    dragIndex.current = index;
  }

  function handleDrop(dropIndex: number) {
    const fromIndex = dragIndex.current;
    if (fromIndex === null || fromIndex === dropIndex) return;

    const reordered = [...rooms];
    const [moved] = reordered.splice(fromIndex, 1);
    if (!moved) return;
    reordered.splice(dropIndex, 0, moved);

    // Reassign sort_order by position
    const updated = reordered.map((r, i) => ({ ...r, sort_order: i }));
    setRooms(updated);
    dragIndex.current = null;

    // Persist
    setSaving(true);
    fetch("/api/admin/rooms/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated.map((r) => ({ id: r.id, sort_order: r.sort_order }))),
    })
      .catch(() => {/* swallow — UX shows stale order until reload */})
      .finally(() => setSaving(false));
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
      {saving && (
        <div className="px-6 py-2 bg-[var(--color-gold-accent)]/10 text-[var(--color-gold-accent)] font-body text-xs text-center">
          Saving order…
        </div>
      )}
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="w-10 px-3 py-4" aria-label="Drag handle" />
            <th className="w-16 px-3 py-4" aria-label="Thumbnail" />
            <th className="text-left px-4 py-4 font-body text-xs font-semibold tracking-wider uppercase text-[var(--color-muted)]">
              Name
            </th>
            <th className="text-left px-4 py-4 font-body text-xs font-semibold tracking-wider uppercase text-[var(--color-muted)] hidden sm:table-cell">
              Price / night
            </th>
            <th className="text-left px-4 py-4 font-body text-xs font-semibold tracking-wider uppercase text-[var(--color-muted)] hidden md:table-cell">
              Status
            </th>
            <th className="px-4 py-4" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {rooms.map((room, index) => {
            const thumb = getThumbnailUrl(room);
            return (
              <tr
                key={room.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
                className="hover:bg-[var(--color-cream)]/50 transition-colors cursor-default"
              >
                <td className="px-3 py-4 text-center cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-4 h-4 text-[var(--color-muted)] mx-auto" />
                </td>
                <td className="px-3 py-4">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt=""
                      className="w-14 h-10 object-cover rounded-lg bg-[var(--color-warm-beige)]"
                    />
                  ) : (
                    <div className="w-14 h-10 rounded-lg bg-[var(--color-warm-beige)]" />
                  )}
                </td>
                <td className="px-4 py-4">
                  <p className="font-body text-sm font-medium text-[var(--color-charcoal)]">
                    {room.name}
                  </p>
                  <p className="font-body text-xs text-[var(--color-muted)] mt-0.5">
                    /stay/{room.slug}
                  </p>
                </td>
                <td className="px-4 py-4 hidden sm:table-cell">
                  <span className="font-body text-sm text-[var(--color-charcoal)]">
                    ₹{formatPrice(Number(room.base_price_per_night))}
                  </span>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span
                    className={`inline-flex items-center gap-1.5 font-body text-xs px-3 py-1 rounded-full ${
                      room.is_active
                        ? "bg-[var(--color-moss-green)]/10 text-[var(--color-moss-green)]"
                        : "bg-[var(--color-gold-accent)]/10 text-[var(--color-gold-accent)]"
                    }`}
                  >
                    {room.is_active ? (
                      <Globe className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {room.is_active ? "Active" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <Link
                    href={`/admin/rooms/${room.id}/edit`}
                    className="inline-flex items-center gap-1.5 font-body text-xs text-[var(--color-earth-brown)] hover:underline"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
