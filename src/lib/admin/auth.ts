import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/admin/constants";

export type AdminRole = "admin" | "front_desk" | "read_only";

const ROLE_RANK: Record<AdminRole, number> = { admin: 3, front_desk: 2, read_only: 1 };

export async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const db = createAdminClient();
  const { data: profile } = await db
    .from("user_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .single();

  if (profile?.is_active) return user;

  // Fallback: primary admin email always allowed
  if (user.email === ADMIN_EMAIL) return user;

  return null;
}

export async function assertRole(minRole: AdminRole) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const db = createAdminClient();
  const { data: profile } = await db
    .from("user_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .single();

  if (!profile?.is_active) return null;
  if ((ROLE_RANK[profile.role as AdminRole] ?? 0) < ROLE_RANK[minRole]) return null;

  return { user, role: profile.role as AdminRole };
}

export function can(role: AdminRole, action: string): boolean {
  const perms: Record<string, AdminRole[]> = {
    manage_settings: ["admin"],
    manage_staff: ["admin"],
    cancel_booking: ["admin"],
    create_booking: ["admin", "front_desk"],
    edit_booking: ["admin", "front_desk"],
    view_booking: ["admin", "front_desk", "read_only"],
    view_audit_log: ["admin"],
    send_email: ["admin", "front_desk"],
  };
  return (perms[action] ?? []).includes(role);
}
