import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { Plus, FileText, Globe, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/blog/types";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function PostsPage() {
  const supabase = createAdminClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, status, published_at, updated_at, category")
    .order("updated_at", { ascending: false });

  const rows = (posts ?? []) as Pick<
    BlogPost,
    "id" | "slug" | "title" | "status" | "published_at" | "updated_at" | "category"
  >[];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display italic text-4xl text-[var(--color-charcoal)] mb-1">
            Blog Posts
          </h1>
          <p className="font-body text-sm text-[var(--color-muted)]">
            {rows.length} {rows.length === 1 ? "post" : "posts"} total
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-5 py-3 bg-[var(--color-forest-green)] text-[var(--color-ivory)] rounded-xl font-body text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-16 text-center">
          <FileText className="w-8 h-8 text-[var(--color-muted)] mx-auto mb-4" />
          <p className="font-display italic text-xl text-[var(--color-charcoal)] mb-2">
            No posts yet
          </p>
          <p className="font-body text-sm text-[var(--color-muted)] mb-6">
            Create your first blog post to share stories from the forest.
          </p>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--color-forest-green)] text-[var(--color-ivory)] rounded-xl font-body text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left px-6 py-4 font-body text-xs font-semibold tracking-wider uppercase text-[var(--color-muted)]">
                  Title
                </th>
                <th className="text-left px-6 py-4 font-body text-xs font-semibold tracking-wider uppercase text-[var(--color-muted)] hidden sm:table-cell">
                  Category
                </th>
                <th className="text-left px-6 py-4 font-body text-xs font-semibold tracking-wider uppercase text-[var(--color-muted)] hidden md:table-cell">
                  Status
                </th>
                <th className="text-left px-6 py-4 font-body text-xs font-semibold tracking-wider uppercase text-[var(--color-muted)] hidden lg:table-cell">
                  Updated
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {rows.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-[var(--color-cream)]/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-body text-sm font-medium text-[var(--color-charcoal)] line-clamp-1">
                      {post.title}
                    </p>
                    <p className="font-body text-xs text-[var(--color-muted)] mt-0.5">
                      /blog/{post.slug}
                    </p>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    {post.category ? (
                      <span className="inline-block bg-[var(--color-cream)] text-[var(--color-earth-brown)] font-body text-xs px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    ) : (
                      <span className="text-[var(--color-muted)] text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span
                      className={`inline-flex items-center gap-1.5 font-body text-xs px-3 py-1 rounded-full ${
                        post.status === "published"
                          ? "bg-[var(--color-moss-green)]/10 text-[var(--color-moss-green)]"
                          : "bg-[var(--color-gold-accent)]/10 text-[var(--color-gold-accent)]"
                      }`}
                    >
                      {post.status === "published" ? (
                        <Globe className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {post.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="font-body text-xs text-[var(--color-muted)]">
                      {formatDate(post.updated_at)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="font-body text-xs text-[var(--color-earth-brown)] hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
