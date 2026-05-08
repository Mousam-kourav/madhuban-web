-- Migration 0021: leads table + extend notifications.type check constraint

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  source text not null check (source in ('contact_form','souvenirs_inquiry','experiences_inquiry','other')),
  metadata jsonb default '{}'::jsonb,
  status text not null default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_status_created_idx on leads(status, created_at desc);
create index leads_source_idx on leads(source);
create index leads_email_idx on leads(email);

-- Extend notifications type check to include new notification types
alter table notifications drop constraint if exists notifications_type_check;
alter table notifications add constraint notifications_type_check
  check (type in ('booking_created','payment_received','check_in_today','booking_cancelled','lead_received','newsletter_subscribed'));
