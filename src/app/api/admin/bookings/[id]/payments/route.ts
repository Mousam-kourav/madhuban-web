import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { assertAdmin } from "@/lib/admin/auth";


export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const amount = typeof body.amount === "number" ? body.amount : Number(body.amount);
  const method = typeof body.method === "string" ? body.method.trim() : "";
  const reference = typeof body.reference_number === "string" ? body.reference_number.trim() : null;
  const notes = typeof body.notes === "string" ? body.notes.trim() : null;

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Valid amount required" }, { status: 400 });
  }
  if (!method) {
    return NextResponse.json({ error: "Payment method required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("id")
    .eq("id", id)
    .single();

  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await supabase.from("payments").insert({
    booking_id: id,
    amount,
    status: "captured",
    payment_type: "balance",
    method,
    reference_number: reference || null,
    notes: notes || null,
    captured_at: new Date().toISOString(),
  });

  await supabase.from("audit_log").insert({
    admin_user_id: user.id,
    action: "offline_payment_recorded",
    entity_type: "booking",
    entity_id: id,
    details: { amount, method, reference_number: reference || null },
  });

  return NextResponse.json({ ok: true });
}
