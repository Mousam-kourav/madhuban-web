# 08 — Image Inventory + OG/Favicon Coverage + R2 Leak Hunt

**Date:** 2026-05-18

Audits image and asset usage across the NEW build. Focus areas:
1. R2 bucket leak hunt — confirm whether the KT-flagged OLD-bucket reference is the only one
2. Image source inventory grouped by feature
3. OG image coverage per marketing route
4. Favicon / icon coverage
5. Notable Guests low-res dimension confirmation
6. Placeholder / stock image catalog

---

## 1. R2 bucket leak hunt

Searched the entire repo (production code + scripts + docs + audit folder) for the OLD R2 bucket string `pub-ec3822a2d8d6482db36eb9dadc028ea6` and the NEW R2 bucket string `pub-988c0a6b938742458b908a7a49295f61`.

### OLD bucket references

Total raw hits: **20 occurrences across 9 files.** Categorised:

#### 🚨 Production-shipping reference (1)

| File | Line | Context | Impact |
|---|---:|---|---|
| `src/app/layout.tsx` | **70** | `<link rel="preconnect" href="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev" crossOrigin="anonymous" />` | Browser opens TLS handshake to OLD bucket on every page load. **Bandwidth/latency waste; not a 404 or broken image.** This is the KT-flagged leak (KT cited line 77 but file has shifted — actual line is now 70). |

**No other production references that render to users.** No NEW page references OLD-bucket image URLs at runtime.

#### 🔵 Documentary references in production code (2) — comments only, do not render

| File | Line | Context |
|---|---:|---|
| `src/lib/content/experiences.ts` | 2 | `// Source files are at pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/{folder}/*` |
| `src/app/(marketing)/experiences/page.tsx` | 67 | `// Source on old R2: pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/banner/` |

These are TODO/source-of-truth comments. They do not produce HTML output. Low cleanup priority — but can be removed once the migration banner is uploaded (CLAUDE.md flags one such image as launch-blocking).

#### 🔵 Migration script (1) — runs offline, never ships

| File | Lines | Context |
|---|---|---|
| `scripts/migrate-about-contact-images.ts` | 4, 69, 80, 91, 102, 113 | Migration script that downloads from OLD bucket → uploads to NEW bucket. Intentional use. Will be obsolete once migration is verified complete. |

#### 🔵 Documentation references (multiple) — not shipped to users

- `docs/source/old-site-about-us.md` (8 hits) — reference document for migration team
- `CLAUDE.md` (4 hits) — project README, includes a launch-blocking note about the experiences banner
- `PROGRESS.md` (1 hit) — historical work log
- `audit/00-methodology.md` (1 hit) — this audit's own methodology doc

#### Summary

**One real leak — confirmed identical to KT finding** (just line-number drifted from 77 to 70). **No NEW-page image URLs reference the OLD bucket.** Decision criterion in the user's Step 8 approval was "if you find MORE than just the known OLD R2 bucket leak ... pause and report" — this criterion is NOT met. The two code-file comments are harmless documentation.

### NEW bucket references

Total: **55 occurrences across 49 files** (incl. audit folder and docs). In production source code (excluding tests/scripts/docs):
- Defined at `src/lib/r2.ts:1-3` as the fallback when `NEXT_PUBLIC_R2_BASE` env is unset
- 9 content data files (`src/lib/content/*.ts`) compose R2 URLs via `${R2_BASE}/...`
- 15 marketing pages and 4 booking/admin layouts consume those URLs
- Image hostname is whitelisted in `next.config.ts:9` (NEW bucket only — OLD-bucket URLs would fail `next/image` validation by design)

All production image rendering goes through `R2_BASE`. Healthy.

---

## 2. Image source inventory

### Public folder (`/public/`)

Only 8 static files, all generic Next.js placeholders + project fonts:
- `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg` — **Next.js default scaffolding SVGs. Unused but shipping in bundle.** (LOW cleanup)
- `public/fonts/noto-sans-devanagari-{400,700}-normal.woff` — Devanagari script font (for Hindi rendering?)
- `public/fonts/noto-sans-latin-{400,700}-normal.woff` — Latin font (likely already loaded via `next/font` — verify)

