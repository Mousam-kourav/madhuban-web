# 11 — Priority Recommendations

**Date:** 2026-05-18

Ranked work plan for the polish arc. Built from Steps 3–10 plus the two user-locked decisions:

- **LOCKED 1:** Online checkout (Path B) is being promoted to the primary booking path.
- **LOCKED 2:** All 8 OLD blog URLs that 404 on NEW will be migrated to NEW Supabase, not 301'd.

Priority order is FIXED — work flows top-down through the categories:

1. **SEO-T1-BleedStop** — fix before domain cutover / launch
2. **SEO-T2-Optimization** — improves rankings, not launch-blocking
3. **MOBILE** — touch targets, hero sizing, viewport bugs
4. **BOOKING** — Path B promotion + friction reduction (in scope per LOCKED 1)
5. **VISUAL** — everything else

Complexity sizing:
- **S** = under 1 day
- **M** = 1–3 days (content edits count toward complexity — see CLAUDE.md §10.3 about keyword-preserved phrasing)
- **L** = 3+ days

These are problem statements, not implementation kickoffs. The architect will translate each into a phased work plan.

---

## SEO-T1 · Bleed Stop (HARD GATE for domain cutover)

### SEO-T1-001 · Fix duplicated brand suffix in meta titles

- **Category:** SEO-T1
- **Severity:** HIGH
- **Files affected:** `src/lib/seo.ts:52`, `src/app/layout.tsx:24–27`
- **Complexity:** S
- **Rationale:** Every NEW meta title is 75–114 characters because `buildMetadata` appends `" — Madhuban Eco Retreat"` and the root layout's `title.template` then appends it again. Some pages have the brand 3×. Google truncates titles at ~55–60 chars — current SERP listings are being cut mid-brand on the highest-traffic pages. One-line architectural fix resolves all 36 pages simultaneously. **Highest leverage SEO item in the entire audit.**
- **Dependencies:** none

### SEO-T1-002 · Migrate 8 OLD blog posts to NEW Supabase

- **Category:** SEO-T1
- **Severity:** HIGH
- **Files affected:** Supabase `posts` table (8 new rows), R2 image uploads as needed
- **Complexity:** L
- **Rationale:** All 8 OLD blog URLs return 404 on NEW. Combined GSC stats: 17,255 impressions / 88 clicks / quarter. The trekking guide alone is 9,989 impressions. Migrating preserves authoritative URLs and link equity. Per LOCKED DECISION 2, migration is the chosen approach (not 301). Slugs to preserve verbatim: `bhimbetika-india-s-ancient-rock-art-wonder-the-complete-guide-2026`, `birdwatching-central-india-ratapani-guide`, `day-outing-near-bhopal-perfect-nature-escape`, `featured-hindustan-times-bhopal-wildlife-secret`, `ginnourgarh-fort-forgotten-gond-citadel-ratapani`, `kathotiya-trek-bhopal-hidden-jungle-adventure`, `ratapani-tiger-reserve-slow-tourism-near-bhopal`, `trekking-near-bhopal-15-best-treks-for-nature-adventure`.
- **Dependencies:** none (content migration runs in parallel with code work)

### SEO-T1-003 · Add 8 missing 301 redirects to `next.config.ts`

- **Category:** SEO-T1
- **Severity:** HIGH
- **Files affected:** `next.config.ts`
- **Complexity:** S
- **Rationale:** Eight legacy URLs are indexed by Google and have GSC traffic but currently 404 on NEW. Estimated impressions at risk: ~3,478/quarter. Specifically: `/hotels/madhuban-eco-retreat`, `/hotels/madhuban-eco-retreat/`, `/blogs/madhuban-eco-retreat-complete-guide` (orphan — see SEO-T1-004), `/about/story`, `/home`, `/contact`, `/contact/`, `/about/eco-philosophy`. Architect picks final destinations (suggested in `10-gap-analysis.md` §B).
- **Dependencies:** none

### SEO-T1-004 · Decide orphan blog `/blogs/madhuban-eco-retreat-complete-guide` strategy

