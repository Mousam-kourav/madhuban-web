import { BUSINESS } from '@/lib/content/business';

export type NavItem = { label: string; href: string; external?: boolean };

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: 'Stay', href: '/stay' },
  { label: 'Dining', href: '/dining' },
  { label: 'Day Outing', href: '/day-outing' },
  { label: 'Aranyashala', href: '/aranyashala' },
  { label: 'Souvenir Shop', href: '/souvenir-shop' },
];

export const EXPLORE_NAV: readonly NavItem[] = [
  { label: 'About', href: '/about-us' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Nearby Attractions', href: '/nearby-attractions' },
  { label: 'Contact', href: '/contact-us' },
];

export const FOOTER_EXPLORE: readonly NavItem[] = [
  { label: 'About', href: '/about-us' },
  { label: 'Stay', href: '/stay' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Dining', href: '/dining' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blogs', href: '/blogs' },
];

export const FOOTER_VISIT: readonly NavItem[] = [
  { label: 'Day Outing', href: '/day-outing' },
  { label: 'Aranyashala', href: '/aranyashala' },
  { label: 'Souvenir Shop', href: '/souvenir-shop' },
  { label: 'Nearby Attractions', href: '/nearby-attractions' },
  { label: 'Contact', href: '/contact-us' },
  {
    label: 'View on Google Maps',
    href: `https://www.google.com/maps/search/?api=1&query=${BUSINESS.geo.latitude},${BUSINESS.geo.longitude}`,
    external: true,
  },
];

export const LEGAL_NAV: readonly NavItem[] = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-condition' },
  { label: 'Cookie Policy', href: '/cookies-and-consent-policy' },
  { label: 'Disclaimer', href: '/disclaimer' },
];

export function isLinkActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + '/');
}

export function isExploreActive(pathname: string): boolean {
  return EXPLORE_NAV.some((item) => isLinkActive(pathname, item.href));
}
