# CLAUDE.md — Madhuban Eco Retreat Rebuild

> **Read this file before every session. Don't skip it.**
> This document is the complete instruction set for rebuilding madhubanecoretreat.com from scratch. Every decision has been made. Every convention is documented. Follow it faithfully.

---

## 0 — Identity & Mission

**Project:** Madhuban Eco Retreat — eco-luxury forest resort adjacent to Ratapani Tiger Reserve, 60 km from Bhopal, Madhya Pradesh.
**Parent:** Somaiya Group. **Property manager:** Shibajee.
**Live site:** https://www.madhubanecoretreat.com/
**Phone:** +91 9770558419 · **Email:** madhubanresort@somaiya.com
**Physical address:** Near Ratapani Wildlife Sanctuary, Village Bori, Salkanpur Road, Rehti, Sehore, MP — 466446
**Geo (approximate):** 22.88°N, 77.52°E

**We are rebuilding three things, staggered:**

1. **Website** (user-facing) — same visual design, content, images as the existing site. Rebuild the code layer only.
2. **Booking engine** (4-step flow: select room → guest details + OTP → summary → Razorpay payment → confirmation).
3. **Admin panel** (Bookings module + CMS module, with RBAC).

**The three priorities in order:** SEO (technical + GEO + AEO), UX (mobile-first), Brand (consistent, premium, eco-luxury).

---

## 1 — Ground Rules (never violate)

1. **No code from the old repo gets ported without inspection.** Read `/OLD-REFERENCE/` for content and design cues. Never copy-paste.
2. **URLs are sacred.** The list in §17 is final. No renaming, no changing. Every existing URL redirects to the same path on new site.
3. **The current visual design, palette, fonts-feel, and content stay the same.** We are NOT evolving the palette to Forest Night + Teak Gold. Keep what's live: brown `#6e6146`, beige `#D1C8C1`, charcoal text. We fix bugs silently; we don't redesign.
4. **TypeScript strict mode. No `any` types without a comment explaining why.**
5. **Server Components by default. `'use client'` only when truly needed** (useState, event handlers, browser APIs). Never `'use client'` on a section just because it has animations.
6. **Every page that has FAQs emits `FAQPage` JSON-LD.** Non-negotiable. See §7.
7. **Every page is LCP <2.5s on mobile, LH 95+.** Non-negotiable. Build with this in mind, don't optimize later.
8. **No tracking script fires before cookie consent.** See §13.
9. **No client-side secrets.** Supabase service role key, Razorpay secret, Resend API key — server-side only. Enforce with TypeScript + ESLint.
10. **No more duplicate components. One template, data-driven** — especially experience pages and policy pages (both were duplicated 3-4× in the old codebase).

---

## 2 — Tech Stack (locked)

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 App Router | SSR/SSG/ISR + API routes |
| Language | TypeScript (strict) | Type safety for money math, DB, API |
| React | 19.x | Latest stable |
| Styling | Tailwind CSS v4 | Utility-first, CSS-based theme |
| Components | shadcn/ui (Radix primitives) | Zero bundle bloat, WCAG AA |
| Icons | lucide-react **only** | Kill react-icons, @mui/icons, @fancyapps |
| Fonts | `next/font/google` | Cormorant Garamond (display) + DM Sans (body). Self-hosted, not `@import` |
| DB | Supabase (Postgres + Auth + Storage + RLS) | Existing 15 tables, data seeded |
| Images | Cloudflare R2 (current URLs) + `next/image` | No Cloudflare Images migration |
| Payments | Razorpay (KYC pending — use sandbox until ready) | India's best payment rails |
| Email | Resend | Transactional, 3k/mo free |
| Forms | react-hook-form + zod | Validation, type-safe |
| Dates | date-fns + react-day-picker | Replaces react-datepicker + MUI x-date-pickers |
| Animation | Framer Motion (sparingly) + CSS transitions | 60-70% less animation than old code |
| State | Zustand (only if needed) + React Query for server state | Most state = server state |
| Hosting | Vercel (Hobby → Pro at launch if needed) | Native Next.js |
| CDN | Cloudflare proxy in front of Vercel | DDoS, SSL |
| Monitoring | Sentry (post-launch) + Vercel Analytics | |

**Kill list (remove entirely from project):**
- MUI (`@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`)
- `@emotion/react`, `@emotion/styled`
- `styled-components`
- `@fancyapps/ui`
- `react-icons`
- `axios` (use native `fetch`)
- `js-cookie` (use Next.js cookies API)
- All per-component `.css` files (`Dining.css`, `contactPage.css`, etc.)

---

## 3 — Folder Structure