- **Category:** SEO-T1
- **Severity:** HIGH
- **Files affected:** `next.config.ts` (if 301) or Supabase `posts` (if new content)
- **Complexity:** S (for 301) or L (for new content)
- **Rationale:** This URL is indexed by Google with 793 impressions / 2 clicks but the OLD site serves a soft-404 ("Oops! We couldn't load this blog"). Content cannot be migrated because OLD doesn't have it. Option A: 301 → `/about-us` (instant). Option B: commission a new "Complete Guide" piece at the slug. Decision belongs to the user — flagged for action in Step 8 approval.
- **Dependencies:** user investigation in progress

### SEO-T1-005 · Add H1 to 3 NEW pages currently missing one

- **Category:** SEO-T1
- **Severity:** HIGH
- **Files affected:** `src/app/(marketing)/corporate-offsite/page.tsx`, `src/app/(marketing)/packages/2-day-digital-detox/page.tsx`, `src/app/(marketing)/thank-you/page.tsx`
- **Complexity:** S per page (M for the three together if copywriting needed)
- **Rationale:** These three pages have ZERO `<h1>` element in rendered HTML (confirmed by curl). On-page SEO requires exactly one H1 per document. None of these are high-traffic (all NEW-only) but they fail basic crawler heuristics and accessibility. Quality hygiene before launch.
- **Dependencies:** none

### SEO-T1-006 · Fix H1→H3 skip in shared "Explore" component

- **Category:** SEO-T1
- **Severity:** MEDIUM
- **Files affected:** Whichever shared component renders the "Explore" / related-links block — currently affects `/aranyashala`, `/blogs`, `/enquire`, `/gallery`, `/souvenir-shop/[slug]`. Architect locates the source.
- **Complexity:** S (single component fix propagates to all five pages)
- **Rationale:** Five NEW pages skip from H1 directly to H3, missing H2. The repeated "Explore" pattern signals one shared component is the source. Hurts accessibility and crawler hierarchy interpretation. Single source fix.
- **Dependencies:** none

### SEO-T1-007 · Fix OLD-bucket preconnect leak in root layout

- **Category:** SEO-T1
- **Severity:** MEDIUM
- **Files affected:** `src/app/layout.tsx:70`
- **Complexity:** S
- **Rationale:** `<link rel="preconnect" href="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev">` opens a TLS handshake to the OLD R2 bucket on every page load. NEW pages render NOTHING from OLD bucket — the preconnect is dead weight. Estimated cost: 50–250 ms of critical-path bandwidth per page load. Change to NEW bucket URL or remove. Affects all 41 marketing pages.
- **Dependencies:** none

### SEO-T1-008 · Upload `experiences/banner/hero-{800,1280}.{webp,jpg}` to NEW R2

- **Category:** SEO-T1
- **Severity:** HIGH
- **Files affected:** R2 upload + verify `src/app/(marketing)/experiences/page.tsx` references resolve correctly
- **Complexity:** S
- **Rationale:** CLAUDE.md line 1160 explicitly marks this as launch-blocking. The `/experiences` index page uses a temporary fallback (forest-walks card image) until the proper banner is uploaded. Source images exist on OLD R2 at `pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/banner/`.
- **Dependencies:** none

### SEO-T1-009 · Verify NEW emits a complete `sitemap.xml`

- **Category:** SEO-T1
- **Severity:** HIGH
- **Files affected:** Sitemap generator (likely `src/app/sitemap.ts` or similar — architect locates)
- **Complexity:** S (verify) or M (write if missing)
- **Rationale:** `https://madhuban-web.vercel.app/robots.txt` exists, but the sitemap.xml endpoint was not verified during audit. Must cover all marketing routes (incl. NEW-only pages: `/aranyashala`, `/corporate-offsite`, `/enquire`, `/packages/2-day-digital-detox`, `/souvenir-shop`, `/thank-you`), all `/blogs/*` after migration (SEO-T1-002), all `/stay/*` and `/nearby-attractions/*` slugs, all `/souvenir-shop/*` products.
- **Dependencies:** SEO-T1-002 (so migrated blog slugs are included)

### SEO-T1-010 · Run Lighthouse / PageSpeed baseline

