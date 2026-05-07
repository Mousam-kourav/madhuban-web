import { NextRequest, NextResponse } from "next/server";
import { assertRole } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const UpdateSchema = z.object({
  full_name: z.string().min(1).max(120).optional(),
  role: z.enum(["admin", "front_desk", "read_only"]).optional(),
  is_active: z.boolean().optional(),
});

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const ctx = await assertRole("admin");
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const parsed = UpdateSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("user_profiles")
    .update(parsed.data)
    .eq("user_id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const ctx = await assertRole("admin");
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Prevent self-deletion
  if (id === ctx.user.id) {
    return NextResponse.json({ error: "Cannot remove your own account" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("user_profiles")
    .update({ is_active: false })
    .eq("user_id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
