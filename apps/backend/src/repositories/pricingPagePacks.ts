import { supabase } from '../supabaseClient';
import type { PricingPagePack, CreatePricingPagePackInput } from '@growth-os/shared';

/**
 * Create new pricing page pack
 */
export async function createPricingPagePack(
  input: CreatePricingPagePackInput
): Promise<PricingPagePack> {
  const { data, error } = await supabase
    .from('pricing_page_packs')
    .insert([input])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create pricing page pack: ${error.message}`);
  }

  return data as PricingPagePack;
}

/**
 * List all pricing page packs by product
 */
export async function listPricingPagePacksByProduct(
  product: string
): Promise<PricingPagePack[]> {
  const { data, error } = await supabase
    .from('pricing_page_packs')
    .select('*')
    .eq('product', product)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list pricing page packs: ${error.message}`);
  }

  return data as PricingPagePack[];
}

/**
 * Get a single pricing page pack by ID
 */
export async function getPricingPagePackById(id: string): Promise<PricingPagePack | null> {
  const { data, error } = await supabase
    .from('pricing_page_packs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get pricing page pack: ${error.message}`);
  }

  return data as PricingPagePack;
}

