import { supabase } from '../supabaseClient';
import type { ViralShortFormScript, CreateViralShortFormScriptInput } from '@growth-os/shared';

/**
 * Create new viral short form script
 */
export async function createViralShortFormScript(
  input: CreateViralShortFormScriptInput
): Promise<ViralShortFormScript> {
  const { data, error } = await supabase
    .from('viral_short_form_scripts')
    .insert([input])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create viral short form script: ${error.message}`);
  }

  return data as ViralShortFormScript;
}

/**
 * List all viral short form scripts for a specific persona
 */
export async function listViralShortFormScriptsForPersona(
  personaId: string
): Promise<ViralShortFormScript[]> {
  const { data, error } = await supabase
    .from('viral_short_form_scripts')
    .select('*')
    .eq('persona_id', personaId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list viral short form scripts: ${error.message}`);
  }

  return data as ViralShortFormScript[];
}

/**
 * List all viral short form scripts by product
 */
export async function listViralShortFormScriptsByProduct(
  product: string
): Promise<ViralShortFormScript[]> {
  const { data, error } = await supabase
    .from('viral_short_form_scripts')
    .select('*')
    .eq('product', product)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list viral short form scripts by product: ${error.message}`);
  }

  return data as ViralShortFormScript[];
}

/**
 * Get a single viral short form script by ID
 */
export async function getViralShortFormScriptById(id: string): Promise<ViralShortFormScript | null> {
  const { data, error } = await supabase
    .from('viral_short_form_scripts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get viral short form script: ${error.message}`);
  }

  return data as ViralShortFormScript;
}