```
src/
├── app/
│   ├── (marketing)/              ← public website
│   │   ├── layout.tsx            ← header + footer shell
│   │   ├── page.tsx              ← /
│   │   ├── about-us/page.tsx
│   │   ├── stay/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx   ← dynamic room detail
│   │   ├── experiences/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx   ← ONE template, data-driven
│   │   ├── dining/page.tsx
│   │   ├── day-outing/page.tsx
│   │   ├── nearby-attractions/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── contact-us/page.tsx
│   │   ├── blogs/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx   ← slug, not [id]
│   │   ├── (policies)/
│   │   │   ├── privacy-policy/page.tsx
│   │   │   ├── terms-and-condition/page.tsx
│   │   │   ├── cookies-and-consent-policy/page.tsx
│   │   │   └── disclaimer/page.tsx
│   │   └── packages/
│   │       └── 2-day-digital-detox/page.tsx
│   ├── (booking)/                ← guest booking flow
│   │   ├── layout.tsx            ← minimal header
│   │   └── booking/
│   │       ├── page.tsx          ← step 1
│   │       ├── guest/page.tsx    ← step 2
│   │       ├── summary/page.tsx  ← step 3
│   │       ├── payment/page.tsx  ← step 4
│   │       └── confirmed/[id]/page.tsx
│   ├── (admin)/                  ← admin panel
│   │   ├── layout.tsx            ← sidebar + topbar
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── reservations/
│   │   ├── bookings/
│   │   ├── rooms/
│   │   ├── pricing/
│   │   ├── availability/
│   │   ├── blog/
│   │   ├── gallery/
│   │   ├── content/
│   │   ├── coupons/
│   │   ├── invoices/
│   │   └── users/
│   ├── api/
│   │   ├── bookings/
│   │   │   ├── create-order/route.ts
│   │   │   └── verify-payment/route.ts
│   │   ├── availability/route.ts
│   │   ├── otp/
│   │   │   ├── send/route.ts
│   │   │   └── verify/route.ts
│   │   ├── leads/route.ts        ← contact form captures
│   │   ├── newsletter/route.ts
│   │   ├── webhooks/razorpay/route.ts
│   │   └── admin/
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── global-error.tsx
│   └── layout.tsx                ← root: fonts, metadata, consent
├── components/
│   ├── marketing/                ← public site sections
│   ├── booking/                  ← booking engine UI
│   ├── admin/                    ← admin-only UI
│   └── ui/                       ← shared shadcn components
├── lib/
│   ├── supabase/
│   │   ├── client.ts             ← browser client
│   │   ├── server.ts             ← server client
│   │   ├── admin.ts              ← service role client (API routes only)
│   │   └── database.types.ts     ← auto-generated from schema
│   ├── razorpay.ts
│   ├── resend.ts
│   ├── schema/                   ← JSON-LD generators per schema type
│   │   ├── lodging-business.ts
│   │   ├── resort.ts
│   │   ├── room.ts
│   │   ├── faq-page.ts
│   │   ├── article.ts
│   │   ├── breadcrumb-list.ts
│   │   └── speakable.ts
│   ├── seo.ts                    ← generateMetadata helper
│   ├── gst.ts                    ← GST back-calc for 12% and 18% slabs
│   ├── bookings/                 ← booking state machine, validators
│   ├── content/                  ← typed copy decks per page
│   └── utils.ts
├── hooks/
│   ├── use-availability.ts
│   ├── use-booking.ts
│   └── use-consent.ts
├── content/                      ← markdown / typed JSON for CMS fallback
└── content/                      ← markdown / typed JSON for CMS fallback
```

> **globals.css location:** `src/app/globals.css` (Next.js community convention). Do NOT create a separate `src/styles/` folder.

**Imports:** absolute via `@/` alias. No relative `../../../`.

**Config file conventions:**
- `next.config.ts` — TypeScript (not `.js` or `.mjs`)
- `eslint.config.ts` — TypeScript flat config (ESLint 9, not `.eslintrc.*`)
- `postcss.config.mjs` — keep as `.mjs` (PostCSS does not support TS config)
- No `tailwind.config.js` — Tailwind v4 uses `@theme` in `globals.css` only

---

## 4 — Brand System (keep current, just cleanly defined)

### Colors (CSS variables in `globals.css`)

```css
:root {
  /* Primary palette (keep from current live site) */
  --color-earth-brown: #6E6146;          /* primary brand, CTAs, dark backgrounds */
  --color-warm-beige:  #D1C8C1;          /* secondary, page surfaces */
  --color-cream:       #FAF7F2;          /* light page bg, cards */
  --color-charcoal:    #2A2A2A;          /* body text */
  --color-ivory:       #FEFCF8;          /* hero text, on-dark text */

  /* Support */
  --color-gold-accent: #C9A84C;          /* small gold highlights, stars, badges */
  --color-moss-green:  #4A6741;          /* tags, eco-badges only */
  --color-blush-dusk:  #D4A76A;          /* hover states */

  /* Semantic */
  --color-success: #4A6741;
  --color-warning: #C9A84C;
  --color-error:   #B84A4A;

  /* Surfaces */
  --color-border:  #EAE5DC;
  --color-muted:   #8B8578;
}
```

Forbidden colors (remove from old code): `#22c55e`, `#16a34a`, `#4CAF50` (Tailwind greens), `#25D366` (WhatsApp bright green), `#f7f5f0`, `#b4a681d8` (off-brand beiges), `rgb(190,175,145)`, `rgb(204,180,120)` (scattered gold approximations).

### Typography

```ts
// app/layout.tsx
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});
```

