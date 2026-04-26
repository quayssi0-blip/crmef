import { createClient } from '@supabase/supabase-js';
import { createServerClient, createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL = 'https://gqwghuqkzdxsckbclvwb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_EX0q2PdsSvCFpKAlp57llQ_RZBFnxZK';

/**
 * Server-side Supabase client (for use in server components and middleware)
 * Uses @supabase/ssr with skipAutoInitialize to prevent race conditions
 * during token refresh. This avoids the "Invalid Refresh Token: Refresh Token Not Found"
 * error caused by parallel refresh attempts.
 */
export const createSupabaseServerClient = ({ req, res }) => {
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    req,
    res,
    options: {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: true,
      },
    },
  });
};

/**
 * Browser-side Supabase client
 * Uses @supabase/ssr's browser client which properly handles session persistence
 * and includes built-in recovery from token refresh failures.
 */
export const createSupabaseBrowserClient = () => {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    options: {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    },
  });
};

// Legacy client for backward compatibility (client-side only)
// This maintains the old API while using the new SSR-safe client underneath
let supabase = null;

export const getSupabase = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!supabase) {
    supabase = createSupabaseBrowserClient();
  }

  return supabase;
};

/**
 * Admin/Server-side client with service role key
 * Note: This uses the same anon key for backward compatibility.
 * In production, use a proper service role key for admin operations.
 */
export const getSupabaseAdmin = () => {
  if (typeof window !== 'undefined') {
    return null;
  }
  return createSupabaseBrowserClient();
};