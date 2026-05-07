-- Migration 0020: Add actor_email to audit_log
-- Run in Supabase SQL Editor. Apply before deploying Phase A8 code.
-- Legacy rows will have actor_email = null; viewer displays them as "User: {uuid[:8]}".

alter table audit_log
  add column if not exists actor_email text;
