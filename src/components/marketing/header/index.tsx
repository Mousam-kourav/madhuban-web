'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { isExploreActive } from '@/lib/content/navigation';
import { TopBar } from './top-bar';
import { NavDesktop } from './nav-desktop';
import { MobileDrawer } from './mobile-drawer';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Skip to content — first focusable element on the page */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-earth-brown focus:text-ivory focus:font-medium focus:text-sm"
      >
        Skip to content
      </a>

      {/* Top bar — non-sticky, scrolls out naturally */}
      <TopBar />

      {/* Main header — sticky */}
      <header
        role="banner"
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-200',
          scrolled ? 'h-16 bg-cream shadow-md' : 'h-20 bg-cream/95',
        )}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 flex items-center"
            aria-label="Madhuban Eco Retreat — home"
          >
            <span className="font-display text-xl lg:text-2xl font-medium text-earth-brown leading-tight">
              Madhuban Eco Retreat
            </span>
          </Link>

          {/* Desktop nav — center/right */}
          <NavDesktop pathname={pathname} exploreActive={isExploreActive(pathname)} />

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Book Now — desktop */}
            <Button
              render={<Link href="/booking" />}
              size="default"
              className="hidden lg:inline-flex"
            >
              Book Now
            </Button>

            {/* Book — mobile compact */}
            <Button
              render={<Link href="/booking" />}
              size="sm"
              className="lg:hidden"
            >
              Book
            </Button>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className={cn(
                'lg:hidden flex items-center justify-center w-10 h-10 rounded-md',
                'hover:bg-earth-brown/10 transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown',
              )}
            >
              <Menu className="size-5 text-charcoal" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer — rendered outside header to avoid stacking context issues */}
      <MobileDrawer open={drawerOpen} onOpenChange={setDrawerOpen} pathname={pathname} />
    </>
  );
}
