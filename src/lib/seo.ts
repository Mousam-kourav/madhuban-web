import type { Metadata } from 'next';
import { R2_BASE } from '@/lib/r2';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.madhubanecoretreat.com';
const SITE_NAME = 'Madhuban Eco Retreat';
const DEFAULT_OG_IMAGE = `${R2_BASE}/branding/logo/madhuban-logo-full-md.webp`;

interface BuildMetadataInput {
  /**
   * Page-specific title. Pass clean (no brand suffix) — the root layout's title
   * template appends " — Madhuban Eco Retreat" once. Keep ≤38 chars so the full
   * rendered title stays ≤60.
   */
  title: string;
  description: string;
  /** URL path, e.g. '/stay/safari-tent'. Used to build canonical URL and OG url. */
  path: string;
  /** Full URL to OG image. Falls back to default R2 logo. */
  ogImage?: string;
  /** When true, emits robots: noindex, nofollow. Use for admin, booking/payment, staging. */
  noIndex?: boolean;
  /**
   * When set, used as the full <title> verbatim — root layout's template is
   * bypassed via Next.js's `{ absolute }` form. Use for pages whose exact title
   * is already indexed (e.g. homepage) or that need a custom brand placement.
   */
  titleOverride?: string;
  /** Optional keywords for the page. Passed through to Next.js metadata. */
  keywords?: string[];
  /** OpenGraph type. Defaults to 'website'; use 'article' for blog posts. */
  ogType?: 'website' | 'article';
}

/**
 * Builds Next.js Metadata for a page. Use in every page's generateMetadata() or as a static export.
 *
 * @example
 * export const metadata = buildMetadata({
 *   title: 'Safari Tent Accommodation',
 *   description: 'Sleep under canvas in our safari tent...',
 *   path: '/stay/safari-tent',
 *   keywords: ['safari tent near bhopal', 'eco stay ratapani'],
 * });
 */
export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex = false,
  titleOverride,
  keywords,
  ogType = 'website',
}: BuildMetadataInput): Metadata {
  const canonical = `${BASE_URL}${path}`;
  const image = ogImage ?? DEFAULT_OG_IMAGE;

  return {
    metadataBase: new URL(BASE_URL),
    title: titleOverride ? { absolute: titleOverride } : title,
    description,
    ...(keywords?.length && { keywords }),
    alternates: {
      canonical,
      languages: {
        'en-IN': canonical,
        'x-default': canonical,
      },
    },
    openGraph: {
      title: titleOverride ?? title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630 }],
      locale: 'en_IN',
      type: ogType,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@madhubanretreat',
      title: titleOverride ?? title,
      description,
      images: [image],
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
