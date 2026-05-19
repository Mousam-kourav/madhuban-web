# 09 — Performance Baseline

**Date:** 2026-05-18

## 1. PageSpeed Insights API — blocked by quota

Attempted: 5 PSI v5 runs in parallel (home mobile + desktop, /stay/safari-tent mobile, /blogs/eco-resort… mobile, /booking mobile).

Result: **all 5 returned HTTP 429** with:
```
"reason": "RATE_LIMIT_EXCEEDED"
"quota_metric": "pagespeedonline.googleapis.com/default"
"quota_limit_value": "0"
```

The unauthenticated public quota for `pagespeedonline.googleapis.com` resolves to **0 queries per day** for this caller. CrUX API likewise required API key (403 PERMISSION_DENIED on unauthenticated request).

**Implication:** this audit cannot produce Lighthouse Performance / Accessibility / Best Practices / SEO scores for the NEW build via the API path. The Step 12 "any score below 70 → HIGH priority" rule is therefore deferred until scores are obtained.

### How to unblock

The architect/user needs to do ONE of the following before Step 12 priorities can incorporate Lighthouse:

1. **Provide a Google API key** with PageSpeed Insights API enabled. The audit can be re-run via `audit/.gsc-analyze.cjs`-style script that takes the key from env.
2. **Run Lighthouse manually from Chrome DevTools** (Application → Lighthouse → Generate Report) against the 5 URLs in §2 below, with mobile + desktop strategies as applicable, and paste the JSON output into `audit-inputs/lighthouse/` so a follow-up pass can ingest them.
3. **Run PageSpeed Insights manually** via the web UI at https://pagespeed.web.dev/?url=… for each URL and screenshot the scores.

This is included as **task PERF-AUDIT-FOLLOWUP** in Step 12.

---

## 2. URLs intended to be benchmarked

When PSI data becomes available, run against these 5 URL × strategy combinations:

| # | URL | Strategy | Rationale |
|---|---|---|---|
| 1 | `https://madhuban-web.vercel.app/` | mobile | Top-traffic page; primary mobile audience |
| 2 | `https://madhuban-web.vercel.app/` | desktop | Top-traffic; desktop comparison baseline |
| 3 | `https://madhuban-web.vercel.app/stay/safari-tent` | mobile | Room detail with most image references on the page (127 image-related HTML hits — most of any /stay/[slug]) |
| 4 | `https://madhuban-web.vercel.app/blogs/eco-resort-vs-luxury-resort-real-difference` | mobile | The only NEW blog post — long-form prose baseline |
| 5 | `https://madhuban-web.vercel.app/booking` | mobile | Conversion-critical landing (WhatsApp form + image-heavy room grid + FAQ) |

---

## 3. Curl-based fallback metrics

In lieu of Lighthouse, the following were captured directly via curl. These are **not equivalents** to Performance / Accessibility / BP / SEO scores — they measure server-side time-to-first-byte and HTML payload size only. They do NOT include browser rendering, JS parse/execute, image loading, or CLS.

Run on 2026-05-18 from the audit machine (single observation, not averaged):

### Time-to-first-byte and HTML payload

| Page | TTFB | Total transfer | HTML size | HTTP status | Note |
|---|---:|---:|---:|---:|---|
| `/` | **1.96 s** | 2.40 s | 330 KB | 200 | Cold ISR? First hit was slow |
| `/stay/safari-tent` | 1.56 s | 1.72 s | 144 KB | 200 | ISR + Supabase pricing fetch |
| `/blogs/eco-resort-vs-luxury-resort-real-difference` | 1.57 s | 1.60 s | 89 KB | 200 | ISR (revalidate 60) |
| `/booking` | 1.33 s | 1.58 s | 167 KB | 200 | Dynamic (Supabase rooms list) |
| `/about-us` | **0.28 s** | 0.33 s | 124 KB | 200 | Second hit — Vercel edge cache warm |

### Critical observations from TTFB

- The cold first request to `/` took **1.96 s** to first byte. That's high. Targets for a brand homepage: <600 ms. The 1.5–2 s figures across ISR pages suggest Vercel cold-start OR Supabase round-trips are accumulating per-request.
- `/about-us` returning **0.28 s** on a warm hit confirms that the underlying delivery is fast when the edge cache is warm. The cold-hit cost is concentrated in the first request per ISR cycle (revalidate 60–300 s windows).
- Real-world TTFB experienced by visitors depends on regional Vercel edge and Supabase region routing — likely better than these single-observation samples for Indian users since Vercel/Supabase have south-Asia presence.

### HTML payload size

- Homepage HTML at 330 KB is on the heavier side. For comparison, content-rich landing pages typically aim for <200 KB of HTML; the rest comes from images and JS bundles.
- /blog HTML at 89 KB is reasonable for a long-form post.
- /booking HTML at 167 KB includes the room grid SSR'd.

### HTML-side resource references (count of `<script>`, `<link rel=stylesheet>`, `<img>`/Image refs, font URLs)

| Page | Img refs | `<script>` | Stylesheets | Font URLs |
|---|---:|---:|---:|---:|
| `/` | **33** | 15 | 2 | 4 |
| `/stay/safari-tent` | 9 | 15 | 2 | 4 |
| `/blogs/eco-resort-vs-luxury-resort-real-difference` | 3 | 15 | 2 | 4 |
| `/booking` | 10 | 15 | 2 | 4 |
| `/about-us` | 6 | 14 | 2 | **8** |

