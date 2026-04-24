'use client';

import type { FaqItem } from '@/lib/schema/types';
import { faqPage } from '@/lib/schema';
import { Seo } from '@/components/ui/seo';
import { Heading } from '@/components/ui/heading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface FaqProps {
  /** Questions and answers. Each item auto-emits a Question + Answer in FAQPage JSON-LD. */
  items: FaqItem[];
  /** Optional section heading rendered above the accordion in display font. */
  heading?: string;
  /** Optional id for anchor linking to this FAQ section from the page nav. */
  id?: string;
  className?: string;
}

/**
 * FAQ accordion with automatic FAQPage JSON-LD emission.
 * Every page that renders <Faq items={...} /> gets structured data with zero extra wiring.
 * Next.js SSRs 'use client' components on first request, so the JSON-LD lands in initial HTML.
 * Answer text is wrapped in data-speakable="true" for Phase 3 SpeakableSpecification targeting.
 *
 * @example
 * <Faq
 *   heading="Frequently Asked Questions"
 *   id="faq"
 *   items={[
 *     { question: 'Is Madhuban open year-round?', answer: 'Yes, we operate 365 days a year.' },
 *   ]}
 * />
 */
export function Faq({ items, heading, id, className }: FaqProps) {
  return (
    <div id={id} className={cn(className)}>
      {/* JSON-LD is SSR'd in initial HTML even though this is a client component */}
      <Seo schemas={[faqPage({ items })]} />

      {heading && <Heading as="h2" text={heading} className="mb-8" />}

      <Accordion className="w-full">
        {items.map((item, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger className="text-left text-base font-medium text-charcoal">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <div data-speakable="true" className="leading-relaxed text-muted-foreground">
                {item.answer}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default Faq;
