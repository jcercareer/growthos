import { supabase } from '../supabaseClient';
import type { Messaging, CreateMessagingInput } from '@growth-os/shared';

/**
 * Create new messaging
 */
export async function createMessaging(
  input: CreateMessagingInput
): Promise<Messaging> {
  const { data, error } = await supabase
    .from('messaging')
    .insert([input])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create messaging: ${error.message}`);
  }

  return data as Messaging;
}

/**
 * List all messaging for a specific persona
 */
export async function listMessagingForPersona(
  personaId: string
): Promise<Messaging[]> {
  const { data, error } = await supabase
    .from('messaging')
    .select('*')
    .eq('persona_id', personaId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list messaging: ${error.message}`);
  }

  return data as Messaging[];
}

/**
 * Get a single messaging by ID
 */
export async function getMessagingById(id: string): Promise<Messaging | null> {
  const { data, error } = await supabase
    .from('messaging')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get messaging: ${error.message}`);
  }

  return data as Messaging;
}

