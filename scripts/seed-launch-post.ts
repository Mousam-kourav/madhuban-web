import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const post = {
  slug: "eco-resort-vs-luxury-resort-real-difference",
  title: "Eco Resort vs Luxury Resort: The Real Difference",
  excerpt:
    "Both promise escape. Only one delivers it without footprint. A look at where eco resorts and luxury resorts overlap, where they diverge, and what Madhuban chose.",
  body: {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Both promise escape. Only one delivers it without footprint.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "The Luxury Resort, Defined" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "The modern luxury resort is a feat of engineering. Marble flown in from Italy. Linens spun in Egypt. Air conditioning so aggressive that you reach for a throw blanket in July. Infinity pools using municipal water in regions where the water table is dropping. The proposition is escape — but it's an escape paid for, in carbon and consequence, by the place you're escaping to.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "The Eco Resort, Defined" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "An eco resort starts from a different premise. The materials come from where the building stands. The architecture works with the climate instead of fighting it — thick walls, deep verandas, cross-ventilation. Water gets harvested. Food gets sourced from farms you could walk to. Room counts stay deliberately low. The proposition is the same as luxury — escape, beauty, comfort — but the math behind it is fundamentally different.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Where They Overlap" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Here's where the lazy critique fails: comfort is not the differentiator. A good eco resort has the same beds, the same hot showers, the same WiFi, the same considered service as a five-star hotel. The myth that 'eco' means 'rough' is marketing — usually marketing by luxury resorts trying to dismiss a competitor. At Madhuban, every room has air conditioning. Every bathroom has hot water. Every guest has a private bath. None of that is the trade-off.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Where They Diverge" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "The divergence is in the things you don't immediately see. Sourcing — does the building exist because of where it stands, or in spite of it? Scale — does the resort hold 200 rooms or 20? Staff ratios — are people there because of a quota, or because they grew up in the next village? Wildlife footprint — does the resort sit lightly in the ecosystem, or has it carved a clearing? And the most honest test: what happens after you check out? Does the property keep extracting, or does it actively give back?",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Madhuban's Stance" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "We built six rooms. Not because we couldn't afford more, but because more would change what the place is. Our walls are mud, painted by Gond artisans from villages an hour away. We sit adjacent to Ratapani Tiger Reserve, which means our existence is contingent on that forest staying intact — so we plant, we conserve, we don't build past the canopy line. The pool uses harvested rainwater. The kitchen sources from farms we can name. None of this makes us austere. It makes us deliberate.",
          },
        ],
      },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "'Eco-luxury' sounds, to skeptics, like a contradiction in terms. It isn't. It's the only luxury that respects the conditions that make a place worth visiting in the first place.",
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "The other kind — imported, oversized, indifferent — is just consumption with better lighting.",
          },
        ],
      },
    ],
  },
  category: "Sustainability",
  tags: ["eco-tourism", "luxury", "philosophy"],
  status: "published",
  published_at: new Date().toISOString(),
  read_time_minutes: 6,
  author_name: "Madhuban Eco Retreat",
  seo_title: "Eco Resort vs Luxury Resort: The Real Difference | Madhuban",
  meta_description:
    "Both promise escape. Only one delivers it without footprint. Where eco resorts and luxury resorts truly diverge.",
  cover_image_url: "https://pub-988c0a6b938742458b908a7a49295f61.r2.dev/home/rooms/camping-tent-2-1280.webp",
  cover_image_alt: "Camping tents on a grassy clearing at Madhuban Eco Retreat",
};

async function seed() {
  const { error } = await supabase
    .from("blog_posts")
    .upsert(post, { onConflict: "slug" });

  if (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }

  process.stdout.write("✅ Seed post created: eco-resort-vs-luxury-resort-real-difference\n");
}

void seed();
