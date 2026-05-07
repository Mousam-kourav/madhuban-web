import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertAdmin } from "@/lib/admin/auth";


export async function PATCH(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const allowed = [
    "contact_email", "contact_phone", "whatsapp_number",
    "gstin", "legal_entity_name", "trade_name", "registered_address",
    "business_hours_open", "business_hours_close",
    "upi_id", "upi_payee_name", "email_signature",
  ];

  const update: Record<string, unknown> = { updated_by: user.email, updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("app_settings")
    .update(update)
    .eq("id", "singleton");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