- **Category:** SEO-T1
- **Severity:** HIGH
- **Files affected:** none (data gathering)
- **Complexity:** S
- **Rationale:** Step 10 of the audit was blocked by PSI API quota (HTTP 429, `quota_limit_value: "0"`). Performance / Accessibility / Best Practices / SEO scores need to be captured to enforce the "any score below 70 = HIGH priority" rule. Provide a Google API key or run Lighthouse manually for the 5 URLs listed in `09-performance-baseline.md` §2. Without this, downstream perf-related recommendations cannot be score-gated.
- **Dependencies:** none

---

## SEO-T2 · Optimization (improves rankings, not launch-blocking)

### SEO-T2-001 · Rewrite home H1 to recover brand + keyword

- **Category:** SEO-T2
- **Severity:** HIGH
- **Files affected:** `src/lib/content/homepage.ts` (`HERO_COPY.h1`)
- **Complexity:** M (content decision, not just a string edit — must align with positioning)
- **Rationale:** OLD H1 "Madhuban Eco Retreat: Eco-Luxury Forest Resort" → NEW "Connect With Wildlife & Nature". Lost both brand and primary keyword on the #1 traffic page (36,090 impressions / 2,730 clicks). NEW H1 is poetic but keyword-empty. Per CLAUDE.md §10.3 client decision, content is intentionally keyword-stuffed — rewrite must preserve that constraint.
- **Dependencies:** SEO-T1-001 (so SERPs reflect the H1 change without title-truncation noise)

### SEO-T2-002 · Rewrite about-us H1

- **Category:** SEO-T2
- **Severity:** HIGH
- **Files affected:** `src/app/(marketing)/about-us/page.tsx`
- **Complexity:** S
- **Rationale:** NEW H1 "Where Sustainability Meets Hospitality" lacks brand. Top-5 traffic page (3,362 impressions). Aim for brand + positioning.
- **Dependencies:** SEO-T1-001

### SEO-T2-003 · Rewrite stay listing H1

- **Category:** SEO-T2
- **Severity:** HIGH
- **Files affected:** `src/app/(marketing)/stay/page.tsx`
- **Complexity:** S
- **Rationale:** NEW H1 "Stay With Us" is keyword-empty on a 3,175-impression page. OLD targeted "Eco-Luxury Stays in the Heart of Ratapani". Recover stay/ratapani/eco keywords.
- **Dependencies:** SEO-T1-001

### SEO-T2-004 · Rewrite nearby-attractions listing H1

- **Category:** SEO-T2
- **Severity:** MEDIUM
- **Files affected:** `src/app/(marketing)/nearby-attractions/page.tsx`
- **Complexity:** S
- **Rationale:** NEW H1 "Where the Forest Opens into History" is poetic — sheds "places to visit Bhopal" keyword stem (1,361 impressions on "best hiking trails nearby" alone). 1,014 page impressions.
- **Dependencies:** SEO-T1-001

### SEO-T2-005 · Rewrite experiences listing H1

- **Category:** SEO-T2
- **Severity:** MEDIUM
- **Files affected:** `src/app/(marketing)/experiences/page.tsx`
- **Complexity:** S
- **Rationale:** NEW H1 "Experience Life at Nature's Rhythm" is poetic. 764 page impressions. Recover "nature experiences ratapani", "things to do in ratapani" keywords.
- **Dependencies:** SEO-T1-001

### SEO-T2-006 · Rewrite contact-us H1

- **Category:** SEO-T2
- **Severity:** LOW
- **Files affected:** `src/app/(marketing)/contact-us/page.tsx`
- **Complexity:** S
- **Rationale:** NEW H1 "Get in Touch" is generic. 557 page impressions. Smaller impact, easy rewrite for brand context.
- **Dependencies:** SEO-T1-001

### SEO-T2-007 · Add unique OG images to 8 high-traffic marketing pages

- **Category:** SEO-T2
- **Severity:** MEDIUM
- **Files affected:** Metadata declarations in `/about-us`, `/stay` (listing), `/gallery`, `/experiences` (listing), `/blogs` (listing), `/contact-us`, `/corporate-offsite`, `/enquire` — currently using `branding/logo/madhuban-logo-full-md.webp` fallback
- **Complexity:** M (1 image per page = 8 images to curate/upload to R2 + 8 metadata edits)
- **Rationale:** Social-share previews currently show the logo only. For pages with significant impressions (e.g. `/about-us` 3,362, `/stay` 3,175, `/gallery` 1,231), this is a missed click-through opportunity.
- **Dependencies:** none

