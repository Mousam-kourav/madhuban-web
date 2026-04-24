import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Heading } from '@/components/ui/heading';

export const metadata: Metadata = buildMetadata({
  title: 'Aranyashala',
  description:
    'Aranyashala at Madhuban Eco Retreat — a curated forest learning programme in the heart of Ratapani Tiger Reserve, Madhya Pradesh.',
  path: '/aranyashala',
});

export default function AranyashalaPage() {
  return (
    <Container>
      <Section aria-label="Aranyashala">
        <Heading as="h1" text="Aranyashala Programme" subheading="Coming soon" />
        <p className="mt-6 max-w-2xl text-charcoal/80 leading-relaxed">
          Aranyashala is our curated forest learning programme — combining nature immersion,
          traditional knowledge, and hands-on ecology, set against the wilderness of Ratapani
          Tiger Reserve. Full details launching soon.
        </p>
      </Section>
    </Container>
  );
}
