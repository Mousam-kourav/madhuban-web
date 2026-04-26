import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminSidebar } from "./admin-sidebar";

export default async function AuthedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-[var(--color-cream)]">
      <AdminSidebar />
      <main className="flex-1 p-8 max-w-6xl">{children}</main>
    </div>
  );
}
