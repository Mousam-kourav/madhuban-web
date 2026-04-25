const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';
if (!R2_BASE) {
  if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'production') {
    console.warn('[journey.ts] NEXT_PUBLIC_R2_BASE is not set. Journey photos will 404.');
  }
}

export type JourneyPhoto = {
  id: number;
  alt: string;
  webp: { mobile: string; desktop: string };
  jpg: { mobile: string; desktop: string };
};

function journeyPhoto(id: number, alt: string): JourneyPhoto {
  const slug = `journey-${id}`;
  return {
    id,
    alt,
    webp: {
      mobile:  `${R2_BASE}/home/journey/${slug}-480.webp`,
      desktop: `${R2_BASE}/home/journey/${slug}-800.webp`,
    },
    jpg: {
      mobile:  `${R2_BASE}/home/journey/${slug}-480.jpg`,
      desktop: `${R2_BASE}/home/journey/${slug}-800.jpg`,
    },
  };
}

export const JOURNEY_PHOTOS: readonly JourneyPhoto[] = [
  journeyPhoto(1,  'A tiger on a forest trail in central India'),
  journeyPhoto(2,  'Guests in safari jeeps spotting wildlife in the forest'),
  journeyPhoto(3,  "A spread of vegetarian Indian dishes served at Madhuban's dining hall"),
  journeyPhoto(4,  'Two guests cycling along a tree-lined path at Madhuban'),
  journeyPhoto(5,  "A wooden footbridge winding through the property's bamboo grove"),
  journeyPhoto(6,  "Camping tents and an evening bonfire at Madhuban's campsite"),
  journeyPhoto(7,  'A laptop and book on a teakwood table — slow workdays in the forest'),
  journeyPhoto(8,  'Two glasses of fresh juice at the poolside during monsoon'),
  journeyPhoto(9,  'Pool-side loungers framed by a frangipani tree at Madhuban'),
  journeyPhoto(10, "Madhuban's swimming pool with mud-villas and forest beyond"),
] as const;
