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

interface Params { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Params) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: roomId } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  const answer = typeof body.answer === "string" ? body.answer.trim() : "";

  if (!question) return NextResponse.json({ error: "question required" }, { status: 400 });

  const supabase = createAdminClient();

  // Get next display_order
  const { data: last } = await supabase
    .from("room_faqs")
    .select("display_order")
    .eq("room_id", roomId)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = ((last as { display_order: number } | null)?.display_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("room_faqs")
    .insert({ room_id: roomId, question, answer, display_order: nextOrder })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
