import { supabase } from '../supabaseClient';
import type { EmailSmsSequence, CreateEmailSmsSequenceInput } from '@growth-os/shared';

/**
 * Create new email/SMS sequence
 */
export async function createEmailSmsSequence(
  input: CreateEmailSmsSequenceInput
): Promise<EmailSmsSequence> {
  const { data, error } = await supabase
    .from('email_sms_sequences')
    .insert([input])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create email/SMS sequence: ${error.message}`);
  }

  return data as EmailSmsSequence;
}

/**
 * List all email/SMS sequences for a specific persona
 */
export async function listEmailSmsSequencesForPersona(
  personaId: string
): Promise<EmailSmsSequence[]> {
  const { data, error } = await supabase
    .from('email_sms_sequences')
    .select('*')
    .eq('persona_id', personaId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list email/SMS sequences: ${error.message}`);
  }

  return data as EmailSmsSequence[];
}

/**
 * List all email/SMS sequences by product
 */
export async function listEmailSmsSequencesByProduct(
  product: string
): Promise<EmailSmsSequence[]> {
  const { data, error } = await supabase
    .from('email_sms_sequences')
    .select('*')
    .eq('product', product)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list email/SMS sequences by product: ${error.message}`);
  }

  return data as EmailSmsSequence[];
}

/**
 * Get a single email/SMS sequence by ID
 */
export async function getEmailSmsSequenceById(id: string): Promise<EmailSmsSequence | null> {
  const { data, error } = await supabase
    .from('email_sms_sequences')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get email/SMS sequence: ${error.message}`);
  }

  return data as EmailSmsSequence;
}

