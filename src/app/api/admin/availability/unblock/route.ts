import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";
import { assertAdmin } from "@/lib/admin/auth";


const UnblockSchema = z.object({
  block_id: z.string().uuid(),
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

  const parsed = UnblockSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { block_id } = parsed.data;
  const supabase = createAdminClient();

  const { data: existing, error: fetchError } = await supabase
    .from("manual_blocks")
    .select("id, room_id, date_from, date_to, reason")
    .eq("id", block_id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Block not found" }, { status: 404 });
  }

  const { error: deleteError } = await supabase
    .from("manual_blocks")
    .delete()
    .eq("id", block_id);

  if (deleteError) {
    return NextResponse.json({ error: "Failed to remove block" }, { status: 500 });
  }

  await supabase.from("audit_log").insert({
    admin_user_id: user.id,
    actor_email: user.email ?? null,
    action: "manual_block_removed",
    entity_type: "manual_block",
    entity_id: block_id,
    details: {
      room_id: existing.room_id,
      date_from: existing.date_from,
      date_to: existing.date_to,
      reason: existing.reason,
    },
  });

  return NextResponse.json({ success: true });
}
