-- Migration 0015: Add notes column to manual_blocks
-- Run in Supabase SQL editor before deploying Phase A6
ALTER TABLE manual_blocks ADD COLUMN IF NOT EXISTS notes text;
