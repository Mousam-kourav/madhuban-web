# 07 — Booking Flow Audit

**Date:** 2026-05-18

End-to-end review of the booking journey on the NEW build, from marketing-page entry CTAs through to payment confirmation. Inspected via source-code reading of `src/app/(booking)/book/*`, `src/components/booking/whatsapp-lead-form.tsx`, and the marketing-page CTAs that route into the flow.

---

## 1. Architecture overview — two parallel paths

The NEW build implements **two distinct booking journeys**, and the choice between them is determined entirely by which CTA the user clicks. This is a deliberate architectural decision but should be understood explicitly before any conversion polish work.

### Path A — WhatsApp lead (low-friction, prominent)

```
Marketing page CTA → /booking  OR  /enquire
        → WhatsApp lead form (4 fields)
        → submit opens https://wa.me/919770558419 with prefilled message
        → user negotiates quote with staff manually
        → no booking record created on site
        → no payment captured online
```

### Path B — Online checkout (full payment, hidden)

```
Marketing page → /stay → /stay/[slug]  (3+ clicks)
        → "Check Availability" or "Book Now" CTA
        → /book/[slug]            ← Step 1: Your Details
        → /book/[slug]/review     ← Step 2: Review
        → /book/[slug]/payment    ← Step 3: Payment (Razorpay)
        → /book/confirmation?ref=XXX
```

**Critical finding (Path B is unreachable from primary CTAs):** Every "Book Now" / "Book Your Stay" CTA on the homepage, navbar, hero, and most marketing pages routes to **Path A** (WhatsApp form), not Path B. The only entry to Path B is from inside a room-detail page (`/stay/[slug]`). To reach the real online booking from the homepage, a user must:
1. Click into `/stay` (browse rooms)
2. Click into a specific `/stay/[slug]` (room detail)
3. Click "Check Availability" or the mobile sticky bar "Book Now"

That's 3+ clicks minimum, vs. 1 click for the WhatsApp form.

This may be intentional (WhatsApp-first for Indian audience preference), but it means the entire online-booking surface is significantly under-promoted. If the rebuild's intent was "make online booking a first-class option," that is not currently realised.

---

## 2. Entry points — every CTA inventoried

| File | Line | CTA label | Target | Path |
|---|---:|---|---|---|
| `src/components/marketing/header/index.tsx` | 81 | (Header desktop "Book Now") | `/booking` | A (WhatsApp) |
| `src/components/marketing/header/index.tsx` | 90 | (Header mobile "Book Now") | `/booking` | A (WhatsApp) |
| `src/components/marketing/hero/carousel.tsx` | 135 (via `HERO_COPY.ctaPrimary`) | "Book Your Stay" | `/booking` | A |
| `src/lib/content/homepage.ts:8` | — | (defines hero primary CTA) | `/booking` | A |
| `src/app/(marketing)/about-us/page.tsx` | 465 | (footer CTA) | `/enquire` | A |
| `src/app/(marketing)/stay/page.tsx` | 147 | "Enquire" | `/enquire` | A |
| `src/app/(marketing)/contact-us/page.tsx` | 203, 232 | enquiry CTAs | `/enquire` | A |
| `src/app/(marketing)/experiences/page.tsx` | 267 | (page CTA) | `/enquire` | A |
| `src/app/(marketing)/blogs/[slug]/page.tsx` | 154 | (post CTA) | `/enquire` | A |
| `src/components/marketing/experience-detail/index.tsx` | 208 | (experience CTA) | `/enquire` | A |
| `src/components/marketing/room-detail/room-detail-page.tsx` | 260 | **"Check Availability"** | `/book/${slug}` | **B (real booking)** |
| `src/components/marketing/room-detail/mobile-sticky-bar.tsx` | 47 | **"Book Now"** | `/book/${slug}` | **B** |
| `src/components/marketing/room-detail/booking-widget.tsx` | 72 | (price-widget CTA) | `/book/${slug}` | **B** |

**Path B entry points: 3 (all on room-detail surface). Path A entry points: 10+ (all over the site).**

---

## 3. Path A — WhatsApp lead form

### Files
- `src/app/(marketing)/booking/page.tsx` — landing page, embeds form
- `src/app/(marketing)/enquire/page.tsx` — alt landing
- `src/components/booking/whatsapp-lead-form.tsx` — actual form component

