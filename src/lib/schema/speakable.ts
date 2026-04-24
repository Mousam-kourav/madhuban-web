const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.madhubanecoretreat.com';

interface SpeakableInput {
  /** URL path of the page, e.g. '/stay/safari-tent'. */
  path: string;
  /**
   * CSS selectors pointing to speakable content blocks.
   * Use on sections that directly answer the page's primary query (AEO answer blocks).
   */
  cssSelectors?: string[];
}

/**
 * Generates SpeakableSpecification schema for voice-search AEO.
 * Target the "Answer Block" prose near the top of each page.
 * Per CLAUDE.md §7.4, every page must have a 40-80 word speakable answer block.
 *
 * @example
 * speakable({ path: '/stay/safari-tent', cssSelectors: ['[data-speakable]'] })
 */
export function speakable({ path, cssSelectors }: SpeakableInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: `${BASE_URL}${path}`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors ?? ['[data-speakable]'],
    },
  };
}
