# 10 — Gap Analysis

**Date:** 2026-05-18

Synthesizes Steps 3 through 9 into a single inventory of what's missing on NEW vs OLD, with risk-tiered remediation. Built per Step 8 user clarifications.

---

## A. OLD sitemap (30 URLs) — NEW coverage table

| OLD URL | Status on NEW | Mechanism | Risk |
|---|---|---|---|
| `/` | ✅ Live | Direct match | None |
| `/about-us` | ✅ Live | Direct match | None |
| `/stay` | ✅ Live | Direct match | None |
| `/experiences` | ✅ Live | Direct match | None |
| `/dining` | ✅ Live | Direct match | None |
| `/nearby-attractions` | ✅ Live | Direct match | None |
| `/gallery` | ✅ Live | Direct match | None |
| `/contact-us` | ✅ Live | Direct match | None |
| `/booking` | ✅ Live | Direct match | None |
| `/blogs` | ✅ Live | Direct match | None |
| `/stay/camping-tent` | ✅ Live | Direct match | None |
| `/stay/glamping-tents` | ✅ Live | Direct match | None |
| `/stay/mud-villa` | 🔁 Redirects | 301 → `/stay/mud-house-1` (next.config.ts:22) | None |
| `/stay/pool-side-room` | 🔁 Redirects | 301 → `/stay/pool-side-villa` (next.config.ts:21) | None |
| `/stay/safari-tent` | ✅ Live | Direct match | None |
| `/experiences/bird-watching-and-wilderness` | ✅ Live | Direct match | None |
| `/experiences/forest-walks-and-nature-trails` | ✅ Live | Direct match | None |
| `/experiences/recreational-facilities` | ✅ Live | Direct match | None |
| `/privacy-policy` | ✅ Live | Direct match | None |
| `/terms-and-condition` | ✅ Live | Direct match | None |
| `/cookies-and-consent-policy` | ✅ Live | Direct match | None |
| `/disclaimer` | ✅ Live | Direct match | None |
| `/blogs/bhimbetika-india-s-ancient-rock-art-wonder-the-complete-guide-2026` | 🚨 **404** | None | **HIGH — 2,438 impr, will be migrated per LOCKED DECISION 2** |
| `/blogs/birdwatching-central-india-ratapani-guide` | 🚨 **404** | None | **HIGH — to migrate** |
| `/blogs/day-outing-near-bhopal-perfect-nature-escape` | 🚨 **404** | None | **HIGH — 439 impr, 13 clicks, to migrate** |
| `/blogs/featured-hindustan-times-bhopal-wildlife-secret` | 🚨 **404** | None | **HIGH — to migrate (low traffic but PR-value)** |
| `/blogs/ginnourgarh-fort-forgotten-gond-citadel-ratapani` | 🚨 **404** | None | **HIGH — 242 impr, to migrate** |
| `/blogs/kathotiya-trek-bhopal-hidden-jungle-adventure` | 🚨 **404** | None | **HIGH — 1,228 impr, 11 clicks, to migrate** |
| `/blogs/ratapani-tiger-reserve-slow-tourism-near-bhopal` | 🚨 **404** | None | **HIGH — 1,406 impr, to migrate** |
| `/blogs/trekking-near-bhopal-15-best-treks-for-nature-adventure` | 🚨 **404** | None | **HIGHEST — 9,989 impr, 52 clicks, to migrate** |

**Summary: 22 / 30 OLD sitemap URLs covered. 8 missing (all blogs).** Per LOCKED DECISION 2, all 8 will be migrated to NEW Supabase rather than redirected. **No additional next.config.ts entries needed for the 8 blogs** — they need content migration only.

---

## B. Legacy GSC URLs with traffic — 301 reconciliation

Cross-referenced GSC pages CSV (all URLs with ≥50 impressions) against `next.config.ts` redirects. Anything indexed by Google but not on OLD sitemap and not on NEW route list needs explicit 301 coverage.

### Verified 200 (already covered by chain of redirects)

| OLD URL | NEW HTTP status | Effective destination |
|---|---|---|
| `/hotels/` | ✅ 200 | redirects to `/hotels` (line 56 of next.config.ts) → `/about-us` |
| `/blog` | ✅ 200 | `/blog` → `/blogs` (line 17) |

