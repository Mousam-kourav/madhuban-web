import Image from 'next/image';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { NEARBY_ATTRACTIONS } from '@/lib/content/nearby';

export function NearbyAttractions() {
  return (
    <Section label="Nearby Attractions" id="nearby-attractions" className="bg-warm-beige/30">
      <Container>
        <Heading
          as="h2"
          text="Beyond Madhuban: Nearby Attractions"
          subheading="Heritage sites, wildlife reserves, and temples within an easy drive."
          className="mb-12"
        />

        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {NEARBY_ATTRACTIONS.map((attraction) => (
            <li key={attraction.slug}>
              {/* TODO: Wire href when /nearby-attractions/[slug] detail pages are built. Currently info-only cards. */}
              <article aria-labelledby={`nearby-title-${attraction.slug}`}>
                <Card className="overflow-hidden">
                  <div className="relative aspect-[3/2] overflow-hidden bg-warm-beige/20">
                    <Image
                      src={attraction.image.webp.desktop}
                      alt={attraction.image.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                      loading="lazy"
                    />
                    <span className="absolute right-2 top-2 rounded-full bg-earth-brown/90 px-2.5 py-0.5 text-xs font-medium text-ivory">
                      {attraction.distance}
                    </span>
                  </div>

                  <CardHeader>
                    <h3
                      id={`nearby-title-${attraction.slug}`}
                      className="font-display text-base font-medium leading-snug text-charcoal"
                    >
                      {attraction.name}
                    </h3>
                  </CardHeader>

                  <CardContent>
                    <p className="line-clamp-2 text-sm leading-relaxed text-charcoal/70">
                      {attraction.description}
                    </p>
                  </CardContent>
                </Card>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