**Finding:** the unused Next.js scaffolding SVGs (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) can be deleted. Low-impact bundle cleanup.

### `<Image>` component usage

68 `<Image>` instances across 15+ marketing pages and 19+ component/layout/admin files. All use `next/image` (no raw `<img>` tags found in marketing pages). Sampled usages all include `sizes` attribute and `alt` text.

### R2 content folders referenced

Major top-level prefixes used by marketing pages (inferred from grep of `${R2_BASE}/...` patterns):

| R2 prefix | Used by | Sample asset |
|---|---|---|
| `home/hero/` | Homepage carousel | `hero-aerial-sunset-{800,1280,1920}.{webp,jpg}` × 3 hero variants |
| `home/rooms/` | Homepage, /stay listing, /booking | `safari-tent-1-1280.jpg`, `mud-house-{1,2}-…`, `pool-side-villa-…`, `glamping-tents-…`, `camping-tent-…` |
| `home/experiences/` | Experience cards | `forest-walks-and-nature-trails-1280.webp`, `bird-watching-and-wilderness-1280.webp`, `recreational-facilities-1280.webp` |
| `home/day-outing/` | `/day-outing` page | `day-outing-hero-image-1280px.webp` (and more) |
| `attractions/` | `/nearby-attractions/[slug]` × 9 | `{slug}/hero.webp` per attraction |
| `dining/` | `/dining` page | `hero-1280.webp` |
| `aranyashala/` | `/aranyashala` page | `hero-1280.webp` |
| `souvenir-shop/` | Souvenir landing + products | `hero-1280.webp` + `products/{slug}/img-{n}/{file}.webp` |
| `testimonials/` | Notable Guests homepage section | `vidya-balan/portrait.webp`, `vijay-raaz/portrait.webp`, `samir-somaiya/portrait.webp` |
| `branding/logo/` | Site-wide | `madhuban-logo-full-md.webp`, `favicon.ico`, `apple-touch-icon.png`, `android-chrome-{192,512}.png` |
| `about/` | `/about-us` page | Multiple (founder, story, eco, hero) |
| `experiences/banner/` | `/experiences` listing | ⚠️ Per CLAUDE.md line 1160, this hero is **not yet uploaded to NEW R2** and is using a temporary fallback (forest-walks card image). **Launch-blocking.** |

### Sampled URL liveness check

13 critical OG/favicon/notable-guests URLs were HEAD-checked. All returned **200 OK**. No OG image 404s detected on the URLs currently referenced.

| URL | Status |
|---|---|
| `/branding/logo/madhuban-logo-full-md.webp` (default OG) | ✅ 200 |
| `/branding/logo/favicon.ico` | ✅ 200 |
| `/branding/logo/apple-touch-icon.png` | ✅ 200 |
| `/home/hero/hero-aerial-sunset-1920.jpg` | ✅ 200 |
| `/aranyashala/hero-1280.webp` | ✅ 200 |
| `/dining/hero-1280.webp` | ✅ 200 |
| `/attractions/bhimbetka-rock-shelters/hero.webp` | ✅ 200 |
| `/attractions/satpura-tiger-reserve/hero.webp` | ✅ 200 |
| `/home/rooms/safari-tent-1-1280.jpg` | ✅ 200 |
| `/testimonials/vidya-balan/portrait.webp` | ✅ 200 (but low-res — §5) |
| `/testimonials/vijay-raaz/portrait.webp` | ✅ 200 (but low-res — §5) |
| `/testimonials/samir-somaiya/portrait.webp` | ✅ 200 (but low-res — §5) |
| `/souvenir-shop/hero-1280.webp` | ✅ 200 |

---

## 3. OG image coverage per NEW marketing route

Source: `metadata.openGraph.images` resolved by `buildMetadata` (`src/lib/seo.ts`). When no page-level `ogImage` is passed, the page uses `DEFAULT_OG_IMAGE = ${R2_BASE}/branding/logo/madhuban-logo-full-md.webp` (which is also the root-layout fallback). When a page passes a custom `ogImage`, that takes precedence.

