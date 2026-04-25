import Image from 'next/image';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { JOURNEY_PHOTOS } from '@/lib/content/journey';

export function FollowOurJourney() {
  return (
    <Section label="Follow Our Journey" id="follow-our-journey" className="bg-warm-beige/30">
      <Container>
        <Heading
          as="h2"
          text="Follow Our Journey"
          subheading="Moments from the property. Tag @madhubanecoretreat to be featured."
          className="mb-12"
        />

        <ul
          role="list"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {JOURNEY_PHOTOS.map((photo) => (
            <li key={photo.id}>
              <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-warm-beige/20 transition-transform duration-300 hover:scale-105">
                <Image
                  src={photo.webp.desktop}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