- Display font (Cormorant Garamond) — H1, H2, H3, hero text, pull quotes
- Body font (DM Sans) — paragraphs, nav, buttons, forms, captions
- No other fonts. Ever. (Old code referenced Poppins, Open Sans, Inter, Arial Narrow, Sitka Banner, Playfair, Lato, Manrope, Sen — all of them falling back to system fonts silently. None of them ship in the rebuild.)

### Spacing & rhythm

- Base unit: 4px (Tailwind default)
- Section padding: `py-20` desktop (80px), `py-12` mobile (48px)
- Between sections: 120px on desktop for luxury rhythm (the brief insists; old site had too-tight sections)
- Container max-width: 1280px, centered, with `px-4 md:px-6 lg:px-8`

### Component conventions

- Buttons: 48px min-height (mobile tap target)
- Cards: 16px border-radius
- Shadows: subtle only. `shadow-sm` and `shadow-md`. Never `shadow-2xl`.
- Animations: 200-400ms, `ease-out`, only on actual interactions (hover, scroll into view for key hero/CTA). No staggered reveals on every list.

---

## 5 — URL Structure (sacred — do not change)

All URLs match the current live site. Breaking any = SEO disaster.

| Page | URL |
|---|---|
| Home | `/` |
| About | `/about-us` |
| Stay index | `/stay` |
| Safari Tent | `/stay/safari-tent` |
| Mud House 1 | `/stay/mud-house-1` |
| Mud House 2 | `/stay/mud-house-2` |
| Pool Side Villa | `/stay/pool-side-villa` |
| Glamping Tent | `/stay/glamping-tents` |
| Camping Tent | `/stay/camping-tent` |
| Experiences | `/experiences` |
| Forest Walks | `/experiences/forest-walks-and-nature-trails` |
| Bird Watching | `/experiences/bird-watching-and-wilderness` |
| Recreational | `/experiences/recreational-facilities` |
| Dining | `/dining` |
| Day Outing | `/day-outing` |
| Nearby Attractions | `/nearby-attractions` |
| Gallery | `/gallery` |
| Contact | `/contact-us` |
| Booking | `/booking` |
| Blog index | `/blogs` |
| Blog article | `/blogs/[slug]` (note: slug, not id — 301 old `/blogs/[id]` → `/blogs/[slug]` during migration) |
| Privacy | `/privacy-policy` |
| Terms | `/terms-and-condition` |
| Cookies | `/cookies-and-consent-policy` |
| Disclaimer | `/disclaimer` |
| NEW Digital Detox | `/packages/2-day-digital-detox` |
| NEW Corporate Offsite | `/corporate-offsite` |
| Thank You | `/thank-you` (post-enquiry destination) |
| 404 | automatic via `not-found.tsx` |

**If any slug changes during build, add a 301 redirect in `next.config.ts`.**

### Known old-URL fixes needed
- Old sitemap had `/stay/mud-villa` → was wrong URL, was never real page. Don't add a redirect. New sitemap has `/stay/mud-house-1` and `/stay/mud-house-2`.
- Old sitemap had `/stay/pool-side-room` → rename to `/stay/pool-side-villa`, 301 redirect.
- Old blog URLs used `uid` (MongoDB-style) as the path. New blogs use slug. 301 every old blog URL to new slug at migration.

---

## 6 — Data Model (Supabase — already set up, verify shape)

15 tables exist, RLS enabled, data seeded. Before writing code that touches any table:

1. Run `pnpm supabase gen types typescript --project-id <id> > src/lib/supabase/database.types.ts`
2. Verify the schema matches what's in the KT (rooms, pricing_rules, availability, guests, bookings, payments, invoices, manual_blocks, coupons, blog_posts, gallery_albums, gallery_images, admin_users, audit_log, day_outing_packages, experiences)
3. If anything's missing or off, fix the schema via migration before writing app code

### Seeded rooms (source of truth)

| Name | Slug | Price/night (GST-inc) | GST rate |
|---|---|---|---|
| Safari Tent | `safari-tent` | ₹5,000 | 12% |
| Mud House 1 (with bathtub) | `mud-house-1` | ₹6,000 | 12% |
| Mud House 2 (without bathtub) | `mud-house-2` | ₹5,500 | 12% |
| Pool Side Villa | `pool-side-villa` | ₹5,500 | 12% |
| Glamping Tent | `glamping-tents` | ₹4,500 | 12% |
| Camping Tent | `camping-tent` | ₹2,500 | 12% |

All current rooms are under ₹7,500/night so all 12% GST. If any room price is ever set ≥ ₹7,500/night via admin panel, GST rate auto-flips to 18% in `lib/gst.ts`.

### Storage

- `resort-images` — public bucket. All marketing images.
- `invoices` — private. Signed URLs only, 1-hour expiry.

---

## 7 — SEO (this is the priority — treat it first-class, not a Phase 9 afterthought)

### 7.1 Metadata — every page uses `generateMetadata()`

```ts
// lib/seo.ts
export function buildMetadata({
  title,
  description,
  canonical,
  ogImage,
}: BuildMetadataInput): Metadata {
  const base = 'https://www.madhubanecoretreat.com';
  return {
    metadataBase: new URL(base),
    title,                              // ≤60 chars
    description,                        // ≤160 chars
    alternates: { canonical: `${base}${canonical}` },
    openGraph: {
      title,
      description,
      url: `${base}${canonical}`,
      siteName: 'Madhuban Eco Retreat',
      images: [ogImage || `${base}/og-default.jpg`],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage || `${base}/og-default.jpg`],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  };
}
```

