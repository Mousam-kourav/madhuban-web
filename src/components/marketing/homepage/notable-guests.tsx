import Image from 'next/image';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { R2_BASE } from '@/lib/r2';
import {
  NOTABLE_GUESTS,
  type NotableGuest,
} from '@/lib/testimonials/notable-guests';

interface NotableGuestsProps {
  /** Defaults to the bundled hard-coded list. Pass to override. */
  guests?: readonly NotableGuest[];
}

export function NotableGuests({ guests = NOTABLE_GUESTS }: NotableGuestsProps = {}) {
  return (
    <Section
      label="Notable Guests"
      id="notable-guests"
      className="bg-cream py-24 md:py-32"
    >
      <Container>
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-gold-accent">
          Notable Guests
        </p>

        <Heading
          as="h2"
          text="Loved by Guests Across India"
          subheading="From cinema to conservation, Madhuban has hosted voices that matter."
          className="mb-12"
        />

        <ul
          role="list"
          className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
        >
          {guests.map((guest) => (
            <li key={guest.slug}>
              <article className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-sm transition-shadow duration-300 hover:shadow-lg">
                <Image
                  src={`${R2_BASE}/${guest.image}`}
                  alt={`${guest.name}, ${guest.role}, at Madhuban Eco Retreat`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient for text legibility */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                  <h3 className="text-xl font-bold tracking-tight md:text-2xl">
                    {guest.name}
                  </h3>
                  <p className="mt-1 text-sm text-cream/80">{guest.role}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
