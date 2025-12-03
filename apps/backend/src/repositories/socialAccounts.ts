import { supabase } from '../supabaseClient';
import type { SocialAccount, CreateSocialAccountInput } from '@growth-os/shared';

/**
 * Create a new social account
 */
export async function createSocialAccount(
  input: CreateSocialAccountInput
): Promise<SocialAccount> {
  const { data, error } = await supabase
    .from('social_accounts')
    .insert([input])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create social account: ${error.message}`);
  }

  return data as SocialAccount;
}

/**
 * List all social accounts, optionally filtered by platform and/or brand
 */
export async function listSocialAccounts(
  platform?: string,
  brand?: string
): Promise<SocialAccount[]> {
  let query = supabase
    .from('social_accounts')
    .select('*')
    .order('created_at', { ascending: false });

  if (platform) {
    query = query.eq('platform', platform);
  }

  if (brand) {
    query = query.eq('brand', brand);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to list social accounts: ${error.message}`);
  }

  return data as SocialAccount[];
}

/**
 * Get a single social account by ID
 */
export async function getSocialAccountById(
  id: string
): Promise<SocialAccount | null> {
  const { data, error } = await supabase
    .from('social_accounts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get social account: ${error.message}`);
  }

  return data as SocialAccount;
}

