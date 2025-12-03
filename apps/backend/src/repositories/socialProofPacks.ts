import { supabase } from '../supabaseClient';
import type { SocialProofPack, CreateSocialProofPackInput } from '@growth-os/shared';

/**
 * Create new social proof pack
 */
export async function createSocialProofPack(
  input: CreateSocialProofPackInput
): Promise<SocialProofPack> {
  const { data, error } = await supabase
    .from('social_proof_packs')
    .insert([input])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create social proof pack: ${error.message}`);
  }

  return data as SocialProofPack;
}

/**
 * List all social proof packs by product
 */
export async function listSocialProofPacksByProduct(
  product: string
): Promise<SocialProofPack[]> {
  const { data, error } = await supabase
    .from('social_proof_packs')
    .select('*')
    .eq('product', product)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list social proof packs: ${error.message}`);
  }

  return data as SocialProofPack[];
}

/**
 * Get a single social proof pack by ID
 */
export async function getSocialProofPackById(id: string): Promise<SocialProofPack | null> {
  const { data, error } = await supabase
    .from('social_proof_packs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get social proof pack: ${error.message}`);
  }

  return data as SocialProofPack;
}

