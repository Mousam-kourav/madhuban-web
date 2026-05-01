# Phase 9A — Site Audit Report
**Date:** 2026-05-01  
**Auditor:** Claude Code (read-only pass, no code changes)  
**Branch:** `audit/phase-9a-site-audit`  
**Production:** https://madhuban-web.vercel.app  
**Status at audit:** Phases 0–8 complete per PROGRESS.md (last commit Phase 8, experiences pages, 2026-04-29)

---

## Pre-flight confirmation

- CLAUDE.md read end-to-end ✅ (Version 1.5, includes §§1–27)
- PROGRESS.md read end-to-end ✅ (Phase 8 last completed; 74 routes at build)
- No code changes made in this session ✅

---

## 1. Page Inventory

### 1.1 Pages that exist and work

| URL | File | Status | Notes |
|---|---|---|---|
| `/` | `(marketing)/page.tsx` | ✅ Full content | 11 sections, all JSON-LD |
| `/stay` | `(marketing)/stay/page.tsx` | ✅ Full content | ISR 60s, Supabase-backed |
| `/stay/safari-tent` | `(marketing)/stay/[slug]/page.tsx` | ✅ Full content | ISR 60s |
| `/stay/mud-house-1` | same | ✅ Full content | |
| `/stay/mud-house-2` | same | ✅ Full content | |
| `/stay/pool-side-villa` | same | ✅ Full content | |
| `/stay/glamping-tents` | same | ✅ Full content | |
| `/stay/camping-tent` | same | ✅ Full content | |
| `/experiences` | `(marketing)/experiences/page.tsx` | ✅ Full content | JSON-LD present; hero image will 404 (see §7) |
| `/experiences/forest-walks-and-nature-trails` | `(marketing)/experiences/[slug]/page.tsx` | ✅ Full content | SSG |
| `/experiences/bird-watching-and-wilderness` | same | ✅ Full content | |
| `/experiences/recreational-facilities` | same | ✅ Full content | |
| `/contact-us` | `(marketing)/contact-us/page.tsx` | ✅ Full content | JSON-LD present |
| `/enquire` | `(marketing)/enquire/page.tsx` | ✅ Full content | Not in CLAUDE.md §5 URL list; added Phase 6 |
| `/blogs` | `(marketing)/blogs/page.tsx` | ✅ Full content | ISR 60s; **missing JSON-LD** (see §6) |
| `/blogs/[slug]` | `(marketing)/blogs/[slug]/page.tsx` | ✅ Full content | ISR 60s, JSON-LD present |
| `/aranyashala` | `(marketing)/aranyashala/page.tsx` | ⚠️ Placeholder | Has metadata + "Coming soon" copy |
| `/souvenir-shop` | `(marketing)/souvenir-shop/page.tsx` | ⚠️ Placeholder | Has metadata + "Shop launching soon" copy |
| `/book/[slug]` | `(booking)/book/[slug]/page.tsx` | ✅ Booking step 1 | Room-specific flow |
| `/book/[slug]/review` | `(booking)/book/[slug]/review/page.tsx` | ✅ Booking step 2 | Price breakdown |
| `/book/[slug]/payment` | `(booking)/book/[slug]/payment/page.tsx` | ✅ Booking step 3 | Razorpay integration |
| `/book/confirmation` | `(booking)/book/confirmation/page.tsx` | ✅ Confirmation | Uses `?ref=` query param |
| `/admin` | `admin/(authed)/page.tsx` | ✅ Dashboard | Auth-gated |
| `/admin/posts` + sub-pages | `admin/(authed)/posts/` | ✅ Full CRUD | Blog editor, Tiptap |
| `/admin/rooms` + sub-pages | `admin/(authed)/rooms/` | ✅ Full CRUD | Room editor, 9 sections |
| `/admin/bookings` + `/[id]` | `admin/(authed)/bookings/` | ✅ Read + status transitions | No manual create |
| `/admin/coupons` + sub-pages | `admin/(authed)/coupons/` | ✅ Full CRUD | Soft delete |

### 1.2 Pages referenced somewhere but currently blank (return `null`)

These routes exist in the file system but their page components return `null` — rendering a completely blank page. Many are linked directly from the primary navigation or footer.

| URL | Nav/footer reference | Impact |
|---|---|---|
| `/about-us` | EXPLORE_NAV + FOOTER_EXPLORE | **Critical** — core hotel page, linked from nav dropdown |
| `/dining` | PRIMARY_NAV + FOOTER_EXPLORE | **Critical** — linked from top-level nav |
| `/day-outing` | PRIMARY_NAV + FOOTER_VISIT | **Critical** — linked from top-level nav |
| `/nearby-attractions` | FOOTER_VISIT + EXPLORE_NAV | High — linked from nav and footer |
| `/gallery` | EXPLORE_NAV + FOOTER_EXPLORE | High — linked from nav dropdown |
| `/privacy-policy` | LEGAL_NAV (footer) | High — legal page, linked from footer |
| `/terms-and-condition` | LEGAL_NAV (footer) | High — legal page |
| `/cookies-and-consent-policy` | LEGAL_NAV (footer) + **cookie banner itself** | **Critical** — cookie banner links here |
| `/disclaimer` | LEGAL_NAV (footer) | High |
| `/booking` | **Header "Book Now" CTA** | **Critical** — primary CTA on every page (see §2) |
| `/corporate-offsite` | Homepage CTA section links here | High |
| `/thank-you` | CLAUDE.md §5 post-enquiry destination | Medium |
| `/packages/2-day-digital-detox` | CLAUDE.md §5 URL | Medium |
| `/not-found.tsx` | Triggered on any 404 | **Critical** — 404 page is blank |

