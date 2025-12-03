import { supabase } from '../supabaseClient';
import type { Persona, CreatePersonaInput } from '@growth-os/shared';

/**
 * Create a new persona
 */
export async function createPersona(
  input: CreatePersonaInput
): Promise<Persona> {
  const { data, error } = await supabase
    .from('personas')
    .insert([input])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create persona: ${error.message}`);
  }

  return data as Persona;
}

/**
 * List all personas, optionally filtered by product
 */
export async function listPersonas(
  product?: string
): Promise<Persona[]> {
  let query = supabase
    .from('personas')
    .select('*')
    .order('created_at', { ascending: false });

  if (product) {
    query = query.eq('product', product);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to list personas: ${error.message}`);
  }

  return data as Persona[];
}

/**
 * Get a single persona by ID
 */
export async function getPersonaById(id: string): Promise<Persona | null> {
  const { data, error } = await supabase
    .from('personas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    throw new Error(`Failed to get persona: ${error.message}`);
  }

  return data as Persona;
}