### SEO-T2-008 · Replace `/blogs/eco-resort-vs-luxury-resort-real-difference` OG image

- **Category:** SEO-T2
- **Severity:** LOW
- **Files affected:** Blog metadata config or Supabase row for this post
- **Complexity:** S
- **Rationale:** Current OG is `/home/rooms/camping-tent-2-1280.webp` — thematically off for a post about resort categories. Social-share renders an unrelated camping tent.
- **Dependencies:** none

### SEO-T2-009 · Curate neutral `/nearby-attractions` listing OG image

- **Category:** SEO-T2
- **Severity:** LOW
- **Files affected:** `src/app/(marketing)/nearby-attractions/page.tsx` metadata
- **Complexity:** S (one image)
- **Rationale:** Currently uses `attractions/ratapani-tiger-reserve/hero.webp`, over-representing one of the nine attractions. Curate or composite a neutral banner.
- **Dependencies:** none

### SEO-T2-010 · Add PWA `manifest.webmanifest`

- **Category:** SEO-T2
- **Severity:** LOW
- **Files affected:** `src/app/manifest.ts` (or static `public/manifest.webmanifest`)
- **Complexity:** S
- **Rationale:** Lighthouse PWA scoring will flag absence. Allows "Add to Home Screen" on mobile and broader install discoverability.
- **Dependencies:** SEO-T1-010 (Lighthouse may surface this; confirm scope after baseline)

---

## MOBILE · Touch targets, hero sizing, viewport bugs

### MOBILE-001 · Standardize hero `<h1>` mobile sizing — fix iPhone 12 Pro mid-word wrap

- **Category:** MOBILE
- **Severity:** HIGH
- **Files affected:** `src/components/marketing/hero/carousel.tsx:125`, `src/app/(marketing)/nearby-attractions/page.tsx:49`, `src/app/(marketing)/nearby-attractions/[slug]/page.tsx:102`, `src/app/(marketing)/blogs/page.tsx:59`, `src/app/(marketing)/blogs/[slug]/page.tsx:98`, `src/app/(marketing)/dining/page.tsx:117`
- **Complexity:** S
- **Rationale:** Six pages use `text-5xl` (48 px) as the mobile baseline H1. Long words like "Recreational" or "Kathotiya" approach the 358 px iPhone 12 Pro content width and may overflow or break mid-word. The codebase already has an inconsistent second pattern (`text-4xl` mobile baseline) used on `/about-us`, `/contact-us`, `/booking`, `/day-outing`, `/experiences`, `/aranyashala` — those are safe. Standardize all heroes on `text-4xl` (or `text-3xl`) baseline and add `break-words hyphens-auto` defensively.
- **Dependencies:** none

### MOBILE-002 · Reduce excessive vertical padding on `/nearby-attractions` hero

- **Category:** MOBILE
- **Severity:** MEDIUM
- **Files affected:** `src/app/(marketing)/nearby-attractions/page.tsx:35`
- **Complexity:** S
- **Rationale:** `py-32 md:py-40` = 128–160 px vertical padding on mobile. Consumes ~30% of iPhone 12 Pro's 844 px viewport with empty space. Scale down to `py-16 md:py-24` or similar mobile-friendly values.
- **Dependencies:** none

### MOBILE-003 · Verify touch targets on `/aranyashala` (18 small-class instances)

- **Category:** MOBILE
- **Severity:** LOW
- **Files affected:** `src/app/(marketing)/aranyashala/page.tsx`
- **Complexity:** S
- **Rationale:** Grep counted 18 instances of `h-{6–11}`, `w-{6–11}`, `p-{1–2}`, `py-{1–2}`, `px-{1–2}` on this single page. Most are likely icons (h-6 = 24 px), but some may be clickable elements failing the 44 × 44 px touch target. Spot-check the largest cluster.
- **Dependencies:** none

### MOBILE-004 · Long home subhead pushes CTAs below the fold on mobile

