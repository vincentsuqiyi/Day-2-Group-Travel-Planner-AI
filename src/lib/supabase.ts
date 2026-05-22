/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="vite/client" />
import { createClient } from "@supabase/supabase-js";

export const supabase = (
  createClient(
    import.meta.env.VITE_SUPABASE_URL || '',
    import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  )
);

export const isSupabaseConfigured = !!(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Helper to handle client-side database interaction gracefully
export async function getTripFromDb(tripId: string) {
  if (!isSupabaseConfigured) return null;
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
  if (!isSupabaseConfigured) return false;
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