**Legacy booking stubs** (Phase 0 scaffold, never implemented — real flow is at `/book/[slug]/*`):

| URL | File | Status |
|---|---|---|
| `/booking/guest` | `(booking)/booking/guest/page.tsx` | returns null |
| `/booking/payment` | `(booking)/booking/payment/page.tsx` | returns null |
| `/booking/summary` | `(booking)/booking/summary/page.tsx` | returns null |
| `/booking/confirmed/[id]` | `(booking)/booking/confirmed/[id]/page.tsx` | returns null |

### 1.3 Pages conspicuously absent (not in codebase at all)

All CLAUDE.md §5 URL-list pages have at least a route file. No completely absent required pages were found. However the following content gaps are meaningful:

- **Dining page** — file exists, blank. A resort website without a dining page is a trust issue for guests.
- **Gallery** — file exists, blank. Image galleries are how guests decide whether to book; absence is a direct conversion loss.
- **About Us** — file exists, blank. Second most-visited page on a hotel site after homepage.
- **Nearby Attractions** — file exists, blank. Major differentiator for eco-tourism properties.
- **All 4 policy pages** — exist but blank. Without Privacy Policy, the site is non-compliant with DPDP/GDPR requirements.

---

## 2. Navigation & Footer Audit

### 2.1 Header — Desktop Primary Nav

| Label | Href | Status |
|---|---|---|
| Stay | `/stay` | ✅ works |
| Dining | `/dining` | ❌ blank page |
| Day Outing | `/day-outing` | ❌ blank page |
| Aranyashala | `/aranyashala` | ⚠️ placeholder ("Coming soon") |
| Souvenir Shop | `/souvenir-shop` | ⚠️ placeholder ("Shop launching soon") |

### 2.2 Header — Explore Dropdown

| Label | Href | Status |
|---|---|---|
| About | `/about-us` | ❌ blank page |
| Experiences | `/experiences` | ✅ works |
| Gallery | `/gallery` | ❌ blank page |
| Blogs | `/blogs` | ✅ works |
| Nearby Attractions | `/nearby-attractions` | ❌ blank page |
| Contact | `/contact-us` | ✅ works |

### 2.3 Header — "Book Now" / Primary CTA

The header renders two "Book Now" buttons — one desktop, one mobile. Both link to `/booking`:

```tsx
// src/components/marketing/header/index.tsx:66-80
<Button render={<Link href="/booking" />} size="default" className="hidden lg:inline-flex">
  Book Now
</Button>
<Button render={<Link href="/booking" />} size="sm" className="lg:hidden">
  Book
</Button>
```

**`/booking/page.tsx` returns `null`.** Every "Book Now" click on every page delivers a completely blank screen. The actual booking flow starts at `/book/[slug]` (accessed only from room detail pages via the BookingWidget). A user arriving from the homepage or nav bar has no way to start a booking.

This is the most critical UX failure on the site.

Other CTA audit:
- Room detail pages "Book This Room" → `/book/[slug]` ✅ (works)
- `/stay` bottom CTA "Plan Your Retreat" → `/enquire` ✅ (works)
- Blog article CTA "Plan Your Retreat" → `/enquire` ✅ (works)
- Homepage Corporate Offsite section → `/corporate-offsite` ❌ (blank)
- Footer "Plan Your Retreat" → `/enquire` ✅ (works)

### 2.4 Mobile Nav

`src/components/marketing/header/mobile-drawer.tsx` uses the same PRIMARY_NAV and EXPLORE_NAV arrays. The same dead links listed in §2.1–2.2 apply to the mobile drawer. The mobile "Book" button also links to `/booking`.

### 2.5 Footer — Explore Column

| Label | Href | Status |
|---|---|---|
| About | `/about-us` | ❌ blank page |
| Stay | `/stay` | ✅ |
| Experiences | `/experiences` | ✅ |
| Dining | `/dining` | ❌ blank page |
| Gallery | `/gallery` | ❌ blank page |
| Blogs | `/blogs` | ✅ |

### 2.6 Footer — Visit Column

| Label | Href | Status |
|---|---|---|
| Plan Your Retreat | `/enquire` | ✅ |
| Day Outing | `/day-outing` | ❌ blank page |
| Aranyashala | `/aranyashala` | ⚠️ placeholder |
| Souvenir Shop | `/souvenir-shop` | ⚠️ placeholder |
| Nearby Attractions | `/nearby-attractions` | ❌ blank page |
| Contact | `/contact-us` | ✅ |
| View on Google Maps | external (dynamic geo coords) | ✅ |

### 2.7 Footer — Legal Links

| Label | Href | Status |
|---|---|---|
| Privacy Policy | `/privacy-policy` | ❌ blank (returns null) |
| Terms & Conditions | `/terms-and-condition` | ❌ blank (returns null) |
| Cookie Policy | `/cookies-and-consent-policy` | ❌ blank — also linked from cookie banner itself |
| Disclaimer | `/disclaimer` | ❌ blank (returns null) |

The cookie banner ("Customize" flow) explicitly links to `/cookies-and-consent-policy` for the user to read the policy. That page is blank. A user who clicks it while choosing consent options sees nothing.

---

## 3. Admin Panel Audit

### 3.1 Admin sidebar nav items

| Item | Href | Status in sidebar |
|---|---|---|
| Dashboard | `/admin` | ✅ live |
| Blog Posts | `/admin/posts` | ✅ live |
| Rooms | `/admin/rooms` | ✅ live |
| Bookings | `/admin/bookings` | ✅ live |
| Coupons | `/admin/coupons` | ✅ live |
| Settings | — | ❌ disabled (opacity-50, cursor-not-allowed) |
| Support | — | ❌ disabled (opacity-50, cursor-not-allowed) |

