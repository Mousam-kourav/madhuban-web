// GSC CSV analysis helper — used by Step 5 of the audit.
// Reads gsc-queries / gsc-pages / gsc-countries CSVs and writes ranked summaries
// plus a per-NEW-route keyword recommendation table.
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.resolve(__dirname, '..', 'audit-inputs');

function parseCsv(file) {
  const text = fs.readFileSync(path.join(INPUT_DIR, file), 'utf8');
  const lines = text.split(/\r?\n/).filter(l => l.length > 0);
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    // Simple CSV — values may contain commas inside quotes, but GSC export usually doesn't.
    // Handle quoted fields defensively.
    const fields = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' && (i === 0 || line[i-1] === ',')) { inQuotes = true; continue; }
      if (ch === '"' && inQuotes && (i === line.length - 1 || line[i+1] === ',')) { inQuotes = false; continue; }
      if (ch === ',' && !inQuotes) { fields.push(cur); cur = ''; continue; }
      cur += ch;
    }
    fields.push(cur);
    const row = {};
    headers.forEach((h, i) => { row[h] = fields[i] || ''; });
    return row;
  });
}

function num(s) { return parseFloat(String(s || '').replace(/[%,]/g, '')) || 0; }

const queries = parseCsv('gsc-queries.csv.csv').map(r => ({
  query: r['Top queries'],
  clicks: num(r.Clicks),
  impressions: num(r.Impressions),
  ctr: num(r.CTR),
  position: num(r.Position),
}));

const pages = parseCsv('gsc-pages.csv.csv').map(r => ({
  url: r['Top pages'],
  clicks: num(r.Clicks),
  impressions: num(r.Impressions),
  ctr: num(r.CTR),
  position: num(r.Position),
}));

const countries = parseCsv('gsc-countries.csv.csv').map(r => ({
  country: r.Country,
  clicks: num(r.Clicks),
  impressions: num(r.Impressions),
  ctr: num(r.CTR),
  position: num(r.Position),
}));

// Output sections
const lines = [];
const push = s => lines.push(s);

push('# Madhuban GSC analysis — auto-generated section');
push('');
push(`**Inputs:**`);
push(`- gsc-queries.csv.csv — ${queries.length} rows`);
push(`- gsc-pages.csv.csv — ${pages.length} rows`);
push(`- gsc-countries.csv.csv — ${countries.length} rows`);
push('');

const totals = {
  qClicks: queries.reduce((s, q) => s + q.clicks, 0),
  qImps: queries.reduce((s, q) => s + q.impressions, 0),
  pClicks: pages.reduce((s, p) => s + p.clicks, 0),
  pImps: pages.reduce((s, p) => s + p.impressions, 0),
};
push(`**Totals (per GSC export):**`);
push(`- Total clicks (sum of queries): ${totals.qClicks.toLocaleString()}`);
push(`- Total impressions (sum of queries): ${totals.qImps.toLocaleString()}`);
push(`- Total clicks (sum of pages): ${totals.pClicks.toLocaleString()}`);
push(`- Total impressions (sum of pages): ${totals.pImps.toLocaleString()}`);
push('');

// Geography summary
push('## Geography snapshot');
push('');
push('| Country | Clicks | Impressions | CTR | Avg position |');
push('|---|---:|---:|---:|---:|');
const topCountries = [...countries].sort((a, b) => b.clicks - a.clicks).slice(0, 8);
topCountries.forEach(c => push(`| ${c.country} | ${c.clicks.toLocaleString()} | ${c.impressions.toLocaleString()} | ${c.ctr.toFixed(2)}% | ${c.position.toFixed(2)} |`));
push('');

// Top queries by impressions
push('## Top 50 queries by impressions');
push('');
push('Impressions = potential audience size. High impressions + low CTR usually means a ranking opportunity (existing visibility, room to improve).');
push('');
push('| # | Query | Clicks | Impr | CTR | Avg pos |');
push('|---|---|---:|---:|---:|---:|');
[...queries].sort((a, b) => b.impressions - a.impressions).slice(0, 50).forEach((q, i) => {
  push(`| ${i + 1} | ${q.query} | ${q.clicks} | ${q.impressions.toLocaleString()} | ${q.ctr.toFixed(2)}% | ${q.position.toFixed(2)} |`);
});
push('');

