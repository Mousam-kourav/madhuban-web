import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';

export function CorporateOffsiteTeaser() {
  return (
    <Section label="Corporate Offsites" id="corporate-offsite" className="bg-cream">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Image */}
          <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-warm-beige/20">
            <Image
              src={`${R2_BASE}/home/dining/dining-hero-800.webp`}
              alt="Bamboo pendant lights and timber interior at Madhuban's private dining pavilion"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              loading="lazy"
            />
          </div>

          {/* Copy */}
          <div>
            <p className="mb-4 font-body text-sm font-semibold uppercase tracking-widest text-earth-brown">
              For Teams &amp; Groups
            </p>
            <h2 className="font-display text-3xl font-medium leading-tight text-charcoal md:text-4xl">
              Corporate Offsites in the Forest
            </h2>
            <p className="mt-6 font-body text-base leading-relaxed text-charcoal/70">
              Trade boardrooms for bamboo pavilions. Madhuban hosts team retreats, leadership
              offsites, and group gatherings of 150–200 — with private dining, custom experiences,
              and full-property buyouts available on request.
            </p>
            <div className="mt-8">
              <Button render={<Link href="/day-outing" />}>
                Plan Your Offsite
              </Button>
            </div>
          </div>

        </div>
      </Container>
    </Section>
  );
}