`DISABLED_ITEMS` array is empty — settings and support are hardcoded disabled buttons at the sidebar bottom, not part of the disabled items system.

### 3.2 CRUD parity per module

| Module | Create | Read | Update | Delete | Notes |
|---|---|---|---|---|---|
| Blog Posts | ✅ | ✅ | ✅ | ✅ | Tiptap editor, SEO sidebar, schedule publish |
| Rooms | ✅ | ✅ | ✅ | ✅ | 9 collapsible sections, drag reorder |
| Bookings | ❌ no manual create | ✅ list + detail | ✅ status transitions only | ❌ no delete | CLAUDE.md §9.2 specifies manual booking creation |
| Coupons | ✅ | ✅ | ✅ | ✅ (soft) | Soft delete preserves FK integrity |

### 3.3 DB tables with no admin UI

The following database tables exist (per CLAUDE.md §6 and Phase 7/8 notes) but have zero admin management:

| Table | Description | Impact |
|---|---|---|
| `gallery_albums` | Photo album groupings | No way to manage gallery |
| `gallery_images` | Individual gallery photos | No way to manage gallery |
| `experiences` | 17 stale rows from Phase 0 | Ignored; content hardcoded in `experiences.ts` |
| `manual_blocks` | Homepage content blocks | Not implemented |
| `audit_log` | Every admin write action | No read UI for super_admin review |
| `day_outing_packages` | Day outing products | No management UI |
| `leads` | Contact form submissions | **API returns 501**; no leads captured |
| `newsletter_subscribers` | Newsletter signups | **API doesn't write to DB**; zero subscribers stored |
| `pricing_rules` | Seasonal/weekend pricing | No UI; base prices only |
| `availability` (manual_blocks) | Room block/unblock calendar | No visual availability calendar |
| `invoices` | GST invoice PDFs | No generation, no storage, no UI |

### 3.4 Missing admin modules (per CLAUDE.md §9.2 spec)

| Module | Status |
|---|---|
| Gallery (albums + images + drag-reorder) | ❌ Not built |
| Pricing rules (seasonal, weekend, long-stay, bulk update) | ❌ Not built |
| Availability calendar (visual block/unblock) | ❌ Not built (API stub exists at `/api/availability`) |
| Reports (occupancy, revenue, GST, source, arrivals/departures) | ❌ Not built |
| Invoices (GST invoice generation, PDF, signed URLs) | ❌ Not built |
| Users / RBAC (super_admin / manager / receptionist roles) | ❌ Not built |
| Manual booking creation (walk-in, phone, corporate) | ❌ Not built |
| Website content blocks (testimonials, FAQs, homepage sections) | ❌ Not built |
| Stay packages (Digital Detox etc.) | ❌ Not built |

---

## 4. Content & Copy Issues

### 4.1 Placeholder / blank content

Thirteen page components return `null`, producing blank pages. See full list in §1.2. The 404 page (`not-found.tsx`) also returns null — every broken URL on the site shows a blank screen with no guidance to the user.

### 4.2 "Coming soon" placeholders in live nav

Two pages linked from the main navigation show "Coming soon" placeholders:
- `/aranyashala` — `src/app/(marketing)/aranyashala/page.tsx:18`: subheading is literally `"Coming soon"`
- `/souvenir-shop` — `src/app/(marketing)/souvenir-shop/page.tsx:18`: body ends with `"Shop launching soon."`

These are in the PRIMARY_NAV (Aranyashala) and FOOTER_VISIT (both). A user landing on these from the nav will see a "coming soon" shell — acceptable for pre-launch but needs a decision: either remove from nav until ready, or complete the page.

### 4.3 Known copy quality issues

- `src/lib/content/homepage.ts:1` — `// TODO: Editorial pass post-launch. Live content has keyword-stuffed phrasing`. Entire homepage copy flagged internally. Not blocking but needs a round-trip with client before launch.
- `src/lib/content/nearby.ts:1` — Bhojpur Temple card currently shows a Saru Maru Caves photo as placeholder. Wrong image for a real attraction.

### 4.4 Hardcoded R2 URL in blog listing hero

`src/app/(marketing)/blogs/page.tsx:29-30`:
```html
<source srcSet="https://pub-988c0a6b938742458b908a7a49295f61.r2.dev/home/rooms/pool-side-villa-3-1280.webp" ...>
<img src="https://pub-988c0a6b938742458b908a7a49295f61.r2.dev/home/rooms/pool-side-villa-3-1280.jpg" ...>
```

Two issues: (a) The R2 base URL is hardcoded rather than reading from `NEXT_PUBLIC_R2_BASE`. (b) A room photo is being used as the blog listing page hero — semantically incorrect. A blog hero should be a nature/writing image, not a specific accommodation.

### 4.5 Alt text sampling

Sampled 8 images across marketing pages:
- Homepage hero carousel: `alt={slide.image.alt}` — populated from `images.ts` ✅
- Room cards `/stay`: `alt={room.image.alt}` — from mapper/DB ✅
- Experience cards: `alt={exp.image.alt}` — from `experiences.ts` ✅
- Blog cards: `alt={post.cover_image_alt ?? post.title}` — fallback to title ✅
- Blog listing hero: `alt="Pool Side Villa exterior in daylight..."` — hardcoded, correct ✅
- Nearby attractions: `alt` from `nearby.ts` content file ✅
- Testimonials: no images ✅ (no alt issue)
- Room gallery: `alt` from `galleryImages()` helper in `rooms.ts` — populated ✅

No missing alt attributes found on rendered content. Decorative `aria-hidden="true"` used correctly on ornamental elements.

