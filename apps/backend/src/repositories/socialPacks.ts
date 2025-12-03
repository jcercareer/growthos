import { supabase } from '../supabaseClient';
import type { SocialPack, CreateSocialPackInput } from '@growth-os/shared';

/**
 * Create new social pack
 */
export async function createSocialPack(
  input: CreateSocialPackInput
): Promise<SocialPack> {
  const { data, error } = await supabase
    .from('social_packs')
    .insert([input])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create social pack: ${error.message}`);
  }

  return data as SocialPack;
}

/**
 * List all social packs for a specific persona
 */
export async function listSocialPacksForPersona(
  personaId: string
): Promise<SocialPack[]> {
  const { data, error } = await supabase
    .from('social_packs')
    .select('*')
    .eq('persona_id', personaId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list social packs: ${error.message}`);
  }

  return data as SocialPack[];
}

/**
 * List all social packs by product
 */
export async function listSocialPacksByProduct(
  product: string
): Promise<SocialPack[]> {
  const { data, error } = await supabase
    .from('social_packs')
    .select('*')
    .eq('product', product)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list social packs by product: ${error.message}`);
  }

  return data as SocialPack[];
}

/**
 * Get a single social pack by ID
 */
export async function getSocialPackById(id: string): Promise<SocialPack | null> {
  const { data, error } = await supabase
    .from('social_packs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get social pack: ${error.message}`);
  }

  return data as SocialPack;
}

