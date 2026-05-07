import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { assertAdmin } from "@/lib/admin/auth";


export async function GET(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const status = url.searchParams.get("status");

  const supabase = createAdminClient();
  let query = supabase
    .from("bookings")
    .select(`
      id, booking_ref, checkin, checkout, status, payment_status, total_amount, created_at,
      guests!guest_id ( name, email ),
      rooms!room_id ( name, slug )
    `)
    .order("checkin", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
