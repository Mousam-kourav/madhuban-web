'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Attraction } from '@/lib/attractions/data';

const FILTERS = ['All', 'Wildlife', 'Heritage', 'Temples', 'Adventure'] as const;
type Filter = (typeof FILTERS)[number];

interface AttractionGridProps {
  attractions: Attraction[];
  /** R2 base URL, passed as a string so no function crosses the server→client boundary. */
  r2Base: string;
}

export function AttractionGrid({ attractions, r2Base }: AttractionGridProps) {
  const [active, setActive] = useState<Filter>('All');

  const cardImage = (slug: string) => `${r2Base}/attractions/${slug}/card.webp`;

  const filtered =
    active === 'All'
      ? attractions
      : attractions.filter((a) => {
          if (active === 'Wildlife') return a.category === 'Wildlife';
          if (active === 'Heritage') return a.category === 'Heritage';
          if (active === 'Temples') return a.category === 'Temples';
          if (active === 'Adventure') return a.category === 'Adventure';
          return true;
        });

  return (
    <>
      {/* Filter chips */}
      <div
        className="flex flex-wrap justify-center gap-3 mb-12"
        role="group"
        aria-label="Filter attractions by category"
      >
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            aria-pressed={active === filter}
            className={cn(
              'px-5 py-2 rounded-full text-sm font-body font-medium transition-all duration-200',
              active === filter
                ? 'bg-forest-green text-cream border border-forest-green'
                : 'border border-earth-brown text-earth-brown hover:bg-earth-brown/10',
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Card grid */}
      <ul
        role="list"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
      >
        {filtered.map((attraction) => (
          <li key={attraction.slug}>
            <Link
              href={`/nearby-attractions/${attraction.slug}`}
              className="group block hover:-translate-y-1 transition-transform duration-200"
              aria-label={`Explore ${attraction.name}`}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src={cardImage(attraction.slug)}
                  alt={attraction.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4 bg-charcoal/80 text-ivory text-xs uppercase tracking-wider rounded-full px-3 py-1.5">
                  <span className="sr-only">Distance: </span>
                  {attraction.distanceBadge}
                </div>
              </div>

              <div className="pt-5">
                <p className="text-xs uppercase tracking-[0.2em] text-gold-accent font-medium font-body">
                  {attraction.tags.join(' · ')}
                </p>
                <h3 className="text-2xl font-display font-medium text-charcoal mt-2 group-hover:text-forest-green transition-colors duration-200">
                  {attraction.name}
                </h3>
                <p className="text-base text-earth-brown leading-relaxed mt-3 line-clamp-3 font-body">
                  {attraction.cardDescription}
                </p>
                <span className="inline-flex items-center gap-2 mt-4 text-sm font-body uppercase tracking-[0.15em] text-forest-green">
                  Explore{' '}
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
