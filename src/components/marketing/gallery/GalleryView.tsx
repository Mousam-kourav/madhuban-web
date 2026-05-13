'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Masonry from 'react-masonry-css';
import { useSwipeable } from 'react-swipeable';
import { X, ChevronLeft, ChevronRight, Play, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GalleryCategory, GalleryItemRow } from '@/lib/supabase/database.types';

const CATEGORIES: { value: GalleryCategory | 'all'; label: string }[] = [
  { value: 'all',                label: 'All' },
  { value: 'stays',              label: 'Stays' },
  { value: 'dining',             label: 'Dining' },
  { value: 'aranyashala',        label: 'Aranyashala' },
  { value: 'forest',             label: 'Forest' },
  { value: 'events',             label: 'Events' },
  { value: 'behind-the-scenes',  label: 'Behind the Scenes' },
];

const CATEGORY_DESCRIPTIONS: Partial<Record<GalleryCategory | 'all', string>> = {
  all:                   'A complete visual narrative of life at Madhuban.',
  stays:                 'Safari tents, mud houses, glamping, and our poolside villa.',
  dining:                'Farm-to-table meals, campfire dinners, and forest feasts.',
  aranyashala:           'Nature school sessions, forest classrooms, and eco-workshops.',
  forest:                'Wild landscapes, wildlife trails, and Ratapani in every season.',
  events:                'Weddings, corporate retreats, and special celebrations.',
  'behind-the-scenes':   'The people, rituals, and daily rhythms that make Madhuban.',
};

const BREAKPOINTS = { default: 4, 1100: 3, 768: 2, 480: 1 };

interface LightboxState {
  open: boolean;
  index: number;
}

function Lightbox({
  items,
  state,
  onClose,
  onPrev,
  onNext,
}: {
  items: GalleryItemRow[];
  state: LightboxState;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[state.index];
  const handlers = useSwipeable({
    onSwipedLeft: onNext,
    onSwipedRight: onPrev,
    trackMouse: false,
  });

  useEffect(() => {
    if (!state.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [state.open, onClose, onPrev, onNext]);

  if (!state.open || !item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={item.alt_text || item.filename}
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        aria-label="Close lightbox"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Prev */}
      <button
        type="button"
        aria-label="Previous image"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Media */}
      <div
        {...handlers}
        className="relative mx-16 flex max-h-[85vh] max-w-5xl items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === 'video' ? (
          <video
            src={item.r2_url}
            controls
            autoPlay
            className="max-h-[80vh] max-w-full rounded-lg"
          />
        ) : (
          <Image
            src={item.r2_url}
            alt={item.alt_text || item.filename}
            width={item.width ?? 1200}
            height={item.height ?? 800}
            className="max-h-[80vh] w-auto rounded-lg object-contain"
            priority
          />
        )}

        {/* Caption */}
        {item.caption && (
          <p className="absolute -bottom-8 left-0 right-0 text-center font-body text-sm text-white/70">
            {item.caption}
          </p>
        )}
      </div>

      {/* Next */}
      <button
        type="button"
        aria-label="Next image"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Counter */}
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-body text-xs text-white/50">
        {state.index + 1} / {items.length}
      </span>
    </div>
  );
}

export function GalleryView({ items }: { items: GalleryItemRow[] }) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'all'>('all');
  const [lightbox, setLightbox] = useState<LightboxState>({ open: false, index: 0 });

  const filtered = activeCategory === 'all'
    ? items
    : items.filter((i) => i.category === activeCategory);

  const openLightbox = useCallback((index: number) => {
    setLightbox({ open: true, index });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox((s) => ({ ...s, open: false }));
  }, []);

  const prevItem = useCallback(() => {
    setLightbox((s) => ({ open: true, index: (s.index - 1 + filtered.length) % filtered.length }));
  }, [filtered.length]);

  const nextItem = useCallback(() => {
    setLightbox((s) => ({ open: true, index: (s.index + 1) % filtered.length }));
  }, [filtered.length]);

  return (
    <>
      {/* Category Filter */}
      <div className="sticky top-0 z-20 border-b border-[var(--color-border,#e5e0d8)] bg-[var(--color-cream,#faf7f2)]">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          <div
            className="flex gap-1 overflow-x-auto py-3 scrollbar-none"
            role="tablist"
            aria-label="Filter gallery by category"
          >
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                role="tab"
                aria-selected={activeCategory === value}
                type="button"
                onClick={() => setActiveCategory(value)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-1.5 font-body text-sm transition-colors',
                  activeCategory === value
                    ? 'bg-[var(--color-earth-brown)] text-white'
                    : 'bg-white text-[var(--color-charcoal)] hover:bg-[var(--color-earth-brown)]/10',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Description */}
      {CATEGORY_DESCRIPTIONS[activeCategory] && (
        <div className="border-b border-[var(--color-border,#e5e0d8)] bg-white py-3">
          <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
            <p className="font-body text-sm text-[var(--color-muted)]">
              {CATEGORY_DESCRIPTIONS[activeCategory]}
            </p>
          </div>
        </div>
      )}

      {/* Grid */}
      <section
        aria-label="Gallery images"
        className="mx-auto max-w-[1280px] px-4 py-8 md:px-6 lg:px-8 lg:py-12"
      >
        {filtered.length === 0 ? (
          <p className="py-24 text-center font-body text-[var(--color-muted)]">
            No images in this category yet. Check back soon.
          </p>
        ) : (
          <Masonry
            breakpointCols={BREAKPOINTS}
            className="flex -ml-4"
            columnClassName="pl-4"
          >
            {filtered.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Open ${item.alt_text || item.filename}`}
                onClick={() => openLightbox(idx)}
                className="group relative mb-4 block w-full overflow-hidden rounded-xl bg-[var(--color-cream)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-earth-brown)]"
              >
                {item.type === 'video' ? (
                  <div className="relative aspect-video bg-charcoal">
                    {item.thumbnail_url ? (
                      <Image
                        src={item.thumbnail_url}
                        alt={item.alt_text || item.filename}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1100px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-12 w-12 text-white/60" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Play className="h-10 w-10 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-[4/3] overflow-hidden bg-charcoal/5">
                    {/* Blurred fill: hides empty bands when the image isn't 4:3 */}
                    <Image
                      src={item.thumbnail_url ?? item.r2_url}
                      alt=""
                      fill
                      aria-hidden="true"
                      className="scale-110 object-cover opacity-80 blur-2xl"
                      sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1100px) 33vw, 25vw"
                    />
                    {/* Foreground: full image, never cropped */}
                    <Image
                      src={item.thumbnail_url ?? item.r2_url}
                      alt={item.alt_text || item.filename}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1100px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/50 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {item.caption && (
                        <span className="font-body text-xs leading-snug text-white line-clamp-2">
                          {item.caption}
                        </span>
                      )}
                      <ZoomIn className="ml-auto h-5 w-5 shrink-0 text-white" aria-hidden="true" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </Masonry>
        )}
      </section>

      <Lightbox
        items={filtered}
        state={lightbox}
        onClose={closeLightbox}
        onPrev={prevItem}
        onNext={nextItem}
      />
    </>
  );
}