**Character rules:**
- Title: ≤60 chars including pipe. `Page — Madhuban Eco Retreat` (keep "Madhuban Eco Retreat" suffix short for brand)
- Description: ≤160 chars, active voice, includes primary keyword and location

### 7.2 JSON-LD schema — every relevant page

Use `lib/schema/*` helpers to build these. Render via a `<Seo schemas={[...]} />` component that emits `<script type="application/ld+json">` with `<` escaped to `\u003c`.

| Page | Schemas required |
|---|---|
| Homepage | `LodgingBusiness` + `Resort` + `LocalBusiness` + `FAQPage` |
| About | `LodgingBusiness` + `AboutPage` |
| Stay index | `Resort` + `hasOfferCatalog` of 6 rooms + `FAQPage` |
| Each room page | `LodgingBusiness` + `Room` + `Offer` + `AggregateRating` + `FAQPage` |
| Experiences index | `CollectionPage` + `ItemList` of experiences + `FAQPage` |
| Each experience | `TouristTrip` + `TouristAttraction` + `FAQPage` |
| Dining | `FoodEstablishment` + `FAQPage` |
| Day Outing | `Product` + `Offer` + `FAQPage` |
| Nearby Attractions | `ItemList` of `TouristAttraction` + `FAQPage` |
| Contact | `ContactPage` + `LodgingBusiness` |
| Blog index | `Blog` + `ItemList` |
| Blog article | `BlogPosting` + `Author` + `Organization` publisher + conditional `FAQPage` |
| Gallery | `ImageGallery` with real image URLs |
| Policies (all 4) | `WebPage` |

**BreadcrumbList** on every page except homepage. Generated automatically from the URL path via a helper.

### 7.3 NAP consistency — one source of truth

Never hardcode address fragments anywhere. Import from a single file:

```ts
// lib/content/business.ts
export const BUSINESS = {
  name: 'Madhuban Eco Retreat',
  legalName: 'Madhuban Eco Retreat (A Somaiya Group Initiative)',
  phone: '+919770558419',
  email: 'madhubanresort@somaiya.com',
  address: {
    streetAddress: 'Near Ratapani Wildlife Sanctuary, Village Bori, Salkanpur Road',
    locality: 'Rehti',
    region: 'Madhya Pradesh',
    postalCode: '466446',
    country: 'IN',
    district: 'Sehore',
  },
  geo: {
    latitude: 22.88,
    longitude: 77.52,
  },
  sameAs: [
    'https://www.facebook.com/madhubanecoretreat/',
    'https://www.instagram.com/madhubanecoretreat/',
    'https://www.linkedin.com/company/madhuban-eco-retreat-ratapani-sanctuary/',
    'https://www.youtube.com/@madhuban-eco-retreat',
    'https://x.com/madhubanretreat',
    'https://www.pinterest.com/madhubanecoretreat/',
    'https://www.tumblr.com/madhuban-eco-retreat',
    'https://www.reddit.com/user/Naive-Transition-394/',
    'https://www.quora.com/profile/Madhuban-Eco-Retreat',
  ],
} as const;
```

**The old code had 6 different versions of this address across pages. That stops. One import, one truth.**

### 7.4 GEO/AEO (answer engine optimization)

Every page must have:

- **Answer Block** — 40-80 words of plain prose near the top that directly answers the page's primary query. Marked with `SpeakableSpecification` schema for voice search.
- **Minimum 5 FAQs** with `FAQPage` schema. Phrased as people actually ask ("Is Madhuban Eco Retreat open for day visits?" not "What are visiting hours?").
- **Factual density** — state distances, counts, prices as facts. "60 km from Bhopal · 70+ bird species · 80% solar-powered" type strips.

### 7.5 Sitemap & robots

- `src/app/sitemap.ts` generates dynamic sitemap including all blog posts from Supabase
- `src/app/robots.ts` allows all, disallows `/admin`, `/api`, `/booking/payment`, points to sitemap
- Submit sitemap to Google Search Console on launch day

### 7.6 Redirects (preserve SEO equity)

Configure in `next.config.ts` at launch:

```ts
async redirects() {
  return [
    { source: '/stay/pool-side-room', destination: '/stay/pool-side-villa', permanent: true },
    { source: '/stay/mud-villa', destination: '/stay/mud-house-1', permanent: true },
    // blog slug migrations generated from a map file
  ];
}
```

### 7.7 Core Web Vitals targets

- LCP: <2.5s (hero image preloaded with `priority` + `fetchPriority="high"` + explicit `sizes`)
- INP: <200ms (no heavy JS on tap, debounce search inputs)
- CLS: <0.1 (all images have width/height, fonts use `font-display: swap`, reserve skeleton heights)
- Lighthouse mobile target: 95+ performance, 100 SEO, 100 accessibility

---

## 8 — Booking Engine (Phase 6-7)

### 8.1 Flow

