import { supabase } from '../supabaseClient';
import type { Funnel, CreateFunnelInput } from '@growth-os/shared';

/**
 * Create new funnel
 */
export async function createFunnel(
  input: CreateFunnelInput
): Promise<Funnel> {
  const { data, error } = await supabase
    .from('funnels')
    .insert([input])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create funnel: ${error.message}`);
  }

  return data as Funnel;
}

/**
 * List all funnels for a specific persona
 */
export async function listFunnelsForPersona(
  personaId: string
): Promise<Funnel[]> {
  const { data, error } = await supabase
    .from('funnels')
    .select('*')
    .eq('persona_id', personaId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list funnels: ${error.message}`);
  }

  return data as Funnel[];
}

/**
 * List all funnels by product
 */
export async function listFunnelsByProduct(
  product: string
): Promise<Funnel[]> {
  const { data, error } = await supabase
    .from('funnels')
    .select('*')
    .eq('product', product)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list funnels by product: ${error.message}`);
  }

  return data as Funnel[];
}

/**
 * Get a single funnel by ID
 */
export async function getFunnelById(id: string): Promise<Funnel | null> {
  const { data, error } = await supabase
    .from('funnels')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get funnel: ${error.message}`);
  }

  return data as Funnel;
}

