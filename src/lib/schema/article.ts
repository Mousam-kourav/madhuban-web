import { BUSINESS } from '@/lib/content/business';

interface ArticleInput {
  title: string;
  description: string;
  /** Full URL path, e.g. '/blogs/birding-at-ratapani'. Base URL is prepended. */
  path: string;
  /** ISO 8601 date string, e.g. '2025-04-24'. */
  publishedAt: string;
  modifiedAt?: string;
  /** Full image URL. */
  image?: string;
  /** Author display name. Defaults to the property name. */
  authorName?: string;
}

/**
 * Generates BlogPosting schema for a blog article page.
 * Conditionally add FAQPage schema alongside this if the article has FAQs.
 *
 * @example
 * <Seo schemas={[article({ title, description, path, publishedAt, image })]} />
 */
export function article({
  title,
  description,
  path,
  publishedAt,
  modifiedAt,
  image,
  authorName,
}: ArticleInput): Record<string, unknown> {
  const url = `${BUSINESS.url}${path}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    datePublished: publishedAt,
    ...(modifiedAt && { dateModified: modifiedAt }),
    ...(image && { image }),
    author: {
      '@type': 'Organization',
      name: authorName ?? BUSINESS.name,
      url: BUSINESS.url,
    },
    publisher: {
      '@type': 'Organization',
      name: BUSINESS.parent,
      url: BUSINESS.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}
