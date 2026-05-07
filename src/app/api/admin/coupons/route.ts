import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { assertAdmin } from "@/lib/admin/auth";


const couponSchema = z.object({
  code: z.string().min(2).max(30).transform((v) => v.trim().toUpperCase()),
  discount_type: z.enum(["percentage", "flat"]),
  discount_value: z.number().positive(),
  min_booking_value: z.number().min(0).default(0),
  valid_from: z.string().nullable().optional(),
  valid_to: z.string().nullable().optional(),
  usage_limit: z.number().int().positive().nullable().optional(),
  is_active: z.boolean().default(true),
});

export async function GET() {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = couponSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();

  // Check uniqueness
  const { data: existing } = await supabase
    .from("coupons")
    .select("id")
    .eq("code", parsed.data.code)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
  }

  const { data, error } = await supabase
    .from("coupons")
    .insert({
      ...parsed.data,
      valid_from: parsed.data.valid_from ?? null,
      valid_to: parsed.data.valid_to ?? null,
      usage_limit: parsed.data.usage_limit ?? null,
      is_active: parsed.data.is_active ?? true,
    })
    .select("id, code")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
