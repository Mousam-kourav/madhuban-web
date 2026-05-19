# 00 — Methodology

**Date:** 2026-05-18
**Auditor:** Claude (Opus 4.7) via Claude Code CLI
**Working directory:** `C:\Users\MOUSAM\Projects\madhuban-web`
**Branch audited:** `feat/phase-9h-2-featured-experiences-public-section` (clean, in sync with origin)

## Goal

Establish a complete, reproducible baseline of:
1. Every page that exists on the OLD live site
2. Every page that exists on the NEW Vercel build
3. What content, headings, keywords, and assets each has
4. Where the NEW build diverges from the OLD in ways that risk SEO equity or user experience
5. A ranked list of fixes to address before any redesign work begins

The audit is **read-only**. No source code is modified. No PRs are opened. No dev server is started. Output is exclusively markdown files under `audit/`.

## Tools used

| Tool | Purpose |
|---|---|
| `curl` (via Bash) | Fetching OLD site HTML, sitemap, robots, and PageSpeed API responses |
| `grep` / `Grep` | Pattern searches across the NEW codebase |
| `Glob` | File discovery |
| `Read` | Reading NEW source files |
| `Write` | Producing audit markdown |
| Google PageSpeed Insights API (v5) | Performance baseline (Lighthouse over HTTP) |
| Google Search Console CSV exports | Keyword and page ranking data — provided by user in `audit-inputs/` |

No npm packages installed. No code execution.

## Inputs

### Provided by user
- `audit-inputs/gsc-queries.csv` — GSC top queries (last 90 days)
- `audit-inputs/gsc-pages.csv` — GSC top pages (last 90 days)
- `audit-inputs/gsc-countries.csv` — GSC traffic by country (last 90 days)

If these are absent when Step 5 begins, the audit pauses there.

### Fetched live
- `https://www.madhubanecoretreat.com/` (OLD homepage + every URL in OLD sitemap)
- `https://www.madhubanecoretreat.com/sitemap.xml`
- `https://www.madhubanecoretreat.com/robots.txt`
- `https://madhuban-web.vercel.app/` (NEW live preview, for performance only — content audit reads from local source instead)

### Read from local
- All `src/app/(marketing)/**/page.tsx`
- `src/app/(booking)/book/**/page.tsx` (Step 8 only)
- `next.config.ts`
- `src/app/layout.tsx` (root metadata + preconnects)

## Scope

### In scope
- Every marketing page route on NEW
- Every URL in the OLD sitemap (30 total)
- `/dining` and `/day-outing` on OLD (linked but not always sitemap'd) — fetched directly
- The booking flow on NEW from entry CTA to confirmation
- Image references in marketing pages
- OG metadata and favicon coverage per route

### Out of scope
- Admin UI (`src/app/admin/*`)
- API routes (`src/app/api/*`)
- Auth flows
- Database schema and migrations
- Code style or test coverage
- Anything past the priority recommendations (no implementation suggestions — that's the architect's job)

## Approach per step

| Step | Output file | Approach |
|---|---|---|
| 3 | `01-page-inventory.md` | OLD sitemap parse → NEW route walk → side-by-side table. Stay slugs get their own equity-map subsection. |
| 4 | `02-old-site-content/*.md`, `03-new-site-content/*.md` | One file per page. Sequential. Save immediately after each — no batching, no end-of-step dump. |
| 5 | `04-seo-keyword-mapping.md` | Parse GSC CSVs. Top-50 by impressions, top-30 by clicks, top-20 by CTR (≥50 impressions). Map each top-ranking URL → primary/secondary keywords → NEW route equivalent. |
| 6 | `05-heading-structure.md` | Regex/AST scan of NEW page sources for H1/H2/H3. OLD: regex on saved HTML. Flag hierarchy violations. |
| 7 | `06-mobile-issues.md` | Source-code static analysis for: hero text sizing classes, fixed widths, missing `sm:`/`md:` variants, button/link sizing, image sizes attribute. Cite `file:line`. |
| 8 | `07-booking-flow-audit.md` | Trace from every entry-point CTA on marketing pages through `(booking)/book/*` to confirmation. Document steps, fields, trust signals, mobile-specific issues. |
| 9 | `08-image-inventory.md` | Grep `<Image`, `next/image`, `r2.dev`, `pub-*` strings. Cross-reference R2 bucket strings to find OLD-bucket leaks. Per-route OG and favicon check. |
| 10 | `09-performance-baseline.md` | PageSpeed Insights API on home (mobile+desktop), one room slug, one blog slug, booking. Capture Performance/A11y/BP/SEO + LCP/CLS/INP/TBT. |
| 11 | `10-gap-analysis.md` | Synthesis. For each of the 30 OLD sitemap URLs: does a NEW route exist, or is there a 301 redirect in `next.config.ts`? List missing content/headings/keywords. |
| 12 | `11-priority-recommendations.md` | Ranked SEO → Mobile → Booking → Visual. Each item: title, category, files affected, complexity S/M/L, rationale. Complexity factors in "content edits = code edits". |

## How to reproduce

```bash
# 1. Repo must be at the same commit as audit time
git checkout feat/phase-9h-2-featured-experiences-public-section

# 2. Fetch OLD live state
curl -sL https://www.madhubanecoretreat.com/sitemap.xml -o /tmp/old-sitemap.xml
curl -sL https://www.madhubanecoretreat.com/robots.txt
# (then curl each <loc> URL — see 02-old-site-content/)

# 3. Local source — no setup needed beyond clone. Audit reads only.

# 4. GSC data
# Export from Search Console > Performance > Queries / Pages / Countries
# Date range: last 90 days at time of audit (2026-02-17 to 2026-05-18)
# Place in audit-inputs/

# 5. Performance
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://madhuban-web.vercel.app&strategy=mobile"
```

## Reliability caveats

- **GSC data is point-in-time.** Re-running this audit later will produce different keyword rankings.
- **PageSpeed Insights varies per run.** Scores can shift ±5 points between consecutive calls due to network variance. Treat the captured numbers as a baseline order-of-magnitude, not exact.
- **Live OLD site can change.** Anything fetched is a snapshot. If the OLD site is updated mid-audit, follow-on extractions may diverge from earlier ones.
- **NEW codebase changes during audit are not tracked.** This is a snapshot of the branch as of the date above.
- **OLD site is Next.js + SSR.** Initial HTML contains rendered content, so curl-based extraction is reliable for body content. Dynamic client-only widgets (if any) may be missed.
- **OLD site uses a different R2 bucket** (`pub-ec3822a2d8d6482db36eb9dadc028ea6`) than NEW (`pub-988c0a6b938742458b908a7a49295f61`). Audit Step 9 explicitly hunts for OLD-bucket leaks in NEW source.

## What this audit does NOT do

- It does not write or recommend specific code. Step 12 outputs problem statements, not implementation kickoffs.
- It does not run the NEW dev server or interact with the UI in a real browser. Mobile issues are inferred from source code, not visually verified — the user/architect must spot-check the highest-impact findings in a real device or DevTools before scheduling fixes.
- It does not exhaustively audit accessibility — Step 10's Lighthouse a11y score is captured but a full WCAG audit is out of scope.
- It does not crawl the OLD site recursively. Only the URLs in `sitemap.xml` (plus `/day-outing` and `/dining` per user decision) are fetched.
