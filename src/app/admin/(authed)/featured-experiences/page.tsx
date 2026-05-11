import Link from 'next/link';
import { Plus, Sparkles } from 'lucide-react';
import { adminGetAllFeaturedExperiences } from '@/lib/featured-experiences/queries';
import { FeaturedListClient } from './featured-list-client';

export default async function AdminFeaturedExperiencesPage() {
  let items: Awaited<ReturnType<typeof adminGetAllFeaturedExperiences>> = [];
  try {
    items = await adminGetAllFeaturedExperiences();
  } catch {
    // DB unavailable — show empty list
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-earth-brown)]/10">
            <Sparkles className="h-5 w-5 text-[var(--color-earth-brown)]" />
          </div>
          <div>
            <h1 className="font-display text-4xl text-[var(--color-charcoal)]">Featured Experiences</h1>
            <p className="mt-0.5 font-body text-sm text-[var(--color-muted)]">
              Curated 16:9 cards shown on the homepage. {items.length} total.
            </p>
          </div>
        </div>
        <Link
          href="/admin/featured-experiences/new"
          className="flex items-center gap-2 rounded-xl bg-[var(--color-forest-green)] px-5 py-3 font-body text-sm font-medium text-[var(--color-ivory)] transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Experience
        </Link>
      </div>

      <FeaturedListClient initialItems={items} />
    </div>
  );
}
