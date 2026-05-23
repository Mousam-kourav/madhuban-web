import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { attractionItemList } from '@/lib/schema/item-list';
import { R2_BASE } from '@/lib/r2';
import { ATTRACTIONS } from '@/lib/attractions/data';
import { AttractionGrid } from './filter-chips';

export const metadata: Metadata = buildMetadata({
  title: 'Nearby Attractions',
  description:
    'Heritage sites, wildlife reserves, and temples within an easy drive of Madhuban Eco Retreat — including Ratapani Tiger Reserve, Bhimbetka, Bhojpur, and Salkanpur.',
  path: '/nearby-attractions',
  ogImage: `${R2_BASE}/attractions/ratapani-tiger-reserve/hero.webp`,
});

function heroImage(slug: string) {
  return `${R2_BASE}/attractions/${slug}/hero.webp`;
}

const STATS = [
  { number: '9', label: 'Heritage & Nature\nDestinations' },
  { number: '30,000+', label: 'Years of Human\nHistory Nearby' },
  { number: '1,271 km²', label: 'Tiger Reserve at\nOur Doorstep' },
  { number: '57th', label: 'Tiger Reserve\nin India' },
] as const;

export default function NearbyAttractionsPage() {
  return (
    <>
      <Seo schemas={[attractionItemList(ATTRACTIONS, heroImage)]} />

      {/* ── Hero (typography only) ───────────────────────────────────────── */}
      <section aria-labelledby="hero-heading" className="bg-cream py-20 md:py-28 text-center px-4">
        <p className="text-xs uppercase tracking-[0.2em] font-body font-medium text-gold-accent mb-6">
          Beyond Madhuban
        </p>

        {/* Diamond divider */}
        <div className="flex items-center justify-center gap-4 mb-8" aria-hidden="true">
          <div className="h-px w-16 bg-gold-accent/40" />
          <div className="size-2 bg-gold-accent rotate-45" />
          <div className="h-px w-16 bg-gold-accent/40" />
        </div>

        <h1
          id="hero-heading"
          className="text-4xl md:text-7xl font-display font-light text-charcoal mb-6 leading-tight break-words"
        >
          Where the Forest Opens into History
        </h1>

        <p className="max-w-2xl mx-auto text-base md:text-lg font-body text-earth-brown leading-relaxed">
          Within a short drive of the property — a thousand-year-old temple, India&apos;s newest
          tiger reserve, prehistoric caves older than civilisation, and a Gond queen&apos;s hilltop
          fort.
        </p>
      </section>

      {/* ── Intro paragraphs ─────────────────────────────────────────────── */}
      <section className="bg-cream py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-6 text-base md:text-lg font-body text-earth-brown leading-relaxed">
          <p>
            <span
              className="float-left font-display text-7xl font-light leading-none text-gold-accent mr-3 mt-1"
              aria-hidden="true"
            >
              M
            </span>
            adhuban sits at the edge of the <strong>Ratapani Tiger Reserve</strong>, in a corner of
            central Madhya Pradesh where deep history and wild forest happen to share the same
            address. From the property, a morning&apos;s drive can take you to a UNESCO World
            Heritage Site older than recorded language, a Buddhist monastery where a young Emperor
            Ashoka once stayed, or a temple that has been continuously worshipped at for a thousand
            years.
          </p>
          <p>
            We&apos;ve been recommending these nine places to guests for years — chosen for what
            they actually offer, not just for what guidebooks list. Each one is reachable as a
            half-day or full-day trip from Madhuban. Our team can arrange transport, guides, and
            timings; just ask the front desk a day in advance.
          </p>
        </div>
      </section>

      {/* ── Statistics strip ─────────────────────────────────────────────── */}
      <section aria-label="Key statistics" className="bg-warm-beige/30 py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
          {STATS.map((stat, i) => (
            <div
              key={stat.number}
              className={`text-center ${i > 0 ? 'md:border-l md:border-warm-beige' : ''}`}
            >
              <p className="text-5xl md:text-6xl font-display font-light text-forest-green">
                {stat.number}
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-earth-brown mt-2 whitespace-pre-line">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Card grid with filter ─────────────────────────────────────────── */}
      <section aria-labelledby="grid-heading" className="bg-cream py-20 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2
            id="grid-heading"
            className="text-3xl md:text-5xl font-display font-light text-charcoal text-center mb-4"
          >
            The Nine Places We Recommend
          </h2>
          <p className="text-center text-sm font-body text-earth-brown/70 mb-12">
            Each reachable as a half-day or full-day trip from Madhuban.
          </p>

          <AttractionGrid attractions={ATTRACTIONS} r2Base={R2_BASE} />
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <ClosingCta />
    </>
  );
}

export function ClosingCta() {
  return (
    <section className="bg-forest-green text-cream py-24 md:py-32 px-4 text-center">
      <p className="text-xs uppercase tracking-[0.2em] font-body font-medium text-gold-accent mb-6">
        Plan Your Visit
      </p>
      <h2 className="text-3xl md:text-5xl font-display font-light text-cream mb-6">
        Stay With Us. Step Into the Story.
      </h2>
      <p className="max-w-2xl mx-auto text-base md:text-lg font-body text-cream/80 leading-relaxed mb-10">
        Madhuban is the base from which all of this becomes a single, unhurried experience.
        We&apos;ll handle the maps, the timings, and the chai. You bring the curiosity.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/stay"
          className="min-h-[48px] inline-flex items-center justify-center px-8 py-3 rounded-full bg-cream text-forest-green font-body font-medium text-sm uppercase tracking-[0.15em] transition-opacity duration-200 hover:opacity-90"
        >
          Check Availability
        </Link>
        <Link
          href="/contact-us"
          className="min-h-[48px] inline-flex items-center justify-center px-8 py-3 rounded-full border border-cream text-cream font-body font-medium text-sm uppercase tracking-[0.15em] transition-colors duration-200 hover:bg-cream/10"
        >
          Speak to Our Team
        </Link>
      </div>
    </section>
  );
}