### Missing 301 — NEW returns 404 — 🚨 needs adding before launch

Verified by HTTP request — these all 404 on the NEW build today.

| OLD URL | GSC impr | GSC clicks | Recommended target | Rationale |
|---|---:|---:|---|---|
| `/hotels/madhuban-eco-retreat/` | **1,605** | 10 | `/` | Highest-impression uncovered legacy URL; brand-page from WordPress era |
| `/hotels/madhuban-eco-retreat` (no trailing slash) | _(in same group)_ | _(in same group)_ | `/` | Same URL canonical pair — add both, or just the non-trailing form and let trailing-slash redirect to it |
| `/blogs/madhuban-eco-retreat-complete-guide` | 793 | 2 | `/about-us` OR new content | **Special case** — OLD URL returns 200 but **shows "Oops! We couldn't load this blog" error**. Content was deleted from OLD CMS but Google still has the URL indexed. Cannot migrate (no content to migrate). Either 301 → `/about-us` (closest topical match) or commission a new "Complete Guide" piece. |
| `/about/story` | 529 | 3 | `/about-us` | Substring of `/about-us`; clearly the OLD WordPress sub-page |
| `/home` | 190 | 0 | `/` | WordPress-style homepage variant |
| `/contact` | 83 | 2 | `/contact-us` | Trailing-slash variant of `/contact-us` |
| `/contact/` | 108 | 1 | `/contact-us` | Same canonical group |
| `/about/eco-philosophy` | 76 | 2 | `/about-us` | OLD sub-page |

**Total impressions at risk if these aren't added: ~3,478 impressions/quarter.** Clicks at risk: ~20 (low, but a missing 301 also bleeds link equity).

### Already covered by 301 (no action needed)

The 48 redirects in `next.config.ts` handle these GSC-visible legacy URLs cleanly:
- `/rooms/` → `/stay`, `/rooms/mud-house/` → `/stay/mud-house-1`
- `/about/Vision-&-Mission` → `/about-us`
- `/blog`, `/blog/:slug` → `/blogs`, `/blogs/:slug`
- `/cropped-…-png` group → `/gallery`
- Plus the lorem-ipsum WordPress demo URLs (no GSC traffic, but covered defensively)

### Recommendation in `next.config.ts`

Add the following inside the `redirects()` array (illustrative format — architect handles actual code):

```ts
{ source: '/hotels/madhuban-eco-retreat', destination: '/', permanent: true },
{ source: '/hotels/madhuban-eco-retreat/', destination: '/', permanent: true },
{ source: '/blogs/madhuban-eco-retreat-complete-guide', destination: '/about-us', permanent: true },
{ source: '/about/story', destination: '/about-us', permanent: true },
{ source: '/home', destination: '/', permanent: true },
{ source: '/contact', destination: '/contact-us', permanent: true },
{ source: '/contact/', destination: '/contact-us', permanent: true },
{ source: '/about/eco-philosophy', destination: '/about-us', permanent: true },
```

This will go into Step 12 as a single SEO-T1 work item.

---

## C. Orphan-blog investigation

URL: `https://www.madhubanecoretreat.com/blogs/madhuban-eco-retreat-complete-guide`

### Findings
- **HTTP status:** 200 OK
- **Cache:** `public, max-age=86400, stale-while-revalidate=604800`
- **Title tag:** missing
- **H1:** missing
- **Body content:** _"Oops! We couldn't load this blog. The blog you're looking for isn't available right now. Explore other nature-inspired stories while we bring this one back."_
- **CTA:** "Explore Other Blogs"

### Interpretation
The OLD CMS once had a blog post at this slug. The post was deleted (or content lost) but the route stayed live, now serving a soft-404 error page. Google indexed the URL when content was live and still ranks it. Current state on OLD: 793 impressions / 2 clicks / position 8.49 — Google's crawl now sees "no content" but is still showing the URL in SERPs.

### Why it matters
- Google may eventually drop the URL once it detects soft-404, but that takes weeks/months.
- For users who click through from search today, they land on a broken-feeling page.

