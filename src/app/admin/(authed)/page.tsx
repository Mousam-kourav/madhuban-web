import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { FileText } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminClient = createAdminClient();
  const { count } = await adminClient
    .from("blog_posts")
    .select("*", { count: "exact", head: true });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display italic text-4xl text-[var(--color-charcoal)] mb-1">
          Dashboard
        </h1>
        <p className="font-body text-sm text-[var(--color-muted)]">
          Welcome back,{" "}
          <span className="text-[var(--color-charcoal)]">{user?.email}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-body text-xs font-semibold tracking-wider uppercase text-[var(--color-muted)]">
              Blog Posts
            </p>
            <div className="bg-[var(--color-forest-green)]/10 p-2 rounded-xl">
              <FileText className="w-4 h-4 text-[var(--color-forest-green)]" />
            </div>
          </div>
          <p className="font-display text-4xl text-[var(--color-charcoal)]">
            {count ?? 0}
          </p>
          <a
            href="/admin/posts"
            className="mt-3 inline-block font-body text-xs text-[var(--color-earth-brown)] hover:underline"
          >
            Manage posts →
          </a>
        </div>
      </div>
    </div>
  );
}
