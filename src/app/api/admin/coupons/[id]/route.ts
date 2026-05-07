import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { assertAdmin } from "@/lib/admin/auth";


const updateSchema = z.object({
  code: z.string().min(2).max(30).transform((v) => v.trim().toUpperCase()).optional(),
  discount_type: z.enum(["percentage", "flat"]).optional(),
  discount_value: z.number().positive().optional(),
  min_booking_value: z.number().min(0).optional(),
  valid_from: z.string().nullable().optional(),
  valid_to: z.string().nullable().optional(),
  usage_limit: z.number().int().positive().nullable().optional(),
  is_active: z.boolean().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("coupons").select("*").eq("id", id).single();
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();

  // Check code uniqueness if changing code
  if (parsed.data.code) {
    const { data: existing } = await supabase
      .from("coupons")
      .select("id")
      .eq("code", parsed.data.code)
      .neq("id", id)
      .maybeSingle();
    if (existing) return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
  }

  const { data, error } = await supabase
    .from("coupons")
    .update(parsed.data)
    .eq("id", id)
    .select("id, code")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();

  // Soft delete — set is_active=false (old bookings reference coupon_code by string, not FK)
  const { error } = await supabase
    .from("coupons")
    .update({ is_active: false })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
