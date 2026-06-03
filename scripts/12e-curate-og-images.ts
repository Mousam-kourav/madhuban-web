/**
 * 12e-curate-og-images.ts — Phase 12.E.2 OG image curation
 *
 * Generates 1200×630 (Open Graph standard) JPG images for 8 high-traffic
 * pages, sourced from existing on-site photography on R2 (no AI, no stock).
 * Uploads to og/{page-slug}-1200x630.jpg in the live R2 bucket.
 *
 * This is a ONE-TIME script — once R2 assets exist, page metadata in code
 * references them by URL. The script is idempotent: it HeadObjects each
 * target key and skips if already present.
 *
 * Run: pnpm tsx scripts/12e-curate-og-images.ts
 *
 * Requires the same .env.local R2 creds used by migrate-about-contact-images.ts:
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME,
 *   NEXT_PUBLIC_R2_BASE
 */

import { config } from "dotenv";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

config({ path: ".env.local" });

const required = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "NEXT_PUBLIC_R2_BASE",
] as const;

for (const key of required) {
  if (!process.env[key]) {
    process.stderr.write(`Missing env var: ${key}\n`);
    process.exit(1);
  }
}

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE!;
const R2_BUCKET = process.env.R2_BUCKET_NAME!;

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

// OG spec: 1200×630 (Facebook, Twitter, LinkedIn all favour this aspect ratio).
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const OG_QUALITY = 85;

interface OgImage {
  /** R2 source key (path under NEXT_PUBLIC_R2_BASE). May be webp or jpg. */
  sourceKey: string;
  /** Target og/{slug}-1200x630.jpg key. */
  targetKey: string;
  /** Page path this OG image serves (for reporting). */
  page: string;
  /** Alt text emitted in metadata.openGraph.images[].alt. */
  alt: string;
}

const OG_IMAGES: OgImage[] = [
  {
    page: "/",
    sourceKey: "home/hero/hero-aerial-sunset-1920.jpg",
    targetKey: "og/homepage-1200x630.jpg",
    alt: "Aerial view of Madhuban Eco Retreat at sunset, surrounded by Ratapani teak forest",
  },
  {
    page: "/stay",
    sourceKey: "home/rooms/safari-tent-1-1280.jpg",
    targetKey: "og/stay-1200x630.jpg",
    alt: "Safari tent on stilts at Madhuban Eco Retreat with forest views",
  },
  {
    page: "/stay/safari-tent",
    sourceKey: "home/rooms/safari-tent-1-1280.jpg",
    targetKey: "og/safari-tent-1200x630.jpg",
    alt: "Madhuban Eco Retreat safari tent with private veranda overlooking the forest",
  },
  {
    page: "/stay/mud-house-1",
    sourceKey: "home/rooms/mud-house-1-1-1280.jpg",
    targetKey: "og/mud-house-1-1200x630.jpg",
    alt: "Gond-inspired mud house bedroom at Madhuban Eco Retreat with terracotta walls",
  },
  {
    page: "/stay/pool-side-villa",
    sourceKey: "home/rooms/pool-side-villa-3-1280.jpg",
    targetKey: "og/pool-side-villa-1200x630.jpg",
    alt: "Pool-side villa exterior at Madhuban Eco Retreat with infinity pool",
  },
  {
    page: "/experiences",
    sourceKey: "home/experiences/forest-walks-and-nature-trails-1280.jpg",
    targetKey: "og/experiences-1200x630.jpg",
    alt: "Guided forest walk through teak woodland at Madhuban Eco Retreat",
  },
  {
    page: "/aranyashala",
    sourceKey: "aranyashala/hero-1280.webp",
    targetKey: "og/aranyashala-1200x630.jpg",
    alt: "Aranyashala nature school students by the lakeside at Madhuban Eco Retreat",
  },
  {
    page: "/dining",
    sourceKey: "dining/hero-1280.webp",
    targetKey: "og/dining-1200x630.jpg",
    alt: "Farm-to-table vegetarian feast at Madhuban Eco Retreat",
  },
];

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

async function uploadToR2(buffer: Buffer, key: string): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return `${R2_BASE}/${key}`;
}

async function curate() {
  process.stdout.write("\nPhase 12.E.2 — OG Image Curation\n");
  process.stdout.write("=".repeat(55) + "\n\n");

  const results: { page: string; url: string; status: "uploaded" | "skipped" | "failed" }[] = [];

  for (const og of OG_IMAGES) {
    const sourceUrl = `${R2_BASE}/${og.sourceKey}`;
    process.stdout.write(`[${og.page}]\n`);
    process.stdout.write(`  source: ${og.sourceKey}\n`);
    process.stdout.write(`  target: ${og.targetKey}\n`);

    const exists = await checkExists(og.targetKey);
    if (exists) {
      process.stdout.write(`  -> already exists, skipping\n\n`);
      results.push({ page: og.page, url: `${R2_BASE}/${og.targetKey}`, status: "skipped" });
      continue;
    }

    try {
      const sourceBuffer = await fetchImage(sourceUrl);
      process.stdout.write(`  downloaded: ${(sourceBuffer.length / 1024).toFixed(1)} KB\n`);

      // Smart-crop centre with subject-preserving fit:
      // sharp's "cover" fit fills 1200x630 and crops the excess; the default
      // "attention" strategy biases toward salient content.
      const resized = await sharp(sourceBuffer)
        .resize({
          width: OG_WIDTH,
          height: OG_HEIGHT,
          fit: "cover",
          position: sharp.strategy.attention,
        })
        .jpeg({ quality: OG_QUALITY, progressive: true, mozjpeg: true })
        .toBuffer();

      const url = await uploadToR2(resized, og.targetKey);
      process.stdout.write(`  uploaded: ${(resized.length / 1024).toFixed(1)} KB -> ${url}\n\n`);
      results.push({ page: og.page, url, status: "uploaded" });
    } catch (err) {
      process.stderr.write(`  FAILED: ${err instanceof Error ? err.message : String(err)}\n\n`);
      results.push({ page: og.page, url: `${R2_BASE}/${og.targetKey}`, status: "failed" });
    }
  }

  process.stdout.write("=".repeat(55) + "\n");
  process.stdout.write("Summary:\n");
  for (const r of results) {
    process.stdout.write(`  [${r.status}] ${r.page} -> ${r.url}\n`);
  }
  process.stdout.write("\nDone.\n");
}

curate().catch((err) => {
  process.stderr.write(`\nCuration failed: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
