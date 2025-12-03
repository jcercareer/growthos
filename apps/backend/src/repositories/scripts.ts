import { supabase } from '../supabaseClient';
import type { Script, CreateScriptInput } from '@growth-os/shared';

/**
 * Create a new script
 */
export async function createScript(
  input: CreateScriptInput
): Promise<Script> {
  const { data, error } = await supabase
    .from('scripts')
    .insert([input])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create script: ${error.message}`);
  }

  return data as Script;
}

/**
 * List all scripts, optionally filtered by persona
 */
export async function listScripts(personaId?: string): Promise<Script[]> {
  let query = supabase
    .from('scripts')
    .select('*')
    .order('created_at', { ascending: false });

  if (personaId) {
    query = query.eq('persona_id', personaId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to list scripts: ${error.message}`);
  }

  return data as Script[];
}

/**
 * List all scripts for a specific persona
 */
export async function listScriptsForPersona(
  personaId: string
): Promise<Script[]> {
  return listScripts(personaId);
}

/**
 * Get a single script by ID
 */
export async function getScriptById(id: string): Promise<Script | null> {
  const { data, error } = await supabase
    .from('scripts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get script: ${error.message}`);
  }

  return data as Script;
}

