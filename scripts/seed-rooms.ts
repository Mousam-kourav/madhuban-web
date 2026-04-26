import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  process.stderr.write(
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local\n",
  );
  process.exit(1);
}

// Service-role client — bypasses RLS. Never use in app code.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// Extract first sentence (≤160 chars) or first 160 chars of first paragraph.
function toShortDesc(paragraphs: readonly string[]): string {
  const first = paragraphs[0] ?? "";
  const match = first.match(/^[^.!?]*[.!?]/);
  if (match !== null && match[0].length <= 160) return match[0];
  return first.slice(0, 160);
}

// Convert string[] paragraphs to a minimal Tiptap JSON doc.
function toTiptapDoc(paragraphs: readonly string[]) {
  return {
    type: "doc",
    content: paragraphs.map((text) => ({
      type: "paragraph",
      content: [{ type: "text", text }],
    })),
  };
}

async function seed() {
  // Dynamic import so dotenv runs first — rooms.ts reads NEXT_PUBLIC_R2_BASE at init time.
  const { ROOMS } = await import("../src/lib/content/rooms");

  let totalFaqs = 0;

  for (const [index, room] of ROOMS.entries()) {
    process.stdout.write(`Updating ${room.slug}... `);

    const { data, error } = await supabase
      .from("rooms")
      .update({
        name: room.name,
        base_price_per_night: room.pricePerNight,
        tagline: room.tagline,
        genre: room.genre,
        href: room.href,
        hero_image: room.image,
        description_short: toShortDesc(room.longDescription),
        long_description: toTiptapDoc(room.longDescription),
        max_occupancy: room.occupancy.adults,
        max_occupancy_children: room.occupancy.children,
        bed_config: room.bedConfig,
        size_label: room.size,
        amenities: room.amenities,
        highlights: room.highlights,
        gallery: room.gallery,
        is_active: true,
        sort_order: index,
        seo_title: `${room.name} | Madhuban Eco Retreat`,
        seo_description: room.tagline,
      })
      .eq("slug", room.slug)
      .select("id")
      .single();

    if (error ?? !data) {
      process.stderr.write(
        `\n❌ Update failed for ${room.slug}: ${error?.message ?? "no row returned — slug not found in DB"}\n`,
      );
      process.exit(1);
    }

    const roomId = (data as { id: string }).id;

    // Delete existing FAQs for this room (makes the script re-runnable).
    const { error: deleteError } = await supabase
      .from("room_faqs")
      .delete()
      .eq("room_id", roomId);

    if (deleteError) {
      process.stderr.write(
        `\n❌ FAQ delete failed for ${room.slug}: ${deleteError.message}\n`,
      );
      process.exit(1);
    }

    // Insert all FAQs fresh with display_order = array index.
    const faqs = room.faqs.map((faq, i) => ({
      room_id: roomId,
      question: faq.question,
      answer: faq.answer,
      display_order: i,
    }));

    const { error: insertError } = await supabase
      .from("room_faqs")
      .insert(faqs);

    if (insertError) {
      process.stderr.write(
        `\n❌ FAQ insert failed for ${room.slug}: ${insertError.message}\n`,
      );
      process.exit(1);
    }

    totalFaqs += faqs.length;
    process.stdout.write(`done. Inserted ${faqs.length} FAQs.\n`);
  }

  process.stdout.write(
    `\n✅ Seed complete. ${ROOMS.length} rooms updated, ${totalFaqs} FAQs inserted.\n`,
  );
}

void seed();
