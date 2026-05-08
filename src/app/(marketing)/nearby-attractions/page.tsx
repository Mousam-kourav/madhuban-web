import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Nearby Attractions',
  titleOverride: 'Nearby Attractions Ratapani | Places to Visit Near Madhuban Eco Retreat',
  description:
    'Explore Ratapani Wildlife Sanctuary, Bhimbetka, Ginnorgarh Fort, Saru Maru Caves, Salkanpur Temple & Satpura attractions near Madhuban Eco Retreat.',
  path: '/nearby-attractions',
  noIndex: true,
  keywords: [
    'nearby attractions ratapani',
    'places to visit near bhopal',
    'attractions near madhuban eco retreat',
    'satpura nearby places',
    'bhimbetka near ratapani',
    'ginnorgarh fort trek',
    'saru maru caves mp',
    'narmada darshan mp',
  ],
});

export default function Page() {
  return null;
}
