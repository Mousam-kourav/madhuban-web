-- Phase 7: Booking engine tables
-- Apply via Supabase Dashboard → SQL Editor

-- ─── coupons ─────────────────────────────────────────────────────────────────

create table if not exists public.coupons (
  id             uuid primary key default gen_random_uuid(),
  code           text unique not null,           -- uppercase, e.g. FOREST20
  discount_type  text not null                   -- 'percent' | 'flat'
                   check (discount_type in ('percent', 'flat')),
  discount_value numeric(10,2) not null,
  min_nights     int not null default 1,
  min_amount     numeric(10,2) not null default 0,
  max_uses       int,                            -- null = unlimited
  used_count     int not null default 0,
  valid_from     date,
  valid_until    date,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger coupons_updated_at
  before update on public.coupons
  for each row execute function public.set_updated_at();

alter table public.coupons enable row level security;

create policy "Public can read active coupons"
  on public.coupons for select
  using (is_active = true);

create policy "Admin full access on coupons"
  on public.coupons for all
  using  (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com')
  with check (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com');

-- ─── pricing_rules ───────────────────────────────────────────────────────────

create table if not exists public.pricing_rules (
  id          uuid primary key default gen_random_uuid(),
  room_id     uuid references public.rooms(id) on delete cascade,  -- null = all rooms
  name        text not null,
  rule_type   text not null                     -- 'seasonal' | 'weekend' | 'longstay' | 'event'
                check (rule_type in ('seasonal', 'weekend', 'longstay', 'event')),
  start_date  date,                             -- null for longstay/weekend rules
  end_date    date,
  multiplier  numeric(4,3) not null default 1,  -- e.g. 1.2 = +20%
  min_nights  int,                              -- required for longstay
  priority    int not null default 0,           -- higher wins when multiple apply
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger pricing_rules_updated_at
  before update on public.pricing_rules
  for each row execute function public.set_updated_at();

alter table public.pricing_rules enable row level security;

create policy "Public can read active pricing rules"
  on public.pricing_rules for select
  using (is_active = true);

create policy "Admin full access on pricing_rules"
  on public.pricing_rules for all
  using  (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com')
  with check (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com');

-- ─── manual_blocks ───────────────────────────────────────────────────────────

create table if not exists public.manual_blocks (
  id          uuid primary key default gen_random_uuid(),
  room_id     uuid not null references public.rooms(id) on delete cascade,
  start_date  date not null,
  end_date    date not null,
  reason      text,
  created_by  text,
  created_at  timestamptz not null default now()
);

create index if not exists manual_blocks_room_dates_idx
  on public.manual_blocks (room_id, start_date, end_date);

alter table public.manual_blocks enable row level security;

-- Public cannot see blocks; admin sees all
create policy "Admin full access on manual_blocks"
  on public.manual_blocks for all
  using  (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com')
  with check (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com');

-- ─── bookings ────────────────────────────────────────────────────────────────

create table if not exists public.bookings (
  id               uuid primary key default gen_random_uuid(),
  reference_number text unique not null,         -- MBR-YYYYMMDD-XXXX
  room_id          uuid not null references public.rooms(id),
  check_in         date not null,
  check_out        date not null,
  nights           int not null,
  adults           int not null default 1,
  children         int not null default 0,
  -- Guest
  guest_name       text not null,
  guest_email      text not null,
  guest_phone      text not null,
  -- Pricing
  price_per_night  numeric(10,2) not null,       -- rate used (GST-inclusive)
  base_amount      numeric(10,2) not null,        -- pre-GST total
  gst_rate         int not null default 12,
  gst_amount       numeric(10,2) not null,
  discount_amount  numeric(10,2) not null default 0,
  coupon_id        uuid references public.coupons(id),
  coupon_code      text,
  total_amount     numeric(10,2) not null,        -- GST-inclusive, after discount
  advance_amount   numeric(10,2) not null,        -- 50% charged at booking
  balance_due      numeric(10,2) not null,        -- 50% at check-in
  -- Meta
  special_requests text,
  status           text not null default 'PENDING_PAYMENT'
                     check (status in ('PENDING_PAYMENT','CONFIRMED','CHECKED_IN','CHECKED_OUT','CANCELLED','NO_SHOW')),
  source           text not null default 'online'
                     check (source in ('online','walk_in','phone','corporate')),
  razorpay_order_id   text,
  razorpay_payment_id text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists bookings_room_dates_idx
  on public.bookings (room_id, check_in, check_out);
create index if not exists bookings_status_idx
  on public.bookings (status);
create index if not exists bookings_guest_email_idx
  on public.bookings (guest_email);

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

alter table public.bookings enable row level security;

-- No public select — guests access their bookings via booking reference + email (server-side only)
create policy "Admin full access on bookings"
  on public.bookings for all
  using  (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com')
  with check (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com');

-- ─── payments ────────────────────────────────────────────────────────────────

create table if not exists public.payments (
  id                  uuid primary key default gen_random_uuid(),
  booking_id          uuid not null references public.bookings(id) on delete cascade,
  amount              numeric(10,2) not null,
  currency            text not null default 'INR',
  payment_type        text not null              -- 'advance' | 'balance'
                        check (payment_type in ('advance', 'balance')),
  payment_method      text not null default 'razorpay'
                        check (payment_method in ('razorpay','cash','bank_transfer','upi')),
  razorpay_order_id   text,
  razorpay_payment_id text,
  razorpay_signature  text,
  status              text not null default 'pending'
                        check (status in ('pending','captured','failed','refunded')),
  refund_amount       numeric(10,2) not null default 0,
  refunded_at         timestamptz,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger payments_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

alter table public.payments enable row level security;

create policy "Admin full access on payments"
  on public.payments for all
  using  (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com')
  with check (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com');

-- ─── invoices ────────────────────────────────────────────────────────────────

create table if not exists public.invoices (
  id             uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,  -- MBR-INV-YYYY-XXXX
  booking_id     uuid not null references public.bookings(id),
  invoice_type   text not null default 'invoice'
                   check (invoice_type in ('invoice', 'credit_note')),
  pdf_url        text,                  -- signed URL, regenerated on demand
  amount         numeric(10,2) not null,
  issued_at      timestamptz not null default now(),
  created_at     timestamptz not null default now()
);

alter table public.invoices enable row level security;

create policy "Admin full access on invoices"
  on public.invoices for all
  using  (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com')
  with check (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com');

-- ─── audit_log ───────────────────────────────────────────────────────────────

create table if not exists public.audit_log (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null,
  action      text not null             -- 'create' | 'update' | 'delete' | 'status_change'
                check (action in ('create','update','delete','status_change')),
  entity      text not null,            -- 'booking' | 'room' | 'coupon' | etc.
  entity_id   text not null,
  before_json jsonb,
  after_json  jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists audit_log_entity_idx
  on public.audit_log (entity, entity_id);
create index if not exists audit_log_user_idx
  on public.audit_log (user_id);

alter table public.audit_log enable row level security;

create policy "Admin full access on audit_log"
  on public.audit_log for all
  using  (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com')
  with check (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com');