### Fields (all required)
| Field | Input type | Validation |
|---|---|---|
| Full Name | `text`, `autoComplete="name"` | non-empty |
| WhatsApp Number | `tel`, `autoComplete="tel"`, `+91` prefix shown but not enforced | regex `^\+?[\d\s\-]{7,15}$` — accepts 7-15 digits |
| Number of Guests | `select` (1–10) | non-empty |
| Check-In Date | `date`, `min={today}` | non-empty, ≥ today |

### Field count: 4
### Outcome
On submit, the form constructs a WhatsApp URL and opens it in a new tab:
```
https://wa.me/919770558419?text=Hi+Madhuban...
```
**No data is saved on the Madhuban backend.** The user is handed off to WhatsApp. If they close the WhatsApp app or never message, the lead is lost. There's no fallback email capture, no Supabase record. (Compare: traditional lead-capture forms POST to a backend; here the user IS the network hop.)

### Trust / context signals present
- "Now Open for Bookings" eyebrow chip on `/booking` (`booking/page.tsx:161`)
- Hero, 3 highlight cards (Teak Forest Views, Wildlife Safaris, Farm-to-Table)
- Room grid (6 rooms with prices) below the form on `/booking`
- "Call for Instant Booking +91 9770558419" strip (`booking/page.tsx:317-340`)
- 7 FAQs covering pricing, family-friendliness, distance, cancellation, safari, room inclusions
- Schema markup: `lodgingBusiness`, `faqPage`, `breadcrumbList`

### Trust signals MISSING from Path A
- No customer review/testimonial element on `/booking` or `/enquire`
- No security or privacy reassurance ("we don't share your phone number")
- No mention of response time ("we usually reply within X minutes")
- No reviews aggregate score or star rating
- The text "Prefer a form? Use our booking enquiry form" (line 196) links to `/enquire` — but `/enquire` is also a WhatsApp-handoff form, not a true form. **Misleading copy** — both options produce a WhatsApp lead.

### Friction
- Field count is reasonable (4)
- Touch targets are good (`h-12` = 48px for inputs and button — meets 44px standard)
- Submit opens a new tab — if the user is on iOS Safari with popup-blocking enabled, this may fail silently
- No room preference field — staff must ask via WhatsApp follow-up, adding manual back-and-forth

### Mobile-specific
- Form is contained in `max-w-lg` (32rem ≈ 512px). On 390px viewport it's full-width minus container padding. No specific mobile issues.

---

## 4. Path B — Online checkout (real booking)

### Step 1: `/book/[slug]` — Your Details

**File:** `src/app/(booking)/book/[slug]/page.tsx` + `checkout-form.tsx`

#### Stay dates section (4 fields)
| Field | Input | Constraints |
|---|---|---|
| Check-in | `date`, `min={today}` | required, must be today or future |
| Check-out | `date`, `min={checkIn + minNights}` | required, must be after check-in + minNights |
| Adults | `select` (1 to `maxAdults`) | required, default 2 |
| Children | `select` (0 to `maxChildren`) — only shown if maxChildren > 0 | required, default 0 |

#### Guest details section (4 fields)
| Field | Input | Validation |
|---|---|---|
| Full name | `text`, `autoComplete="name"` | non-empty |
| Email | `email`, `autoComplete="email"` | regex `^[^\s@]+@[^\s@]+\.[^\s@]+$` |
| Mobile number | `tel`, `autoComplete="tel"` | digit count ≥ 7 |
| Special requests | `textarea`, maxLength 2000 | **optional** ✓ |

#### Coupon section (1 field)
| Field | Input | Behavior |
|---|---|---|
| Coupon code | `text`, auto-uppercased | optional; user clicks "Apply" to refetch price |

#### Price summary (right column on desktop, stacked below on mobile)
- Fetched via `POST /api/booking/calculate-price` on every relevant change
- Loading state: animated skeleton bars
- Error state: red error text
- Success state: line items (price × nights, coupon discount if any, GST, total)
- Reassurance: "Due now (full payment) · No balance due at check-in"

#### Submit button
- "Continue to Review"
- Disabled if: submitting, loadingPrice, or no pricing data
- On success: saves draft to `sessionStorage["booking_draft"]`, navigates to `/book/${slug}/review`

