import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Faq } from '@/components/ui/faq';

export const metadata: Metadata = buildMetadata({
  title: 'Forest Resort near Ratapani Tiger Reserve, Bhopal',
  description:
    'Eco-luxury forest resort 60 km from Bhopal, adjacent to Ratapani Tiger Reserve. Safari tents, mud houses, pool villa, glamping, dining & nature experiences.',
  path: '/',
});

export default function HomePage() {
  return (
    <main>
      <Section label="Welcome to Madhuban Eco Retreat">
        <Container>
          <Heading
            as="h1"
            text="Madhuban Eco Retreat"
            subheading="Eco-luxury forest resort adjacent to Ratapani Tiger Reserve · 60 km from Bhopal"
          />
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg">Book Your Stay</Button>
            <Button variant="outline" size="lg">Explore Rooms</Button>
          </div>
        </Container>
      </Section>

      <Section label="Phase 1 smoke test">
        <Container>
          <Breadcrumb pathname="/stay/safari-tent" className="mb-8" />

          <Card className="mb-8 max-w-md">
            <CardHeader>
              <CardTitle>Design System — Phase 1 Complete</CardTitle>
              <CardDescription>
                Container · Section · Heading · Button · Input · Textarea · Label · Card · Faq · Breadcrumb · ResortImage · Seo
              </CardDescription>
            </CardHeader>
          </Card>

          <Faq
            heading="Test FAQ"
            items={[
              {
                question: 'Is this a real FAQ?',
                answer: 'No — this is a Phase 1 smoke test confirming FAQPage JSON-LD emits correctly in initial HTML.',
              },
            ]}
          />
        </Container>
      </Section>
    </main>
  );
}
