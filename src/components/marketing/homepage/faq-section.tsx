import { ChevronDown } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { HOMEPAGE_FAQS } from '@/lib/content/faqs';

export function FaqSection() {
  return (
    <Section label="FAQ" id="faq" className="bg-warm-beige/30">
      <Container>
        <Heading
          as="h2"
          text="Frequently Asked Questions"
          subheading="Common questions about staying at Madhuban."
          className="mb-12"
        />

        <div className="mx-auto max-w-3xl">
          {HOMEPAGE_FAQS.map((faq, index) => (
            <details
              key={faq.id}
              open={index === 0}
              className="group border-b border-warm-beige/40 py-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <h3 className="font-display text-xl font-medium text-charcoal">
                  {faq.question}
                </h3>
                <ChevronDown
                  className="size-5 shrink-0 text-earth-brown transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <div className="pt-4 text-sm leading-relaxed text-charcoal/70">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
