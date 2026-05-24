import Image from 'next/image';
import Link from 'next/link';
import { TreePine, Compass, UtensilsCrossed, Phone, ChevronDown } from 'lucide-react';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { lodgingBusiness } from '@/lib/schema/lodging-business';
import { faqPage } from '@/lib/schema/faq-page';
import { breadcrumbList } from '@/lib/schema/breadcrumb-list';
import { getRooms } from '@/lib/rooms/queries';
import { dbRoomToRoom } from '@/lib/rooms/mapper';
import type { Room } from '@/lib/content/rooms';
import { formatPrice } from '@/lib/utils';
import { WhatsAppLeadForm } from '@/components/booking/whatsapp-lead-form';

// SEO — exact title + description preserved from old site (page ranks in Google)
export const metadata: Metadata = buildMetadata({
  title: 'Book',
  titleOverride: 'Book Madhuban Eco Retreat | Hotel Near Ratapani Jungle',
  description:
    'Book Madhuban Eco Retreat near Ratapani Wildlife Sanctuary. Check resort price, availability & secure your eco-friendly jungle stay today!',
  path: '/booking',
  ogImage: `${process.env.NEXT_PUBLIC_R2_BASE ?? ''}/home/hero/hero-aerial-sunset-1280.webp`,
  keywords: [
    'Book resort near ratapani jungle',
    'Ratapani resort price',
    'Madhuban Eco Retreat price',
    'Ratapani resort booking',
    'Book hotel near ratapani jungle lodge',
    'Hotels near Ratapani Wildlife Sanctuary',
    'Book hotel near ratapani for family',
    'Hotel in Ratapani online booking',
  ],
});

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';

// R2 path reuses existing hero image — no new upload needed
const HERO_IMAGE = {
  src: `${R2_BASE}/home/hero/hero-aerial-sunset-1280.webp`,
  alt: 'Aerial view of Madhuban Eco Retreat at sunset, with forested hills of Ratapani Tiger Reserve in the distance',
};

// Old-site SEO subtitle for each room slug — preserved verbatim
const ROOM_SEO_SUBTITLES: Record<string, string> = {
  'safari-tent': 'Ratapani Resort Safari Stay',
  'mud-house-1': 'Traditional Jungle Resort Mud House',
  'mud-house-2': 'Traditional Jungle Resort Mud House',
  'pool-side-villa': 'Resort with Swimming Pool Villa',
  'glamping-tents': 'Luxury Jungle Camp Glamping',
  'camping-tent': 'Nature Forest Resort Camping',
};

const HIGHLIGHTS = [
  {
    icon: TreePine,
    title: 'Teak Forest Views',
    body: 'Wake up to the sounds of the jungle in our premium cottages nestled within ancient teak trees.',
  },
  {
    icon: Compass,
    title: 'Wildlife Safaris',
    body: 'Guided excursions into the Ratapani Tiger Reserve led by expert naturalists and forest guards.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Farm-to-Table',
    body: 'Authentic local flavors prepared with organic ingredients sourced from nearby tribal villages.',
  },
] as const;

const FAQS = [
  {
    question: "What's the price of a stay at Madhuban Eco Retreat?",
    answer:
      'Room rates start from ₹2,500/night (Camping Tent) up to ₹12,000/night (Safari Tent or Pool Side Villa), all inclusive of GST. Prices vary by room type and season. Use the WhatsApp enquiry form on this page to receive a personalised quote.',
  },
  {
    question: 'How do I book a hotel near Ratapani Wildlife Sanctuary?',
    answer:
      "You can book online at madhubanecoretreat.com — browse accommodations at /stay, pick your room, and use the booking widget. For faster service, WhatsApp us on +91 9770558419 and we'll confirm your dates directly.",
  },
  {
    question: 'Is Madhuban Eco Retreat suitable for family bookings?',
    answer:
      'Absolutely. All rooms welcome families. The Pool Side Villa comfortably fits 2 adults + 2 children. Guided forest walks and recreational activities are designed for all age groups — children, seniors, and beginners alike.',
  },
  {
    question: 'How far is Madhuban from Bhopal?',
    answer:
      'Madhuban Eco Retreat is approximately 60 km from Bhopal city, near Rehti, Sehore district. The drive takes roughly 1.5 to 2 hours depending on route and traffic.',
  },
  {
    question: "What's the cancellation policy?",
    answer:
      'Free cancellation up to 7 days before arrival — you receive a 100% refund. 3–7 days before check-in: 50% refund. Less than 3 days or no-show: no refund. Full details at madhubanecoretreat.com/terms-and-condition.',
  },
  {
    question: 'Are there safari options near Madhuban Eco Retreat?',
    answer:
      'Yes. Madhuban is adjacent to the Ratapani Tiger Reserve. The resort organises guided jungle safaris and forest walks led by trained naturalists and forest guards. Pre-booking is recommended for safaris.',
  },
  {
    question: "What's included in the room rate?",
    answer:
      'All room rates at Madhuban include breakfast, Wi-Fi access, swimming pool access (where applicable), and parking. Additional meals, safaris, and activity bookings are available at extra cost.',
  },
] as const;

