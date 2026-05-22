/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Helper to handle client-side database interaction gracefully
export async function getTripFromDb(tripId: string) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('id', tripId)
      .maybeSingle();

    if (error) {
      console.warn('Database select failed or table entries is missing:', error);
      return null;
    }
    return data ? data.data : null;
  } catch (err) {
    console.error('Failed to select from Supabase:', err);
    return null;
  }
}

export async function saveTripToDb(tripId: string, tripData: any) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('entries')
      .upsert({ id: tripId, data: tripData });

    if (error) {
      console.warn('Database upsert failed or table entries is missing:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to upsert to Supabase:', err);
    return false;
  }
}
