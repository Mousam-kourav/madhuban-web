import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { adminGetFeaturedExperience } from '@/lib/featured-experiences/queries';
import { FeaturedForm } from '../../featured-form';

export default async function EditFeaturedExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await adminGetFeaturedExperience(id);
  if (!item) notFound();

  return (
    <div>
      <Link
        href="/admin/featured-experiences"
        className="mb-6 inline-flex items-center gap-1 font-body text-sm text-[var(--color-earth-brown)] hover:text-[var(--color-charcoal)]"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Featured Experiences
      </Link>
      <h1 className="mb-8 font-display text-4xl text-[var(--color-charcoal)]">
        Edit Featured Experience
      </h1>
      <div className="max-w-3xl rounded-2xl border border-[var(--color-border)] bg-white p-8">
        <FeaturedForm initial={item} />
      </div>
    </div>
  );
}
