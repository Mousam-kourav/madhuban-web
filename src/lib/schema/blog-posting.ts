import type { BlogPost } from "@/lib/blog/types";

export function blogPosting(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: "Madhuban Eco Retreat" },
    publisher: {
      "@type": "Organization",
      name: "Madhuban Eco Retreat",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
    },
    description: post.meta_description ?? post.excerpt ?? undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
    },
  };
}
