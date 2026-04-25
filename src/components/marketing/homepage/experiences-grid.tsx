import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { EXPERIENCES } from '@/lib/content/experiences';

export function ExperiencesGrid() {
  return (
    <Section label="Immersive Experiences" id="experiences" className="bg-warm-beige/30">
      <Container>
        <Heading
          as="h2"
          text="Immersive Experiences in Ratapani&#8217;s Wilderness"
          subheading="Step beyond the retreat into the living forest"
          className="mb-12"
        />

        <ul
          role="list"
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {EXPERIENCES.map((experience) => (
            <li key={experience.slug}>
              <article aria-labelledby={`exp-title-${experience.slug}`}>
                <Card className="overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                  <div className="relative aspect-[3/2] overflow-hidden bg-warm-beige/20">
                    <Image
                      src={experience.image.webp.desktop}
                      alt={experience.image.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover/card:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>

                  <CardHeader>
                    <h3
                      id={`exp-title-${experience.slug}`}
                      className="font-display text-lg font-medium leading-snug text-charcoal"
                    >
                      {experience.name}
                    </h3>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-3">
                    <p className="line-clamp-4 text-sm leading-relaxed text-charcoal/70">
                      {experience.description}
                    </p>
                    <p className="text-xs text-charcoal/60">
                      <span className="font-medium text-earth-brown">Ideal For: </span>
                      {experience.idealFor}
                    </p>
                  </CardContent>

                  <CardFooter>
                    <Link
                      href={experience.href}
                      className="inline-flex items-center gap-1 text-sm font-medium text-earth-brown underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-1 rounded-sm"
                    >
                      Explore
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </Link>
                  </CardFooter>
                </Card>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <Link
            href="/experiences"
            className="inline-flex h-12 items-center justify-center rounded-md border border-earth-brown px-8 text-sm font-medium text-earth-brown transition-colors duration-200 hover:bg-earth-brown hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
          >
            Explore All Experiences
          </Link>
        </div>
      </Container>
    </Section>
  );
}
