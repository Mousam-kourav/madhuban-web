import Image from "next/image";
import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog/types";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso)
    .toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
}

interface Props {
  post: BlogPostSummary;
}

export function BlogCard({ post }: Props) {
  return (
    <Link href={`/blogs/${post.slug}`} className="group block">
      <article>
        {/* Cover image */}
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-[var(--color-warm-beige)]">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.cover_image_alt ?? post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-body text-xs text-[var(--color-muted)] uppercase tracking-wider">
                No image
              </span>
            </div>
          )}
          {post.category && (
            <div className="absolute top-4 left-4">
              <span className="bg-[var(--color-forest-green)] text-[var(--color-ivory)] font-body text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full">
                {post.category}
              </span>
            </div>
          )}
        </div>

        {/* Meta */}
        <p className="font-body text-xs tracking-widest text-[var(--color-charcoal)]/60 uppercase mb-2">
          {formatDate(post.published_at)}
          {post.read_time_minutes
            ? ` · ${post.read_time_minutes} MIN READ`
            : ""}
        </p>

        {/* Title */}
        <h3 className="font-display italic text-2xl text-[var(--color-charcoal)] leading-snug mb-2 group-hover:text-[var(--color-earth-brown)] transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="font-body text-sm text-[var(--color-charcoal)]/70 line-clamp-3 mb-4">
            {post.excerpt}
          </p>
        )}

        {/* Author */}
        {post.author_name && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[var(--color-earth-brown)] flex items-center justify-center flex-shrink-0">
              <span className="font-body text-xs text-white font-semibold">
                {post.author_name.charAt(0)}
              </span>
            </div>
            <span className="font-body text-xs text-[var(--color-charcoal)]/70">
              By {post.author_name}
            </span>
          </div>
        )}
      </article>
    </Link>
  );
}