### Custom (page-specific) OG image — 26 routes

These render a relevant photo when shared on social:

| Route | OG image (relative to NEW R2) |
|---|---|
| `/` | `/home/hero/hero-aerial-sunset-1920.jpg` |
| `/aranyashala` | `/aranyashala/hero-1280.webp` |
| `/booking` | `/home/hero/hero-aerial-sunset-1280.webp` |
| `/day-outing` | `/home/day-outing/day-outing-hero-image-1280px.webp` |
| `/dining` | `/dining/hero-1280.webp` |
| `/blogs/eco-resort-vs-luxury-resort-real-difference` | `/home/rooms/camping-tent-2-1280.webp` ⚠️ thematically off — see §3.1 |
| `/experiences/bird-watching-and-wilderness` | `/home/experiences/bird-watching-and-wilderness-1280.webp` |
| `/experiences/forest-walks-and-nature-trails` | `/home/experiences/forest-walks-and-nature-trails-1280.webp` |
| `/experiences/recreational-facilities` | `/home/experiences/recreational-facilities-1280.webp` |
| `/nearby-attractions` | `/attractions/ratapani-tiger-reserve/hero.webp` ⚠️ uses one specific attraction — consider neutral banner |
| `/nearby-attractions/bhimbetka-rock-shelters` | `/attractions/bhimbetka-rock-shelters/hero.webp` |
| `/nearby-attractions/bhojpur-temple` | `/attractions/bhojpur-temple/hero.webp` |
| `/nearby-attractions/ginnaurgarh-fort` | `/attractions/ginnaurgarh-fort/hero.webp` |
| `/nearby-attractions/kathotiya-rock-paintings` | `/attractions/kathotiya-rock-paintings/hero.webp` |
| `/nearby-attractions/kolar-dam` | `/attractions/kolar-dam/hero.webp` |
| `/nearby-attractions/ratapani-tiger-reserve` | `/attractions/ratapani-tiger-reserve/hero.webp` |
| `/nearby-attractions/salkanpur-devi-temple` | `/attractions/salkanpur-devi-temple/hero.webp` |
| `/nearby-attractions/saru-maru-caves` | `/attractions/saru-maru-caves/hero.webp` |
| `/nearby-attractions/satpura-tiger-reserve` | `/attractions/satpura-tiger-reserve/hero.webp` |
| `/souvenir-shop` | `/souvenir-shop/hero-1280.webp` |
| `/souvenir-shop/budhni-handwoven-bamboo-basket-medium` | `/souvenir-shop/products/.../img-1/1777954400566-bamboo-basket-usage.webp` |
| `/stay/camping-tent` | `/home/rooms/camping-tent-1-1280.jpg` |
| `/stay/glamping-tents` | `/home/rooms/glamping-tents-1-1280.jpg` |
| `/stay/mud-house-1` | `/home/rooms/mud-house-1-1-1280.jpg` |
| `/stay/mud-house-2` | `/home/rooms/mud-house-2-1-1280.jpg` |
| `/stay/pool-side-villa` | `/home/rooms/pool-side-villa-1-1280.jpg` |
| `/stay/safari-tent` | `/home/rooms/safari-tent-1-1280.jpg` |

### Falls back to logo OG — 14 routes ⚠️ MEDIUM

These pages use the default `/branding/logo/madhuban-logo-full-md.webp`. Social shares render the brand logo, not a photographic preview. For policy pages this is acceptable; for marketing pages it's a missed engagement opportunity.

| Route | Acceptable? |
|---|---|
| `/about-us` | ⚠️ Should have unique OG — about-us is a top-20 traffic page (21 clicks, 3,362 impr) |
| `/blogs` | ⚠️ Listing page — should have curated banner |
| `/contact-us` | ⚠️ Marketing page — minor issue |
| `/corporate-offsite` | ⚠️ NEW-only marketing page; needs unique OG |
| `/enquire` | ⚠️ Marketing landing page; needs unique OG |
| `/experiences` | ⚠️ Listing page (764 impr) — should have unique OG |
| `/gallery` | ⚠️ Should have unique OG (1,231 impr) |
| `/packages/2-day-digital-detox` | ⚠️ Marketing landing; needs unique OG |
| `/stay` | ⚠️ Listing page (3,175 impr) — high-traffic; should have unique OG |
| `/thank-you` | ✅ Acceptable (post-conversion) |
| `/privacy-policy` | ✅ Acceptable (legal/policy) |
| `/terms-and-condition` | ✅ Acceptable |
| `/cookies-and-consent-policy` | ✅ Acceptable |
| `/disclaimer` | ✅ Acceptable |

