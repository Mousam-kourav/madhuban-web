'use client';

import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';
import {
  IconInstagram,
  IconFacebook,
  IconYouTube,
  IconLinkedIn,
  IconWhatsApp,
} from '@/components/ui/social-icons';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import { PRIMARY_NAV, EXPLORE_NAV, isLinkActive } from '@/lib/content/navigation';
import { BUSINESS } from '@/lib/content/business';

interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string;
}

const SOCIAL_LINKS = [
  { href: 'https://www.instagram.com/madhubanecoretreat/', label: 'Instagram', Icon: IconInstagram },
  { href: 'https://www.facebook.com/madhubanecoretreat/', label: 'Facebook', Icon: IconFacebook },
  { href: 'https://www.youtube.com/@madhuban-eco-retreat', label: 'YouTube', Icon: IconYouTube },
  {
    href: 'https://www.linkedin.com/company/madhuban-eco-retreat-ratapani-sanctuary/',
    label: 'LinkedIn',
    Icon: IconLinkedIn,
  },
  {
    href: `https://wa.me/${BUSINESS.whatsapp.replace(/\D/g, '')}`,
    label: 'WhatsApp',
    Icon: IconWhatsApp,
  },
] as const;

function NavLink({
  href,
  active,
  onClick,
  children,
}: {
  href: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center min-h-[48px] px-3 py-2 text-base font-medium rounded-md transition-colors duration-200',
        'hover:bg-earth-brown/10 hover:text-earth-brown',
        active ? 'text-earth-brown bg-earth-brown/10' : 'text-charcoal',
      )}
    >
      {children}
    </Link>
  );
}

export function MobileDrawer({ open, onOpenChange, pathname }: MobileDrawerProps) {
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton
        className="w-[85vw] max-w-sm bg-cream border-r border-border p-0 overflow-y-auto flex flex-col"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>

        <nav aria-label="Mobile primary" className="flex-1 pt-12 pb-4">
          <ul className="space-y-0.5 px-4">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} active={isLinkActive(pathname, item.href)} onClick={close}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-4 px-4">
            <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Explore
            </p>
            <ul className="space-y-0.5">
              {EXPLORE_NAV.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} active={isLinkActive(pathname, item.href)} onClick={close}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="border-t border-border px-4 py-6 space-y-4">
          <div className="space-y-3">
            <Link
              href={`tel:${BUSINESS.phone}`}
              className="flex items-center gap-2 text-sm text-charcoal hover:text-earth-brown transition-colors"
            >
              <Phone className="size-4 text-earth-brown shrink-0" aria-hidden="true" />
              <span>+91 9770558419</span>
            </Link>
            <Link
              href={`mailto:${BUSINESS.email}`}
              className="flex items-center gap-2 text-sm text-charcoal hover:text-earth-brown transition-colors"
            >
              <Mail className="size-4 text-earth-brown shrink-0" aria-hidden="true" />
              <span>{BUSINESS.email}</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-earth-brown hover:text-blush-dusk transition-colors"
              >
                <Icon className="size-5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