```
/booking
  ↓ select dates + rooms + guests
/booking/guest
  ↓ guest details + OTP verify phone (MSG91 or Twilio)
/booking/summary
  ↓ show price breakdown, GST-inclusive, coupon apply
/booking/payment
  ↓ Razorpay order created, checkout modal
  ↓ payment success → HMAC verify → mark CONFIRMED
/booking/confirmed/[id]
  ↓ email + WhatsApp confirmation sent + PDF voucher
```

### 8.2 Booking number format

`MBR-YYYYMMDD-XXXX` where XXXX is a 4-digit sequence per day. Stored in `bookings.reference_number`.

### 8.3 GST rules (see `lib/gst.ts`)

```ts
export function gstRate(nightlyRate: number): 12 | 18 {
  return nightlyRate >= 7500 ? 18 : 12;
}

export function priceBreakdown(totalInclusive: number, gstRate: 12 | 18) {
  const base = +(totalInclusive / (1 + gstRate / 100)).toFixed(2);
  const gst = +(totalInclusive - base).toFixed(2);
  return { base, gst, total: totalInclusive };
}
```

Prices shown to user are **always** GST-inclusive. Invoice shows breakup. Food/beverage line items = 5% GST.

### 8.4 Razorpay

- Order created server-side in `/api/bookings/create-order` using `RAZORPAY_KEY_SECRET` (never expose)
- Client opens checkout with `order_id`
- On success, POST to `/api/bookings/verify-payment` with HMAC SHA256 signature verification
- Webhook at `/api/webhooks/razorpay` for `payment.captured`, `payment.failed`, `refund.processed`
- Payment failure → booking held `PENDING_PAYMENT` for 15 min, then room released

**Until KYC clears: use sandbox credentials. Booking engine is functional but cannot process real payments. Admin panel shows warning banner when in sandbox mode.**

### 8.5 Advance payment

**50% at booking, 50% at check-in.** Configured in `lib/bookings/policy.ts`. Razorpay charges 50% of total. Balance tracked in `bookings.balance_due`. Admin panel shows balance. Check-in workflow captures the rest.

### 8.6 Cancellation policy (final)

| Days before check-in | Refund % |
|---|---|
| 7 or more | 90% |
| 3 to 7 | 50% |
| Less than 3 | 0% |
| No-show | 0% |

Implemented in `lib/bookings/refund.ts`. Show policy text on summary page + in confirmation email.

### 8.7 Booking status state machine

```
PENDING_PAYMENT → CONFIRMED → CHECKED_IN → CHECKED_OUT
                         ↓
                     CANCELLED / NO_SHOW
```

Every transition writes to `audit_log`. Illegal transitions throw. Managed in `lib/bookings/state-machine.ts`.

### 8.8 GST invoice

- Format: `MBR-INV-YYYY-XXXX` (sequential per financial year)
- Issuing entity: **Somaiya Group** (parent). Invoice header reads "Issued by Somaiya Group, property Madhuban Eco Retreat" with Somaiya GSTIN. Full Somaiya registered address.
- Generated as PDF via `@react-pdf/renderer`, stored in private `invoices` bucket with signed URL
- Cannot edit after generation — issue credit note instead (separate PDF series `MBR-CN-YYYY-XXXX`)

---

## 9 — Admin Panel (Phase 7-8)

### 9.1 Roles

- `super_admin` — all access, user management, delete operations
- `manager` — all business features, no user management
- `receptionist` — bookings module only, no CMS, no reports

Enforced via Supabase RLS **and** Next.js middleware. Both layers. Never trust client.

### 9.2 Modules

**Bookings module:**
- Dashboard with today's arrivals/departures/in-house
- All reservations with filters (date range, source, status)
- Calendar view with occupancy heatmap
- Booking detail (assign room number, check-in, check-out, add charges, cancel, refund)
- Manual booking creation (walk-in / phone / corporate)
- GST invoice generation
- Reports: occupancy, revenue, booking source, GST summary, cancellation, arrivals/departures

**CMS module:**
- Rooms CRUD (name, slug, description, amenities, images, pricing, GST rate, status)
- Pricing rules (seasonal, weekend, longstay, bulk update)
- Availability calendar (visual block/unblock)
- Stay packages (Digital Detox etc.)
- Blog (create, edit, schedule, publish, SEO fields, categories, tags — rich editor with sanitization)
- Gallery (albums, drag-reorder, featured flag)
- Website content blocks (homepage sections, testimonials, FAQs, guest-types, policies)
- Offers & coupons

### 9.3 Audit log

Every admin write action logs: `user_id`, `timestamp`, `action` (create/update/delete), `entity` (booking/room/etc), `entity_id`, `before_json`, `after_json`. Retained 3 years minimum.

### 9.4 Auth

- Supabase Auth with email + password
- 2FA via TOTP (Google Authenticator) — required for `super_admin` and `manager`
- Session: 12 hours, sliding refresh
- Password reset flow via Resend

---

## 10 — Content Migration (from existing live site)

Reference: `/OLD-REFERENCE/` folder (the read-only copy).

### 10.1 What to keep (extract, retype, clean)

