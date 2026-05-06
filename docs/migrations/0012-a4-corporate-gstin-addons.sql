-- Migration 0012 — Phase A4: Corporate GSTIN + Add-ons on bookings
-- Run in Supabase SQL Editor. Already applied to production DB (2026-05-06).
-- Source: architect decision — GSTIN and company stored per-booking (not per-guest)
-- for historical accuracy (same guest may book once personally, once for different company).

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS corporate_gstin       text,
  ADD COLUMN IF NOT EXISTS corporate_company_name text,
  ADD COLUMN IF NOT EXISTS corporate_address      text,
  ADD COLUMN IF NOT EXISTS addons                 jsonb DEFAULT '[]'::jsonb;

-- addons shape: [{ id: string, label: string, price: number, qty: number, unit: string }]
-- Price is stored at time of booking for historical immutability when catalog prices change.
