'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';

interface MobileStickyBarProps {
  pricePerNight: number;
  slug: string;
}

export function MobileStickyBar({ pricePerNight, slug }: MobileStickyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('room-hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 flex h-[72px] items-center justify-between bg-earth-brown px-4 md:hidden',
        'transition-transform duration-200',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
      aria-hidden={!visible}
    >
      <p className="font-body text-sm font-semibold text-ivory">
        &#8377;{formatPrice(pricePerNight)}
        <span className="font-normal opacity-75">/night</span>
      </p>
      <Link
        href={`/booking?room=${slug}`}
        tabIndex={visible ? 0 : -1}
        className="inline-flex h-10 items-center justify-center rounded-lg bg-ivory px-5 font-body text-sm font-medium text-earth-brown transition-colors duration-200 hover:bg-ivory/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2"
      >
        Book Now
      </Link>
    </div>
  );
}