From the old components, extract:
- All page copy (paragraphs, headings, taglines) — retype into `src/lib/content/*.ts` files, typed
- All image URLs (R2 CDN paths) — list in `src/lib/content/images.ts`
- Real testimonials (6 Google reviews) — `src/lib/content/testimonials.ts`
- Room details: amenities, descriptions, highlights — feed into Supabase `rooms` table
- Experience content, FAQs, answers — Supabase + content files
- Blog posts (via migration script from Render backend to Supabase)
- Celebrity guests (Vidya Balan, Vijay Raaz, Samir Somaiya) + image URLs
- Drone videos (R2 paths for hero video)

### 10.2 What to fix silently (bugs, not redesign)

- `Accommodations.jsx` — unfinished sentence `"Every stay at Madhuban Eco Retreat is designed..."` → write full sentence using room content
- `GuestsSection.jsx` — unfinished `"Recognized as one of the best resorts near Ratapani..."` → complete
- Header: hardcoded wrong phone `+917895432160` → use `BUSINESS.phone`
- `OurJourney` WhatsApp icon linking to Facebook → fix to `https://wa.me/919770558419`
- Wikipedia-hosted Facebook/WhatsApp icons → self-host in `/public/icons/`
- 404 page dead links (`/eco-philosophy`, `/contact`) → fix to real routes
- `NewsListPagination.jsx` hitting `/blogs/all/ed_tech` → delete component entirely
- `CommonFaq.js` (singular) with mood-travel sample data → delete
- `VyomEdge` company name leftovers in all 4 policy data objects → remove
- `Gallery - Copy.jsx`, `Footer (1).jsx`, `page (1).jsx` → delete
- Layout metadata `"Create Next App"` + `"Generated by create next app"` → replace with real brand metadata
- Geist + Geist_Mono fonts in layout (unused) → replace with Cormorant + DM Sans

### 10.3 What to rewrite (content quality issues)

- Some paragraphs are keyword-stuffed unnaturally ("best hotel near Ratapani Wildlife Sanctuary at Madhuban Eco Retreat..."). Mark these in content files with `// TODO: copy review` comment. **Do not rewrite them in Phase 1.** Keep live content as-is per client decision. Flag for later editorial pass.

### 10.4 What to delete entirely

- All MUI-using components → rewrite with shadcn/ui (CommonFaqs, ContactModal, CookiesPopup, CustomBanner, all 4 policy page templates)
- Three duplicated experience detail pages → ONE `[slug]/page.tsx` template driven by Supabase experience data
- Four duplicated policy pages → ONE policy template driven by data file
- Two "PhilosopyBenifit" and "SustainabilityFeature" icon mapper components → ONE
- Two identical experience grid components (OurExperiences + ImmersiveExperiences) → ONE with optional CTA prop

---

## 11 — Forms & Lead Capture

**Current problem:** every form in the old site is WhatsApp-redirect-only. No leads captured anywhere. Business loses every enquiry that doesn't manually get written down.

**New rule:** every form POSTs to an API route, which:

1. Writes the lead to Supabase `leads` table (create this table)
2. Sends Resend email to `madhubanresort@somaiya.com` with lead details
3. Sends WhatsApp pre-filled message as secondary channel (optional button, not auto-redirect)
4. Returns success → show inline success state (NOT `alert()`, NOT `window.open()` popup)

**Forms to implement:**
- Contact page form → `/api/leads` with `source: 'contact_page'`
- Contact modal (exit-intent-ish) → `/api/leads` with `source: 'modal'`
- Blog sidebar sticky form → `/api/leads` with `source: 'blog_sidebar'`
- Day outing group enquiry → `/api/leads` with `source: 'day_outing'`
- Corporate offsite enquiry → `/api/leads` with `source: 'corporate'`
- Newsletter signup (footer + dedicated section) → `/api/newsletter` → Supabase `newsletter_subscribers`

Validation with zod. Server-side rate limiting (5 submissions per IP per hour). Honeypot field for bots.

---

## 12 — Tracking & Consent (GDPR/DPDP compliant)

### 12.1 Current violation

Old code fires GA4, GTM, and Contentsquare on page load, before consent. That stops in the rebuild.

### 12.2 New model

Nothing fires until `consent.analytics === true` or `consent.marketing === true` (depending on the tool).

```ts
// hooks/use-consent.ts
export type ConsentState = {
  necessary: true;         // always
  analytics: boolean;      // GA4, Vercel Analytics
  marketing: boolean;      // GTM (for ad pixels), Contentsquare
};
```

### 12.3 Cookie banner

Three buttons: Accept All, Reject All, Manage Preferences. No dark patterns. "Reject All" is the same visual weight as "Accept All". Manage Preferences opens a dialog with three toggles (Necessary fixed-on, Analytics, Marketing).

Stored in `consent_v1` cookie. 365-day expiry. Visible on every page until consent given.

### 12.4 Script loading

GA4, GTM, Contentsquare loaded conditionally via `next/script` with `strategy="lazyOnload"` and only mounted when consent is granted:

```tsx
<ConsentGate category="analytics">
  <Script src="https://www.googletagmanager.com/gtag/js?id=G-DBTW8G5KT3" />
  {/* GA4 init */}
</ConsentGate>
```

---

## 13 — Performance Rules