Observations:
- 15 `<script>` tags on most pages — typical Next.js chunk count, not excessive but worth profiling.
- 2 stylesheets — fine.
- `/about-us` has **8 font URL references** vs 4 elsewhere — investigate whether all 8 are actually needed (could be a font over-loading regression on that page).
- Home page has 33 image references in HTML — these are mostly Image component `srcSet` entries, not 33 distinct images. Actual image count is ~6–10 distinct.

### Asset-level hint (from earlier image grep — Step 9)

- Homepage carousel preloads 3 hero variants (mobile/tablet/desktop × WebP/JPG = 6 candidate images) with `priority` + `fetchPriority="high"` on the first slide and `loading="eager"` on slides 2–3. **Loading 3 hero slides eagerly is a known LCP/data-cost trade-off** — slides 2 and 3 are not above the fold but still load immediately. Worth verifying impact in real Lighthouse.

### OLD bucket preconnect (Step 9 cross-ref)

The `<link rel="preconnect" href="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev">` in `src/app/layout.tsx:70` opens a TLS connection on every page load to a hostname that's never used. Estimated cost: 1 DNS lookup + 1 TLS handshake per page load = roughly **50–250 ms wasted** on the critical path depending on user location. Lighthouse may or may not surface this as a specific audit, but it appears in the Network tab as a hanging request.

---

## 4. What we know vs what we need

| Metric | Status | Source |
|---|---|---|
| TTFB | ✅ Captured (1.3–2.0 s cold, 0.28 s warm) | curl `time_starttransfer` |
| HTML payload size | ✅ Captured | curl `size_download` |
| Number of HTML-referenced resources | ✅ Captured (proxy) | HTML grep |
| LCP (Largest Contentful Paint) | ❌ Need Lighthouse | — |
| LCP element identification | ❌ Need Lighthouse | — |
| CLS (Cumulative Layout Shift) | ❌ Need Lighthouse | — |
| INP (Interaction to Next Paint) | ❌ Need CrUX field data | — |
| TBT (Total Blocking Time) | ❌ Need Lighthouse | — |
| Total page weight (after images + JS) | ❌ Need Lighthouse | — |
| Performance / A11y / BP / SEO scores | ❌ Need Lighthouse | — |
| HTTP/2 or HTTP/3 transport | ❌ Curl negotiated HTTP/1.1 — actual browser likely uses HTTP/2 over Vercel | curl |

---

## 5. Inferred performance risk areas (without Lighthouse — to verify when scores arrive)

These are reasonable hypotheses based on source code review, image inventory, and curl-based metrics. Treat as **risk hypotheses pending data**, not findings.

| Risk | Pages affected | Why likely |
|---|---|---|
| **LCP from hero image** | `/`, `/stay/[slug]`, `/booking`, `/about-us`, `/aranyashala`, etc. | Hero is the LCP on most marketing pages; with `priority` + `fetchPriority="high"` the image is well-positioned, but the homepage carousel preloads 3 slides eagerly which competes for bandwidth |
| **CLS from hero text/CTA shifts** | `/` | Hero uses `text-5xl md:text-7xl` H1 with no aspect-ratio reservation around button rendering. Risk of CTA shift after webfont swap (Lato + display font load). Verify. |
| **TBT from React hydration** | All pages | Standard Next.js hydration cost — should be reasonable but room-detail with sticky bar and price widget might add JS |
| **Total Blocking Time on `/booking`** | `/booking` | Renders 6 room cards from Supabase + WhatsApp form. JS likely lean but pre-paint cost may be measurable |
| **OG image too large?** | `/stay/safari-tent` (1280-wide JPG) | OG image is `/home/rooms/safari-tent-1-1280.jpg`. Spec recommends 1200 × 630 for OG. Aspect ratio mismatch may cause crop or pad on social — also worth profiling actual file size |
| **Notable Guests images** | `/` | Three portrait images at 253–541 px width are tiny in bytes (9–45 KB) but **upscaling-blurry on retina**. Not a performance hit; a quality hit. (Cross-ref Step 9 §6.) |
| **Devanagari fonts** | All pages (loaded in layout?) | `public/fonts/noto-sans-devanagari-{400,700}-normal.woff` ship in `/public/` but only `/about-us` shows 8 font URL references vs 4 elsewhere. Verify font scope. |

---

## 6. Curl-based recommendations (independent of Lighthouse)

1. **Investigate the cold-hit TTFB on ISR pages.** 1.5–2 s before first byte from the edge is high. Possible causes: cold serverless function start, Supabase round-trip in the data fetch, region affinity mismatch. Architect should profile via Vercel dashboard.
2. **Remove or correct the OLD-bucket preconnect** (`layout.tsx:70`). 50–250 ms wasted handshake per page load.
3. **Inspect the homepage carousel preload strategy** — 3 hero variants × 2 formats × `priority`/`fetchPriority` may oversubscribe initial bandwidth. Slides 2/3 don't need eager loading.
4. **Investigate the 8 font URL references on `/about-us`** vs 4 elsewhere. Likely a font-loading regression on that specific page.

---

## 7. Step 12 dependency

The Step 12 priority recommendations cannot include data-driven Performance / A11y / BP / SEO score gating (e.g. "scores below 70 = HIGH") until Lighthouse data is provided. The architect should:

- Either schedule a follow-up Lighthouse run AFTER the SEO-T1 fixes land (so the scores reflect post-fix state, which is more useful)
- Or run Lighthouse now to establish a pre-polish baseline for measurable improvement tracking

The audit will surface this as **PERF-001: Run Lighthouse / PageSpeed baseline** as a HIGH priority in Step 12.