- **Category:** MOBILE
- **Severity:** LOW
- **Files affected:** `src/lib/content/homepage.ts:7` (`HERO_COPY.subhead` = 218 chars)
- **Complexity:** S (one-line edit) or `INFORMATIONAL` per CLAUDE.md §10.3 (content frozen)
- **Rationale:** Long subhead at `text-lg` wraps to ~5 lines on iPhone 12 Pro, pushing primary CTAs below the fold. Per CLAUDE.md §10.3 the keyword-stuffed phrasing is preserved by client decision — this is informational unless the constraint is lifted.
- **Dependencies:** none

---

## BOOKING · Path B promotion + friction reduction (LOCKED 1 in scope)

### BOOKING-001 · Promote Path B (online checkout) as the primary booking destination

- **Category:** BOOKING
- **Severity:** HIGH
- **Files affected:** `src/components/marketing/header/index.tsx:81,90`, `src/lib/content/homepage.ts:8` (`HERO_COPY.ctaPrimary.href`), and all 9 marketing-page CTAs currently routing to `/enquire`
- **Complexity:** L (architectural — needs a UX decision: route header/hero "Book Now" to a room-picker or to `/stay`, or surface dates+guests on a hub page that routes to `/book/{room}`)
- **Rationale:** LOCKED DECISION 1. Currently every primary "Book Now" CTA routes to the WhatsApp lead form (Path A). The actual online-payment flow (`/book/{slug}` → `/review` → `/payment` → confirmation) is reachable only from inside `/stay/{slug}` room-detail pages — 3+ clicks from home. Per architect's choice, route the prominent CTAs to either (a) `/stay` (let user pick room first), (b) a dedicated `/book` hub page with date+guest picker, or (c) the default room's `/book/{slug}` directly. WhatsApp form stays as a secondary fallback.
- **Dependencies:** none

### BOOKING-002 · Fix mobile sticky-bar Book Now CTA touch target

- **Category:** BOOKING
- **Severity:** HIGH
- **Files affected:** `src/components/marketing/room-detail/mobile-sticky-bar.tsx:49`
- **Complexity:** S
- **Rationale:** Current `h-10` = 40 px button. WCAG/Apple HIG minimum is 44 × 44 px. This is the highest-intent mobile booking CTA on the site (appears only after the user scrolls past the hero — strong purchase signal). Mis-taps lose revenue. One-line change from `h-10` to `h-12`.
- **Dependencies:** none

### BOOKING-003 · Show price summary above the form on mobile `/book/[slug]`

- **Category:** BOOKING
- **Severity:** HIGH
- **Files affected:** `src/app/(booking)/book/[slug]/checkout-form.tsx:150` (the `lg:grid-cols-[1fr_360px]` layout)
- **Complexity:** M
- **Rationale:** Desktop has a sticky price summary in the right column. Mobile stacks the price BELOW the entire 8-field form. Users fill name, email, phone, special requests, coupon, dates, guests — all before seeing what they're paying for. Confusing wait state, and "Continue to Review" is disabled until pricing API returns. Move price summary or add a sticky-bottom price+CTA on mobile.
- **Dependencies:** none

### BOOKING-004 · Add cancellation policy summary to booking flow

- **Category:** BOOKING
- **Severity:** MEDIUM
- **Files affected:** `src/app/(booking)/book/[slug]/page.tsx`, `src/app/(booking)/book/[slug]/payment/page.tsx`
- **Complexity:** S
- **Rationale:** Currently the cancellation policy is buried in the `/booking` landing FAQ. Users in the active checkout form cannot see it. "What if I need to cancel?" is one of the most common abandonment triggers in hotel booking funnels. Surface 1–2 sentences inline near the submit button.
- **Dependencies:** none

### BOOKING-005 · Add inline (per-field) validation feedback

- **Category:** BOOKING
- **Severity:** MEDIUM
- **Files affected:** `src/app/(booking)/book/[slug]/checkout-form.tsx:107–119` (current validate-on-submit)
- **Complexity:** M
- **Rationale:** Currently errors only appear after the user attempts submit. Modern UX expects per-field validation on blur (e.g. invalid email error appears when user tabs away from the field). Reduces user frustration with a long form.
- **Dependencies:** none

### BOOKING-006 · Add help / WhatsApp / phone CTA inside booking flow