1. **Server Components by default.** `'use client'` ONLY when necessary.
2. **Hero images:** `priority` + `fetchPriority="high"` + explicit `sizes` + next-gen formats (AVIF → WebP → JPG fallback). Never background-image CSS for hero.
3. **Below-fold images:** `loading="lazy"` always. Default behavior in Next 15 for non-priority images.
4. **Fonts:** `next/font/google` with `display: 'swap'`. Subset to Latin only.
5. **Videos:** Never autoplay a full-resolution MP4 in background. Use a static `poster` image, load video on user interaction or when idle.
6. **Third-party scripts:** `strategy="lazyOnload"`. None in `<head>` sync.
7. **Bundle:** monitor with `@next/bundle-analyzer`. Keep first-load JS under 150KB per route.
8. **Framer Motion:** lazy-import when needed. Never on critical render path.
9. **No `@import url('https://fonts.googleapis.com/...')` in CSS files.** Render-blocking.
10. **Preconnect** to Cloudflare R2 bucket and Razorpay checkout:

```tsx
<link rel="preconnect" href="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev" crossOrigin="anonymous" />
<link rel="preconnect" href="https://checkout.razorpay.com" />
```

---

## 14 — Accessibility (WCAG 2.1 AA, not aspirational)

- Semantic HTML always. `<nav>`, `<main>`, `<article>`, `<section>` — never divs for structure.
- One `<h1>` per page. Headings in order (h1 → h2 → h3).
- All interactive elements keyboard-accessible with visible focus ring.
- Color contrast ratio verified: body text 4.5:1, large text 3:1.
- All images have alt text. Decorative images use `alt=""`. No auto-derivation from filename (replace `getAltFromUrl` with curated alt per image — source from Supabase or content files).
- All form inputs have associated `<label>`.
- Skip-to-content link in layout.
- `prefers-reduced-motion` respected — if user has reduced motion preference, Framer animations become opacity-only, no transforms.
- Videos must have captions or transcript link.

---

## 15 — Testing Strategy

- **Unit (Vitest):** `lib/gst.ts`, `lib/bookings/state-machine.ts`, `lib/bookings/refund.ts`, schema builders, any pure function touching money or data shape
- **Integration (Vitest + mock Supabase):** API routes (booking create, payment verify, lead capture)
- **E2E (Playwright):** 5 critical flows only — (1) can a user book a room, (2) can a user submit contact form, (3) can admin log in and view dashboard, (4) does payment flow succeed with test Razorpay, (5) does cancellation refund calc correctly
- **Visual regression:** not Phase 1. Add later if needed.

Target: 80% unit coverage on `lib/`. API routes 100% integration-tested on happy path + known error paths.

---

## 16 — Deployment

- GitHub repo: `Mousam-kourav/madhuban-web` (the one you're in now — we're replacing its contents)
- Vercel project: Hobby for dev/preview. Pro at launch if team collaboration needed.
- Cloudflare: DNS + proxy in front of Vercel. SSL terminated at Cloudflare, passed through.
- Preview deployments: every PR gets a preview URL.
- Staging: `main` branch auto-deploys to staging.
- Production: manual promote via Vercel UI or GitHub release tag.
- Env vars: in Vercel dashboard across Production + Preview + Development. Never committed.
- Branch protection on `main`: require PR, require status checks (build + test + typecheck + lint).

---

## 17 — Environment Variables

Create `.env.local` (never commit). Vercel env vars mirror these.

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=

# Razorpay (sandbox until KYC clears)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_WEBHOOK_SECRET=

# Email
RESEND_API_KEY=
RESEND_FROM_EMAIL=bookings@madhubanecoretreat.com

# SMS OTP
MSG91_API_KEY=
MSG91_SENDER_ID=MADHBN
MSG91_TEMPLATE_ID=

# App
NEXT_PUBLIC_SITE_URL=https://www.madhubanecoretreat.com
NEXT_PUBLIC_SITE_NAME=Madhuban Eco Retreat
NEXT_PUBLIC_WHATSAPP_NUMBER=+919770558419

# Admin
ADMIN_JWT_SECRET=
ADMIN_SESSION_EXPIRY_HOURS=12

# Image CDN
NEXT_PUBLIC_R2_BASE=https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev

# Analytics (consent-gated)
NEXT_PUBLIC_GA4_ID=G-DBTW8G5KT3
NEXT_PUBLIC_GTM_ID=GTM-MKKPGJ72

