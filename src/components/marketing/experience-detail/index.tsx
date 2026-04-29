import Image from 'next/image';
import Link from 'next/link';
import { Check, ChevronRight, ChevronDown } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import type { Experience } from '@/lib/content/experiences';

export function ExperienceDetailPage({ experience }: { experience: Experience }) {
  const whatsappText = encodeURIComponent(
    `Hi, I'm interested in the ${experience.name} experience at Madhuban Eco Retreat.`,
  );

  return (
    <article>
      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <section
        aria-label={`${experience.name} hero`}
        className="relative h-[75svh] min-h-[400px] overflow-hidden md:h-[80svh]"
      >
        <Image
          src={experience.image.webp.desktop}
          alt={experience.image.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-ivory/80">
            Experiences at Madhuban
          </p>
          <h1 className="font-display text-4xl font-medium italic text-ivory md:text-6xl lg:text-7xl">
            {experience.name}
          </h1>
          <p className="mt-4 max-w-xl font-body text-base text-ivory/90 md:text-lg">
            {experience.tagline}
          </p>
        </div>

        <a
          href="#overview"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-ivory/60 px-5 py-2 font-body text-sm text-ivory transition hover:bg-ivory/10"
          aria-label="Scroll to experience overview"
        >
          ↓ Explore
        </a>
      </section>

      {/* ── 2. Answer Block (AEO) ───────────────────────────────────────────── */}
      <section id="overview" className="bg-cream py-10" aria-label="Overview">
        <Container>
          <p
            className="mx-auto max-w-3xl text-center font-body text-base leading-relaxed text-charcoal md:text-lg"
            data-speakable="true"
          >
            {experience.description}
          </p>
        </Container>
      </section>

      {/* ── 3. Long Description ─────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20" aria-label="About this experience">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Heading as="h2" text="About This Experience" subheading="Immersive · Guided · Eco-Friendly" />
            <div className="mt-8 space-y-5 font-body text-base leading-relaxed text-charcoal md:text-[17px]">
              {experience.longDescription.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── 4. What to Expect + Ideal For ───────────────────────────────────── */}
      <section className="bg-warm-beige/30 py-16 md:py-20" aria-label="What to expect">
        <Container>
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            {/* What to Expect */}
            <div>
              <h2 className="mb-6 font-display text-2xl font-medium text-earth-brown md:text-3xl">
                What to Expect
              </h2>
              <ul className="space-y-3" role="list">
                {experience.whatToExpect.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-moss-green"
                      aria-hidden="true"
                    />
                    <span className="font-body text-base text-charcoal">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ideal For */}
            <div>
              <h2 className="mb-6 font-display text-2xl font-medium text-earth-brown md:text-3xl">
                Ideal For
              </h2>
              <ul className="space-y-3" role="list">
                {experience.idealForList.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ChevronRight
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-accent"
                      aria-hidden="true"
                    />
                    <span className="font-body text-base text-charcoal">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 5. Gallery ──────────────────────────────────────────────────────── */}
      {experience.gallery.length > 0 && (
        <section className="bg-white py-16 md:py-20" aria-label={`${experience.name} gallery`}>
          <Container>
            <Heading as="h2" text="Gallery" subheading="A glimpse into the experience" />
            <div
              className={[
                'mt-10 grid gap-3',
                experience.gallery.length === 1
                  ? 'grid-cols-1'
                  : experience.gallery.length >= 4
                  ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                  : 'grid-cols-2 md:grid-cols-3',
              ].join(' ')}
            >
              {experience.gallery.map((img, i) => (
                <div
                  key={i}
                  className={[
                    'relative overflow-hidden rounded-[12px]',
                    experience.gallery.length === 1
                      ? 'aspect-[16/7]'
                      : i === 0 && experience.gallery.length >= 4
                      ? 'col-span-2 aspect-[4/3]'
                      : 'aspect-[3/2]',
                  ].join(' ')}
                >
                  <Image
                    src={img.webp.desktop}
                    alt={img.alt}
                    fill
                    loading={i === 0 ? 'eager' : 'lazy'}
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── 6. FAQs — native <details> (JSON-LD is emitted at page level via touristAttraction()) */}
      <section className="bg-warm-beige/20 py-16 md:py-20" aria-label="Frequently asked questions">
        <Container>
          <Heading as="h2" text="Frequently Asked Questions" subheading="Common questions answered" />
          <div className="mt-10 mx-auto max-w-3xl divide-y divide-border overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            {experience.faqs.map((faq, i) => (
              <details key={i} className="group" open={i === 0}>
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
      </section>

      {/* ── 7. CTA ──────────────────────────────────────────────────────────── */}
      <section
        className="bg-forest-green py-20 text-center md:py-24"
        aria-label="Plan your stay"
      >
        <Container>
          <p className="mb-2 font-body text-xs uppercase tracking-[0.2em] text-ivory/60">
            Madhuban Eco Retreat · Ratapani, Madhya Pradesh
          </p>
          <h2 className="mb-4 font-display text-3xl font-medium italic text-ivory md:text-5xl">
            Ready to Experience It?
          </h2>
          <p className="mx-auto mb-8 max-w-xl font-body text-base text-ivory/80">
            Plan your retreat at Madhuban — 60 km from Bhopal, deep in the Ratapani forest.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/enquire"
              className="inline-flex h-12 items-center justify-center rounded-md bg-ivory px-8 font-body text-sm font-medium text-earth-brown transition hover:bg-warm-beige"
            >
              Plan Your Retreat
            </Link>
            <a
              href={`https://wa.me/919770558419?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-md border border-ivory/50 px-8 font-body text-sm font-medium text-ivory transition hover:bg-ivory/10"
            >
              Chat on WhatsApp
            </a>
          </div>
        </Container>
      </section>
    </article>
  );
}
