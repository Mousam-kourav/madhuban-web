import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublishedPost,
  getAllPublishedSlugs,
  getRelatedPosts,
} from "@/lib/blog/queries";
import { renderTiptap, extractHeadings } from "@/lib/blog/render-tiptap";
import { buildMetadata } from "@/lib/seo";
import { Seo } from "@/components/ui/seo";
import { blogPosting } from "@/lib/schema/blog-posting";
import { breadcrumbListFromPath } from "@/lib/schema/breadcrumb-list";
import { BlogCard } from "../blog-card";
import { TableOfContents } from "./toc";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllPublishedSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (err) {
    console.warn(
      "[generateStaticParams /blogs/[slug]] Supabase query failed — returning []. Pages will render via ISR.",
      err,
    );
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seo_title ?? post.title,
    description: post.meta_description ?? post.excerpt ?? post.title,
    path: `/blogs/${post.slug}`,
    ogImage: post.cover_image_url ?? undefined,
    titleOverride: post.seo_title ?? undefined,
  });
}

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

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const [post, related] = await Promise.all([
    getPublishedPost(slug),
    getRelatedPosts(slug),
  ]);

  if (!post) notFound();

  const headings = extractHeadings(post.body);

  return (
    <>
      <Seo
        schemas={[
          blogPosting(post),
          breadcrumbListFromPath(`/blogs/${post.slug}`),
        ]}
      />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end justify-center overflow-hidden">
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.cover_image_alt ?? post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--color-forest-green)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4 pb-16">
          <p className="font-body text-xs font-semibold tracking-widest uppercase text-[var(--color-gold-accent)] mb-4">
            {post.category}
            {post.category && post.published_at ? " · " : ""}
            {formatDate(post.published_at)}
          </p>
          <h1 className="font-display italic text-5xl md:text-6xl text-[var(--color-ivory)] leading-tight mb-6">
            {post.title}
          </h1>
          {post.author_name && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-earth-brown)] flex items-center justify-center flex-shrink-0">
                <span className="font-body text-sm text-white font-semibold">
                  {post.author_name.charAt(0)}
                </span>
              </div>
              <span className="font-body text-sm italic text-[var(--color-ivory)]/80">
                by {post.author_name}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="bg-[var(--color-cream)] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-12">
            {/* Left TOC — desktop only */}
            <div className="hidden lg:block w-60 flex-shrink-0">
              <TableOfContents
                headings={headings}
                readTime={post.read_time_minutes}
              />
            </div>

            {/* Main content */}
            <article className="flex-1 max-w-2xl">
              {post.body ? renderTiptap(post.body) : null}
            </article>
          </div>
        </div>
      </section>

      {/* Plan Your Retreat CTA */}
      <section className="bg-[var(--color-forest-green)] py-20 px-4 my-16">
        <div className="max-w-md mx-auto text-center">
          <h2 className="font-display italic text-3xl text-[var(--color-ivory)] mb-4">
            Plan Your Retreat
          </h2>
          <p className="font-body text-sm text-[var(--color-ivory)]/80 leading-relaxed mb-8">
            Experience the wisdom of the canopy firsthand. Our sanctuary awaits
            those seeking silence, sustainability, and soul-deep rest.
          </p>
          <Link
            href="/booking"
            className="inline-block px-8 py-4 rounded-xl bg-[var(--color-gold-accent)] text-[var(--color-charcoal)] font-body font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            Book Now
          </Link>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="bg-[var(--color-cream)] py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="font-body text-xs font-semibold tracking-widest uppercase text-[var(--color-muted)] mb-2">
                  Continue Exploring
                </p>
                <h2 className="font-display italic text-3xl text-[var(--color-charcoal)]">
                  Related Journeys
                </h2>
              </div>
              <Link
                href="/blogs"
                className="font-body text-xs font-semibold tracking-widest uppercase text-[var(--color-earth-brown)] hover:underline"
              >
                View All Stories →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