# Monitoring
SENTRY_DSN=
```

Rotate and add Vercel token to Azure pipeline secrets (NOT committed to `azure-pipelines.yml` anymore).

---

## 18 — Git Workflow

- Branch from `main`. Name: `feat/hero-section`, `fix/header-phone`, `chore/tailwind-upgrade`.
- One logical change per PR. Small PRs. Easier review, easier rollback.
- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- PR must pass: typecheck, lint, build, tests.
- Never force-push to `main` or any branch others are working on.

---

## 19 — The 14-16 Week Plan (Pro-plan paced)

| Phase | Weeks | What |
|---|---|---|
| **P0** | 1 | Repo setup, Next.js 16 + TS scaffold, brand tokens, fonts, shadcn init, Supabase client, env vars, deploy-preview working |
| **P1** | 2 | Design system foundation: Button, Input, Card, Container, Heading (evolved from DecorativeHeading), Section, Image wrapper, SEO component, FAQ component with JSON-LD |
| **P2** | 3 | Global shell: Layout, Header (with sticky-on-scroll booking widget, mega-menu for Stay), Footer (4 columns, Somaiya branding, working newsletter), WhatsApp floater, Cookie banner with real consent gating |
| **P3** | 4 | Homepage — all 11 sections per KT spec. Hero first. Each section: data from Supabase or content files, server components, LH 95+ mobile target verified. |
| **P4** | 5-6 | Remaining marketing pages: About, Stay index, 5 accommodation detail pages (dynamic from Supabase), Experiences hub + 3 detail pages (one template), Dining, Day Outing, Nearby Attractions, Contact, Gallery |
| **P5** | 7 | Blog system: listing, article page with DOMPurify sanitization, migration script to pull posts from Render → Supabase, redirects for old blog URLs |
| **P6** | 7 | Policy pages (one template, 4 data files), 404 page (with correct links), Thank You page, sitemap, robots, redirects |
| **P7** | 8-9 | Booking engine: 4 steps, availability real-time check, OTP integration, Razorpay sandbox integration, HMAC verification, webhooks, PDF voucher, Resend confirmation email |
| **P8** | 10-12 | Admin panel: auth + RBAC, Bookings module (dashboard, reservations, calendar, detail, manual, invoices, reports), CMS module (rooms, pricing, availability, blog editor, gallery, content blocks, coupons) |
| **P9** | 13 | SEO pass: schema audit every page, NAP verification, FAQPage on every page with FAQs, SpeakableSpecification, sitemap validation, 301 redirects live-tested, Core Web Vitals verified |
| **P10** | 14 | Accessibility pass: WCAG AA verified on top 20 pages, keyboard navigation end-to-end, screen reader test |
| **P11** | 15 | Testing: E2E playwright for 5 critical flows, unit coverage on lib/, load test booking endpoint |
| **P12** | 16 | Launch: DNS cutover, Razorpay live keys (post-KYC), Google Search Console resubmit sitemap, Sentry on, monitor for 72 hours |

Skippable if blocked: Razorpay live (stays sandbox until KYC), admin panel can ship to v1 with Bookings module only + CMS in v2.

---

## 20 — Working With Me (Claude Code)

1. **Read this file in every session.** Context dies, this file persists.
2. **Before any task, write a plan.** 3-5 bullet points of what you'll do. Wait for user to confirm. Then execute.
3. **After any task, update `PROGRESS.md`** at repo root with: what shipped, what's next, any decisions made.
4. **When stuck, ask. Don't guess.** Especially on money, legal, or brand.
5. **When a decision requires business input (prices, policy, legal text), pause and surface it.**
6. **Never commit secrets. Never log secrets.**
7. **Check the OLD-REFERENCE folder** at `C:\Users\MOUSAM\Projects\madhuban-web-OLD-REFERENCE\` for content, not code patterns. Do NOT copy it into this repo. Do NOT commit it.
8. **Refuse to touch** these files without explicit user approval: `azure-pipelines.yml` (live deploy config), `.env.local`, `.env.production`, Razorpay live keys, Supabase service role key.
9. **When the user says "start Phase N"**, re-read that phase in §19 first, then plan first, then execute.
10. **Pro-plan token budget is real.** Prefer small focused edits over big refactors in one shot. If running low, save progress and tell user to resume next session.

---

## 21 — When Questions Come Up

Route them this way:

- **Technical stack / architecture** → This file has the answer. If not, assume the simplest Next.js 16 canonical pattern.
- **Visual design / content / copy** → Check `/OLD-REFERENCE/` first. If missing, ask user.
- **Pricing / policy / legal** → Ask user. Do not invent.
- **SEO specifics** → §7. If unclear, over-index on schema and semantic HTML.
- **Database shape** → Supabase type definitions in `src/lib/supabase/database.types.ts` is ground truth.

---

## 22 — Success Criteria (what "done" looks like)

The rebuild is successful when all of these are true:

- [ ] Lighthouse mobile: 95+ Performance, 100 SEO, 100 Accessibility, 100 Best Practices — verified on top 10 pages
- [ ] Every page has correct JSON-LD schema (Rich Results Test passes)
- [ ] NAP identical across every page, every schema, every mention
- [ ] All 30+ form submissions land in Supabase `leads` table (currently: zero leads captured)
- [ ] Booking flow works end-to-end in sandbox, including failure scenarios and refunds
- [ ] Admin can log in, view bookings, create manual booking, generate GST invoice, block dates
- [ ] Blog migrated from Render to Supabase; Render server decommissioned
- [ ] Zero MUI, zero styled-components, zero @emotion, zero per-component CSS files in the codebase
- [ ] `pnpm typecheck` passes clean
- [ ] `pnpm lint` passes clean
- [ ] `pnpm build` produces bundle <2MB total, first-load JS <150KB per route
- [ ] Cookie consent gate verified — no trackers fire before consent
- [ ] All 301 redirects from old URLs verified
- [ ] Google Search Console shows no crawl errors after 7 days live

---

*Last updated: {{DATE}} — Version 1.0 — Architectural decisions locked by Mousam Kourav and Claude (browser session)*
