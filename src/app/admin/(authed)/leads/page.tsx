import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/admin/constants";
import { LeadsClient } from "./leads-client";

export const metadata: Metadata = { title: "Leads — Madhuban Admin" };

export default async function LeadsPage() {
  const user = await assertAdmin();
  if (!user) redirect("/admin/login");

  const db = createAdminClient();
  const { data: profile } = await db
    .from("user_profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  const isAdmin =
    !profile?.role ||
    profile.role === "admin" ||
    user.email === ADMIN_EMAIL;

  return <LeadsClient isAdmin={isAdmin} />;
}
