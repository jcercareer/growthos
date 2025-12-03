import { supabase } from '../supabaseClient';
import type { PaidAdsPack, CreatePaidAdsPackInput } from '@growth-os/shared';

/**
 * Create new paid ads pack
 */
export async function createPaidAdsPack(
  input: CreatePaidAdsPackInput
): Promise<PaidAdsPack> {
  const { data, error } = await supabase
    .from('paid_ads_packs')
    .insert([input])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create paid ads pack: ${error.message}`);
  }

  return data as PaidAdsPack;
}

/**
 * List all paid ads packs for a specific persona
 */
export async function listPaidAdsPacksForPersona(
  personaId: string
): Promise<PaidAdsPack[]> {
  const { data, error } = await supabase
    .from('paid_ads_packs')
    .select('*')
    .eq('persona_id', personaId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list paid ads packs: ${error.message}`);
  }

  return data as PaidAdsPack[];
}

/**
 * List all paid ads packs by product
 */
export async function listPaidAdsPacksByProduct(
  product: string
): Promise<PaidAdsPack[]> {
  const { data, error } = await supabase
    .from('paid_ads_packs')
    .select('*')
    .eq('product', product)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list paid ads packs by product: ${error.message}`);
  }

  return data as PaidAdsPack[];
}

/**
 * Get a single paid ads pack by ID
 */
export async function getPaidAdsPackById(id: string): Promise<PaidAdsPack | null> {
  const { data, error } = await supabase
    .from('paid_ads_packs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get paid ads pack: ${error.message}`);
  }

  return data as PaidAdsPack;
}

