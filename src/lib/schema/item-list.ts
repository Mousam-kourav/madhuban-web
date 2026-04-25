import type { Room } from '@/lib/content/rooms';

const SITE_URL = 'https://www.madhubanecoretreat.com';

export function roomItemList(rooms: readonly Room[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Accommodations at Madhuban Eco Retreat',
    description: 'Six eco-luxury accommodation types at Madhuban Eco Retreat, Ratapani.',
    itemListOrder: 'https://schema.org/ItemListUnordered',
    numberOfItems: rooms.length,
    itemListElement: rooms.map((room, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: room.name,
        url: `${SITE_URL}${room.href}`,
        image: room.image.webp.desktop,
        offers: {
          '@type': 'Offer',
          price: room.pricePerNight,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };
}
