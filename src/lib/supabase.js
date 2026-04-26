import { createClient } from '@supabase/supabase-js';

let supabase = null;

const SUPABASE_URL = 'https://gqwghuqkzdxsckbclvwb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_EX0q2PdsSvCFpKAlp57llQ_RZBFnxZK';

export const getSupabase = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  
  return supabase;
};

export const getSupabaseAdmin = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false },
  });
};
