import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/blog/queries";
import { buildMetadata } from "@/lib/seo";
import { BlogCard } from "./blog-card";
import { NewsletterCta } from "@/components/marketing/homepage/newsletter-cta";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Journal",
    description:
      "Stories from nature, wellness, and wilderness — Madhuban Eco Retreat's journal from the forest edge of Ratapani.",
    path: "/blogs",
  });
}

export default async function BlogsPage() {
  const posts = await getPublishedPosts();
  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))];

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <picture className="absolute inset-0">
          <source
            srcSet="https://pub-988c0a6b938742458b908a7a49295f61.r2.dev/home/rooms/pool-side-villa-3-1280.webp"
            type="image/webp"
          />
          <img
            src="https://pub-988c0a6b938742458b908a7a49295f61.r2.dev/home/rooms/pool-side-villa-3-1280.jpg"
            alt="Pool Side Villa exterior in daylight at Madhuban Eco Retreat"
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        <div className="relative z-10 text-center px-4">
          <p className="font-display italic text-2xl text-[var(--color-gold-accent)] mb-3">
            Journal of the Earth
          </p>
          <h1 className="font-display italic text-5xl md:text-6xl text-[var(--color-ivory)] leading-tight max-w-3xl">
            Stories From Nature,
            <br />
            Wellness &amp; Wilderness
          </h1>
        </div>
      </section>

      {/* Filter bar */}
      {categories.length > 0 && (
        <section className="sticky top-[72px] z-10 bg-[var(--color-cream)] border-b border-[var(--color-border)] px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto">
            <button className="flex-shrink-0 px-4 py-2 rounded-full font-body text-xs font-semibold tracking-wider uppercase bg-[var(--color-earth-brown)] text-[var(--color-ivory)]">
              All Stories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className="flex-shrink-0 px-4 py-2 rounded-full font-body text-xs font-semibold tracking-wider uppercase border border-[var(--color-border)] text-[var(--color-charcoal)]/70 hover:border-[var(--color-earth-brown)] hover:text-[var(--color-charcoal)] transition-colors"
              >
                {cat}
              </button>
            ))}
            <div className="flex-1" />
            <span className="flex-shrink-0 font-body text-xs text-[var(--color-muted)]">
              Recent
            </span>
          </div>
        </section>
      )}

      {/* Posts grid */}
      <section className="bg-[var(--color-cream)] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display italic text-3xl text-[var(--color-charcoal)]/40 mb-3">
                Stories are being gathered
              </p>
              <p className="font-body text-sm text-[var(--color-muted)]">
                Check back soon for stories from the forest.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterCta />
    </>
  );
}