- **Category:** BOOKING
- **Severity:** MEDIUM
- **Files affected:** `(booking)` layout or each step's page
- **Complexity:** S
- **Rationale:** A user stuck mid-form has no inline contact option. Currently their only choice is to leave the booking flow (back to global nav). Add a discreet "Need help? +91 9770558419 / WhatsApp" affordance in the booking layout footer.
- **Dependencies:** none

### BOOKING-007 · Explain min-nights auto-extension

- **Category:** BOOKING
- **Severity:** MEDIUM
- **Files affected:** `src/app/(booking)/book/[slug]/checkout-form.tsx:168–172`
- **Complexity:** S
- **Rationale:** When user picks a check-out date that violates `minNights`, the system silently bumps the check-out date forward without UI feedback. Users may be confused why their dates moved. Add a small inline note: "Minimum stay for this room is N nights — adjusted check-out accordingly."
- **Dependencies:** none

### BOOKING-008 · Add "Why book direct?" trust block to `/book/[slug]`

- **Category:** BOOKING
- **Severity:** MEDIUM
- **Files affected:** `src/app/(booking)/book/[slug]/checkout-form.tsx` (new section)
- **Complexity:** M
- **Rationale:** No direct-booking benefit messaging on the form page. Standard trust patterns: "Best rate guaranteed", "No booking fees", "Direct support from property". Recommended addition once the form layout is rebalanced (BOOKING-003).
- **Dependencies:** BOOKING-003

### BOOKING-009 · Fix coupon Apply button touch target

- **Category:** BOOKING
- **Severity:** MEDIUM
- **Files affected:** `src/app/(booking)/book/[slug]/checkout-form.tsx:325`
- **Complexity:** S
- **Rationale:** `h-[42px]` is 2 px under the 44 px standard. Trivial fix to `h-11` (44 px) or `h-12` (48 px).
- **Dependencies:** none

### BOOKING-010 · Add degraded fallback when pricing API fails

- **Category:** BOOKING
- **Severity:** MEDIUM
- **Files affected:** `src/app/(booking)/book/[slug]/checkout-form.tsx:107–119` (pricing validation gate)
- **Complexity:** M
- **Rationale:** Today if `POST /api/booking/calculate-price` fails, submit is fully blocked. A degraded path ("we'll send you a quote — submit anyway") preserves the lead even when pricing is intermittently unavailable. Architectural decision required.
- **Dependencies:** none

### BOOKING-011 · Add character counter to Special Requests field

- **Category:** BOOKING
- **Severity:** LOW
- **Files affected:** `src/app/(booking)/book/[slug]/checkout-form.tsx:288–302`
- **Complexity:** S
- **Rationale:** 2,000-char `maxLength` is enforced silently. Users hitting the limit will be surprised.
- **Dependencies:** none

### BOOKING-012 · Persist booking draft beyond sessionStorage

- **Category:** BOOKING
- **Severity:** LOW
- **Files affected:** `src/app/(booking)/book/[slug]/checkout-form.tsx:135–137`
- **Complexity:** M
- **Rationale:** Drafts live in sessionStorage — lost when the tab closes. Switch to localStorage with TTL, or save an anonymous draft row in Supabase. Useful when users compare rooms mid-flow.
- **Dependencies:** none

### BOOKING-013 · Consider inlining the Review step into Step 1

- **Category:** BOOKING
- **Severity:** LOW
- **Files affected:** `src/app/(booking)/book/[slug]/review/page.tsx` + `review-client.tsx`
- **Complexity:** M
- **Rationale:** The Review step (Step 2 of 3) shows what the user already filled. It adds a page-load and a redirect (`router.push('/book/${slug}/review')`) without collecting new data. Some hotel booking flows handle this via an inline "Confirm details" expansion on Step 1. Architect evaluates.
- **Dependencies:** none

### BOOKING-014 · Add Add-to-Calendar (ICS) and map to confirmation page

- **Category:** BOOKING
- **Severity:** LOW
- **Files affected:** `src/app/(booking)/book/confirmation/page.tsx:183–193`
- **Complexity:** M
- **Rationale:** Confirmation gives GPS coords as text. Add a real map widget (Google Maps embed) plus an "Add to Calendar" button (ICS file). Reduces follow-up support load and improves perceived quality.
- **Dependencies:** none

---

## VISUAL · Polish, asset quality, performance hypotheses

