import { supabase } from '../supabaseClient';
import type {
  SocialPostMetricsSnapshot,
  CreateMetricsSnapshotInput,
} from '@growth-os/shared';

/**
 * Create a new metrics snapshot
 */
export async function createMetricsSnapshot(
  input: CreateMetricsSnapshotInput
): Promise<SocialPostMetricsSnapshot> {
  const { data, error } = await supabase
    .from('social_post_metrics_snapshots')
    .insert([input])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create metrics snapshot: ${error.message}`);
  }

  return data as SocialPostMetricsSnapshot;
}

/**
 * List all metrics snapshots for a specific social post
 */
export async function listMetricsForPost(
  socialPostId: string
): Promise<SocialPostMetricsSnapshot[]> {
  const { data, error } = await supabase
    .from('social_post_metrics_snapshots')
    .select('*')
    .eq('social_post_id', socialPostId)
    .order('captured_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list metrics snapshots: ${error.message}`);
  }

  return data as SocialPostMetricsSnapshot[];
}

/**
 * Get the latest metrics snapshot for a social post
 */
export async function getLatestMetricsForPost(
  socialPostId: string
): Promise<SocialPostMetricsSnapshot | null> {
  const { data, error } = await supabase
    .from('social_post_metrics_snapshots')
    .select('*')
    .eq('social_post_id', socialPostId)
    .order('captured_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get latest metrics: ${error.message}`);
  }

  return data as SocialPostMetricsSnapshot;
}

