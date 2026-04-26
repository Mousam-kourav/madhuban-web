import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_EMAIL = "madhubanecoretreat@gmail.com";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return user;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export async function GET() {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("rooms")
    .select("id, slug, name, base_price_per_night, is_active, sort_order, hero_image, gallery, updated_at")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const slug = slugify(name);
  if (!slug) return NextResponse.json({ error: "Could not generate slug from name" }, { status: 400 });

  const supabase = createAdminClient();

  // Ensure slug uniqueness (append timestamp if collision)
  const { data: existing } = await supabase
    .from("rooms")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const { data: maxOrder } = await supabase
    .from("rooms")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = ((maxOrder as { sort_order: number } | null)?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("rooms")
    .insert({
      name,
      slug: finalSlug,
      is_active: false,
      sort_order: nextOrder,
      max_occupancy: 2,
      max_occupancy_children: 0,
      base_price_per_night: 5000,
      long_description: { type: "doc", content: [] },
      amenities: [],
      gallery: [],
      highlights: [],
    })
    .select("id, slug")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
