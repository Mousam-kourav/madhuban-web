-- Phase 12.B.1: Strip legacy brand suffixes from curated SEO titles
--
-- Background: SEO titles were authored under the OLD buildMetadata behavior
-- which only single-suffixed brand. Now that buildMetadata passes clean titles,
-- legacy stored values cause double-brand in SERPs.
--
-- This script strips trailing "— Madhuban Eco Retreat", "| Madhuban Eco Retreat",
-- "- Madhuban Eco Retreat", and similar variants from rooms.seo_title and
-- blog_posts.seo_title columns.
--
-- Idempotent: re-running has no effect once data is clean.
--
-- HOW TO RUN:
--   1. Supabase dashboard → SQL Editor → New Query
--   2. Paste this entire file
--   3. Run
--   4. Eyeball the verification SELECT results at the bottom
--   5. Every seo_title should be brand-free (e.g. "Safari Tent",
--      "Eco Resort vs Luxury Resort: The Real Difference")

UPDATE rooms
SET seo_title = TRIM(BOTH ' ' FROM REGEXP_REPLACE(seo_title, '\s*[|—-]\s*Madhuban Eco Retreat\s*$', ''))
WHERE seo_title ~* 'Madhuban Eco Retreat\s*$';

UPDATE blog_posts
SET seo_title = TRIM(BOTH ' ' FROM REGEXP_REPLACE(seo_title, '\s*[|—-]\s*Madhuban(\s+Eco\s+Retreat)?\s*$', ''))
WHERE seo_title ~* 'Madhuban(\s+Eco\s+Retreat)?\s*$';

-- Verification queries (eyeball results — these are NOT in a transaction with
-- the UPDATEs above, they're for manual inspection):
SELECT slug, seo_title FROM rooms ORDER BY slug;
SELECT slug, seo_title FROM blog_posts ORDER BY slug;
