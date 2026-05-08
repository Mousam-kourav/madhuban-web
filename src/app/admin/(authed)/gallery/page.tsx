import { Images } from 'lucide-react';
import { adminGetGalleryItems } from '@/lib/gallery/queries';
import type { GalleryItemRow } from '@/lib/gallery/queries';
import { GalleryClient } from './gallery-client';

export default async function AdminGalleryPage() {
  let items: GalleryItemRow[] = [];
  try {
    items = await adminGetGalleryItems({ limit: 200 });
  } catch {
    // DB unavailable — client will handle empty state
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-earth-brown)]/10">
            <Images className="h-5 w-5 text-[var(--color-earth-brown)]" />
          </div>
          <div>
            <h1 className="font-display italic text-4xl text-[var(--color-charcoal)]">
              Gallery Management
            </h1>
            <p className="mt-0.5 font-body text-sm text-[var(--color-muted)]">
              Organize and curate visual narratives of the sanctuary.
            </p>
          </div>
        </div>
      </div>

      <GalleryClient initialItems={items} />
    </div>
  );
}