const breadcrumbSchema = breadcrumbList({
  items: [
    { name: 'Home', path: '/' },
    { name: 'Booking', path: '/booking' },
  ],
});

export default async function BookingPage() {
  let rooms: Room[] = [];
  try {
    const dbRooms = await getRooms();
    rooms = dbRooms.map((r) => dbRoomToRoom(r, []));
  } catch {
    rooms = [];
  }

  return (
    <>
      <Seo
        schemas={[
          lodgingBusiness(),
          faqPage({ items: FAQS.map((f) => ({ question: f.question, answer: f.answer })) }),
          breadcrumbSchema,
        ]}
      />

      {/* ── 1. Hero ──────────────────────────────────────────────────────────── */}
      <section
        aria-label="Book Madhuban Eco Retreat hero"
        className="relative h-[75svh] min-h-[420px] overflow-hidden"
      >
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          {/* Status banner eyebrow */}
          <span className="mb-4 inline-block rounded-full bg-earth-brown/80 px-4 py-1 font-body text-xs font-medium uppercase tracking-[0.2em] text-ivory">
            Now Open for Bookings
          </span>
          <h1 className="font-display text-4xl font-medium text-ivory md:text-5xl lg:text-6xl">
            Escape to Ratapani&apos;s<br className="hidden md:block" /> Premier Eco-Luxury Retreat
          </h1>
          <p className="mt-5 max-w-2xl font-body text-base text-ivory/90 md:text-lg">
            Experience nature like never before. Immerse yourself in the heart of the Tiger Reserve,
            just 1 hour from the bustle of Bhopal.
          </p>
        </div>
      </section>

      {/* ── Breadcrumb ───────────────────────────────────────────────────────── */}
      <div className="bg-cream py-3">
        <Container>
          <Breadcrumb pathname="/booking" />
        </Container>
      </div>

      {/* ── 2. WhatsApp Lead Form ────────────────────────────────────────────── */}
      <Section className="bg-cream" label="Book your stay">
        <Container>
          <div className="mx-auto max-w-lg">
            <div className="text-center mb-8">
              <Heading
                as="h2"
                text="Plan Your Nature Getaway"
                subheading="Fill in the details below to receive a personalized quote."
              />
            </div>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
              <WhatsAppLeadForm />
            </div>
            <p className="mt-4 text-center font-body text-xs text-charcoal/50">
              Prefer a form?{' '}
              <Link href="/enquire" className="text-earth-brown underline underline-offset-2 hover:no-underline">
                Use our booking enquiry form
              </Link>
              .
            </p>
          </div>
        </Container>
      </Section>

      {/* ── 3. Reconnect with Wilderness ─────────────────────────────────────── */}
      <Section className="bg-warm-beige/20" label="Reconnect with wilderness">
        <Container>
          <Heading
            as="h2"
            text="Reconnect with Wilderness"
            className="mb-12"
          />
          <ul
            role="list"
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
              <li key={title}>
                <article className="flex h-full flex-col items-center rounded-[16px] border border-border bg-white p-8 text-center shadow-sm">
                  <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-earth-brown/10">
                    <Icon className="h-6 w-6 text-earth-brown" aria-hidden="true" />
                  </span>
                  <h3 className="mb-3 font-display text-xl font-medium text-charcoal">{title}</h3>
                  <p className="font-body text-sm leading-relaxed text-charcoal/70">{body}</p>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── 4. Luxury Stays — Room Grid ──────────────────────────────────────── */}
      <Section className="bg-white" label="Luxury stays at Madhuban">
        <Container>
          <Heading
            as="h2"
            text="Luxury Stays"
            subheading="Experience the Eco-friendly Accommodations at Madhuban Eco Retreat"
            className="mb-12"
          />

          {rooms.length > 0 ? (
            <ul
              role="list"
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {rooms.map((room, index) => (
                <li key={room.slug}>
                  <article
                    aria-labelledby={`bk-room-${room.slug}`}
                    className="h-full"
                  >
                    <Card className="h-full overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
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
                        {/* SEO subtitle preserved from old site */}
                        <p className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          {ROOM_SEO_SUBTITLES[room.slug] ?? room.genre}
                        </p>
                        <h3
                          id={`bk-room-${room.slug}`}
                          className="font-display text-xl font-medium leading-snug text-charcoal"
                        >
                          {room.name}
                        </h3>
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
                          View Details →
                        </Link>
                      </CardFooter>
                    </Card>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-12 text-center">
              <p className="font-body text-base text-charcoal/60">
                View all accommodations at{' '}
                <Link href="/stay" className="text-earth-brown underline underline-offset-2">
                  our Stay page
                </Link>
                .
              </p>
            </div>
          )}
        </Container>
      </Section>

      {/* ── 5. Call Strip ────────────────────────────────────────────────────── */}
      <section
        className="bg-earth-brown py-14 text-center"
        aria-label="Call for instant booking"
      >
        <Container>
          <p className="mb-2 font-body text-xs uppercase tracking-[0.25em] text-ivory/60">
            Available 9 AM – 6 PM daily
          </p>
          <h2 className="mb-3 font-display text-3xl font-medium text-ivory md:text-4xl">
            Call for Instant Booking
          </h2>
          <p className="mb-6 font-display text-4xl font-medium text-ivory/90 md:text-5xl">
            +91 9770558419
          </p>
          <a
            href="tel:+919770558419"
            className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-ivory/60 px-10 font-body text-sm font-semibold uppercase tracking-wider text-ivory transition hover:bg-ivory hover:text-earth-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-earth-brown"
          >
            <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
            Call Now
          </a>
        </Container>
      </section>

      {/* ── 6. Escape to the Wilds ───────────────────────────────────────────── */}
      <Section className="bg-cream" label="Escape to the wilds">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-earth-brown/70">
                Just 1 hour from Bhopal
              </p>
              <h2 className="font-display text-3xl font-medium leading-tight text-charcoal md:text-4xl">
                Escape to the Wilds
              </h2>
              <div className="my-5 flex items-center gap-3" aria-hidden="true">
                <span className="block h-px w-8 bg-earth-brown" />
                <span className="block size-1.5 rotate-45 bg-earth-brown" />
                <span className="block h-px w-8 bg-earth-brown" />
              </div>
              <div className="space-y-4 font-body text-base leading-relaxed text-charcoal/80">
                <p>
                  Only 1 hour from Bhopal — Escape the city noise. Located in the heart of the
                  Ratapani Tiger Reserve, Madhuban Eco Retreat offers a complete break from the
                  digital world.
                </p>
                <p>
                  60 km from Bhopal along scenic forest roads, the retreat sits on 20 acres of
                  regenerated land adjacent to one of Madhya Pradesh&apos;s most biodiverse wildlife
                  corridors.
                </p>
                <ul className="space-y-2">
                  {[
                    '70+ bird species in the surrounding forest',
                    'Organic kitchen garden & farm-to-table dining',
                    'Guided safaris into Ratapani Tiger Reserve',
                    'Zero plastic policy. Solar-assisted operations.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 block size-1.5 shrink-0 rotate-45 bg-earth-brown" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] shadow-md">
              <Image
                src={`${R2_BASE}/home/experiences/forest-walks-and-nature-trails-1280.webp`}
                alt="Forest walking trail through teak woodland at Madhuban Eco Retreat, adjacent to Ratapani Tiger Reserve"
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 7. FAQs ──────────────────────────────────────────────────────────── */}
      <Section className="bg-warm-beige/20" label="Booking FAQs">
        <Container>
          <Heading
            as="h2"
            text="FAQs"
            subheading="Questions for a Meaningful Journey"
            className="mb-10"
          />
          <div className="mx-auto max-w-3xl divide-y divide-border overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            {FAQS.map((faq, i) => (
              <details key={faq.question} className="group" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-body text-base font-medium text-charcoal transition hover:bg-cream [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown
                    className="h-4 w-4 flex-shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div
                  className="px-5 pb-4 font-body text-[15px] leading-relaxed text-charcoal/70"
                  data-speakable="true"
                >
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 8. Final CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-forest-green py-20 text-center md:py-24" aria-label="Plan your stay">
        <Container>
          <p className="mb-2 font-body text-xs uppercase tracking-[0.2em] text-ivory/60">
            Madhuban Eco Retreat · Ratapani Tiger Reserve Belt
          </p>
          <h2 className="mb-4 font-display text-3xl font-medium text-ivory md:text-5xl">
            Plan Your Stay at Madhuban
          </h2>
          <p className="mx-auto mb-8 max-w-xl font-body text-base text-ivory/80">
            Choose from six unique eco-luxury stays — from safari tents to a pool-side villa.
            60&nbsp;km from Bhopal, surrounded by nature.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/stay"
              className="inline-flex h-12 items-center justify-center rounded-md bg-ivory px-8 font-body text-sm font-medium text-earth-brown transition hover:bg-warm-beige"
            >
              View All Rooms
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex h-12 items-center justify-center rounded-md border border-ivory/50 px-8 font-body text-sm font-medium text-ivory transition hover:bg-ivory/10"
            >
              Have a question? Contact us →
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
