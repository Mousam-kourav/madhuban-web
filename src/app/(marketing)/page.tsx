// TODO: Live meta description says "mud villas" but rooms are "mud houses".
// Preserved per CLAUDE.md §10.3. Update during editorial pass.

import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { HeroSection } from '@/components/marketing/hero';
import { WelcomeSection } from '@/components/marketing/homepage/welcome';
import { StatsBar } from '@/components/marketing/homepage/stats';
import { RoomsPreview } from '@/components/marketing/homepage/rooms-preview';
import { ExperiencesGrid } from '@/components/marketing/homepage/experiences-grid';
import { DiningPreview } from '@/components/marketing/homepage/dining-preview';
import { NearbyAttractions } from '@/components/marketing/homepage/nearby-attractions';
import { Testimonials } from '@/components/marketing/homepage/testimonials';
import { BlogPreview } from '@/components/marketing/homepage/blog-preview';
import { lodgingBusiness } from '@/lib/schema/lodging-business';
import { resort } from '@/lib/schema/resort';
import { speakable } from '@/lib/schema/speakable';
import { roomItemList } from '@/lib/schema/item-list';
import { ANSWER_BLOCK } from '@/lib/content/homepage';
import { ROOMS } from '@/lib/content/rooms';

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';

export const metadata: Metadata = buildMetadata({
  title: 'Forest Resort near Ratapani Tiger Reserve, Bhopal',
  titleOverride: 'Madhuban Eco Retreat | Best Eco Resort Near Bhopal',
  description:
    'Discover Madhuban Eco Retreat, a premier eco resort near Bhopal & Ratapani. Enjoy safari tents, mud villas, forest walks & sustainable luxury. Book your stay!',
  path: '/',
  ogImage: `${R2_BASE}/home/hero/hero-aerial-sunset-1920.jpg`,
});

export default function HomePage() {
  return (
    <>
      <Seo
        schemas={[
          lodgingBusiness(),
          resort(),
          speakable({ path: '/', cssSelectors: ['.answer-block'] }),
          roomItemList(ROOMS),
        ]}
      />

      <HeroSection />

      <WelcomeSection />

      {/* AEO answer block — speakable via .answer-block CSS selector */}
      <Section
        label="About Madhuban Eco Retreat"
        className="py-8 md:py-10 bg-warm-beige/30"
      >
        <Container>
          <p className="answer-block mx-auto max-w-3xl text-center font-body text-base leading-relaxed text-charcoal/80">
            {ANSWER_BLOCK}
          </p>
        </Container>
      </Section>

      <StatsBar />

      <RoomsPreview />

      <ExperiencesGrid />

      <DiningPreview />

      <NearbyAttractions />

      <Testimonials />

      <BlogPreview />

      {/* PHASE 3 SESSION D: Newsletter, corporate offsite teaser, FAQ */}
    </>
  );
}
