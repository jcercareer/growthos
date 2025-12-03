import { supabase } from '../supabaseClient';
import type { SocialPost, CreateSocialPostInput } from '@growth-os/shared';

/**
 * Create a new social post
 */
export async function createSocialPost(
  input: CreateSocialPostInput
): Promise<SocialPost> {
  const { data, error } = await supabase
    .from('social_posts')
    .insert([input])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create social post: ${error.message}`);
  }

  return data as SocialPost;
}

/**
 * List all social posts with optional filters
 */
export async function listSocialPosts(filters?: {
  product?: string;
  audienceType?: string;
  socialAccountId?: string;
  tag?: string;
}): Promise<SocialPost[]> {
  let query = supabase
    .from('social_posts')
    .select('*')
    .order('posted_at', { ascending: false });

  if (filters?.product) {
    query = query.eq('product', filters.product);
  }

  if (filters?.audienceType) {
    query = query.eq('audience_type', filters.audienceType);
  }

  if (filters?.socialAccountId) {
    query = query.eq('social_account_id', filters.socialAccountId);
  }

  if (filters?.tag) {
    // Use Postgres array contains operator
    query = query.contains('tags', [filters.tag]);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to list social posts: ${error.message}`);
  }

  return data as SocialPost[];
}

/**
 * Get a single social post by ID
 */
export async function getSocialPostById(id: string): Promise<SocialPost | null> {
  const { data, error } = await supabase
    .from('social_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get social post: ${error.message}`);
  }

  return data as SocialPost;
}

