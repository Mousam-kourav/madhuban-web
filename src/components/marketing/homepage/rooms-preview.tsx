import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { ROOMS } from '@/lib/content/rooms';
import { formatPrice } from '@/lib/utils';

export function RoomsPreview() {
  return (
    <Section label="Our Accommodations" id="accommodations" className="bg-cream">
      <Container>
        <Heading
          as="h2"
          text="Our Accommodations"
          subheading="Eco-Luxury Stays in the Heart of Ratapani"
          className="mb-12"
        />

        <ul
          role="list"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {ROOMS.map((room, index) => (
            <li key={room.slug}>
              <article aria-labelledby={`room-title-${room.slug}`}>
                <Card className="overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                  {/* Image wrapper: aspect-[3/2] with fill so next/image can be responsive */}
                  <div className="relative aspect-[3/2] overflow-hidden bg-warm-beige/20">
                    <Image
                      src={room.image.webp.desktop}
                      alt={room.image.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover/card:scale-[1.03]"
                      {...(index === 0
                        ? { loading: 'eager' as const }
                        : { loading: 'lazy' as const })}
                    />
                  </div>

                  <CardHeader>
                    <h3
                      id={`room-title-${room.slug}`}
                      className="font-display text-lg font-medium leading-snug text-charcoal"
                    >
                      {room.name}
                    </h3>
                    <p className="text-sm font-medium text-earth-brown">
                      From &#8377;{formatPrice(room.pricePerNight)}/night
                    </p>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm leading-relaxed text-charcoal/70">
                      {room.tagline}
                    </p>
                  </CardContent>

                  <CardFooter>
                    <Link
                      href={room.href}
                      className="text-sm font-medium text-earth-brown underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-1 rounded-sm"
                    >
                      View details →
                    </Link>
                  </CardFooter>
                </Card>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <Link
            href="/stay"
            className="inline-flex h-12 items-center justify-center rounded-md border border-earth-brown px-8 text-sm font-medium text-earth-brown transition-colors duration-200 hover:bg-earth-brown hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
          >
            View All Accommodations
          </Link>
        </div>
      </Container>
    </Section>
  );
}
