import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Gallery',
  titleOverride: 'Madhuban Eco Gallery | Nature, Culture & Retreat Photo Collection',
  description:
    'Explore the eco gallery of Madhuban Eco Retreat—forest views, tribal culture, Bhimbetka, Saru Maru, Ginnorgarh Fort, and nature moments in Ratapani.',
  path: '/gallery',
  noIndex: true,
  keywords: [
    'madhuban eco retreat gallery',
    'ratapani nature gallery',
    'bhimbetka photos',
    'tribal culture madhya pradesh',
    'eco retreat images',
    'ratapani forest images',
  ],
});

export default function Page() {
  return null;
}
