import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { Seo } from '@/components/ui/seo';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container } from '@/components/ui/container';
import { ExperienceDetailPage } from '@/components/marketing/experience-detail';
import { EXPERIENCES } from '@/lib/content/experiences';
import { touristAttraction, breadcrumbListFromPath } from '@/lib/schema';

export function generateStaticParams() {
  return EXPERIENCES.map((exp) => ({ slug: exp.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const experience = EXPERIENCES.find((e) => e.slug === slug);
  if (!experience) return {};

  return buildMetadata({
    title: experience.seoTitle,
    description: experience.seoDescription,
    path: experience.href,
    ogImage: experience.gallery[0]?.webp.desktop,
  });
}

export default async function ExperienceSlugPage({ params }: Props) {
  const { slug } = await params;
  const experience = EXPERIENCES.find((e) => e.slug === slug);

  if (!experience) notFound();

  const heroImageUrl = experience.gallery[0]?.webp.desktop ?? '';
  const schemas = touristAttraction({
    name: experience.name,
    description: experience.longDescription[0] ?? experience.description,
    path: experience.href,
    heroImageUrl,
    touristTypes: experience.idealForList,
    faqs: experience.faqs,
  });

  return (
    <>
      <Seo schemas={[...schemas, breadcrumbListFromPath(experience.href)]} />

      {/* Breadcrumb */}
      <div className="bg-cream py-3">
        <Container>
          <Breadcrumb pathname={experience.href} />
        </Container>
      </div>

      <ExperienceDetailPage experience={experience} />
    </>
  );
}