### Recommended action (architect decides)
- **Option 1:** 301 → `/about-us` (no editorial work; instant)
- **Option 2:** Commission a fresh "Complete Guide to Madhuban Eco Retreat" post; publish at this slug; reclaim the 793 impressions with relevant content.

Option 2 is higher-effort but reclaims SEO equity. Option 1 is the safe-and-fast move. The user will investigate in parallel (per Step 8 approval).

---

## D. Heading hierarchy gaps cross-referenced with traffic

Combining Step 6 (heading audit) with Step 5 (GSC top-traffic). Identifies pages where the H1 keyword regression on NEW corresponds to a high-impression OLD page. These are the highest-priority H1 rewrites for SEO recovery.

| NEW Page | OLD H1 | NEW H1 | OLD impressions | Recovery priority |
|---|---|---|---:|---|
| `/` | Madhuban Eco Retreat: Eco-Luxury Forest Resort | Connect With Wildlife & Nature | **36,090** | 🚨 **#1 priority** — biggest traffic page, lost both brand and keyword in H1 |
| `/about-us` | (brand-positioning H1) | Where Sustainability Meets Hospitality | 3,362 | 🚨 #2 — top-5 traffic page |
| `/stay` (listing) | Eco-Luxury Stays in the Heart of Ratapani | Stay With Us | 3,175 | 🚨 #3 — top-5 traffic page, NEW H1 is keyword-empty |
| `/nearby-attractions` | (places-keyword H1) | Where the Forest Opens into History | 1,014 | ⚠️ Important — poetic H1 sheds places-keyword |
| `/experiences` | (had keyword H1) | Experience Life at Nature's Rhythm | 764 | ⚠️ Important |
| `/contact-us` | (had brand H1) | Get in Touch | 557 | ⚠️ Smaller impact but easy rewrite |
| `/gallery` | (had brand-photo H1) | Gallery | 1,231 | 🔵 LOW — single word H1 is fine if meta title is rich, but no brand context |
| `/blogs` | (post-listing H1) | Stories From Nature, Wellness & Wilderness | 934 | 🔵 OK — preserves "nature/wellness/wilderness" keywords |
| `/booking` | (booking-keyword H1) | Escape to Ratapani's Premier Eco-Luxury Retreat | 3,507 | ✅ OK — already keyword-rich on NEW |

### Pages with NO H1 (Step 6) — separate fix

Three NEW pages have zero `<h1>` element. None are high-traffic but they fail basic on-page SEO and accessibility:
- `/corporate-offsite` (NEW-only)
- `/packages/2-day-digital-detox` (NEW-only)
- `/thank-you` (NEW-only, post-conversion — least critical)

These don't have OLD-traffic equity to lose, but they should still be fixed before launch as quality hygiene.

### Pages with H1→H3 skip (Step 6)

Five NEW pages skip from H1 directly to H3, missing H2:
- `/aranyashala` — "Forest & Wildlife Interpretation"
- `/blogs` (listing) — "Eco Resort vs Luxury Resort..." (the post tile)
- `/enquire` — "Explore"
- `/gallery` — "Explore"
- `/souvenir-shop/[slug]` — "Explore"

The repeated "Explore" pattern indicates a shared component (likely a related-links / explore-more block) that uses H3 directly without a parent H2 wrapper. **One source fix affects 3+ pages.** Goes into Step 12 as a single work item.

---

## E. Content depth gaps (Step 4 cross-reference)

OLD pages with substantially more body content than their NEW equivalents. These represent migration debt where the NEW build is structurally complete but textually thinner.

| Page | OLD body density | NEW body density | Severity |
|---|---|---|---|
| `/` | 25+ paragraphs (15 captured in extract + 15 more flagged) | 8 paragraphs captured + multiple component sections | ⚠️ Mostly preserved via new sections (dining, nearby, FAQ) but density different |
| `/blogs/*` | 8 long-form posts (40–130 KB each, deeply structured with H3s and H4s) | 1 short post (~5 KB) | 🚨 Per locked decision, 8 posts will be migrated |
| `/dining` | OLD has descriptive H2/H3 about cuisine, philosophy | NEW dining page has similar structure | ⚠️ Spot-check for keyword phrasing parity |
| `/about-us` | OLD had concrete story sections, founder mentions | NEW has 4 H2 sections + founder image | ⚠️ Compare phrasing — keyword density |

