# Madhuban Eco Retreat — Master Plan to Launch

**Last updated:** Tuesday, May 5, 2026
**Status:** Phase 9d-4.2 merged. Starting Phase A1 next.
**Estimated time to launch:** 6-10 weeks.

---

## What was decided

- **Scope**: Full-featured admin redesign + new features before launch. Not a polish pass — a real PMS.
- **Functionality additions**: Stat dashboard, calendar heatmap, manual booking creation, GST invoices, multi-staff access, send email/SMS infra, print vouchers, block dates UI, seasonal pricing UI (deferred since no seasonal pricing planned right now).
- **Visual rebuild**: Match Stitch AI mockups. Cormorant Garamond + DM Sans. Dark forest-green sidebar. Wordmark = "Madhuban Eco Retreat Management".
- **Logo**: Banyan/baobab tree linework in warm gold (#A89968). Available in full lockup + mark-only versions, multiple sizes, with transparent backgrounds. Uploaded to R2 at `/branding/logo/`.
- **GST decisions**:
  - GSTIN: `23AAACT5004A1Z9`
  - Legal entity: Somaiya Properties and Investments Private Limited
  - State: Madhya Pradesh (state code 23)
  - Tax logic: CGST 9% + SGST 9% for MP guests, IGST 18% for non-MP guests
  - E-invoicing: assumed NOT mandatory unless founder confirms turnover > ₹5cr
- **Add Charges feature (A3)**: UI only for now, business logic deferred
- **Manual booking (A4)**: Accept Razorpay (online), Cash (at store), UPI (at store)
- **Seasonal pricing (A5)**: NOT in scope — same pricing year-round. UI placeholder only.
- **Send email (A8)**: yes, full infrastructure
- **Multi-staff access (A8)**: yes
- **Print vouchers (A8)**: both confirmation voucher AND tax invoice voucher

## Post-launch backlog (deferred)

These were going to be 9d-5 / 10 / 11 but are now AFTER admin rebuild:
- Rate limiting on form endpoints
- Resend domain verification (DNS)
- Admin email centralization (13 hardcoded routes → env var pattern)
- Newsletter & leads API → Supabase wiring
- Dead code cleanup
- Site audit remaining items
- Google Reviews integration
- TripAdvisor integration
- Domain cutover (www.madhubanecoretreat.com)
- Razorpay live mode (KYC)
- Final QA

---

## The 11 Phases

### Pre-A1: Logo upload (founder action)
Upload logo bundle to R2 at path `/branding/logo/`. Get the static URL accessible. Bundle delivered Tuesday May 5.

---

### Phase A1 — Admin Design System Foundation (~2 sessions, 3-5 days)
Build reusable components in `src/components/admin/ui/`. Replace admin layout shell. NO business logic changes. After A1, admin looks identical visually but is built on the new foundation.

**Components**: Card, StatCard, Table, Button, IconButton, Input, Select, Toggle, DatePicker, TextArea, Badge, Modal, Drawer, Tabs, EmptyState, Sidebar, TopBar, Breadcrumb, DataTable, Toast (sonner).

**Key decisions locked**: Cormorant + DM Sans, dark forest-green sidebar, "Madhuban Eco Retreat Management" wordmark.

---

### Phase A2 — Dashboard (~1 session)
Apply design system + build dashboard.

**New backend work**: aggregation queries (count by status, sum revenue by month, occupancy %, etc.).

**Sections**:
- 4 stat cards (Tonight's Check-ins, This Month Revenue, Occupancy %, Pending Confirmations)
- Recent Bookings panel
- Room Availability Tonight (progress bars per room type)
- Calendar heatmap (current month)
- Quick Actions grid (Walk-in, Block Dates, Check-in List, GST Report)
- Weekend Occupancy Alert panel

**Decision points before A2**: Weekend occupancy threshold for alert (80% or 90%?)

---

### Phase A3 — Bookings List + Detail Redesign (~1-2 sessions)
The most-used screen. Heaviest visual phase.

**List view**: filters (date range, source, status, room type), search, multi-select bulk actions (Export, Send Reminder, Print Vouchers), revenue total, Avg Daily Rate stat.

**Detail view**: guest info panel, guest folio with running charges (UI only — Add Charges logic deferred), action panel (Check In, Modify, Send Confirmation, Add Charges, Cancel), activity timeline with checkpoints, room & stay details, payment history with offline payment recording.

**New backend work**: activity timeline event log, booking_charges table (UI only), bulk action endpoints.

**Decision points**: Send Reminder template content, Send Confirmation re-send vs different content.

---

### Phase A4 — Manual Booking Creation (~1 session)
For walk-ins and phone bookings.

**Sections**: stay details with availability check, guest info, experience add-ons checklist with quantity, pricing summary (sticky right panel), advance/balance payment split, payment method (Razorpay / Bank Transfer / UPI / Cash / Card on Arrival), source tag (Direct-Website / MMT / Goibibo / Airbnb / Walk-in / Phone / Agent), Corporate/GST toggle, internal notes, Save Draft + Save & Confirm, localStorage auto-save every 30s.

**Decision points before A4**: Experience add-ons list and pricing (Forest Walk, Village Visit, Bird Watching, Bhojpur Temple Tour, Early Check-in, Late Check-out, etc.).

---

### Phase A5 — Rooms & Pricing (~1 session)
Upgrade existing rooms admin.

**Tabs**: Room Types / Rates / Seasonal Rules (placeholder UI only — no rules in DB) / Inventory.

**New backend work**: per-room-type unit inventory (e.g., Safari Tent has 4 units numbered ST-01 through ST-04).

**Decision points before A5**: Confirm whether rooms have individual units that get assigned to bookings.

---

### Phase A6 — Block Dates + Availability Calendar (~1 session)
New page `/admin/availability`. Month/week toggle. Calendar grid per room type per day, color-coded (Fully Booked / Partial / Available / Blocked / Check-in). Block Dates modal creates manual_blocks entries.

**Decision**: Blocks visible in public booking flow as unavailable (yes — already in scope).

---

### Phase A7 — Invoices & GST (~2 sessions, HIGHEST RISK)
The legal/regulatory critical phase.

**Sections**: stats (Invoices This Month, Total Billed, Outstanding, GST Collected), filters, table with bulk Download ZIP / Email / Excel, Generate Invoice from booking → GST-compliant PDF, GST Summary at bottom (CGST + SGST split for MP, IGST for non-MP, Total Monthly Liabilities), Download GST Report (Excel) for filing.

**Backend**:
- New `invoices` table linking to bookings
- PDF generation: react-pdf OR puppeteer-core + chromium-min for Vercel (HIGHEST RISK technical decision)
- GST calculation logic (intra-state CGST+SGST vs inter-state IGST)
- Unbroken invoice number sequence (legal requirement)
- Invoice number format: `MADH/{FY}/{####}` (e.g., `MADH/2026-27/0001`)

**Decisions confirmed**:
- GSTIN: 23AAACT5004A1Z9
- Legal name on invoices: Somaiya Properties and Investments Private Limited
- Trade name: Madhuban Eco Retreat
- Address: Narmada Farm Kheri, Rehti, Sehore, MP, 466446
- E-invoicing: assumed NOT mandatory (founder to confirm turnover before A7)
- Hospitality GST rate: 18% (room tariff > ₹7,500) or 12% (room tariff ≤ ₹7,500). Founder to confirm which applies based on actual room rates.

---

### Phase A8 — Operations Polish & Final (~1-2 sessions)
The cleanup phase.

**Features**:
- Send Email infrastructure (Reminder, Confirmation, Custom Message)
- Print Voucher PDF (confirmation slip with QR code linking to booking detail)
- Print Tax Invoice PDF (delegate to A7's invoice generation)
- Notifications bell (top bar): new bookings, payment received, check-ins today
- Settings page: contact info, GSTIN, default GST rate, email signature, business hours
- Multi-staff access: user management, RBAC (admin / front-desk / read-only)
- Audit log viewer UI (audit_log table already populated)

**Decision points before A8**: 
- Email template content for Reminder and Confirmation
- Whether multi-staff should support email-based magic link OR username/password

---

### Phase 9d-5 — Polish & SEO Infra (~1 session)
Resumes original plan after admin work is complete.
- Rate limiting on forms (souvenirs inquiry, contact, newsletter)
- Resend domain verification
- Admin email centralization (legacy 13 hardcoded routes → env var)
- Newsletter & leads API → Supabase wiring
- Dead code cleanup
- Remaining items from docs/audits/phase-9a-site-audit.md

---

### Phase 10 — Reviews Integration (~1 session)
- Google Reviews API integration with caching layer
- TripAdvisor reviews (if API access available, otherwise embed widget)
- Display on homepage testimonials section + dedicated /reviews page
- Schema.org Review markup

---

### Phase 11 — Launch (~1-2 sessions)
- Final QA pass on all surfaces
- Razorpay live mode activation (requires KYC completion)
- Domain cutover from madhuban-web.vercel.app to www.madhubanecoretreat.com
- DNS propagation verification
- Sitemap submission to Google Search Console
- Final smoke test on production
- Post-launch monitoring setup

---

## Workflow conventions

1. Architect (this conversation) writes phase kickoff prompts
2. Founder pastes to fresh Claude Code session
3. CC investigates, pauses for confirmation when warranted
4. CC builds, runs typecheck/lint/build, pushes to feature branch
5. Founder opens PR manually on GitHub (no gh CLI)
6. Vercel auto-deploys preview
7. Founder tests on preview URL — does NOT merge until validated
8. Founder reports back to architect with CC's report + any issues
9. Architect reviews, decides on follow-ups or merge
10. Founder merges, then we move to next phase

## Critical guardrails (established over previous phases)

- Always test on Vercel preview URL BEFORE merging (lesson from R2 env var bug)
- Always run Supabase migrations manually in SQL editor (CC can't auto-apply)
- Never include `https://` or trailing path in `R2_ACCOUNT_ID` env var
- Always verify env vars are set in Vercel for BOTH Production and Preview scopes
- TypeScript: camelCase. DB columns: snake_case. Mapper layer in `src/lib/{entity}/mapper.ts`.
- Server Components by default, `'use client'` only when interactivity required
- noUncheckedIndexedAccess discipline
- Never new dependencies without architect approval
