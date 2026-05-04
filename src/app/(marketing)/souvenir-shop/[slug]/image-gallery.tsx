'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Props {
  images: Array<{ src: string; alt: string }>;
  productName: string;
}

export function ImageGallery({ images, productName }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-warm-beige/40 font-body text-sm text-charcoal/40">
        No image
      </div>
    );
  }

  const active = images[activeIdx] ?? images[0];

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-warm-beige/40">
        {active && (
          <Image
            src={active.src}
            alt={active.alt || productName}
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* Thumbnails (only if >1 image) */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={activeIdx === i}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                activeIdx === i
                  ? 'border-earth-brown'
                  : 'border-transparent hover:border-earth-brown/40'
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt || `${productName} ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
