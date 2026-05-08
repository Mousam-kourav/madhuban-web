import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

import { ADMIN_EMAIL } from "@/lib/admin/constants";

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// GET: fetch last 10 notifications + unread count
export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();

  const [{ data: notifications }, { count }] = await Promise.all([
    supabase
      .from("notifications")
      .select("*")
      .eq("recipient_email", ADMIN_EMAIL)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("recipient_email", ADMIN_EMAIL)
      .is("read_at", null),
  ]);

  return NextResponse.json({ notifications: notifications ?? [], unreadCount: count ?? 0 });
}

// PATCH: mark one or all as read
export async function PATCH(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as { id?: string; markAllRead?: boolean };
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  if (body.markAllRead) {
    await supabase
      .from("notifications")
      .update({ read_at: now })
      .eq("recipient_email", ADMIN_EMAIL)
      .is("read_at", null);
  } else if (body.id) {
    await supabase
      .from("notifications")
      .update({ read_at: now })
      .eq("id", body.id)
      .eq("recipient_email", ADMIN_EMAIL);
  }

  return NextResponse.json({ ok: true });
}
