import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ROOMS } from '@/lib/content/rooms';
import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { breadcrumbListFromPath } from '@/lib/schema/breadcrumb-list';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'Stay With Us',
  description:
    'Six eco-luxury stays at Madhuban Eco Retreat, 60 km from Bhopal — from canvas safari tents and mud houses to a pool-side villa. All prices include GST.',
  path: '/stay',
});

export default function StayPage() {
  return (
    <>
      <Seo schemas={[breadcrumbListFromPath('/stay')]} />

      {/* ── Intro ─────────────────────────────────────────────────────────── */}
      <Section className="bg-cream" label="Accommodation overview">
        <Container>
          <Heading
            as="h1"
            text="Stay With Us"
            subheading="Six unique eco-luxury stays in the heart of Ratapani forest"
            className="mb-6"
          />
          <p className="mx-auto max-w-[720px] text-center font-body text-base leading-relaxed text-charcoal/70">
            Every accommodation at Madhuban is designed for slowness. Canvas tents that put the
            forest at arm&apos;s length. Mud houses built with traditional rammed-earth craft. A
            pool villa with the water just ten paces from bed. Choose your version of forest luxury
            — then let Ratapani do the rest.
          </p>
        </Container>
      </Section>

      {/* ── Room grid ─────────────────────────────────────────────────────── */}
      <Section className="bg-cream pt-0" label="All accommodations">
        <Container>
          <ul role="list" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ROOMS.map((room, index) => (
              <li key={room.slug}>
                <article aria-labelledby={`room-title-${room.slug}`}>
                  <Card className="overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                    <div className="relative aspect-[3/2] overflow-hidden bg-warm-beige/20">
                      <Image
                        src={room.image.webp.desktop}
                        alt={room.image.alt}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-300"
                        {...(index === 0
                          ? { loading: 'eager' as const, priority: true }
                          : { loading: 'lazy' as const })}
                      />
                    </div>

                    <CardHeader>
                      <p className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        {room.genre}
                      </p>
                      <h2
                        id={`room-title-${room.slug}`}
                        className="font-display text-xl font-medium leading-snug text-charcoal"
                      >
                        {room.name}
                      </h2>
                      <p className="font-body text-sm font-medium text-earth-brown">
                        From &#8377;{formatPrice(room.pricePerNight)}/night
                      </p>
                    </CardHeader>

                    <CardContent>
                      <p className="font-body text-sm leading-relaxed text-charcoal/70">
                        {room.tagline}
                      </p>
                    </CardContent>

                    <CardFooter>
                      <Link
                        href={room.href}
                        className="font-body text-sm font-medium text-earth-brown underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-1"
                      >
                        View room details →
                      </Link>
                    </CardFooter>
                  </Card>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <Section className="bg-warm-beige/30" label="Booking enquiry">
        <Container>
          <div className="mx-auto max-w-[560px] text-center">
            <Heading
              as="h2"
              text="Not sure which room to book?"
              className="mb-6"
            />
            <p className="mb-8 font-body text-base leading-relaxed text-charcoal/70">
              Drop us a message on WhatsApp and we&apos;ll help you choose the stay that matches
              your group size, dates, and what you want from the forest.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="https://wa.me/919770558419?text=Hi, I'd like help choosing an accommodation at Madhuban Eco Retreat."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-lg bg-earth-brown px-6 font-body text-sm font-medium text-ivory transition-colors duration-200 hover:bg-earth-brown/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
              >
                WhatsApp Us
              </a>
              <Link
                href="/booking"
                className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-lg border border-earth-brown px-6 font-body text-sm font-medium text-earth-brown transition-colors duration-200 hover:bg-earth-brown hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
              >
                Book Now
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
