import { supabase } from '../supabaseClient';
import type { LeadMagnet, CreateLeadMagnetInput } from '@growth-os/shared';

/**
 * Create new lead magnet
 */
export async function createLeadMagnet(
  input: CreateLeadMagnetInput
): Promise<LeadMagnet> {
  const { data, error } = await supabase
    .from('lead_magnets')
    .insert([input])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create lead magnet: ${error.message}`);
  }

  return data as LeadMagnet;
}

/**
 * List all lead magnets for a specific persona
 */
export async function listLeadMagnetsForPersona(
  personaId: string
): Promise<LeadMagnet[]> {
  const { data, error } = await supabase
    .from('lead_magnets')
    .select('*')
    .eq('persona_id', personaId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list lead magnets: ${error.message}`);
  }

  return data as LeadMagnet[];
}

/**
 * List all lead magnets by product
 */
export async function listLeadMagnetsByProduct(
  product: string
): Promise<LeadMagnet[]> {
  const { data, error } = await supabase
    .from('lead_magnets')
    .select('*')
    .eq('product', product)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list lead magnets by product: ${error.message}`);
  }

  return data as LeadMagnet[];
}

/**
 * Get a single lead magnet by ID
 */
export async function getLeadMagnetById(id: string): Promise<LeadMagnet | null> {
  const { data, error } = await supabase
    .from('lead_magnets')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get lead magnet: ${error.message}`);
  }

  return data as LeadMagnet;
}

