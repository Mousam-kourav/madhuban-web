import Link from 'next/link';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { WELCOME_COPY } from '@/lib/content/homepage';

export function WelcomeSection() {
  return (
    <Section label="Welcome to Madhuban Eco Retreat">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Heading as="h2" text={WELCOME_COPY.heading} />
          <p className="mt-8 font-body text-base leading-relaxed text-charcoal/80">
            {WELCOME_COPY.paragraph1}
          </p>
          <p className="mt-4 font-body text-base leading-relaxed text-charcoal/80">
            {WELCOME_COPY.paragraph2}
          </p>
          <div className="mt-8">
            <Button
              render={<Link href={WELCOME_COPY.ctaSecondary.href} />}
              variant="outline"
            >
              {WELCOME_COPY.ctaSecondary.label}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