### 4.6 Styling inconsistency — blog pages

`blogs/page.tsx` and `blogs/[slug]/page.tsx` use raw CSS variable notation instead of Tailwind utilities:

```tsx
// blogs/page.tsx (inconsistent)
className="text-[var(--color-gold-accent)]"
className="bg-[var(--color-earth-brown)]"
className="max-w-7xl"  // vs Container component elsewhere

// All other marketing pages (consistent)
className="text-gold-accent"
className="bg-earth-brown"
// use <Container /> component
```

The blog pages were written with a different style than all other marketing pages. The filter bar also uses `sticky top-[72px]` — a hardcoded pixel value that must equal the scrolled header height, but the CSS variable `--header-height: 5rem` (80px) is defined and should be used.

### 4.7 Heading capitalization

Blog listing page H1 is rendered as styled JSX text, not a semantic heading in the traditional sense — it reads "Stories From Nature, Wellness & Wilderness" as display text over a hero image. Page `<title>` via metadata is "Journal — Madhuban Eco Retreat." These two don't match, which can confuse both users and search engines about the page identity.

---

## 5. Design & UX Inconsistencies

### 5.1 Raw `<img>` tag in blog listing hero

`src/app/(marketing)/blogs/page.tsx:26-37` uses a `<picture>/<img>` tag stack instead of `next/image`:
- Bypasses Next.js image optimization pipeline
- No automatic WebP negotiation beyond the manually written `<source>`
- No `sizes` attribute for responsive loading
- If R2 bucket URL changes, this hardcoded URL breaks silently

All other images on the site use `<Image>` from `next/image` (or the `ResortImage` wrapper). This is the only outlier.

### 5.2 `<Section>` component vs raw `<section>` elements

`src/components/ui/section.tsx` was built in Phase 1 as the standard semantic section wrapper (handles `py-12 md:py-20` rhythm, `aria-label`, server component). Usage is inconsistent:

- `experiences/page.tsx`: Uses raw `<section aria-label="...">` throughout — bypasses the component
- `blogs/page.tsx`: Uses raw `<section>` throughout — bypasses both the component and the section padding pattern
- All other marketing pages: Use `<Section label="...">` consistently

The blog and experiences pages have custom padding values that diverge from the 48px/80px rhythm standard.

### 5.3 WhatsApp floater — forbidden color

`src/components/marketing/whatsapp-floater.tsx:23`:
```tsx
className="... bg-[#25D366] ... hover:bg-[#20BA5A] ..."
```

CLAUDE.md §4 explicitly lists `#25D366` (WhatsApp bright green) as a forbidden color. The brand palette has `--color-moss-green: #4A6741` and `--color-earth-brown: #6E6146` as the closest alternatives. The current color is recognizably "WhatsApp green" which is intentional for brand recognition, but it violates the stated rule. A decision is needed: exempt the floater from the color prohibition (update CLAUDE.md), or restyle it.

### 5.4 Booking flow styling is outside the design system

`src/app/(booking)/book/[slug]/page.tsx` and its sub-pages use raw Tailwind without `<Container>`, `<Section>`, or the brand typography hierarchy. The booking flow has its own visual language (raw `py-10 px-4`, `max-w-7xl`) separate from the marketing site design system. This is somewhat expected for a focused transactional flow, but the divergence from brand typography (especially italicized display font for headings) makes it look like a different product.

### 5.5 Booking step indicator — fragile hardcoding

`src/app/(booking)/book/[slug]/page.tsx:66-74` renders the "1. Your Details → 2. Review → 3. Payment" step indicator as a static list. It doesn't highlight the current step in any dynamic way beyond "step 1 is always bold." Steps 2 and 3 do not show which step they're on. A user on the payment page still sees step 1 as "active."

### 5.6 Sticky filter bar hardcoded offset

`src/app/(marketing)/blogs/page.tsx:53`:
```tsx
className="sticky top-[72px] ..."
```

Header height is defined as `--header-height: 5rem` (80px) in `globals.css`. The scrolled-down header shrinks to `h-16` (64px). The sticky filter bar uses a hardcoded `72px` that matches neither value exactly. This could cause the filter bar to overlap the header on some scroll states.

---

## 6. SEO Infrastructure Gaps

### 6.1 Sitemap — completely empty

`src/app/sitemap.ts`:
```ts
export default function sitemap(): MetadataRoute.Sitemap {
  return [];
}
```

The sitemap returns an empty array. `robots.ts` correctly points to `https://www.madhubanecoretreat.com/sitemap.xml` but that sitemap is empty. Google sees no pages to crawl via sitemap. All discovery must come from link-following, which means many pages (especially dynamic blog posts, room detail pages) may not be crawled promptly.

The sitemap needs to include at minimum:
- All static marketing routes (home, stay, experiences, contact, etc.)
- Dynamic room slugs (6 pages from Supabase)
- Dynamic blog post slugs (from Supabase)
- Dynamic experience slugs (3 pages)

### 6.2 robots.txt — wrong path in disallow

`src/app/robots.ts` disallows `/booking/payment`. The actual payment page is at `/book/[slug]/payment` (not `/booking/payment`). The wrong path is disallowed. The real payment page is crawlable by Google.

The payment page does have `noIndex: true` in its `generateMetadata`, so it won't be indexed. But robust protection would be: disallow the correct path in robots.

### 6.3 OG default image missing

