import { supabase } from '../supabaseClient';
import type { LinkedInViralPack, CreateLinkedInViralPackInput } from '@growth-os/shared';

/**
 * Create new LinkedIn viral pack
 */
export async function createLinkedInViralPack(
  input: CreateLinkedInViralPackInput
): Promise<LinkedInViralPack> {
  const { data, error } = await supabase
    .from('linkedin_viral_packs')
    .insert([input])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create LinkedIn viral pack: ${error.message}`);
  }

  return data as LinkedInViralPack;
}

/**
 * List all LinkedIn viral packs for a specific persona
 */
export async function listLinkedInViralPacksForPersona(
  personaId: string
): Promise<LinkedInViralPack[]> {
  const { data, error } = await supabase
    .from('linkedin_viral_packs')
    .select('*')
    .eq('persona_id', personaId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list LinkedIn viral packs: ${error.message}`);
  }

  return data as LinkedInViralPack[];
}

/**
 * List all LinkedIn viral packs by product
 */
export async function listLinkedInViralPacksByProduct(
  product: string
): Promise<LinkedInViralPack[]> {
  const { data, error } = await supabase
    .from('linkedin_viral_packs')
    .select('*')
    .eq('product', product)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list LinkedIn viral packs by product: ${error.message}`);
  }

  return data as LinkedInViralPack[];
}

/**
 * Get a single LinkedIn viral pack by ID
 */
export async function getLinkedInViralPackById(id: string): Promise<LinkedInViralPack | null> {
  const { data, error } = await supabase
    .from('linkedin_viral_packs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get LinkedIn viral pack: ${error.message}`);
  }

  return data as LinkedInViralPack;
}

