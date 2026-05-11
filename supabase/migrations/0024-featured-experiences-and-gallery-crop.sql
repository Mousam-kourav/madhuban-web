-- Migration 0024: featured_experiences table + gallery_items crop columns
--
-- Adds admin-controlled cropping to the gallery (4:3) and a new Featured
-- Experiences CMS surface (16:9). Existing gallery items will be re-cropped
-- via the one-time admin migration endpoint after this DDL is applied.
--
-- Naming follows the existing convention used by gallery_items: r2_key for
-- the R2 object key and r2_url for the public URL. The "original" pair
-- preserves the pre-crop asset so admins can re-crop without re-uploading.

-- ─── featured_experiences ─────────────────────────────────────────────────
create table if not exists public.featured_experiences (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  r2_key text not null,                      -- cropped 16:9 WebP
  r2_url text not null,
  original_r2_key text not null,             -- original pre-crop asset
  original_r2_url text not null,
  crop_data jsonb,                           -- { x, y, width, height, zoom, rotation }
  cta_label text not null,
  cta_link text not null,
  sort_order int not null default 0,
  status text not null default 'draft' check (status in ('published', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

create index if not exists idx_featured_experiences_status_sort
  on public.featured_experiences (status, sort_order);

-- ─── gallery_items: crop columns ──────────────────────────────────────────
-- original_r2_key / original_r2_url preserve the pre-crop asset.
-- crop_data captures the react-easy-crop state for re-cropping.
-- needs_review flags items auto-cropped by the one-time migration so admins
-- can review and either accept or re-crop manually.
alter table public.gallery_items
  add column if not exists original_r2_key  text,
  add column if not exists original_r2_url  text,
  add column if not exists crop_data        jsonb,
  add column if not exists needs_review     boolean not null default false;

-- Backfill: for rows pre-dating this migration, the existing r2_key/r2_url
-- (already a WebP from the prior upload pipeline) becomes the "original"
-- until the one-time migration endpoint re-crops to 4:3.
--
-- NOTE: legacy items never preserved the true pre-conversion original — only
-- the WebP exists. Treating the WebP as the "original" is the best we can
-- do retroactively. New uploads via the rebuilt admin flow preserve the
-- true original.
update public.gallery_items
   set original_r2_key = r2_key,
       original_r2_url = r2_url
 where original_r2_key is null;

alter table public.gallery_items
  alter column original_r2_key set not null,
  alter column original_r2_url set not null;

create index if not exists idx_gallery_items_needs_review
  on public.gallery_items (needs_review)
  where needs_review = true;

-- ─── RLS ──────────────────────────────────────────────────────────────────
-- Note: the RLS audit step (Step 9) appends policies here based on Mousam's
-- pg_policies output. Featured Experiences definitely needs a public-read
-- policy for the homepage section to render anonymously.
alter table public.featured_experiences enable row level security;

create policy "public can read published featured experiences"
  on public.featured_experiences
  for select to anon, authenticated
  using (status = 'published');

create policy "service role has full access to featured experiences"
  on public.featured_experiences
  for all to service_role
  using (true) with check (true);

-- ─── RLS audit: service_role full-access policies ─────────────────────────
-- The audit (Phase 9h.1, Step 9) found that these tables either have RLS
-- enabled without policies, or are accessed via createAdminClient in code
-- and would benefit from an explicit service-role policy as documentation
-- of intent. Service role bypasses RLS regardless, so these policies are
-- belt-and-suspenders — they make the security stance explicit and avoid
-- Supabase Studio flagging "RLS enabled, no policies" warnings.
--
-- Public-anon-read policies are NOT added here: every public-context
-- query in src/ already targets a table with an existing policy (verified
-- by grepping createClient + .from() against pg_policies). The booking
-- flow uses createAdminClient even on unauthenticated public pages, so
-- bookings/payments/guests/coupons/pricing_rules/manual_blocks don't
-- need public-read policies.
--
-- Pattern: do-block with `duplicate_object` (idempotent) and
-- `undefined_table` (safe on fresh spin-ups where some legacy tables
-- may not exist). Compatible with PostgreSQL 14+; CREATE POLICY IF NOT
-- EXISTS was only added in PG 17.

do $$ begin
  create policy "service role has full access to admin_users"
    on public.admin_users for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;

do $$ begin
  create policy "service role has full access to app_settings"
    on public.app_settings for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;

do $$ begin
  create policy "service role has full access to audit_log"
    on public.audit_log for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;

do $$ begin
  create policy "service role has full access to availability"
    on public.availability for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;

do $$ begin
  create policy "service role has full access to bookings"
    on public.bookings for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;

do $$ begin
  create policy "service role has full access to coupons"
    on public.coupons for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;

do $$ begin
  create policy "service role has full access to day_outing_packages"
    on public.day_outing_packages for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;

do $$ begin
  create policy "service role has full access to experiences"
    on public.experiences for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;

do $$ begin
  create policy "service role has full access to gallery_albums"
    on public.gallery_albums for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;

do $$ begin
  create policy "service role has full access to gallery_images"
    on public.gallery_images for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;

do $$ begin
  create policy "service role has full access to guests"
    on public.guests for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;

do $$ begin
  create policy "service role has full access to invoice_counters"
    on public.invoice_counters for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;

do $$ begin
  create policy "service role has full access to invoices"
    on public.invoices for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;

do $$ begin
  create policy "service role has full access to leads"
    on public.leads for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;

do $$ begin
  create policy "service role has full access to manual_blocks"
    on public.manual_blocks for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;

do $$ begin
  create policy "service role has full access to newsletter_subscribers"
    on public.newsletter_subscribers for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;

do $$ begin
  create policy "service role has full access to notifications"
    on public.notifications for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;

do $$ begin
  create policy "service role has full access to payments"
    on public.payments for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;

do $$ begin
  create policy "service role has full access to pricing_rules"
    on public.pricing_rules for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;

do $$ begin
  create policy "service role has full access to user_profiles"
    on public.user_profiles for all to service_role using (true) with check (true);
exception when duplicate_object then null; when undefined_table then null; end$$;