`src/lib/seo.ts:5`:
```ts
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.jpg`;
```

The `public/` directory is empty — no files exist in it at all. `/og-default.jpg` does not exist. Every page that does not specify an explicit `ogImage` (the majority of pages) will have a broken OG image in social sharing previews.

Pages with explicit OG images: `/` (hero aerial sunset), `/stay/[slug]` (room image from R2).  
Pages relying on the missing default: `/contact-us`, `/enquire`, `/experiences`, `/blogs`, policy pages, etc.

### 6.4 JSON-LD schema audit — 5 pages sampled

| Page | LodgingBusiness | Resort | FAQPage | BreadcrumbList | Page-specific | Missing |
|---|---|---|---|---|---|---|
| `/` | ✅ | ✅ | ✅ | — (correct) | `SpeakableSpec`, `roomItemList` | Nothing critical |
| `/stay` | — | — | — | ✅ | — | `Resort` + `hasOfferCatalog` per §7.2 spec |
| `/stay/safari-tent` | ✅ | — | ✅ | ✅ | `HotelRoom + Offer` | Nothing critical |
| `/blogs` | — | — | — | — | — | **`Blog` + `ItemList`** — no schemas at all |
| `/experiences` | — | — | ✅ | ✅ | `CollectionPage + ItemList` | Good |

**Blog index has zero JSON-LD.** Per CLAUDE.md §7.2: "Blog index | `Blog` + `ItemList`". Neither schema is present; the `<Seo>` component is not used at all on `/blogs/page.tsx`.

**Stay index is missing** `Resort + hasOfferCatalog`. Per CLAUDE.md §7.2: "Stay index | `Resort` + `hasOfferCatalog` of 6 rooms + `FAQPage`". The page only has `BreadcrumbList`.

### 6.5 Meta tag audit — 5 pages sampled

| Page | title | description | canonical | og:image | og:title | twitter:card |
|---|---|---|---|---|---|---|
| `/` | ✅ custom | ✅ | ✅ | ✅ explicit | ✅ | ✅ (via buildMetadata) |
| `/stay/safari-tent` | ✅ from DB | ✅ from DB | ✅ | ✅ R2 pattern | ✅ | ✅ |
| `/blogs/eco-resort-vs-luxury-resort-real-difference` | ✅ from post | ✅ | ✅ | ✅ from post | ✅ | ✅ |
| `/contact-us` | ✅ | ✅ | ✅ | ❌ missing default (og-default.jpg doesn't exist) | ✅ | ✅ |
| `/experiences` | ✅ | ✅ | ✅ | ❌ missing default | ✅ | ✅ |

Stub pages (`/about-us`, `/dining`, etc.) return `null` so they emit no metadata at all.

### 6.6 Missing redirects

Per CLAUDE.md §7.6, these redirects should be live:
- `/stay/pool-side-room` → `/stay/pool-side-villa` — **commented out** in `next.config.ts:20`. Should be uncommented before launch or old SEO juice is lost.
- `/stay/mud-villa` → `/stay/mud-house-1` — not configured (CLAUDE.md says "don't add a redirect" for this one — OK)
- Old blog URL IDs → new slugs — not configured. Needs a map of old MongoDB-style IDs → new slugs at launch.

### 6.7 `NEXT_PUBLIC_SITE_URL` in schema — possible dev issue

`src/app/(marketing)/experiences/page.tsx:64,68`:
```ts
'@id': `${process.env.NEXT_PUBLIC_SITE_URL}/experiences#collection-page`,
url: `${process.env.NEXT_PUBLIC_SITE_URL}/experiences`,
```

If `NEXT_PUBLIC_SITE_URL` is unset in a dev environment, these JSON-LD fields will contain `undefined/experiences`. The `buildMetadata` helper handles this more gracefully with a fallback to `https://www.madhubanecoretreat.com`. The experiences page inline schema objects don't use that fallback — they use the env var directly.

---

## 7. Performance Concerns (code-level only)

### 7.1 Experience banner hero image — will 404 in production

`src/app/(marketing)/experiences/page.tsx:57`:
```ts
const HERO_IMAGE = {
  src: `${R2_BASE}/experiences/banner/hero-1280.webp`,
  ...
};
```

This image was noted in Phase 8 as "not yet uploaded to new R2 bucket." It's used as the `<Image fill priority>` hero on the experiences index page. The `priority` flag means Next.js will preload it. A 404 on the LCP element breaks Core Web Vitals. This image needs uploading before the experiences page can score well on Lighthouse.

### 7.2 Blog listing hero — raw `<img>`, no next/image optimization

`src/app/(marketing)/blogs/page.tsx:26-37` uses `<picture>/<img>` directly. Beyond the semantic issue (wrong image for a blog hero), this bypasses the Next.js image optimization pipeline:
- No AVIF/WebP negotiation via Next.js
- No lazy loading
- No blur placeholder
- No `sizes` optimization for different viewports

Estimated LCP impact: none on initial load (fetchPriority="high" is set and the file is ~200KB webp) but the optimization miss is a code debt.

### 7.3 Hardcoded R2 base URL

`blogs/page.tsx:29-30` hardcodes the full R2 URL rather than using `process.env.NEXT_PUBLIC_R2_BASE`. If the R2 bucket ever changes (as it did in Phase 3B when `remotePatterns` needed updating), this file won't be caught by the `NEXT_PUBLIC_R2_BASE` propagation.

### 7.4 `'use client'` assessment — no unnecessary uses found

All 11 client components are justified:
- `cookie-banner.tsx` — localStorage, animations, DOM focus
- `newsletter-form.tsx` — form submit state
- `header/index.tsx` — scroll listener, drawer state
- `header/mobile-drawer.tsx` — sheet open/close
- `header/nav-desktop.tsx` — dropdown hover/keyboard
- `hero/carousel.tsx` — auto-rotation timer, IntersectionObserver
- `room-detail/mobile-sticky-bar.tsx` — IntersectionObserver
- `whatsapp-floater.tsx` — consent context
- `ui/faq.tsx` — accordion state
- `consent-context.tsx` — localStorage, state
- `consent-gate.tsx` — context read