### VISUAL-001 · Replace 3 Notable Guests low-res portraits

- **Category:** VISUAL
- **Severity:** HIGH
- **Files affected:** R2 uploads at `testimonials/{vidya-balan,vijay-raaz,samir-somaiya}/portrait.webp`
- **Complexity:** S
- **Rationale:** Confirmed dimensions: Vidya Balan 309 × 412 (45 KB), Vijay Raaz 253 × 338 (9 KB!), Samir Somaiya 541 × 722 (13 KB). Cards render at `aspect-[3/4]` × 1/3 column width on desktop ≈ 640 × 853 px (1280 × 1707 px at 2× retina). Source images are 2–5× too small and visibly blurry on retina displays. Replacement target: minimum 800 × 1067, ideal 1200 × 1600. Three images to acquire. This is high-visibility above the fold on the homepage.
- **Dependencies:** none

### VISUAL-002 · Investigate font over-loading on `/about-us`

- **Category:** VISUAL
- **Severity:** MEDIUM
- **Files affected:** `src/app/(marketing)/about-us/page.tsx` (or layout-injected fonts)
- **Complexity:** S
- **Rationale:** Step 10 curl scan found 8 font URL references in the rendered HTML of `/about-us` vs 4 elsewhere. Possible double-loading regression. Wasted bytes on every visit.
- **Dependencies:** none

### VISUAL-003 · Investigate cold-hit TTFB on ISR pages (1.5–2 s)

- **Category:** VISUAL
- **Severity:** MEDIUM
- **Files affected:** Vercel deployment config; Supabase region routing
- **Complexity:** M (profiling work, not a single-file change)
- **Rationale:** Curl-measured TTFB on `/`, `/stay/[slug]`, `/blogs/[slug]`, `/booking` was 1.3–2.0 s on the cold first hit. `/about-us` warmed dropped to 0.28 s. The cold-start penalty is concentrated in the per-ISR-cycle first request. Architect should profile via Vercel dashboard whether it's serverless cold-start or Supabase round-trip.
- **Dependencies:** SEO-T1-010 (Lighthouse baseline confirms the bottleneck)

### VISUAL-004 · Review homepage carousel image-preload strategy

- **Category:** VISUAL
- **Severity:** MEDIUM
- **Files affected:** `src/components/marketing/hero/carousel.tsx:103–112`
- **Complexity:** S
- **Rationale:** Currently the hero carousel sets `priority` + `fetchPriority="high"` on slide 1 and `loading="eager"` + `fetchPriority="low"` on slides 2 and 3. That eagerly loads 3 hero variants × WebP+JPG fallbacks, competing with critical-path bandwidth. Slides 2/3 could safely lazy-load until first slide is rendered. Verify the trade-off via Lighthouse.
- **Dependencies:** SEO-T1-010

### VISUAL-005 · Delete unused Next.js scaffolding SVGs in `/public/`

- **Category:** VISUAL
- **Severity:** LOW
- **Files affected:** `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`
- **Complexity:** S
- **Rationale:** Default Next.js project scaffold assets, none referenced in source code. Trivial bundle cleanup.
- **Dependencies:** none

### VISUAL-006 · Add `safari-pinned-tab.svg`

- **Category:** VISUAL
- **Severity:** LOW
- **Files affected:** `public/branding/...` (or R2 + `src/app/layout.tsx` icons array)
- **Complexity:** S
- **Rationale:** Safari pinned-tab icon. Currently missing. Optional but polish-friendly.
- **Dependencies:** none

### VISUAL-007 · Verify Devanagari font usage

- **Category:** VISUAL
- **Severity:** LOW
- **Files affected:** `public/fonts/noto-sans-devanagari-{400,700}-normal.woff`
- **Complexity:** S
- **Rationale:** Two Devanagari WOFF files ship in `/public/fonts/`. Verify they're actually referenced (for Hindi rendering on `/aranyashala` or testimonials). If unused, drop them to reduce font payload.
- **Dependencies:** none

### VISUAL-008 · Remove documentary OLD-bucket comments in production code

