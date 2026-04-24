'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { PRIMARY_NAV, EXPLORE_NAV, isLinkActive } from '@/lib/content/navigation';

interface NavDesktopProps {
  pathname: string;
  exploreActive: boolean;
}

export function NavDesktop({ pathname, exploreActive }: NavDesktopProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav aria-label="Primary" className="hidden lg:flex items-center gap-0.5">
      {PRIMARY_NAV.map((item) => {
        const active = isLinkActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
              'hover:bg-earth-brown/10 hover:text-earth-brown',
              active ? 'text-earth-brown underline underline-offset-4' : 'text-charcoal',
            )}
          >
            {item.label}
          </Link>
        );
      })}

      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger
          openOnHover
          delay={0}
          closeDelay={150}
          aria-current={exploreActive ? 'page' : undefined}
          className={cn(
            'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
            'hover:bg-earth-brown/10 hover:text-earth-brown',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown',
            exploreActive ? 'text-earth-brown underline underline-offset-4' : 'text-charcoal',
          )}
        >
          Explore
          <ChevronDown
            className={cn(
              'size-4 transition-transform duration-200',
              dropdownOpen && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          sideOffset={8}
          className="w-52 bg-cream border border-border shadow-md rounded-lg p-1"
        >
          {EXPLORE_NAV.map((item) => {
            const active = isLinkActive(pathname, item.href);
            return (
              <DropdownMenuItem
                key={item.href}
                render={<Link href={item.href} aria-current={active ? 'page' : undefined} />}
                className={cn(
                  'rounded-md px-3 py-2 text-sm cursor-pointer',
                  active ? 'text-earth-brown font-medium' : 'text-charcoal',
                )}
              >
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
