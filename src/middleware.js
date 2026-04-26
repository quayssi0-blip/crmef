import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

/**
 * JWT decode helper - extracts expiry without verifying signature
 * Used to avoid unnecessary server-side token refresh calls
 */
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export async function middleware(request) {
  // Skip middleware for static files, API routes, and auth callbacks
  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api/') ||
    pathname.includes('auth/callback')
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next();

  try {
    const supabase = createSupabaseServerClient({ req: request, res });

    // Get the current session from cookies
    const { data: { session }, error } = await supabase.auth.getSession();

    // If there's an error (e.g., invalid refresh token), let the client handle recovery
    // Instead of throwing, we just continue without a session
    if (error) {
      console.warn('Auth middleware error (non-fatal):', error.message);
      // Still return the response - client-side auth will attempt recovery
      return res;
    }

    // Check if we have a valid session
    if (session?.access_token) {
      const decoded = decodeJWT(session.access_token);
      if (decoded?.exp) {
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = decoded.exp - now;

        // Only refresh if token is expiring within 5 minutes
        // This prevents the single-use refresh token race condition
        if (timeUntilExpiry < 300) {
          try {
            const { data: { session: refreshedSession }, error: refreshError } = 
              await supabase.auth.refreshSession(session.refresh_token);
            
            if (!refreshError && refreshedSession) {
              // Session refreshed successfully - updated cookies are set via createServerClient
              return res;
            }
          } catch (refreshErr) {
            // If refresh fails, continue with current session
            // Client-side will handle auth state change
            console.warn('Token refresh failed in middleware:', refreshErr.message);
          }
        }
      }
    }

    return res;
  } catch (err) {
    // Never let auth middleware errors block page rendering
    console.warn('Auth middleware unexpected error:', err.message);
    return res;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};