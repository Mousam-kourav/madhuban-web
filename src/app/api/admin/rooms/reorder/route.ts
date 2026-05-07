import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { assertAdmin } from "@/lib/admin/auth";


export async function POST(request: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Body must be an array of {id, sort_order}" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const updates = body as { id: string; sort_order: number }[];

  // Batch updates (Supabase doesn't support bulk update in one call — iterate)
  for (const { id, sort_order } of updates) {
    const { error } = await supabase
      .from("rooms")
      .update({ sort_order })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/stay");
  return NextResponse.json({ ok: true });
}
