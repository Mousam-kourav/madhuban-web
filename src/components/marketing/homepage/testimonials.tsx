import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Card, CardContent } from '@/components/ui/card';
import { TESTIMONIALS } from '@/lib/content/testimonials';

export function Testimonials() {
  return (
    <Section label="Guest Testimonials" id="testimonials" className="bg-cream">
      <Container>
        <Heading
          as="h2"
          text="What Our Guests Say"
          subheading="Real reviews from real stays."
          className="mb-12"
        />

        <div className="columns-1 gap-6 md:columns-2">
          {TESTIMONIALS.map((t) => (
            <article key={t.id} className="break-inside-avoid mb-6">
              <Card>
                <CardContent>
                  <span
                    aria-hidden="true"
                    className="block select-none font-display text-5xl leading-none text-earth-brown/20"
                  >
                    &ldquo;
                  </span>
                  <p className="mt-2 font-body text-sm leading-relaxed text-charcoal">
                    {t.quote}
                  </p>
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="font-display text-sm font-medium text-charcoal">{t.author}</p>
                    <p className="mt-0.5 text-xs text-charcoal/60">{t.location}</p>
                  </div>
                </CardContent>
              </Card>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
