import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAIL = "madhubanecoretreat@gmail.com";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return user;
}

export interface RoomAvailability {
  id: string;
  name: string;
  slug: string;
  base_price_per_night: number;
  max_occupancy: number;
  max_occupancy_children: number;
  inventory_count: number;
  available_units: number;  // inventory_count minus overlapping confirmed/checked-in bookings
}

export async function GET(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json({ error: "from and to query params required (YYYY-MM-DD)" }, { status: 400 });
  }

  if (from >= to) {
    return NextResponse.json({ error: "to must be after from" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Fetch all active rooms
  const { data: rooms, error: roomsError } = await supabase
    .from("rooms")
    .select("id, name, slug, base_price_per_night, max_occupancy, max_occupancy_children, inventory_count")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (roomsError || !rooms) {
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }

  // For each room, count overlapping confirmed/checked-in bookings
  // Date ranges overlap when: checkin < to AND checkout > from
  const { data: conflicts, error: conflictsError } = await supabase
    .from("bookings")
    .select("room_id")
    .in("status", ["CONFIRMED", "CHECKED_IN"])
    .lt("checkin", to)
    .gt("checkout", from);

  if (conflictsError) {
    return NextResponse.json({ error: "Failed to check availability" }, { status: 500 });
  }

  // Count how many booked units per room_id
  const bookedCountByRoom: Record<string, number> = {};
  for (const c of conflicts ?? []) {
    bookedCountByRoom[c.room_id] = (bookedCountByRoom[c.room_id] ?? 0) + 1;
  }

  // Also check manual_blocks
  const { data: blocks } = await supabase
    .from("manual_blocks")
    .select("room_id")
    .lt("date_from", to)
    .gt("date_to", from);

  for (const b of blocks ?? []) {
    bookedCountByRoom[b.room_id] = (bookedCountByRoom[b.room_id] ?? 0) + 1;
  }

  const result: RoomAvailability[] = rooms.map((room) => {
    const booked = bookedCountByRoom[room.id] ?? 0;
    const available = Math.max(0, (room.inventory_count ?? 1) - booked);
    return {
      id: room.id,
      name: room.name,
      slug: room.slug,
      base_price_per_night: Number(room.base_price_per_night),
      max_occupancy: room.max_occupancy,
      max_occupancy_children: room.max_occupancy_children,
      inventory_count: room.inventory_count ?? 1,
      available_units: available,
    };
  });

  return NextResponse.json({ rooms: result });
}
