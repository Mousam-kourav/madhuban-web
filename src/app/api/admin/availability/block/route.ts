import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const ADMIN_EMAIL = "madhubanecoretreat@gmail.com";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return user;
}

const BlockSchema = z.object({
  room_id: z.string().uuid(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().min(1),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BlockSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { room_id, start_date, end_date, reason, notes } = parsed.data;

  if (end_date <= start_date) {
    return NextResponse.json(
      { error: "End date must be after start date" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // Check for overlapping active bookings in this date range for this room
  const { data: conflictingBookings, error: bookingCheckError } = await supabase
    .from("bookings")
    .select("id, booking_ref, checkin, checkout")
    .eq("room_id", room_id)
    .in("status", ["CONFIRMED", "CHECKED_IN"])
    .lt("checkin", end_date)
    .gt("checkout", start_date)
    .limit(1);

  if (bookingCheckError) {
    return NextResponse.json({ error: "Failed to check for conflicts" }, { status: 500 });
  }

  if (conflictingBookings && conflictingBookings.length > 0) {
    return NextResponse.json(
      {
        error:
          "Cannot block: Bookings exist for this room in this range. Cancel or reschedule them first.",
      },
      { status: 409 }
    );
  }

  const { data: block, error: insertError } = await supabase
    .from("manual_blocks")
    .insert({
      room_id,
      date_from: start_date,
      date_to: end_date,
      reason,
      notes: notes ?? null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (insertError || !block) {
    return NextResponse.json({ error: "Failed to create block" }, { status: 500 });
  }

  await supabase.from("audit_log").insert({
    admin_user_id: user.id,
    action: "manual_block_created",
    entity_type: "manual_block",
    entity_id: block.id,
    details: { room_id, start_date, end_date, reason, notes: notes ?? null },
  });

  return NextResponse.json({ success: true, block_id: block.id });
}
