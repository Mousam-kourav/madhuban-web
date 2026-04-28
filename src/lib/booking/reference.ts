import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// Generates MBR-YYYYMMDD-XXXX (4-digit sequence per day, starting at 0001).
export async function generateBookingReference(): Promise<string> {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const prefix = `MBR-${today}-`;

  const supabase = createAdminClient();
  const { count } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .like("booking_ref", `${prefix}%`);

  const seq = String((count ?? 0) + 1).padStart(4, "0");
  return `${prefix}${seq}`;
}
