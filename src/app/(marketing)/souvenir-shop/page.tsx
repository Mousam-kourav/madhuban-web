import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Heading } from '@/components/ui/heading';

export const metadata: Metadata = buildMetadata({
  title: 'Souvenir Shop',
  description:
    'Take a piece of the forest home. Browse handcrafted souvenirs, local artisan goods, and eco-friendly products from Madhuban Eco Retreat.',
  path: '/souvenir-shop',
});

export default function SouvenirShopPage() {
  return (
    <Container>
      <Section aria-label="Souvenir Shop">
        <Heading as="h1" text="Souvenir Shop" subheading="Coming soon" />
        <p className="mt-6 max-w-2xl text-charcoal/80 leading-relaxed">
          Take a piece of the forest home. Our curated selection of handcrafted souvenirs, local
          artisan goods, and eco-friendly products celebrates the wilderness and culture of
          Ratapani. Shop launching soon.
        </p>
      </Section>
    </Container>
  );
}
