// Audit content extractor — used by Step 4 to produce per-page markdown.
// Usage:  cat page.html | node .extract.cjs <url> <label>
// Writes markdown to stdout.
const fs = require('fs');
const url = process.argv[2] || '(unknown URL)';
const label = process.argv[3] || '(page)';

const html = fs.readFileSync(0, 'utf8');

function decodeEntities(s) {
  return (s || '')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&hellip;/g, '…')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&copy;/g, '©');
}

function stripTags(s) {
  return decodeEntities((s || '').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function getMeta(name) {
  const re = new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]*>`, 'i');
  const m = html.match(re);
  if (!m) return '';
  const c = m[0].match(/content=["']([^"']*)["']/i);
  return c ? decodeEntities(c[1]) : '';
}

const title = decodeEntities((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '');
const description = getMeta('description');
const ogTitle = getMeta('og:title');
const ogDescription = getMeta('og:description');
const ogImage = getMeta('og:image');
const canonical = (() => {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  if (!m) return '';
  const c = m[0].match(/href=["']([^"']*)["']/i);
  return c ? c[1] : '';
})();
const robots = getMeta('robots');

// Headings in document order
const headings = [];
const headingRe = /<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi;
let h;
while ((h = headingRe.exec(html)) !== null) {
  const tag = h[1].toLowerCase();
  const text = stripTags(h[2]);
  if (text) headings.push({ tag, text });
}

// Strip nav/footer/script/style/header, then collect <p> text
let body = html
  .replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
  .replace(/<nav[\s\S]*?<\/nav>/gi, '')
  .replace(/<footer[\s\S]*?<\/footer>/gi, '')
  .replace(/<header[\s\S]*?<\/header>/gi, '');

const paragraphs = [];
const pRe = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
let p;
while ((p = pRe.exec(body)) !== null) {
  const text = stripTags(p[1]);
  if (text && text.length > 20) paragraphs.push(text);
}

// CTA / button text
const ctas = new Set();
const aRe = /<a\b[^>]*>([\s\S]*?)<\/a>/gi;
let a;
while ((a = aRe.exec(body)) !== null) {
  const text = stripTags(a[1]);
  if (text && text.length > 1 && text.length < 60 && /book|enquire|reserve|contact|learn|view|explore|gallery|stay|whatsapp|call/i.test(text)) {
    ctas.add(text);
  }
}
const btnRe = /<button\b[^>]*>([\s\S]*?)<\/button>/gi;
let b;
while ((b = btnRe.exec(body)) !== null) {
  const text = stripTags(b[1]);
  if (text && text.length > 1 && text.length < 60) ctas.add(text);
}

// Internal links
const internal = new Set();
const aHrefRe = /<a\b[^>]*href=["'](\/[^"'#]*)["']/gi;
let l;
while ((l = aHrefRe.exec(html)) !== null) {
  if (!l[1].startsWith('/_next')) internal.add(l[1]);
}

// Output markdown
const out = [];
out.push(`# ${label}`);
out.push('');
out.push(`**URL fetched:** ${url}`);
out.push(`**Extracted:** ${new Date().toISOString().slice(0, 10)}`);
out.push('');
out.push('## SEO metadata');
out.push('');
out.push(`- **Title:** ${title.trim() || '_(missing)_'}`);
out.push(`- **Meta description:** ${description || '_(missing)_'}`);
out.push(`- **OG title:** ${ogTitle || '_(falls back to title)_'}`);
out.push(`- **OG description:** ${ogDescription || '_(falls back to description)_'}`);
out.push(`- **OG image:** ${ogImage || '_(missing)_'}`);
out.push(`- **Canonical:** ${canonical || '_(none set)_'}`);
out.push(`- **Robots:** ${robots || '_(default)_'}`);
out.push('');
out.push('## Heading structure');
out.push('');
if (headings.length === 0) {
  out.push('_(no headings found — may be client-rendered)_');
} else {
  for (const hh of headings) {
    const indent = '  '.repeat(parseInt(hh.tag[1]) - 1);
    out.push(`${indent}- **${hh.tag.toUpperCase()}:** ${hh.text}`);
  }
}
out.push('');
out.push('## Body paragraphs (first 15)');
out.push('');
if (paragraphs.length === 0) {
  out.push('_(no <p> content found)_');
} else {
  for (const para of paragraphs.slice(0, 15)) {
    out.push(`- ${para}`);
  }
  if (paragraphs.length > 15) out.push('');
  if (paragraphs.length > 15) out.push(`_(+${paragraphs.length - 15} more paragraphs not shown)_`);
}
out.push('');
out.push('## CTAs / buttons detected');
out.push('');
if (ctas.size === 0) {
  out.push('_(none detected via heuristic)_');
} else {
  for (const c of Array.from(ctas).sort()) out.push(`- ${c}`);
}
out.push('');
out.push('## Internal links');
out.push('');
out.push(`Count: ${internal.size}`);
if (internal.size > 0) {
  out.push('');
  for (const link of Array.from(internal).sort()) out.push(`- ${link}`);
}
out.push('');

process.stdout.write(out.join('\n'));
