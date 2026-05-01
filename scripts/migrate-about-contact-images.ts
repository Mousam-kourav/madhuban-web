/**
 * migrate-about-contact-images.ts
 *
 * Downloads images from the old R2 bucket (pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev)
 * that are used on the About Us page, resizes them to WebP at multiple widths using sharp,
 * then uploads to the new R2 bucket via the S3-compatible API.
 *
 * Run: pnpm tsx scripts/migrate-about-contact-images.ts
 */

import { config } from "dotenv";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

config({ path: ".env.local" });

// ── Env validation ──────────────────────────────────────────────────────────

const required = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "NEXT_PUBLIC_R2_BASE",
] as const;

for (const key of required) {
  if (!process.env[key]) {
    process.stderr.write(`❌ Missing env var: ${key}\n`);
    process.exit(1);
  }
}

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE!;
const R2_BUCKET = process.env.R2_BUCKET_NAME!;

// R2_ACCOUNT_ID may be a full endpoint URL or just the account hash.
// Normalise: if it starts with https://, use as-is (strip trailing slash).
// Otherwise build the standard endpoint URL.
const rawAccountId = process.env.R2_ACCOUNT_ID!.trim().replace(/\/$/, "");
const R2_ENDPOINT = rawAccountId.startsWith("https://")
  ? rawAccountId
  : `https://${rawAccountId}.r2.cloudflarestorage.com`;

const s3 = new S3Client({
  endpoint: R2_ENDPOINT,
  region: "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// ── Image definitions ───────────────────────────────────────────────────────

interface MigrationImage {
  /** Source URL from old R2 bucket */
  sourceUrl: string;
  /** Target R2 keys: { width: key } */
  targets: { width: number; key: string }[];
  /** Alt text for reference */
  altText: string;
}

const IMAGES: MigrationImage[] = [
  // About Us — Hero (outdoor adventure image — most landscape-oriented)
  {
    sourceUrl:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/about/outdoor-adventure-obstacles-madhuban-eco-retreat-bhopal.webp",
    targets: [
      { width: 800, key: "home/about/hero-800.webp" },
      { width: 1280, key: "home/about/hero-1280.webp" },
    ],
    altText:
      "Outdoor adventure activities at Madhuban Eco Retreat near Bhopal — guests exploring nature trails",
  },
  // About Us — Story / Heritage image (mud house — evokes local craft & heritage)
  {
    sourceUrl:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/about/mud-house-madhuban-eco-retreat-bhopal.webp",
    targets: [
      { width: 800, key: "home/about/story-800.webp" },
      { width: 1280, key: "home/about/story-1280.webp" },
    ],
    altText:
      "Mud house accommodation at Madhuban Eco Retreat, built with traditional rammed-earth craft near Ratapani",
  },
  // About Us — Eco / Sustainability section (restaurant / farm-to-table)
  {
    sourceUrl:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/about/madhuban-eco-retreat-best-restaurant-near-bhopal.webp",
    targets: [
      { width: 800, key: "home/about/eco-800.webp" },
      { width: 1280, key: "home/about/eco-1280.webp" },
    ],
    altText:
      "Farm-to-table dining at Madhuban Eco Retreat — organic, locally sourced meals in a natural setting",
  },
  // About Us — Vision/Mission — Safari Tent (Cloudinary avif → convert to webp)
  {
    sourceUrl:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/about/vision-mission/tourists-jungle-safari-jeep-madhuban-eco-retreat-ratapani.avif",
    targets: [
      { width: 800, key: "home/about/founder-800.webp" },
      { width: 1280, key: "home/about/founder-1280.webp" },
    ],
    altText:
      "Guests on a jungle safari jeep at Madhuban Eco Retreat near Ratapani Tiger Reserve, Madhya Pradesh",
  },
  // Contact — hero (pool side image — welcoming, architectural)
  {
    sourceUrl:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/about/pool-side-madhuban-eco-retreat-best-pool-resort-near-bhopal.webp",
    targets: [
      { width: 800, key: "home/contact/hero-800.webp" },
      { width: 1280, key: "home/contact/hero-1280.webp" },
    ],
    altText:
      "Pool side area at Madhuban Eco Retreat near Bhopal — a serene eco-luxury resort near Ratapani Wildlife Sanctuary",
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

async function checkExists(key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function fetchImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadToR2(
  buffer: Buffer,
  key: string,
  contentType: string = "image/webp",
): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return `${R2_BASE}/${key}`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function migrate() {
  process.stdout.write("\n🌿 Madhuban About/Contact Image Migration\n");
  process.stdout.write("═".repeat(55) + "\n\n");

  const results: { key: string; url: string; skipped?: boolean }[] = [];

  for (const img of IMAGES) {
    process.stdout.write(`📷 ${img.sourceUrl.split("/").pop()}\n`);
    process.stdout.write(`   Source: ${img.sourceUrl}\n`);

    let sourceBuffer: Buffer;
    try {
      sourceBuffer = await fetchImage(img.sourceUrl);
      process.stdout.write(`   Downloaded: ${(sourceBuffer.length / 1024).toFixed(1)} KB\n`);
    } catch (err) {
      process.stderr.write(`   ❌ Download failed: ${err instanceof Error ? err.message : String(err)}\n`);
      continue;
    }

    for (const target of img.targets) {
      const exists = await checkExists(target.key);
      if (exists) {
        process.stdout.write(`   ⏭  Skipping ${target.key} (already exists)\n`);
        results.push({ key: target.key, url: `${R2_BASE}/${target.key}`, skipped: true });
        continue;
      }

      try {
        const resized = await sharp(sourceBuffer)
          .resize({ width: target.width, withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer();

        const url = await uploadToR2(resized, target.key);
        process.stdout.write(`   ✅ Uploaded ${target.key} (${(resized.length / 1024).toFixed(1)} KB)\n`);
        results.push({ key: target.key, url });
      } catch (err) {
        process.stderr.write(
          `   ❌ Failed ${target.key}: ${err instanceof Error ? err.message : String(err)}\n`,
        );
      }
    }

    process.stdout.write("\n");
  }

  // ── Summary ──────────────────────────────────────────────────────────────

  process.stdout.write("═".repeat(55) + "\n");
  process.stdout.write("📋 R2 URLs for use in page code:\n\n");

  const groupedByPage: Record<string, { key: string; url: string; skipped?: boolean }[]> = {};
  for (const r of results) {
    const page = r.key.startsWith("home/about/") ? "about-us" : "contact-us";
    if (!groupedByPage[page]) groupedByPage[page] = [];
    groupedByPage[page].push(r);
  }

  for (const [page, items] of Object.entries(groupedByPage)) {
    process.stdout.write(`\n[${page}]\n`);
    for (const item of items) {
      const tag = item.skipped ? "(existed)" : "(new)";
      process.stdout.write(`  ${tag} ${item.url}\n`);
    }
  }

  process.stdout.write("\n✅ Migration complete.\n");
}

migrate().catch((err) => {
  process.stderr.write(`\n❌ Migration failed: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
