import type { FaqItem } from './types';

interface FaqPageInput {
  items: FaqItem[];
}

/**
 * Generates FAQPage schema.org object.
 * Emit on every page that has a FAQ section — non-negotiable per CLAUDE.md §7.2.
 *
 * @example
 * <Seo schemas={[faqPage({ items: roomFaqs })]} />
 */
export function faqPage({ items }: FaqPageInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
