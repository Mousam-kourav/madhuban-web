'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HERO_IMAGES } from '@/lib/content/images';
import { HERO_COPY } from '@/lib/content/homepage';

const SLIDE_COUNT = 3 as const;
const ROTATION_MS = 6000;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  // userPaused: toggled explicitly by the Pause/Play button — persists over hover/focus
  const [userPaused, setUserPaused] = useState<boolean>(prefersReducedMotion);
  // envPaused: set by hover, keyboard focus, or tab visibility — clears automatically
  const [envPaused, setEnvPaused] = useState(false);
  // reduceMotion: synced from matchMedia; initialized lazily from window on first client render
  const [reduceMotion, setReduceMotion] = useState<boolean>(prefersReducedMotion);
  // tick: incremented on manual slide change to reset the rotation interval
  const [tick, setTick] = useState(0);

  const shouldPause = userPaused || envPaused || reduceMotion;

  // Listen for reduced-motion preference changes (setState only in event callback, not in body)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => {
      setReduceMotion(e.matches);
      if (e.matches) setUserPaused(true);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Pause env when tab is hidden; resume when visible again
  useEffect(() => {
    const onVisibility = () => {
      setEnvPaused(document.visibilityState !== 'visible');
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Auto-rotation — resets whenever paused state or tick changes
  useEffect(() => {
    if (shouldPause) return;
    const id = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDE_COUNT);
    }, ROTATION_MS);
    return () => clearInterval(id);
  }, [shouldPause, tick]);

  const goToSlide = useCallback((index: number) => {
    setCurrent(index);
    setTick(t => t + 1); // reset the 6-second countdown on manual navigation
  }, []);

  const toggleUserPause = useCallback(() => {
    setUserPaused(p => !p);
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLElement>) => {
    // Resume env-pause only when focus moves entirely outside the carousel
    const related = e.relatedTarget;
    if (related instanceof Node && e.currentTarget.contains(related)) return;
    setEnvPaused(false);
  }, []);

  return (
    <section
      aria-label="Featured views of Madhuban Eco Retreat"
      aria-roledescription="carousel"
      className="hero-height relative w-full overflow-hidden"
      onMouseEnter={() => setEnvPaused(true)}
      onMouseLeave={() => setEnvPaused(false)}
      onFocus={() => setEnvPaused(true)}
      onBlur={handleBlur}
    >
      {/* Slides */}
      {HERO_IMAGES.map((slide, index) => (
        <div
          key={index}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${index + 1} of 3`}
          aria-hidden={current !== index}
          className={cn(
            'absolute inset-0 transition-opacity duration-[600ms] ease-in-out',
            current === index
              ? 'opacity-100 z-10 pointer-events-auto'
              : 'opacity-0 z-0 pointer-events-none',
          )}
        >
          <Image
            src={slide.webp.desktop.src}
            alt={slide.alt}
            fill
            sizes="100vw"
            className="object-cover"
            {...(index === 0
              ? { priority: true }
              : { loading: 'eager', fetchPriority: 'low' as const })}
          />
        </div>
      ))}

      {/* Scrim — bottom-to-top gradient for text contrast */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-20 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent"
      />

      {/* Text overlay — bottom-center mobile, bottom-left desktop */}
      <div className="absolute inset-0 z-30 flex items-end pb-16 md:pb-20 px-4 md:px-6 lg:px-8">
        <div className="w-full text-center md:text-left md:max-w-[720px]">
          <h1 className="font-display text-5xl md:text-7xl font-medium text-ivory leading-tight mb-4">
            Connect With{' '}
            <br className="hidden lg:block" aria-hidden="true" />
            Wildlife &amp; Nature
          </h1>
          <p className="font-body text-lg text-ivory/90 mb-8 max-w-2xl mx-auto md:mx-0">
            {HERO_COPY.subhead}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button
              render={<Link href={HERO_COPY.ctaPrimary.href} />}
              size="lg"
              className="h-14 px-8 text-base shadow-lg shadow-charcoal/30"
            >
              {HERO_COPY.ctaPrimary.label}
            </Button>
            <Button
              render={<Link href={HERO_COPY.ctaSecondary.href} />}
              variant="outline"
              size="lg"
              className="h-14 px-8 text-base border-2 border-ivory bg-transparent text-ivory hover:bg-ivory/10 hover:text-ivory"
            >
              {HERO_COPY.ctaSecondary.label}
            </Button>
          </div>
        </div>
      </div>

      {/* Dot indicators — bottom-center mobile, bottom-right desktop */}
      <div
        role="tablist"
        aria-label="Slide navigation"
        className="absolute z-40 flex gap-2 bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:bottom-8 md:right-20"
      >
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-label={`Go to slide ${index + 1} of 3`}
            aria-selected={current === index}
            onClick={() => goToSlide(index)}
            className={cn(
              'w-2.5 h-2.5 rounded-full border border-ivory/70',
              'transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-1',
              current === index ? 'bg-ivory' : 'bg-transparent hover:bg-ivory/60',
            )}
          />
        ))}
      </div>

      {/* Pause/Play — top-right mobile, bottom-right desktop */}
      <button
        type="button"
        aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
        onClick={toggleUserPause}
        className={cn(
          'absolute z-40 flex items-center justify-center w-11 h-11 rounded-full',
          'border border-ivory/50 text-ivory hover:bg-ivory/10 transition-colors duration-200',
          'top-4 right-4 md:top-auto md:bottom-7 md:right-6',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory',
        )}
      >
        {userPaused ? (
          <Play className="size-4" aria-hidden="true" />
        ) : (
          <Pause className="size-4" aria-hidden="true" />
        )}
      </button>

      {/* Polite announcer — only active when user has explicitly paused */}
      <div
        aria-live={userPaused ? 'polite' : 'off'}
        aria-atomic="true"
        className="sr-only"
      >
        {userPaused
          ? `Slide ${current + 1} of 3: ${HERO_IMAGES[current]?.alt ?? ''}`
          : ''}
      </div>
    </section>
  );
}