No `'use client'` annotations found on server-component pages or sections.

### 7.5 Database query indexes — unverifiable from code, recommended

Cannot verify actual Postgres index definitions from source code. PROGRESS.md Phase 5B mentions `rooms_status_order_idx` but we can't confirm it was actually created in the DB. Columns that should be indexed:

| Table | Columns | Used by |
|---|---|---|
| `rooms` | `(is_active, sort_order)` | `getRooms()` — main room listing |
| `rooms` | `(slug, is_active)` | `getRoomBySlug()` — room detail pages |
| `blog_posts` | `(status, published_at DESC)` | `getPublishedPosts()` — blog listing |
| `blog_posts` | `(status, slug)` | `getPublishedPost(slug)` — blog detail |
| `bookings` | `(checkin DESC)` | Admin booking list query |

Without indexes, these queries full-scan the table. Low urgency now (small datasets), but worth verifying.

### 7.6 ISR configuration summary

| Route | Revalidate | Static Params |
|---|---|---|
| `/stay` | 60s ✅ | — |
| `/stay/[slug]` | 60s ✅ | `generateStaticParams` ✅ |
| `/blogs` | 60s ✅ | — |
| `/blogs/[slug]` | 60s ✅ | `generateStaticParams` ✅ |
| `/experiences/[slug]` | 60s ✅ | `generateStaticParams` ✅ |
| `/contact-us`, `/enquire` | Static (no revalidate) ✅ | — |
| `/experiences` | Static (no revalidate) — fine; content is hardcoded | — |
| `/book/[slug]` | 60s ✅ (room data) | — |

No pages are incorrectly forced dynamic.

### 7.7 Confirmation page uses admin client

`src/app/(booking)/book/confirmation/page.tsx:43`:
```ts
const supabase = createAdminClient();
```

The booking confirmation page uses the service-role Supabase client (which bypasses RLS). This is a server component so no credentials are exposed to the browser. The query is filtered by `booking_ref`, limiting the blast radius. However, CLAUDE.md §3 specifies admin client should be used in "API routes only." This page could be refactored to call an internal API route instead.

---

## 8. Dead Code / Cleanup

### 8.1 `src/lib/content/rooms.ts` — past deletion deadline

PROGRESS.md Phase 5B: "Retain until ~2026-05-03 (1 week post-deploy)." Today is 2026-05-01 — the deletion deadline is in 2 days. The file has a deprecation comment pointing to the mapper. It should be deleted after confirming no residual imports.

Current import: `src/app/(marketing)/page.tsx:25` still imports `ROOMS` from `rooms.ts` for use in `roomItemList(ROOMS)` on the homepage. This must be replaced with a Supabase query before the file is deleted.

### 8.2 Legacy booking stubs — 4 dead routes

The Phase 0 scaffold created these booking routes (per the CLAUDE.md §3 spec). The actual booking flow was implemented at `/book/[slug]/*` instead. These 4 routes all return `null` and serve no purpose:

- `src/app/(booking)/booking/guest/page.tsx`
- `src/app/(booking)/booking/payment/page.tsx`
- `src/app/(booking)/booking/summary/page.tsx`
- `src/app/(booking)/booking/confirmed/[id]/page.tsx`

The `/booking/page.tsx` itself also returns `null` but is actively linked from the header "Book Now" — it needs content (see §2.3), not deletion.

### 8.3 TODO comments — 9 open

| File | Line | Content |
|---|---|---|
| `src/app/(marketing)/experiences/page.tsx` | 55 | Upload experience banner images to R2 |
| `src/app/api/newsletter/route.ts` | 14 | Implement Supabase write + Resend send |
| `src/components/marketing/homepage/nearby-attractions.tsx` | 22 | Wire href when detail pages built |
| `src/lib/content/blog.ts` | 1 | Replace placeholder blog data with Supabase fetch |
| `src/lib/content/dining.ts` | 1 | Upload dining hero photo to R2 |
| `src/lib/content/experiences.ts` | 1 | Upload experience images to new R2 bucket |
| `src/lib/content/homepage.ts` | 1 | Editorial pass for keyword-stuffed copy |
| `src/lib/content/nearby.ts` | 1 | Replace Bhojpur temple placeholder image |
| `src/lib/content/rooms.ts` | top | Deprecated — replace with queries + mapper |

### 8.4 OTP routes — stubs

`src/app/api/otp/send/route.ts` and `src/app/api/otp/verify/route.ts` both return `{ error: "Not implemented" }` with 501. The booking flow does not use them (Razorpay handles the payment without OTP). These are Phase 0 scaffold stubs that were never needed in the final booking implementation. They can be deleted or left as infrastructure for a future "phone OTP before booking" feature.

### 8.5 No large commented-out code blocks found

Searched all of `src/` for multi-line commented-out code. No significant blocks found. Comments present are: single-line explanatory comments, section dividers, and the 9 TODO items above.

---

## 9. Security & Best Practice Issues

### 9.1 Admin email hardcoded in 13 separate route files

Every admin API route handler file contains:
```ts
const ADMIN_EMAIL = "madhubanecoretreat@gmail.com";
```

This string appears in 13 route files independently. If the admin account email ever changes, all 13 files need manual updates. The correct pattern is `process.env.ADMIN_EMAIL` with a fallback, or a shared `src/lib/admin/auth.ts` constant. Currently the email is also not in the documented env vars list in CLAUDE.md §17.

The authorization check itself is correct — server-side, email-verified, returns 401 if not matched.

