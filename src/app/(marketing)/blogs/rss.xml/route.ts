import { getPublishedPosts } from '@/lib/blog/queries';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.madhubanecoretreat.com';

export const dynamic = 'force-dynamic';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = await getPublishedPosts();

  const items = posts
    .filter((p) => p.published_at)
    .map((p) => {
      const url = `${BASE_URL}/blogs/${p.slug}`;
      const pubDate = new Date(p.published_at!).toUTCString();
      const description = p.excerpt ? escapeXml(p.excerpt) : '';
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      ${description ? `<description>${description}</description>` : ''}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Madhuban Eco Retreat — Blog</title>
    <link>${BASE_URL}/blogs</link>
    <description>Stories, guides and nature notes from Madhuban Eco Retreat near Ratapani, Bhopal.</description>
    <language>en-in</language>
    <atom:link href="${BASE_URL}/blogs/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
