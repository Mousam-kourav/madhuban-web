import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { getPublishedFeaturedExperiences } from '@/lib/featured-experiences/queries';

export async function FeaturedExperiences() {
  const experiences = await getPublishedFeaturedExperiences();

  if (experiences.length === 0) {
    return null;
  }

  return (
    <Section
      label="Featured Experiences"
      id="featured-experiences"
      className="bg-cream py-24 md:py-32"
    >
      <Container>
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-gold-accent">
          Featured Experiences
        </p>

        <Heading
          as="h2"
          text="Curated for Your Visit"
          subheading="Hand-picked experiences and offers to make the most of your time at Madhuban."
          color="charcoal"
          className="mb-12 md:mb-16"
        />

        <ul
          role="list"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3"
        >
          {experiences.map((experience) => (
            <li key={experience.id}>
              <Link href={experience.cta_link} className="group block">
                <article className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-sm transition-shadow duration-300 hover:shadow-lg">
                  <Image
                    src={experience.r2_url}
                    alt={experience.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                    <h3 className="text-xl font-bold tracking-tight md:text-2xl">
                      {experience.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-cream/85">
                      {experience.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em]">
                      {experience.cta_label}
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 transition group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
