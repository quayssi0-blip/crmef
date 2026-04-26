import { createClient } from '@supabase/supabase-js';

let supabase = null;

// Direct URL and key values (embedded since process.env may not be available)
const SUPABASE_URL = 'https://gqwghuqkzdxsckbclvwb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_EX0q2PdsSvCFpKAlp57llQ_RZBFnxZK';

// Read env vars with fallback to direct values
const getEnvVar = (key) => {
  try {
    return process?.env?.[key] || undefined;
  } catch {
    return undefined;
  }
};

// Export a function to get the client
export const getSupabase = () => {
  const url = getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || SUPABASE_URL;
  const key = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    if (!supabase && typeof window !== 'undefined') {
      console.warn('Supabase client not initialized - environment variables are missing');
    }
    return null;
  }
  
  if (!supabase) {
    supabase = createClient(url, key);
  }
  
  return supabase;
};

// Admin client
export const getSupabaseAdmin = () => {
  const url = getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || SUPABASE_URL;
  const serviceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!url || !serviceKey) {
    return null;
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false },
  });
};