### 9.2 Service role client used in a page component

`src/app/(booking)/book/confirmation/page.tsx:43`:
```ts
const supabase = createAdminClient();
```

`createAdminClient()` uses `SUPABASE_SERVICE_ROLE_KEY` which bypasses all Row Level Security. CLAUDE.md §3 comments the admin client as "API routes only." This is a server component so the key is never exposed to the browser — the immediate security risk is low. But if this component ever gains client-side interactivity, the pattern would become dangerous. Refactoring to call an internal API route is the cleaner long-term approach.

### 9.3 No server-side rate limiting on form endpoints

Documented known gap from Phase 6 PROGRESS.md:

| Endpoint | Honeypot | Rate limiting |
|---|---|---|
| `POST /api/forms/contact` | ✅ `website` field | ❌ none |
| `POST /api/forms/booking` | ✅ `website` field | ❌ none |
| `POST /api/newsletter` | ❌ none | ❌ none |
| `POST /api/leads` | N/A (501 stub) | N/A |

The newsletter endpoint has no honeypot and no rate limiting. With the endpoint public and functional (it validates and returns 200), it could be used to enumerate valid email responses.

### 9.4 robots.txt disallows wrong payment path

`src/app/robots.ts:4`:
```ts
disallow: ["/admin", "/api", "/booking/payment"]
```

The actual payment page is at `/book/[slug]/payment`. The disallow rule `/booking/payment` matches a path that doesn't exist. The real payment page is not in the disallow list.

The payment page does emit `robots: { index: false, follow: false }` via `buildMetadata({ noIndex: true })`, so it won't be indexed even if crawled. But multi-layer protection (robots + noindex) is better than noindex-only.

Fix: change to `"/book/*/payment"` or `/book/` entirely.

### 9.5 No hardcoded secrets found

Searched `src/` for `rzp_live_`, `rzp_test_`, API key patterns, and credentials. None found. All secrets use `requireEnv()` or `process.env.*`. ✅

### 9.6 Razorpay webhook endpoint — verification present

`src/app/api/webhooks/razorpay/route.ts` uses `req.text()` (not `req.json()`) for raw body HMAC verification. `verifyWebhookSignature` is called before processing. ✅

### 9.7 Resend sandbox restriction — known, unresolved

From Phase 6 PROGRESS.md: "Resend sandbox restricts email delivery to verified test addresses only." The contact form, booking enquiry form, and booking confirmation emails all use Resend. In production, emails will not deliver to `madhubanresort@somaiya.com` until either:
- `madhubanecoretreat@gmail.com` is added as a verified test address in Resend dashboard, OR
- `madhubanecoretreat.com` domain is DNS-verified in Resend

This is a configuration gap, not a code bug. But it means zero emails are being delivered from any form on the site right now.

---

## 10. Recommendations Prioritized

### 🔴 Critical (do before launch — blocking user journeys or legal compliance)

1. **Fix header "Book Now" → `/booking` (returns null).** Every primary CTA on every page goes to a blank screen. Options: (a) redirect `/booking` → `/stay` so users pick a room first, (b) build a room-selector landing at `/booking`, or (c) change header CTA to `/enquire` as the booking entry point. Found: `src/components/marketing/header/index.tsx:66-80`.

2. **Build or populate the 5 high-traffic blank pages**: `/about-us`, `/dining`, `/day-outing`, `/nearby-attractions`, `/gallery`. These are in the primary navigation. A blank `<Dining>` page linked from the top nav is visible on every page load and undermines all other polish. Minimum: 3-4 sections each plus JSON-LD.

3. **Implement all 4 policy pages** (`/privacy-policy`, `/terms-and-condition`, `/cookies-and-consent-policy`, `/disclaimer`). The cookie banner links directly to `/cookies-and-consent-policy` — that page returns null. Under DPDP (India) and standard GDPR practice, a cookie consent mechanism that links to a blank policy page is non-compliant. Found: all return null in `src/app/(marketing)/(policies)/*/page.tsx`.

4. **Fix `/not-found.tsx` — currently returns null.** Every 404 on the site shows a blank page. Build a proper 404 with navigation links and a return-home CTA. Found: `src/app/not-found.tsx:1`.

5. **Implement `sitemap.ts`** — currently returns `[]`. Build it to include all static routes, all room slugs (from Supabase), all blog post slugs (from Supabase), and experience slugs. Found: `src/app/sitemap.ts:3`.

6. **Upload experience banner hero image.** The experiences index page `<Image fill priority>` is a 404 — this will fail Largest Contentful Paint. Found: `src/app/(marketing)/experiences/page.tsx:57`, noted in Phase 8 known gaps.

7. **Add `og-default.jpg` to `public/`.** The `public/` directory is completely empty. Every page without an explicit `ogImage` renders a broken image in social sharing cards. Found: `src/lib/seo.ts:5` references `${BASE_URL}/og-default.jpg` which doesn't exist.

8. **Fix robots.ts — disallow correct payment path.** Change `/booking/payment` → `/book/*/payment`. Found: `src/app/robots.ts:4`.

9. **Configure Resend for production email delivery.** Zero emails are being delivered from any form. The contact form, booking enquiry form, and booking confirmation all silently fail email send. This must be resolved before any real users submit forms. Found: PROGRESS.md Phase 6 known gap.

### 🟡 Important (fix in next 2 phases)

10. **Build `/corporate-offsite` page.** Referenced from the homepage CTA section, currently blank. Corporate bookings are likely high-value.

11. **Add JSON-LD to blog index page.** `blogs/page.tsx` has no `<Seo>` component. Per CLAUDE.md §7.2, it needs `Blog + ItemList` schemas. Found: `src/app/(marketing)/blogs/page.tsx` — no schema at all.