### 3.1 OG image semantic mismatch — 1 route

`/blogs/eco-resort-vs-luxury-resort-real-difference` references `/home/rooms/camping-tent-2-1280.webp` as its OG. A camping-tent image for an essay titled "Eco Resort vs Luxury Resort: The Real Difference" is thematically off — the social-share card will look unrelated to the headline. Worth re-shooting/re-selecting before that post's URL is heavily promoted.

---

## 4. The "duplicated brand suffix" bug — root cause identified

Step 4 flagged that every NEW meta title is 75–114 chars with the brand appearing 2–3×. Source code review confirms the root cause:

**Two layers compose the title:**

1. `src/lib/seo.ts:52` — `buildMetadata` returns `fullTitle = titleOverride ?? ${title} — ${SITE_NAME}` (i.e. always appends `" — Madhuban Eco Retreat"` once unless `titleOverride` is used).
2. `src/app/layout.tsx:24–27` — root layout sets `title: { default: ..., template: "%s — Madhuban Eco Retreat" }`. The `template` is applied to *any* page-level title that is not wrapped in `{ absolute: ... }`.

Result: every page's title is composed as:
```
[ titleOverride || `${title} — Madhuban Eco Retreat` ] → Next.js applies template → `${that} — Madhuban Eco Retreat`
```

**Concrete example for `/stay/mud-house-1`:**
- buildMetadata returns `title: "Mud House 1 | Madhuban Eco Retreat — Madhuban Eco Retreat"` (page declares title="Mud House 1 | Madhuban Eco Retreat" — already containing brand)
- Next.js template wraps it → `"Mud House 1 | Madhuban Eco Retreat — Madhuban Eco Retreat — Madhuban Eco Retreat"`
- Length: 80 chars. Brand appears **3×**.

**One-line fix** (this is for the architect, not the auditor): wrap the title in `{ absolute: fullTitle }` inside `buildMetadata`, or remove the `template` from root layout. Either change fixes all 36 pages simultaneously. This is THE highest-leverage SEO-T1 fix in the audit.

---

## 5. Favicon / icon coverage

Configured in `src/app/layout.tsx:30-38`. All icons load from R2.

| Icon | URL | Status |
|---|---|---|
| Default favicon | `/branding/logo/favicon.ico` | ✅ 200 |
| Android Chrome 192 | `/branding/logo/android-chrome-192x192.png` | (not directly tested but pattern consistent) |
| Android Chrome 512 | `/branding/logo/android-chrome-512x512.png` | (not directly tested) |
| Apple touch icon | `/branding/logo/apple-touch-icon.png` | ✅ 200 |
| Shortcut | `/branding/logo/favicon.ico` | ✅ 200 |

**Theme color** set to `#2D3B2D` (forest green) via `viewport.themeColor` in layout.tsx:19.

**Missing icons:**
- No `safari-pinned-tab.svg` (Safari pinned-tab icon — recommended but optional)
- No `mstile-150x150.png` (Microsoft tile — not critical)
- No `manifest.webmanifest` (PWA manifest) — Lighthouse will likely flag this if PWA scoring is applied

---

## 6. Notable Guests low-res images — CONFIRMED

Dimensions verified by downloading the WebP files and inspecting their RIFF/VP8 headers via `file`:

| Guest | URL | Dimensions | File size | Display size | Verdict |
|---|---|---|---:|---|---|
| Vidya Balan | `/testimonials/vidya-balan/portrait.webp` | **309 × 412** | 45,574 B (45 KB) | Card aspect 3:4, ~350–450 px wide on md+ | 🚨 Upscaled / blurry on retina |
| Vijay Raaz | `/testimonials/vijay-raaz/portrait.webp` | **253 × 338** | **9,094 B (9 KB)** | same | 🚨 **Worst** — also visibly lossy at this byte size |
| Samir Somaiya | `/testimonials/samir-somaiya/portrait.webp` | **541 × 722** | 13,000 B (13 KB) | same | 🚨 Marginally better but still upscaled on 2× displays |

Section component: `src/components/marketing/homepage/notable-guests.tsx:42-48`.
The cards render at `aspect-[3/4]` inside `md:grid-cols-3` with `sizes="(min-width: 768px) 33vw, 100vw"`. At 1920 viewport that's ~640 px per card → 1280 px at 2× retina. Source images at 253–541 px width are 2–5× too small.

**KT-flagged correctly.** Replacement target: minimum 800 × 1067 (3:4), ideally 1200 × 1600 for retina-friendly rendering. Three replacement images needed.

---

## 7. Placeholder / stock image catalog

Grepped `src/` for: `unsplash`, `placeholder.com`, `via.placeholder`, `lorem`, `placehold.it`, `placeholdit` — **case-insensitive, no matches**. The codebase does not contain any third-party placeholder/stock URLs.

The Next.js default `public/*.svg` files (file/globe/next/vercel/window) ARE present but unused.

---

## 8. Image-specific findings ranked for Step 12

### 🚨 HIGH — fix before launch

1. **Replace 3 Notable Guests low-res portraits** (Vidya Balan 309×412, Vijay Raaz 253×338, Samir Somaiya 541×722). These render on the homepage above the fold-line on mobile and are the most visually scrutinised images on the site. Replacement: ≥800 × 1067 at 2× retina-friendly resolution. (Already flagged in KT; this audit confirms with exact byte sizes.)
2. **Upload the `experiences/banner/hero-{800,1280}.{webp,jpg}` to NEW R2** — currently using a fallback per CLAUDE.md line 1160. Marked launch-blocking by the project itself.
3. **Add unique OG images to 8 high-traffic marketing pages** that currently fall back to the logo: `/about-us` (3,362 impr), `/stay` (3,175 impr), `/gallery` (1,231 impr), `/experiences` (764 impr), `/blogs`, `/contact-us`, `/corporate-offsite`, `/enquire`. Social-share previews currently display brand logo only, missing engagement opportunity.
4. **Fix the OLD-bucket preconnect leak** in `src/app/layout.tsx:70` — change URL to NEW bucket or remove the preconnect entirely. Wasted TLS handshake on every page load.

### ⚠️ MEDIUM

5. **Replace `/blogs/eco-resort-vs-luxury-resort-real-difference` OG image.** Currently shows a camping-tent image, unrelated to the post topic.
6. **Curate a neutral banner for `/nearby-attractions` listing** OG — currently uses `ratapani-tiger-reserve/hero.webp`, which over-represents one attraction.
7. **Add `manifest.webmanifest`** for PWA-style discoverability (Lighthouse may flag).
8. **Remove documentary OLD-bucket comments** from `src/lib/content/experiences.ts:2` and `src/app/(marketing)/experiences/page.tsx:67` once the migration is complete.

### 🔵 LOW

9. **Delete unused Next.js scaffolding SVGs** in `public/`: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`.
10. **Add `safari-pinned-tab.svg`** icon for Safari pinned-tab support.
11. **Verify Devanagari fonts in `public/fonts/` are actually used** — if not, drop them to reduce bundle.

---

## 9. Cross-references to other reports

- **buildMetadata bug source** (§4) — also flagged in `04-seo-keyword-mapping.md` executive findings (CTR loss) and will appear as `SEO-T1-001` in Step 12.
- **Missing OG images** (§3) — feed into Step 11 gap analysis (visual-engagement gaps).
- **OLD-bucket preconnect** (§1) — performance impact will appear in Step 10 (Lighthouse may not score it specifically but it's a Network tab visible leak).
- **Notable Guests low-res** (§6) — visual-polish item with social-proof importance, ranks in Step 12 SEO-T2 or VISUAL bucket.
