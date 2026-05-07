import { NextRequest, NextResponse } from "next/server";
import { assertRole } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const InviteSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(1).max(120),
  role: z.enum(["admin", "front_desk", "read_only"]),
});

export async function GET() {
  const ctx = await assertRole("admin");
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("user_id, email, full_name, role, is_active, created_at, last_login_at")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ users: data ?? [] });
}

export async function POST(req: NextRequest) {
  const ctx = await assertRole("admin");
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = InviteSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { email, full_name, role } = parsed.data;
  const supabase = createAdminClient();

  // Invite user — creates auth.users entry and sends magic-link invite email
  const { data: invited, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email);
  if (inviteError && !inviteError.message.includes("already been registered")) {
    return NextResponse.json({ error: inviteError.message }, { status: 500 });
  }

  const userId = invited?.user?.id;
  if (!userId) {
    // User already exists — find their ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) return NextResponse.json({ error: listError.message }, { status: 500 });
    const existing = users.find((u) => u.email === email);
    if (!existing) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { error: upsertError } = await supabase.from("user_profiles").upsert({
      user_id: existing.id,
      email,
      full_name,
      role,
      is_active: true,
      created_by: ctx.user.email,
    });
    if (upsertError) return NextResponse.json({ error: upsertError.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  const { error: insertError } = await supabase.from("user_profiles").insert({
    user_id: userId,
    email,
    full_name,
    role,
    is_active: true,
    created_by: ctx.user.email,
  });
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