12. **Add `Resort + hasOfferCatalog + FAQPage` schemas to `/stay` page.** Currently only has `BreadcrumbList`. Found: `src/app/(marketing)/stay/page.tsx:36`.

13. **Activate `/stay/pool-side-room` redirect.** Commented out in `next.config.ts:20`. Old site had this URL; it needs a 301 to preserve SEO equity at launch.

14. **Centralize admin email to env var.** `ADMIN_EMAIL` hardcoded in 13 route files. Move to `process.env.ADMIN_EMAIL`. Found: all files under `src/app/api/admin/`.

15. **Implement newsletter Supabase write.** `/api/newsletter/route.ts:14` has TODO. Footer newsletter form submits successfully but stores nothing. Found: `src/app/api/newsletter/route.ts`.

16. **Implement leads API.** `/api/leads/route.ts` returns 501. Contact forms are the primary lead-capture mechanism. Per CLAUDE.md §22 success criteria: "All 30+ form submissions land in Supabase `leads` table." Currently zero. Found: `src/app/api/leads/route.ts:2`.

17. **Fix blog listing page to use `<Image>` component.** Replace raw `<img>` in `blogs/page.tsx:26-37` with `<Image>`, use `R2_BASE` env var, and replace the room image with a proper blog hero image.

18. **Build `/thank-you` page.** CLAUDE.md §5 lists it as the post-enquiry destination. Currently blank. Found: `src/app/(marketing)/thank-you/page.tsx:1`.

19. **Replace blog filter bar hardcoded offset.** `sticky top-[72px]` should reference `--header-height` token. Found: `src/app/(marketing)/blogs/page.tsx:53`.

20. **Add rate limiting to form endpoints.** Known Phase 6 gap. `/api/forms/contact`, `/api/forms/booking`, and especially `/api/newsletter` (no honeypot) need IP-based rate limiting. Resend is billed per email; an unprotected endpoint is a cost risk.

### 🟢 Nice-to-have (someday, not blocking launch)

21. **Delete `src/lib/content/rooms.ts`** (2 days past deadline). First replace the `ROOMS` import on `homepage/page.tsx:25` with a Supabase query.

22. **Delete 4 legacy booking stub routes** (`/booking/guest`, `/booking/payment`, `/booking/summary`, `/booking/confirmed/[id]`). They are dead code from Phase 0.

23. **Decide on WhatsApp floater color.** `#25D366` violates CLAUDE.md §4. Either update the CLAUDE.md rule to explicitly exempt the WhatsApp floater (documenting the intent), or restyle to brand palette. Found: `src/components/marketing/whatsapp-floater.tsx:23`.

24. **Normalize blog page styling to use design system.** `blogs/page.tsx` and `blogs/[slug]/page.tsx` use raw CSS variables and bypass `<Container>` / `<Section>` / brand utility classes. Low visual impact (pages render fine) but creates maintenance inconsistency.

25. **Build admin gallery module.** `gallery_albums` and `gallery_images` tables exist with no management UI. Currently the gallery page returns null anyway, so this is blocked by item 2 above.

26. **Build admin reports module.** Revenue, occupancy, GST summary reports are in CLAUDE.md §9.2 spec but not implemented.

27. **Refactor confirmation page to use an API route** instead of `createAdminClient()` directly in a page component. Low security risk now (server component) but a pattern inconsistency. Found: `src/app/(booking)/book/confirmation/page.tsx:43`.

28. **Standardize hero H1 size and styling** across marketing pages. Room detail, experiences, and blog detail each use different font sizes and layout approaches for the hero H1.

29. **Verify DB indexes exist** for `rooms(slug, is_active)`, `blog_posts(status, published_at)` etc. Cannot confirm from code alone — needs a `\d` check in Supabase.

---

## Appendix: File path quick-reference for top issues

| Issue | File | Line |
|---|---|---|
| Header Book Now → blank page | `src/components/marketing/header/index.tsx` | 66–80 |
| About-us blank | `src/app/(marketing)/about-us/page.tsx` | 1 |
| Dining blank | `src/app/(marketing)/dining/page.tsx` | 1 |
| Day-outing blank | `src/app/(marketing)/day-outing/page.tsx` | 1 |
| Nearby-attractions blank | `src/app/(marketing)/nearby-attractions/page.tsx` | 1 |
| Gallery blank | `src/app/(marketing)/gallery/page.tsx` | 1 |
| All 4 policy pages blank | `src/app/(marketing)/(policies)/*/page.tsx` | 1 |
| 404 page blank | `src/app/not-found.tsx` | 1 |
| Sitemap empty | `src/app/sitemap.ts` | 3 |
| robots wrong path | `src/app/robots.ts` | 4 |
| OG image missing from public/ | `public/` directory | — |
| Experience banner 404 | `src/app/(marketing)/experiences/page.tsx` | 57 |
| Blog missing JSON-LD | `src/app/(marketing)/blogs/page.tsx` | — |
| Stay missing schemas | `src/app/(marketing)/stay/page.tsx` | 36 |
| Leads API 501 | `src/app/api/leads/route.ts` | 2 |
| Newsletter not writing to DB | `src/app/api/newsletter/route.ts` | 14 |
| Admin email hardcoded | `src/app/api/admin/*/route.ts` | top of each file |
| WhatsApp floater forbidden color | `src/components/marketing/whatsapp-floater.tsx` | 23 |
| Deprecated rooms.ts | `src/lib/content/rooms.ts` | top |
| Blog raw img tag | `src/app/(marketing)/blogs/page.tsx` | 26–37 |
| pool-side-room redirect commented out | `next.config.ts` | 20 |
