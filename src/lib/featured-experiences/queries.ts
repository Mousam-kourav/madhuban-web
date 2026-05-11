import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { FeaturedExperienceRow } from '@/lib/supabase/database.types';

export type { FeaturedExperienceRow };

export async function getPublishedFeaturedExperiences(limit = 6): Promise<FeaturedExperienceRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('featured_experiences')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as FeaturedExperienceRow[];
}

export async function adminGetAllFeaturedExperiences(): Promise<FeaturedExperienceRow[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('featured_experiences')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as FeaturedExperienceRow[];
}

export async function adminGetFeaturedExperience(id: string): Promise<FeaturedExperienceRow | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('featured_experiences')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as FeaturedExperienceRow;
}