// Top queries by clicks
push('## Top 30 queries by clicks');
push('');
push('Clicks = actual traffic received. The queries driving the most real users to the OLD site today.');
push('');
push('| # | Query | Clicks | Impr | CTR | Avg pos |');
push('|---|---|---:|---:|---:|---:|');
[...queries].sort((a, b) => b.clicks - a.clicks).slice(0, 30).forEach((q, i) => {
  push(`| ${i + 1} | ${q.query} | ${q.clicks} | ${q.impressions.toLocaleString()} | ${q.ctr.toFixed(2)}% | ${q.position.toFixed(2)} |`);
});
push('');

// Top CTR (min 50 impressions)
push('## Top 20 queries by CTR (impressions ≥ 50)');
push('');
push('High CTR at decent impression volume = strong intent match. Protect these — the page/snippet wording is converting.');
push('');
push('| # | Query | Clicks | Impr | CTR | Avg pos |');
push('|---|---|---:|---:|---:|---:|');
[...queries].filter(q => q.impressions >= 50).sort((a, b) => b.ctr - a.ctr).slice(0, 20).forEach((q, i) => {
  push(`| ${i + 1} | ${q.query} | ${q.clicks} | ${q.impressions.toLocaleString()} | ${q.ctr.toFixed(2)}% | ${q.position.toFixed(2)} |`);
});
push('');

// Top pages
push('## Top 20 ranking pages');
push('');
push('| # | URL | Clicks | Impr | CTR | Avg pos |');
push('|---|---|---:|---:|---:|---:|');
[...pages].sort((a, b) => b.clicks - a.clicks).slice(0, 20).forEach((p, i) => {
  const shortUrl = p.url.replace('https://www.madhubanecoretreat.com', '') || '/';
  push(`| ${i + 1} | \`${shortUrl}\` | ${p.clicks.toLocaleString()} | ${p.impressions.toLocaleString()} | ${p.ctr.toFixed(2)}% | ${p.position.toFixed(2)} |`);
});
push('');

// Page-by-impressions
push('## Top 20 pages by impressions');
push('');
push('| # | URL | Clicks | Impr | CTR | Avg pos |');
push('|---|---|---:|---:|---:|---:|');
[...pages].sort((a, b) => b.impressions - a.impressions).slice(0, 20).forEach((p, i) => {
  const shortUrl = p.url.replace('https://www.madhubanecoretreat.com', '') || '/';
  push(`| ${i + 1} | \`${shortUrl}\` | ${p.clicks.toLocaleString()} | ${p.impressions.toLocaleString()} | ${p.ctr.toFixed(2)}% | ${p.position.toFixed(2)} |`);
});
push('');

// Per-page→query keyword inference
push('## Page → query mapping (thematic inference)');
push('');
push('GSC export does not include the page↔query correlation. Below mapping is inferred by matching slug tokens against query terms — confidence varies. Use as a starting point; verify in GSC UI when prioritizing.');
push('');

const top30Pages = [...pages].sort((a, b) => b.clicks - a.clicks).slice(0, 30);
function pathToTokens(url) {
  const p = url.replace('https://www.madhubanecoretreat.com', '');
  return p.split(/[\/\-]/).filter(t => t.length > 2).map(t => t.toLowerCase());
}
top30Pages.forEach(p => {
  const shortUrl = p.url.replace('https://www.madhubanecoretreat.com', '') || '/';
  const tokens = pathToTokens(p.url);
  const matched = queries
    .filter(q => {
      const qq = q.query.toLowerCase();
      if (tokens.length === 0) {
        // Home — match brand + "near bhopal" queries
        return /madhuban|near bhopal|resort.*bhopal|eco.*bhopal/.test(qq);
      }
      // require at least 2 tokens for content pages; 1 for index pages
      const hits = tokens.filter(t => qq.includes(t)).length;
      return tokens.length >= 3 ? hits >= 2 : hits >= 1;
    })
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);
  push(`### \`${shortUrl}\``);
  push(`- Clicks: **${p.clicks}**, Impressions: **${p.impressions.toLocaleString()}**, CTR: **${p.ctr.toFixed(2)}%**, Avg pos: **${p.position.toFixed(2)}**`);
  if (matched.length > 0) {
    push('- Likely driving queries:');
    matched.forEach(q => push(`  - **${q.query}** — ${q.clicks} clicks / ${q.impressions.toLocaleString()} impr / ${q.ctr.toFixed(2)}% / pos ${q.position.toFixed(2)}`));
  } else {
    push('- _(no thematic query match — likely branded/long-tail)_');
  }
  push('');
});

process.stdout.write(lines.join('\n'));
