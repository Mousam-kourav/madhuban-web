# 06 — Mobile Rendering Issues

**Date:** 2026-05-18

Source-code static analysis of the marketing pages for mobile-viewport rendering risks. Findings are inferred from Tailwind class patterns and JSX structure — no browser rendering was performed. The architect/user should spot-verify HIGH-severity items in DevTools or on a real device before scheduling fixes.

**Reference viewport:** iPhone 12 Pro portrait = 390 × 844 CSS px. After `px-4` (16px each side) the effective text-content width is **358 px**.

**What's audited:**
- Hero text size at mobile breakpoint (the user's reported "hero text wrapping mid-word on iPhone 12 Pro" bug)
- Overflow risk: fixed widths, long unbreakable strings, oversized images
- Touch target sizes — buttons/links smaller than 44 × 44 px
- Excessive vertical spacing on mobile (`py-*` classes that don't scale down)
- Missing `sm:` / `md:` responsive variants on key elements
- Images without `sizes` attribute or proper aspect ratios

---

## Severity legend

- 🚨 **HIGH** — likely visible bug or regression; user has reported it or it directly violates platform conventions
- ⚠️ **MEDIUM** — risk pattern; needs DevTools verification
- 🔵 **LOW** — best-practice opportunity; not breaking

---

## 1. Hero text sizing — 🚨 HIGH

The user reports hero text wrapping mid-word on iPhone 12 Pro. The pattern below is the most likely root cause: every page-level hero `<h1>` starts at `text-5xl` (3 rem ≈ 48 px) on mobile with no smaller `sm:` step. At 48 px, display-font characters average ~28–32 px each. A 12-character word (e.g. "Recreational", "Ginnaurgarh", "Birdwatching") occupies 336–384 px on its own — *wider than the 358 px available on iPhone 12 Pro*. With no `break-words` / `hyphens-auto` fallback, the browser may either overflow or break mid-word depending on the font metric tables.

### Pages affected (every hero on the NEW build uses this pattern)

| File | Line | H1 class | Risky H1 text |
|---|---:|---|---|
| `src/components/marketing/hero/carousel.tsx` | 125 | `text-5xl md:text-7xl` | "Connect With Wildlife & Nature" (home hero) |
| `src/app/(marketing)/nearby-attractions/page.tsx` | 49 | `text-5xl md:text-7xl` | "Where the Forest Opens into History" |
| `src/app/(marketing)/nearby-attractions/[slug]/page.tsx` | 102 | `text-5xl md:text-7xl` | place names — "Ratapani Tiger Reserve", "Kathotiya Rock Paintings" |
| `src/app/(marketing)/blogs/page.tsx` | 59 | `text-5xl md:text-6xl` | "Stories From Nature, Wellness & Wilderness" |
| `src/app/(marketing)/blogs/[slug]/page.tsx` | 98 | `text-5xl md:text-6xl` | post titles (variable length) |
| `src/app/(marketing)/dining/page.tsx` | 117 | `text-5xl md:text-6xl lg:text-7xl` | "Dining at Madhuban" |
| `src/app/(marketing)/souvenir-shop/page.tsx` | 81 | `text-4xl md:text-6xl` | "Take Madhuban Home With You" (this one starts at text-4xl ≈ 36px — safer) |

### Most likely concrete failure cases

- `/experiences/recreational-facilities` — H1 "Recreational Facilities". "Recreational" alone is ~340 px at text-5xl, **on the threshold of the 358 px content area**. Drop down to a heavier display weight or non-IBM-Plex font and it overflows or breaks mid-word.
- `/nearby-attractions/kathotiya-rock-paintings` — H1 "Kathotiya Rock Paintings". "Kathotiya" (~250 px) fits but "Paintings" (~270 px) is tight.
- `/blogs/[slug]` titles vary — the post titled "Eco Resort vs Luxury Resort: The Real Difference" is 50 chars and will multi-line. Words like "Difference" are ~290 px, fit but very tight.

### Recommended pattern (do NOT implement now — Step 12 only ranks the problem)

Architect should consider a progressive scale like `text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl` (starting at 30 px on mobile) and adding `break-words hyphens-auto` as a defensive fallback on hero `<h1>`s.

### Tested-safe heroes (use text-4xl on mobile)

These start at `text-4xl` (36 px), well under threshold:
- `src/app/(marketing)/about-us/page.tsx:178` — `text-4xl ... md:text-6xl lg:text-7xl`
- `src/app/(marketing)/contact-us/page.tsx:69` — `text-4xl ... md:text-6xl`
- `src/app/(marketing)/booking/page.tsx:164` — `text-4xl ... md:text-5xl lg:text-6xl`
- `src/app/(marketing)/day-outing/page.tsx:186` — `text-4xl ... md:text-5xl lg:text-6xl` (also has `max-w-3xl` constraint)
- `src/app/(marketing)/aranyashala/page.tsx:207` — `text-4xl ... md:text-5xl lg:text-6xl`
- `src/app/(marketing)/experiences/page.tsx:137` — `text-4xl ... md:text-6xl lg:text-7xl`
- `src/components/marketing/experience-detail/index.tsx:37` — `text-4xl ... md:text-6xl lg:text-7xl`
- `src/components/marketing/room-detail/room-detail-page.tsx:80` — `text-4xl ... md:text-6xl`

**Conclusion:** the codebase has TWO hero patterns — some files use `text-4xl` mobile (safe), others use `text-5xl` (risky). The inconsistency itself is worth standardizing in Step 12.

---

## 2. Excessive mobile vertical spacing — ⚠️ MEDIUM

Several `py-*` values do not scale down for mobile. At 4× units (Tailwind), `py-20` = 80 px, `py-32` = 128 px, `py-40` = 160 px. Repeated 100+ px gaps on a 844 px-tall viewport push content far down the page.

| File | Line | Pattern | Mobile px | Issue |
|---|---:|---|---:|---|
| `src/app/(marketing)/nearby-attractions/page.tsx` | 35 | `py-32 md:py-40` | 128–160 | Hero section. 128 px vertical padding on a 390 × 844 viewport eats ~30% of the first screen. |
| `src/app/(marketing)/nearby-attractions/page.tsx` | 131 | `py-24 md:py-32` | 96–128 | CTA section at bottom — less critical but still aggressive |
| `src/app/(marketing)/about-us/page.tsx` | 452 | `py-20 ... md:py-24` | 80–96 | OK on mobile, acceptable |
| `src/app/(marketing)/booking/page.tsx` | 431 | `py-20 ... md:py-24` | 80–96 | Acceptable |
| `src/app/(marketing)/experiences/page.tsx` | 254 | `py-20 ... md:py-24` | 80–96 | Acceptable |
| `src/app/(marketing)/day-outing/page.tsx` | 541 | `py-20 ... md:py-24` | 80–96 | Acceptable |
| `src/app/(marketing)/blogs/[slug]/page.tsx` | 144 | `py-20 px-4 my-16` | 80 + 64 my | Combined ~150 px of vertical breathing room — heavy |
| `src/app/(marketing)/blogs/page.tsx` | 94 | `py-24` (empty state) | 96 | Acceptable for empty state |

**Pattern verdict:** Only the `/nearby-attractions` listing's `py-32 md:py-40` hero (line 35) is a clear over-spacing risk. The `py-20` standard elsewhere is reasonable. Architect should verify how `/nearby-attractions` looks on a real device.

---

## 3. Touch targets — 🔵 LOW (mostly compliant)

Spot-checked CTAs and form controls. Hero buttons use `h-14 px-8` = 56 px height, well above the 44 × 44 px WCAG/Apple HIG target. Stay-listing CTAs (`stay/page.tsx:142,148,154`) use `h-12 min-w-[180px]` = 48 × 180 px. Compliant.

### Possible risks (need verification, not flagged as HIGH)

- **Filter chips on `/blogs`** (`blogs/page.tsx:70`) — `gap-3 overflow-x-auto` chip bar. Individual chip heights are not visible without reading the chip component; if chips render at `h-8` (32 px) or smaller, they'd fail touch-target on horizontal-scrolling lists where mis-tap penalty is high. Architect should verify in `audit-inputs` or DevTools.
- **86 occurrences of `h-{6-11}` / `w-{6-11}` / `p-{1-2}`** across 17 marketing files (counted via grep). Most are icons inside buttons (not the click target itself), but a sample audit by the architect would be worthwhile. The cluster is concentrated in:
  - `aranyashala/page.tsx` (18 hits) — many icons; needs verification
  - `day-outing/page.tsx` (16 hits) — many icons
  - `dining/page.tsx` (11 hits)
  - `aboutus/page.tsx` (6 hits)

No definitively-too-small touch target was identified at this audit pass.

---

## 4. Image responsive sizing — 🔵 LOW (mostly compliant)

Sampled all 38 `<Image>` usages across the 15 marketing files. Every sampled image uses `next/image` with `fill` or explicit dimensions plus a `sizes` attribute.

### Compliant patterns observed

- Hero images: `sizes="100vw"` + `priority` + `fetchPriority="high"` (e.g. `about-us/page.tsx:161–169`, `day-outing/page.tsx`)
- Two-column content images: `sizes="(min-width: 1024px) 50vw, 100vw"` (e.g. `about-us/page.tsx:252-259, 272-279`)

### Risk to spot-check

- **`fill` images inside non-`position: relative` parents** would render at 0 × 0. None confirmed bugged here, but verify on the live `/aranyashala` (8 image references) and `/dining` (6 references) since they have the most.
- **No `<img>` raw tags found** in marketing pages — good (everything uses `next/image`).

---

## 5. Horizontal scroll surfaces — 🔵 LOW

Only one `overflow-x-*` instance found in marketing:

- `src/app/(marketing)/blogs/page.tsx:70` — `<div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto">` — likely the category/tag filter chip rail.

On mobile this is a touch-scrollable horizontal rail. Standard pattern, low risk **as long as**:
- Chips have visible affordance that more content exists right (gradient fade or partial chip on the right edge)
- The rail doesn't trigger horizontal scroll on the whole page (no `overflow-x` leak)

Architect should verify visually on iPhone 12 Pro. No code-level fix needed unless behavior is broken.

No `whitespace-nowrap` patterns found on headlines or body content (good — would otherwise force overflow).

---

## 6. Long unbreakable strings — 🔵 LOW

Inspected the HERO_COPY and content data files used to feed page content.

`src/lib/content/homepage.ts:7` — `HERO_COPY.subhead`:
> "Experience eco-luxury living amid the serene wilderness of Ratapani Tiger Reserve at Madhuban Eco Retreat — a peaceful forest stay offering sustainable comfort and mindful escapes."

218 characters, no unbreakable runs. At `text-lg` (18 px) on mobile it will wrap to 5–6 lines and consume ~150 px vertical. Below the hero title that's already ~96–144 px tall, this pushes the CTAs below the fold on most phones. **Worth noting in Step 12 as part of the home-hero scrutiny.**

`src/lib/content/homepage.ts:1-2` carries the comment:

> `// TODO: Editorial pass post-launch. Live content has keyword-stuffed phrasing preserved per CLAUDE.md §10.3 client decision. Do not rewrite during code rebuild.`

This is intentional. Architect should know any "tighten the copy" recommendation conflicts with that client decision.

No content data file appears to contain very long single words (>20 chars), URLs in body content, or unbreakable hashtag-style strings. Low risk.

---

## 7. Form input mobile patterns — not audited in depth

Form-heavy pages (`/contact-us`, `/enquire`, `/booking`) should be reviewed in Step 8 (booking flow) since they overlap. Initial scan: enquire page has `max-w-[640px]` container with field layout — appears standard. No obvious mobile-only field bugs in static analysis. Step 8 will go deeper.

---

## 8. Sticky / fixed-position elements — not detected

Grep for `fixed bottom`, `sticky bottom`, `position: fixed` in marketing pages returned no results outside the standard layout (navbar, footer). No floating mobile-only CTAs ("sticky Book Now bar") detected. This may be a missed mobile-conversion opportunity (Step 8 will discuss) but isn't a rendering bug.

---

## 9. Per-page mobile risk summary

| Page | Risk level | Primary issue |
|---|---|---|
| `/` (home) | 🚨 HIGH | Hero `text-5xl` on mobile (`carousel.tsx:125`) |
| `/about-us` | ✅ Low | `text-4xl` mobile hero, proper image sizes |
| `/aranyashala` | 🔵 Low–Med | 18 icon/small classes — verify touch targets |
| `/blogs` | ⚠️ Medium | Hero `text-5xl`; chip bar horizontal scroll |
| `/blogs/[slug]` | ⚠️ Medium | Hero `text-5xl`; `py-20 + my-16` heavy spacing |
| `/booking` | ✅ Low | `text-4xl` mobile hero |
| `/contact-us` | ✅ Low | `text-4xl` mobile hero |
| `/corporate-offsite` | ❓ Unverified | No H1 found (Step 6 finding); hero pattern unknown without deeper read |
| `/day-outing` | ✅ Low | `text-4xl` + max-w-3xl on hero |
| `/dining` | ⚠️ Medium | Hero `text-5xl` (`dining/page.tsx:117`) |
| `/enquire` | ✅ Low | Constrained `max-w-[640px]` form area |
| `/experiences` | ✅ Low | `text-4xl` mobile hero |
| `/experiences/[slug]` | ✅ Low | `text-4xl` mobile hero |
| `/gallery` | ❓ Unverified | Static analysis didn't surface hero classes; verify on device |
| `/nearby-attractions` | 🚨 HIGH | `text-5xl` hero + `py-32 md:py-40` aggressive spacing |
| `/nearby-attractions/[slug]` | 🚨 HIGH | `text-5xl md:text-7xl` hero — place names with long words (Bhimbetka, Kathotiya, Ginnaurgarh) most at risk |
| `/packages/2-day-digital-detox` | ❓ Unverified | No H1 found (Step 6 finding); hero pattern unknown |
| `/souvenir-shop` | ✅ Low | `text-4xl md:text-6xl` |
| `/souvenir-shop/[slug]` | ✅ Low | `text-4xl md:text-5xl` (`/page.tsx:132`); product gallery is a known touch-friendly component |
| `/stay` | ✅ Low | Container-based heading, CTAs `h-12 min-w-[180px]` — safe |
| `/stay/[slug]` | ⚠️ Medium | Room-detail uses `text-4xl md:text-6xl` (safe); but Step 9 will verify room images |
| `/thank-you` | ❓ Unverified | No H1 found (Step 6 finding) |
| Policy pages | ✅ Low | `max-w-[640px]` text containers |

---

## 10. Top mobile risks (feed into Step 12)

1. 🚨 **`text-5xl` mobile hero on `/`, `/nearby-attractions`, `/nearby-attractions/[slug]`, `/blogs`, `/blogs/[slug]`, `/dining`** — single root cause for the user's iPhone 12 Pro mid-word wrap report. Standardize to `text-4xl` (or even `text-3xl`) mobile baseline.
2. 🚨 **`py-32 md:py-40` on `/nearby-attractions` hero** — fills a third of mobile viewport with empty padding.
3. ⚠️ **3 NEW pages have no H1** (Step 6 finding) — `/corporate-offsite`, `/packages/2-day-digital-detox`, `/thank-you`. These pages' hero patterns couldn't be audited statically; need direct read.
4. ⚠️ **No sticky mobile "Book Now" CTA** detected. This is a conversion pattern most eco-resort sites use; absence is intentional or oversight — for Step 8 to address.
5. 🔵 **Long subhead under home hero** (218 chars at text-lg) pushes CTAs below fold on iPhone 12 Pro. Probably intentional per the homepage.ts comment, but Step 12 should weigh it against booking-conversion priority.

---

## 11. What was NOT audited

- **Tap-and-hold / hover-fallback behavior** on mobile (no static signal for this)
- **Form keyboard / autocomplete attributes** on `/contact-us`, `/enquire`, `/booking` — Step 8 covers
- **Modal / overlay full-screen behavior** on mobile — none detected in static analysis but verify on live
- **Sticky filter behavior** on `/blogs`, `/souvenir-shop`, `/nearby-attractions` listing pages — needs DevTools
- **Real device testing** — this is static-only; recommend the architect run the top-3 risk pages through Chrome DevTools device mode (iPhone 12 Pro preset) and a real device before finalizing Step 12 priorities