- **Category:** VISUAL
- **Severity:** LOW
- **Files affected:** `src/lib/content/experiences.ts:2`, `src/app/(marketing)/experiences/page.tsx:67`
- **Complexity:** S
- **Rationale:** Two code comments reference the OLD R2 bucket as a source-of-truth pointer. Harmless to runtime but creates grep-noise and future-maintenance confusion. Remove after the experiences banner migration (SEO-T1-008) completes.
- **Dependencies:** SEO-T1-008

---

## Informational — OLD-side anomalies (not actionable in this rebuild)

These were discovered during OLD-side content extraction. They do not require fixes on NEW — OLD is being replaced. Documented for completeness.

### INFO-001 · OLD `/experiences` had 2 H1 tags

- **Category:** VISUAL
- **Severity:** LOW (informational)
- **Rationale:** Step 6 found OLD `/experiences` violated single-H1 rule. NEW build's `/experiences` is clean. No action.

### INFO-002 · OLD `/blogs/featured-hindustan-times-bhopal-wildlife-secret` had 6 H1 tags

- **Category:** VISUAL
- **Severity:** LOW (informational)
- **Rationale:** Heavy multi-H1 violation on the OLD HT-feature blog. When this post is migrated per SEO-T1-002, **the migrated version should consolidate to one H1**. Architect note when commissioning the migration.
- **Dependencies:** SEO-T1-002

### INFO-003 · OLD site missing OG images on 25 of 31 pages

- **Category:** VISUAL
- **Severity:** LOW (informational)
- **Rationale:** Historical OLD content issue. NEW build fixed this — 41/41 NEW pages have an OG image (even if some use logo fallback). The OG-image OPTIMIZATION work (SEO-T2-007) is about choosing better OG images for high-traffic pages, not adding missing ones.

---

## Summary by category and complexity

| Category | HIGH | MEDIUM | LOW | Total | S | M | L |
|---|---:|---:|---:|---:|---:|---:|---:|
| SEO-T1 (Bleed Stop) | 8 | 2 | 0 | 10 | 8 | 1 | 1 |
| SEO-T2 (Optimization) | 3 | 1 | 4 | 8 | 6 | 1 | 0 |
| Wait, also #SEO-T2-007 is M | | | | | | | |

Let me recount actual items:

| Category | HIGH | MEDIUM | LOW | Total |
|---|---:|---:|---:|---:|
| SEO-T1 | 8 | 2 | 0 | 10 |
| SEO-T2 | 3 | 1 | 6 | 10 |
| MOBILE | 1 | 1 | 2 | 4 |
| BOOKING | 3 | 7 | 4 | 14 |
| VISUAL | 1 | 3 | 4 | 8 |
| INFO | — | — | 3 | 3 |
| **TOTAL** | **16** | **14** | **19** | **49** |

| Complexity | Count |
|---|---:|
| S (under 1 day) | 30 |
| M (1–3 days) | 16 |
| L (3+ days) | 3 |
| **TOTAL** | **49** |

## Recommended sequencing

The architect's call, but a reasonable flow:

1. **Week 1 — Bleed Stop (SEO-T1 in parallel):**
   - SEO-T1-001 (title bug — single point of leverage)
   - SEO-T1-003 (8 missing 301 redirects — small file)
   - SEO-T1-005, SEO-T1-006, SEO-T1-007 (small code-only fixes)
   - SEO-T1-008 (R2 image upload)
   - SEO-T1-010 (Lighthouse baseline — kick off API key)
   - **In parallel:** SEO-T1-002 blog migration begins (longest item)

2. **Week 2 — Mobile + Booking core:**
   - MOBILE-001 (hero sizing)
   - BOOKING-002 (sticky-bar touch target)
   - BOOKING-003 (price-above-form on mobile)
   - BOOKING-004 (cancellation policy inline)

3. **Week 3 — Booking architecture + SEO-T2 H1 rewrites:**
   - BOOKING-001 (Path B promotion — needs UX decision)
   - SEO-T2-001 through SEO-T2-006 (H1 rewrites — depend on title fix landing)
   - Continue blog migration

4. **Week 4 — Polish:**
   - VISUAL-001 (Notable Guests image replacements)
   - SEO-T2-007 (OG images for 8 pages)
   - Booking medium-priority items
   - Visual mediums and lows

5. **Post-launch:**
   - All LOW items
   - Booking LOW items
   - Performance optimization based on Lighthouse data
