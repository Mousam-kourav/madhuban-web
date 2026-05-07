-- Migration 0018: Notifications table for admin bell
-- Run in Supabase SQL Editor. Apply before deploying Phase A8 code.

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_email text not null,
  type text not null check (type in ('booking_created', 'payment_received', 'check_in_today', 'booking_cancelled')),
  title text not null,
  body text not null,
  link_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_recipient_unread_idx
  on notifications(recipient_email, read_at)
  where read_at is null;
