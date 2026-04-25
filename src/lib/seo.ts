import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.madhubanecoretreat.com';
const SITE_NAME = 'Madhuban Eco Retreat';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.jpg`;

interface BuildMetadataInput {
  /** Page-specific title. Brand suffix is appended automatically. Keep ≤38 chars so full title stays ≤60. */
  title: string;
  description: string;
  /** URL path, e.g. '/stay/safari-tent'. Used to build canonical URL and OG url. */
  path: string;
  /** Full URL to OG image. Falls back to /og-default.jpg. */
  ogImage?: string;
  /** When true, emits robots: noindex, nofollow. Use for admin, booking/payment, staging. */
  noIndex?: boolean;
  /**
   * When set, used as the full <title> verbatim — no brand suffix appended.
   * Use only for pages whose exact title is already indexed (e.g. homepage).
   */
  titleOverride?: string;
}

/**
 * Builds Next.js Metadata for a page. Use in every page's generateMetadata() or as a static export.
 *
 * @example
 * export const metadata = buildMetadata({
 *   title: 'Safari Tent Accommodation',
 *   description: 'Sleep under canvas in our safari tent...',
 *   path: '/stay/safari-tent',
 * });
 */
export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex = false,
  titleOverride,
}: BuildMetadataInput): Metadata {
  const canonical = `${BASE_URL}${path}`;
  const image = ogImage ?? DEFAULT_OG_IMAGE;
  const fullTitle = titleOverride ?? `${title} — ${SITE_NAME}`;

  return {
    metadataBase: new URL(BASE_URL),
    title: fullTitle,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: titleOverride ?? title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: image }],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
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