For the polish arc, the architect should review the OLD content for each high-traffic page and verify NEW has equivalent (or better) keyword density. This is editorial work, not code work — and the homepage.ts comment flagged in Step 7 makes clear that content is intentionally kept keyword-stuffed per client decision (CLAUDE.md §10.3).

---

## F. Meta description gaps

All 41 NEW pages have meta descriptions set (Step 4 found 0 missing). No gap here.

Title length is the cross-cutting bug — addressed under §D / Step 12 SEO-T1 work item (the buildMetadata + root layout template fix).

---

## G. Sitemap.xml — does NEW emit one?

Quick check.

### Status
- OLD `https://www.madhubanecoretreat.com/sitemap.xml` → 200 (30 URLs)
- OLD `https://www.madhubanecoretreat.com/robots.txt` → references sitemap.xml AND `sitemap-images.xml`
- NEW `https://madhuban-web.vercel.app/robots.txt` → exists (returned at Step 1)
- NEW `https://madhuban-web.vercel.app/sitemap.xml` → ❓ not verified during audit

**Action for architect:** verify NEW emits a sitemap.xml and that it includes:
- All marketing routes (incl. new pages: `/aranyashala`, `/corporate-offsite`, `/enquire`, `/packages/2-day-digital-detox`, `/souvenir-shop`, `/thank-you`)
- All `/blogs/*` slugs after migration
- All `/stay/*` slugs, `/experiences/*` slugs, `/nearby-attractions/*` slugs
- All `/souvenir-shop/*` product slugs

Goes into Step 12 as SEO-T1 work item if not already generated.

---

## H. Risk summary by tier

### 🚨 HIGH — fix before domain cutover

1. Migrate 8 OLD blog URLs to NEW Supabase (LOCKED) — content + slugs
2. Add 8 missing 301 redirects to `next.config.ts` (per §B)
3. Fix duplicated-brand-suffix bug in `buildMetadata` + root layout template (Step 9 §4)
4. Rewrite H1s on `/`, `/about-us`, `/stay` listing for keyword preservation (per §D)
5. Add H1 to 3 NEW-only pages with none (`/corporate-offsite`, `/packages/2-day-digital-detox`, `/thank-you`)
6. Fix H1→H3 skip in shared "Explore" component (affects 5 pages)
7. Fix OLD-bucket preconnect leak in `layout.tsx:70`
8. Upload `experiences/banner/hero-{800,1280}.{webp,jpg}` to NEW R2 (launch-blocking per CLAUDE.md)
9. Replace 3 Notable Guests low-res portraits
10. Verify NEW emits a complete `sitemap.xml`

### ⚠️ MEDIUM — improves but not blocking

- Add unique OG images to 8 high-traffic marketing pages currently using logo fallback
- Re-shoot or swap `/blogs/eco-resort-vs-luxury-resort` OG image (currently camping tent — off-topic)
- Add `manifest.webmanifest`
- Investigate font over-loading on `/about-us` (8 font refs vs 4 elsewhere)
- Investigate cold-hit TTFB (1.5–2 s on ISR pages)
- Touch-target fixes (mobile sticky-bar, coupon apply button)

### 🔵 LOW

- Delete unused Next.js scaffolding SVGs in `public/`
- Add `safari-pinned-tab.svg`
- Remove documentary OLD-bucket comments in production code

---

## I. Inputs to Step 12

This document plus:
- `01-page-inventory.md` — structural parity
- `04-seo-keyword-mapping.md` — GSC keyword equity
- `05-heading-structure.md` — H1/H2/H3 violations
- `06-mobile-issues.md` — mobile rendering risks
- `07-booking-flow-audit.md` — booking conversion paths
- `08-image-inventory.md` — asset + OG + R2 coverage
- `09-performance-baseline.md` — performance hypothesis list

…all feed into the priority-ranked work plan in `11-priority-recommendations.md`.