### Step 2: `/book/[slug]/review`

**File:** `src/app/(booking)/book/[slug]/review/page.tsx` + `review-client.tsx`

- Reads draft from sessionStorage
- If draft missing → redirect back to `/book/[slug]`
- If `pricing.roomSlug !== slug` → redirect back (anti-tamper)
- POSTs to `/api/booking/create` then navigates to `/book/${slug}/payment?id=${bookingId}`

(Content of the review UI is in `review-client.tsx` — not deeply audited here. From the page-level wrapper it's a confirmation screen, not a fields-editable screen. Editing means navigating back via browser back button.)

### Step 3: `/book/[slug]/payment`

**File:** `src/app/(booking)/book/[slug]/payment/page.tsx` + `payment-client.tsx`

- Server-side: fetches booking by `id` from Supabase
- Validates booking status === `PENDING_PAYMENT`. If status is `CONFIRMED`, `CANCELLED`, etc., shows status message + appropriate CTA.
- Client-side: 
  - Loads Razorpay JS via `<Script>` tag
  - POSTs to `/api/booking/create-order` to create Razorpay order
  - On submit, opens Razorpay modal with `prefill` (name, email, contact)
  - On success, navigates to `/book/confirmation?ref=${bookingRef}`

### Step 4: `/book/confirmation?ref=XXX`

**File:** `src/app/(booking)/book/confirmation/page.tsx`

- Fetches booking by `booking_ref` from Supabase
- If status === `PENDING_PAYMENT` → shows "Payment Processing" spinner (with auto-poll?)
- If status === `CONFIRMED` → shows success state:
  - ✓ Green checkmark + "See you in the forest!" H1
  - Booking reference (large, bold, tracking-wide)
  - Stay details (room, dates, duration, guests)
  - Payment summary (total amount + "Balance Due ₹0")
  - "What to Expect" section (check-in time, payment status, directions via WhatsApp, GPS coords)
  - Two CTAs: "WhatsApp Us" (prefilled with booking ref) + "View Room Details"

### Step indicator on Path B
A 3-step indicator appears on /book/[slug], /review, /payment:
```
1. Your Details → 2. Review → 3. Payment
```
Bold/highlighted step shows current. Good UX pattern. Note: the indicator is consistent across all three pages, which is correct.

---

## 5. Friction points (Path B)

### 🚨 HIGH — Conversion-blocking

1. **Path B is hidden behind 3+ clicks** from any homepage entry point. See §1 analysis above. Without putting a direct-booking entry on home/booking landing, the online-payment channel is effectively a secondary path.

2. **`MobileStickyBar` Book Now CTA is `h-10` = 40 px** — below the 44 × 44 px touch-target standard. `src/components/marketing/room-detail/mobile-sticky-bar.tsx:49`. This is the highest-intent mobile CTA in the entire site (price-aware sticky bar after hero scrolls off-screen). Touch-target violations on revenue-driving CTAs are textbook conversion bugs.

3. **No price is shown ABOVE the form on `/book/[slug]` mobile.** The price summary card is in the right column on desktop (`lg:grid-cols-[1fr_360px]`) but stacks BELOW the entire details form on mobile. Mobile users fill the entire form in the dark — typing dates, guests, then their name/email/phone — before seeing the total. Increases cognitive friction and the "is this real?" check.

4. **Pricing API failure blocks submit.** `checkout-form.tsx:116`: `if (!pricing) e.pricing = "Please wait for price calculation";` — if the `/api/booking/calculate-price` endpoint errors (network, server timeout), the user sees a red error and cannot submit. There's no degraded fallback flow ("we'll quote you on the next step").

### ⚠️ MEDIUM — Adds friction but not blocking

5. **No save-and-return capability across sessions.** Draft is in `sessionStorage`, gone if the user closes the tab. If they navigate away to compare other rooms (the Mud House 1 vs Mud House 2 case is plausible), they re-enter all fields.

6. **Coupon Apply button is `h-[42px]`** (`checkout-form.tsx:325`) — 42 px, just under the 44 px touch standard. Minor compared to the sticky bar's 40 px.

7. **Date inputs use native `<input type="date">`.** UX inconsistency across mobile browsers: iOS Safari shows a wheel picker (OK), Android Chrome shows a calendar dialog (mostly OK), Android Samsung Internet sometimes shows a plain text input. No mobile-optimised date picker library is in use. Verify on real Android.

8. **No validation feedback on email until submit attempted.** Each field's error appears only after `validate()` runs on submit (per `checkout-form.tsx:107-119`). Inline `aria-invalid` toggles on submit, not on blur. Modern UX expects per-field validation as user moves between fields.

9. **The minimum-night enforcement is silent.** If `minNights` is 2 for a stay and user picks dates with only 1 night, the system silently auto-extends the check-out date. No UI message explains why. User may be confused why check-out moved.

10. **Special requests field has 2000-char limit but no character counter.** Power users hitting the limit will be surprised.

11. **No "Help" / "Contact" link inside the form pages.** If a user is mid-form and confused, the only contact options are global navigation. WhatsApp / call CTAs are not visible inside the booking flow surface.

### 🔵 LOW

12. **The "Review" step (Step 2) has limited utility** — the user has already filled the form on Step 1. Step 2 just shows what they entered with a "Confirm" button. This is fine pattern but adds an extra page-load. Could be inline-collapsed on Step 1 with an "Edit" affordance.

13. **The price-summary card's "Due now: full payment" reassurance** is in `text-xs` (12 px). Important reassurance gets buried at small font size.

---

## 6. Trust signals — present vs missing

### Path B `/book/[slug]` (form)
| Element | Status |
|---|---|
| Step indicator (1/2/3) | ✅ Present |
| Room name + summary | ✅ "Booking" eyebrow + room name H1 |
| Real-time price calculation | ✅ Visible (desktop) / below form (mobile) |
| "No payment charged yet" | ✅ Below submit button |
| GST shown line-itemed | ✅ |
| Cancellation policy | ❌ Not shown on form |
| Security badge / SSL lock | ❌ |
| Reviews / rating | ❌ |
| Best-rate guarantee | ❌ |
| Number of recent bookings | ❌ |
| Direct phone / WhatsApp inline | ❌ |
| Privacy reassurance ("we don't share data") | ❌ |

### Path B `/book/[slug]/payment`
| Element | Status |
|---|---|
| Step indicator | ✅ |
| Total amount confirmed | ✅ (inside Razorpay modal) |
| Razorpay branded modal | ✅ (well-known to Indian audience — strong trust signal) |
| Refund/cancellation policy link | ❌ Not visible on payment page |
| Security badge / payment method icons | ❌ Only Razorpay modal shows these |

### Path B `/book/confirmation`
| Element | Status |
|---|---|
| ✓ Visual success | ✅ Big green check |
| Booking reference (large, copyable) | ✅ |
| Stay details | ✅ |
| Payment summary | ✅ |
| What to expect block (check-in time, directions, GPS) | ✅ |
| Email confirmation note | ✅ "A confirmation email has been sent to {guest.email}" |
| WhatsApp follow-up CTA | ✅ |
| "View Room Details" CTA | ✅ |
| Cancellation policy link | ❌ |
| Add to calendar (ICS) | ❌ |
| Share with travel companion | ❌ |
| Map / directions | ❌ (GPS coords listed in text only) |

---

## 7. Mobile-specific issues

| Issue | Page | Severity |
|---|---|---|
| `MobileStickyBar` "Book Now" CTA is 40px tall (under 44px) | `/stay/[slug]` | 🚨 HIGH |
| Price summary stacks BELOW form on mobile | `/book/[slug]` | 🚨 HIGH |
| Coupon Apply button 42px (under 44px) | `/book/[slug]` | ⚠️ MED |
| Date inputs use native `<input type="date">` — Android inconsistency | `/book/[slug]` | ⚠️ MED |
| `grid-cols-2 gap-4` for check-in/out side-by-side on mobile | `/book/[slug]` | 🔵 LOW (compact but works) |
| No mobile-specific entry point for booking from /booking landing | `/booking` | 🚨 HIGH (Path B unreachable from /booking landing on mobile) |

---

## 8. Drop-off risk per step

Estimating where a hypothetical 100 mobile users from a homepage CTA might drop off (Path B):

| Step | Action | Estimated drop-off | Reason |
|---|---|---:|---|
| 0 | Home hero "Book Your Stay" clicked | — | 100 users land on `/booking` (WhatsApp form) |
| 0a | User realizes /booking is a WhatsApp form, not a real booking | **30%** | "I wanted to book online, not message someone" |
| 0b | Of those who want online, must navigate back, find `/stay`, scroll, pick room | **25%** | Three more clicks before reaching Path B; non-trivial drop |
| 1 | Lands on `/stay/[slug]` | — | Sees room + sticky Book Now (40px target — mis-taps possible) |
| 2 | Clicks "Book Now" → `/book/[slug]` form | **10%** | Form looks long on mobile; price not visible above the fold |
| 3 | Fills 8 fields + waits for price | **15%** | Drop if pricing API stalls; some abandonment from cognitive load |
| 4 | Clicks "Continue to Review" | **5%** | Review step adds an extra page-load with no new action |
| 5 | Clicks "Confirm" on Review | **5%** | Some second-guessing |
| 6 | Razorpay modal opens for payment | **10%** | Payment-time hesitation is universal across e-commerce |
| 7 | Payment success → confirmation | — | |

Cumulative drop-off: ~70-75% from clicking the home hero to landing on `/confirmation`. Most of that loss is the Path A vs Path B detour at the start.

If Path B were the home hero's primary destination (replacing the WhatsApp form), the estimated drop-off shrinks to ~40-50% (industry standard for hotel direct-booking funnels), reclaiming ~20-25 of every 100 high-intent users.

---

## 9. Findings ranked for Step 12 (booking-conversion priority)

### 🚨 HIGH (must address before redesign)

1. **Make Path B reachable from the homepage hero and/or `/booking` landing.** Right now both lead exclusively to Path A.
2. **Fix `MobileStickyBar` Book Now button height — 40px violates touch standard.** One-line CSS change (`h-10` → `h-12`).
3. **Surface price summary ABOVE the form on mobile** at `/book/[slug]` (or use sticky-bottom price + CTA). Mobile users currently fill 8 fields blind.
4. **Add cancellation policy summary to `/book/[slug]` and `/book/[slug]/payment`** — currently buried in `/booking` FAQ. Booking abandonment frequently traces to "what if I need to cancel?".

### ⚠️ MEDIUM

5. Add inline (per-field) validation feedback to the checkout form.
6. Add a visible WhatsApp/phone help CTA inside the booking flow surface — currently users can only ask for help by navigating out.
7. Explain min-nights enforcement when the system auto-extends the check-out date.
8. Add "Why book direct?" trust block on `/book/[slug]` (no booking-fee, best rate, direct support).
9. Persist draft beyond sessionStorage (localStorage with TTL, or even an anonymous Supabase row) to support cross-device or interrupted bookings.

### 🔵 LOW

10. Show character counter on Special Requests field.
11. Increase font-size of "No payment charged yet" reassurance from `text-xs`.
12. Inline the Review step into Step 1 with an "Edit" toggle (or remove Step 2 entirely).
13. Add Add-to-Calendar (ICS) on confirmation page.
14. Add map/directions widget on confirmation page (GPS coords are text only).

---

## 10. Top-3 booking friction findings (per pause-report request)

1. **The site's primary booking CTAs ("Book Now", "Book Your Stay") route to a WhatsApp lead form, not the real online booking. The actual paid online-checkout flow is hidden 3 clicks deep behind room-detail pages.** Highest-impact finding of this entire audit for revenue. If the architect's redesign intent includes online direct-booking as a first-class channel, this is an architectural decision that needs to be made before any visual polish.

2. **Mobile sticky bar Book Now CTA is 40 px tall — under the 44 px touch standard** (`mobile-sticky-bar.tsx:49`). This is the single highest-intent mobile conversion CTA on the site (it only appears after the hero scrolls past, meaning the user is actively considering booking). Mis-taps here directly lose paid bookings. One-line fix.

3. **Mobile users on `/book/[slug]` fill the entire 8-field form before seeing the price.** The two-column desktop layout (`lg:grid-cols-[1fr_360px]`) stacks the price summary below the form on mobile. Combined with "Continue to Review" being disabled until price loads, this creates a confusing wait state where users have done all the work but can't tell what they're committing to.
