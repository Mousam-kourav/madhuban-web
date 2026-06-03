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
import { VoicesFromMadhuban } from '@/components/marketing/homepage/voices-from-madhuban';
import { FeaturedExperiences } from '@/components/marketing/homepage/featured-experiences';
import { NotableGuests } from '@/components/marketing/homepage/notable-guests';
import { BlogPreview } from '@/components/marketing/homepage/blog-preview';
import { CorporateOffsiteTeaser } from '@/components/marketing/homepage/corporate-offsite-teaser';
import { FollowOurJourney } from '@/components/marketing/homepage/follow-our-journey';
import { NewsletterCta } from '@/components/marketing/homepage/newsletter-cta';
import { FaqSection } from '@/components/marketing/homepage/faq-section';
import { lodgingBusiness } from '@/lib/schema/lodging-business';
import { resort } from '@/lib/schema/resort';
import { speakable } from '@/lib/schema/speakable';
import { roomItemList } from '@/lib/schema/item-list';
import { faqPage } from '@/lib/schema/faq-page';
import { ANSWER_BLOCK } from '@/lib/content/homepage';
import { ROOMS } from '@/lib/content/rooms';
import { HOMEPAGE_FAQS } from '@/lib/content/faqs';

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';

export const metadata: Metadata = buildMetadata({
  title: 'Forest Stay near Ratapani, Bhopal',
  titleOverride: 'Madhuban Eco Retreat — Forest Stay near Ratapani, Bhopal',
  description:
    'A twenty-acre eco retreat at the edge of Ratapani Tiger Reserve. Safari tents, mud houses, pool villa, and twenty-plus included forest experiences, 90 minutes from Bhopal.',
  path: '/',
  ogImage: `${R2_BASE}/og/homepage-1200x630.jpg`,
  ogImageAlt: 'Aerial view of Madhuban Eco Retreat at sunset, surrounded by Ratapani teak forest',
  keywords: [
    'eco retreat bhopal',
    'ratapani eco resort',
    'nature resort near bhopal',
    'forest stay madhya pradesh',
    'eco luxury resort mp',
    'sustainable tourism mp',
    'ratapani tiger reserve stay',
  ],
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
          faqPage({ items: HOMEPAGE_FAQS.map(({ question, answer }) => ({ question, answer })) }),
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

      <VoicesFromMadhuban />

      <FeaturedExperiences />

      <NotableGuests />

      <BlogPreview />

      <CorporateOffsiteTeaser />

      <FollowOurJourney />

      <NewsletterCta />

      <FaqSection />
    </>
  );
}
