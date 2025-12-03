import { supabase } from '../supabaseClient';
import type { BlogOutline, CreateBlogOutlineInput } from '@growth-os/shared';

/**
 * Create a new blog outline
 */
export async function createBlogOutline(
  input: CreateBlogOutlineInput
): Promise<BlogOutline> {
  const { data, error } = await supabase
    .from('blog_outlines')
    .insert([input])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create blog outline: ${error.message}`);
  }

  return data as BlogOutline;
}

/**
 * List all blog outlines, optionally filtered by persona
 */
export async function listBlogOutlines(personaId?: string): Promise<BlogOutline[]> {
  let query = supabase
    .from('blog_outlines')
    .select('*')
    .order('created_at', { ascending: false });

  if (personaId) {
    query = query.eq('persona_id', personaId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to list blog outlines: ${error.message}`);
  }

  return data as BlogOutline[];
}

/**
 * List all blog outlines for a specific persona
 */
export async function listBlogOutlinesForPersona(
  personaId: string
): Promise<BlogOutline[]> {
  return listBlogOutlines(personaId);
}

/**
 * Get a single blog outline by ID
 */
export async function getBlogOutlineById(
  id: string
): Promise<BlogOutline | null> {
  const { data, error } = await supabase
    .from('blog_outlines')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get blog outline: ${error.message}`);
  }

  return data as BlogOutline;
}

