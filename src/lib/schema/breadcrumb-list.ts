const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.madhubanecoretreat.com';

export interface BreadcrumbItem {
  name: string;
  /** URL path, e.g. '/stay'. Base URL is prepended. */
  path: string;
}

interface BreadcrumbListInput {
  items: BreadcrumbItem[];
}

/**
 * Generates BreadcrumbList schema from an explicit list of crumbs.
 * Always include Home as the first item.
 *
 * @example
 * breadcrumbList({ items: [
 *   { name: 'Home', path: '/' },
 *   { name: 'Stay', path: '/stay' },
 *   { name: 'Safari Tent', path: '/stay/safari-tent' },
 * ]})
 */
export function breadcrumbList({ items }: BreadcrumbListInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}

/**
 * Auto-generates BreadcrumbList from a URL pathname.
 * Segment labels are title-cased from the slug (hyphens → spaces).
 * For slugs with known display names (e.g. 'safari-tent' → 'Safari Tent'),
 * prefer the explicit breadcrumbList() overload.
 *
 * @example
 * breadcrumbListFromPath('/stay/safari-tent')
 * // → Home > Stay > Safari Tent
 */
export function breadcrumbListFromPath(pathname: string): Record<string, unknown> {
  const segments = pathname.split('/').filter(Boolean);

  const items: BreadcrumbItem[] = [{ name: 'Home', path: '/' }];

  let cumulativePath = '';
  for (const segment of segments) {
    cumulativePath += `/${segment}`;
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    items.push({ name: label, path: cumulativePath });
  }

  return breadcrumbList({ items });
}
