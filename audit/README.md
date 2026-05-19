# Madhuban Eco Retreat — Pre-Polish Audit

**Date conducted:** 2026-05-18
**Auditor:** Claude (Opus 4.7) via Claude Code
**Branch audited:** `feat/phase-9h-2-featured-experiences-public-section`
**Live URLs compared:**
- OLD (production, currently ranking): https://www.madhubanecoretreat.com
- NEW (Vercel preview, rebuild target): https://madhuban-web.vercel.app

## Purpose

Read-only audit conducted before the UI/UX/SEO polish arc begins. Captures the current state of the OLD live site, the NEW rebuild, and the gap between them so that polish work can be sequenced by impact. This document is the index — open the numbered files for details.

## Priority order (LOCKED)

1. **SEO preservation** — protect existing ranking equity
2. **Mobile UX** — highest-visibility issue surface
3. **Booking conversion** — highest revenue impact
4. **Visual polish** — everything else

Every recommendation in `11-priority-recommendations.md` is ranked against this order.

## Locked user decisions (Step 8 review)

1. **Online checkout (Path B) is being promoted to the primary booking path.** WhatsApp lead (Path A) stays as secondary fallback.
2. **All 8 OLD blog URLs that 404 on NEW will be migrated to NEW Supabase** (not 301'd). Slugs preserved verbatim.

## Index

| # | Report | Status |
|---|---|---|
| 00 | [Methodology](./00-methodology.md) | ✅ Done |
| 01 | [Page inventory (OLD vs NEW + stay slug equity)](./01-page-inventory.md) | ✅ Done |
| 02 | [OLD site content extracts (31 files)](./02-old-site-content/) | ✅ Done |
| 03 | [NEW site content extracts (41 files)](./03-new-site-content/) | ✅ Done |
| 04 | [SEO keyword mapping (GSC)](./04-seo-keyword-mapping.md) | ✅ Done |
| 05 | [Heading structure audit](./05-heading-structure.md) | ✅ Done |
| 06 | [Mobile rendering issues](./06-mobile-issues.md) | ✅ Done |
| 07 | [Booking flow audit](./07-booking-flow-audit.md) | ✅ Done |
| 08 | [Image inventory + OG/favicon + R2 leaks](./08-image-inventory.md) | ✅ Done |
| 09 | [Performance baseline](./09-performance-baseline.md) | ✅ Done (PSI API blocked — see file) |
| 10 | [Gap analysis](./10-gap-analysis.md) | ✅ Done |
| 11 | [Priority recommendations](./11-priority-recommendations.md) | ✅ Done |

## Helper scripts

The audit produced 3 reusable scripts. They are dotfiles in `audit/` to keep them out of default `ls` view:

| Script | Purpose |
|---|---|
| `.extract.cjs` | HTML content extractor — pulls title, meta, headings, body, CTAs, internal links from any page |
| `.gsc-analyze.cjs` | GSC CSV parser — outputs ranked tables and page→query thematic mapping |
| `.heading-audit.cjs` | Heading hierarchy auditor — reads extracted content files and flags violations |

To re-run after content changes:
```bash
# Re-extract OLD or NEW content (curl + extract per URL)
cat page.html | node audit/.extract.cjs "url" "label" > audit/03-new-site-content/page.md

# Regenerate keyword mapping (with new GSC export in audit-inputs/)
node audit/.gsc-analyze.cjs

# Regenerate heading audit (from current extracted content)
node audit/.heading-audit.cjs > audit/05-heading-structure.md
```

## Top findings at a glance

### 🚨 Highest-leverage SEO fixes

1. **Duplicated brand suffix in meta titles** (SEO-T1-001) — one-line code fix resolves all 36 over-length titles
2. **8 OLD blog URLs return 404 on NEW** (SEO-T1-002) — to migrate per LOCKED 2; biggest is `/blogs/trekking-near-bhopal-…` at 9,989 impressions
3. **8 missing 301 redirects** for legacy GSC URLs (SEO-T1-003) — ~3,478 impressions at risk

### 🚨 Highest-leverage UX/conversion fixes

1. **Online checkout flow (Path B) is hidden 3+ clicks deep** (BOOKING-001, LOCKED 1)
2. **Mobile sticky-bar Book Now is 40 px** (BOOKING-002) — below 44 px touch standard
3. **Hero `<h1>` uses `text-5xl` mobile baseline on 6 pages** (MOBILE-001) — root of iPhone 12 Pro mid-word wrap

## Scope notes

- **In scope:** every route under `src/app/(marketing)/` and the corresponding live OLD page where one exists. The booking flow at `src/app/(booking)/book/*` is in scope for Step 8 only.
- **Out of scope:** `src/app/admin/*`, `src/app/api/*`, auth/login flows, server actions internals, database schema.
- **OLD-only pages:** content extracted via HTTP fetch only (no source access).
- **NEW-only pages** (no OLD equivalent): `aranyashala`, `corporate-offsite`, `enquire`, `packages/2-day-digital-detox`, `souvenir-shop`, `thank-you` — audited on NEW side only.
- **Performance scores blocked** — PSI API returned HTTP 429 quota exceeded; SEO-T1-010 schedules manual baseline.

## How to reproduce

See [`00-methodology.md`](./00-methodology.md).
