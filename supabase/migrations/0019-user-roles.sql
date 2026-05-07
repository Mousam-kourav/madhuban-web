-- Migration 0019: User profiles + RBAC roles
-- Run in Supabase SQL Editor. Apply before deploying Phase A8 code.
-- NOTE: Backfill step at the bottom requires your admin user's UUID.
--       Run: select id, email from auth.users; — then replace the placeholder below.

create table if not exists user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null check (role in ('admin', 'front_desk', 'read_only')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by text,
  last_login_at timestamptz
);

create index if not exists user_profiles_email_idx on user_profiles(email);

-- ── Backfill existing admin user ──────────────────────────────────────────────
-- Run: select id, email from auth.users;
-- Then replace the UUIDs/email below with the real values before running.
--
-- insert into user_profiles (user_id, email, full_name, role)
-- values ('REPLACE-WITH-ADMIN-USER-UUID', 'madhubanecoretreat@gmail.com', 'Madhuban Admin', 'admin')
-- on conflict (user_id) do nothing;
