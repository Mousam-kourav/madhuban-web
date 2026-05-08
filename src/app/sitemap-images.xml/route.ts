import { NextResponse } from 'next/server';
import { getPublishedGalleryItems } from '@/lib/gallery/queries';

export const dynamic = 'force-dynamic';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.madhubanecoretreat.com';

export async function GET() {
  let items: Awaited<ReturnType<typeof getPublishedGalleryItems>> = [];
  try {
    items = await getPublishedGalleryItems({ limit: 1000 });
  } catch {
    // Return empty sitemap if DB is unavailable
  }

  const imageItems = items.filter((i) => i.type === 'image');

  const urlEntries = imageItems
    .map((item) => {
      const title = item.alt_text || item.filename;
      const escapedUrl = item.r2_url.replace(/&/g, '&amp;');
      const escapedTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const caption = item.caption
        ? `<image:caption>${item.caption.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:caption>`
        : '';
      return `  <url>
    <loc>${BASE_URL}/gallery</loc>
    <image:image>
      <image:loc>${escapedUrl}</image:loc>
      <image:title>${escapedTitle}</image:title>
      ${caption}
    </image:image>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
