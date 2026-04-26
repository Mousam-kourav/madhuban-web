import type { DbRoom, DbRoomFaq, GalleryItem, HeroImageItem, HighlightItem } from "@/lib/types/rooms";
import type { Room, RoomFaq, RoomGalleryImage, RoomImage } from "@/lib/content/rooms";

// Extract plain-text paragraphs from a Tiptap doc stored as jsonb.
// Covers the simple doc shape produced by the seed script and the admin Tiptap editor.
function extractParagraphs(doc: unknown): string[] {
  if (!doc || typeof doc !== "object") return [];
  const d = doc as { content?: { type?: string; content?: { text?: string }[] }[] };
  const paragraphs: string[] = [];
  for (const node of d.content ?? []) {
    if (node.type === "paragraph") {
      const text = (node.content ?? []).map((c) => c.text ?? "").join("");
      if (text) paragraphs.push(text);
    }
  }
  return paragraphs;
}

function safeGallery(raw: unknown): readonly RoomGalleryImage[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(Boolean).map((item) => {
    const g = item as GalleryItem;
    return {
      alt: g.alt ?? "",
      webp: { mobile: g.webp?.mobile ?? "", desktop: g.webp?.desktop ?? "" },
      jpg: { mobile: g.jpg?.mobile ?? "", desktop: g.jpg?.desktop ?? "" },
    };
  });
}

function safeHighlights(raw: unknown): readonly { icon: string; title: string; description: string }[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(Boolean).map((item) => {
    const h = item as HighlightItem;
    return {
      icon: h.icon ?? "Sparkles",
      title: h.title ?? "",
      description: h.description ?? "",
    };
  });
}

function safeHeroImage(raw: unknown, slug: string): RoomImage {
  const R2 = process.env.NEXT_PUBLIC_R2_BASE ?? "";
  if (raw && typeof raw === "object") {
    const h = raw as HeroImageItem;
    return {
      alt: h.alt ?? "",
      webp: {
        mobile: h.webp?.mobile ?? `${R2}/home/rooms/${slug}-480.webp`,
        tablet: h.webp?.tablet ?? `${R2}/home/rooms/${slug}-800.webp`,
        desktop: h.webp?.desktop ?? `${R2}/home/rooms/${slug}-1280.webp`,
      },
      jpg: {
        mobile: h.jpg?.mobile ?? `${R2}/home/rooms/${slug}-480.jpg`,
        tablet: h.jpg?.tablet ?? `${R2}/home/rooms/${slug}-800.jpg`,
        desktop: h.jpg?.desktop ?? `${R2}/home/rooms/${slug}-1280.jpg`,
      },
    };
  }
  // Fallback to R2 convention paths if hero_image not yet set
  return {
    alt: "",
    webp: {
      mobile: `${R2}/home/rooms/${slug}-480.webp`,
      tablet: `${R2}/home/rooms/${slug}-800.webp`,
      desktop: `${R2}/home/rooms/${slug}-1280.webp`,
    },
    jpg: {
      mobile: `${R2}/home/rooms/${slug}-480.jpg`,
      tablet: `${R2}/home/rooms/${slug}-800.jpg`,
      desktop: `${R2}/home/rooms/${slug}-1280.jpg`,
    },
  };
}

// Map a DB room row + its FAQs into the legacy Room shape that public components expect.
export function dbRoomToRoom(dbRoom: DbRoom, dbFaqs: DbRoomFaq[]): Room {
  const longDesc = extractParagraphs(dbRoom.long_description);

  const faqs: RoomFaq[] = dbFaqs.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  return {
    slug: dbRoom.slug,
    name: dbRoom.name,
    pricePerNight: Number(dbRoom.base_price_per_night),
    tagline: dbRoom.tagline ?? "",
    href: dbRoom.href ?? `/stay/${dbRoom.slug}`,
    genre: dbRoom.genre ?? "",
    image: safeHeroImage(dbRoom.hero_image, dbRoom.slug),
    longDescription: longDesc.length > 0 ? longDesc : [dbRoom.description_short ?? ""],
    occupancy: {
      adults: dbRoom.max_occupancy,
      children: dbRoom.max_occupancy_children,
    },
    bedConfig: dbRoom.bed_config ?? "",
    size: dbRoom.size_label ?? "",
    amenities: Array.isArray(dbRoom.amenities) ? (dbRoom.amenities as string[]) : [],
    highlights: safeHighlights(dbRoom.highlights),
    gallery: safeGallery(dbRoom.gallery),
    faqs,
  };
}
