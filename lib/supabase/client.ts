import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'sb-auth-token',
    flowType: 'pkce',
  },
  global: {
    headers: {
      'x-client-info': 'learnhub-web',
    },
  },
});

// Handle token refresh errors globally
if (typeof window !== 'undefined') {
  // Listen for auth errors
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED' && !session) {
      // Token refresh failed, clear invalid tokens
      console.warn('Token refresh failed, clearing invalid session');
      try {
        // Clear all Supabase auth tokens from localStorage
        // BUT preserve PKCE code verifier if it exists (for OAuth flow)
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          // Don't clear PKCE code verifier - it's needed for OAuth callback
          if (key.includes('supabase') || key.includes('sb-') || key.includes('auth-token')) {
            // Preserve PKCE code verifier
            if (!key.includes('code-verifier') && !key.includes('pkce')) {
              localStorage.removeItem(key);
            }
          }
        });
      } catch (e) {
        console.error('Error clearing localStorage:', e);
      }
    }
  });

  // Handle unhandled promise rejections from Supabase
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    
    // Suppress PKCE code exchange errors - these can happen during normal page loads
    // when Supabase tries to automatically detect sessions but the code verifier is missing
    if (error?.message?.includes('code verifier') || 
        error?.message?.includes('auth code and code verifier') ||
        error?.message?.includes('both auth code and code verifier should be non-empty')) {
      // This is a PKCE flow error - suppress it to avoid console noise
      // It's expected when there's no active OAuth flow
      event.preventDefault();
      return;
    }
    
    if (error?.message?.includes('refresh_token') || 
        error?.message?.includes('Invalid Refresh Token') ||
        error?.message?.includes('Refresh Token Not Found')) {
      console.warn('Caught refresh token error, clearing session');
      event.preventDefault(); // Prevent error from showing in console
      
      // Clear invalid tokens
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          // Don't clear PKCE code verifier
          if (key.includes('supabase') || key.includes('sb-') || key.includes('auth-token')) {
            // Preserve PKCE code verifier
            if (!key.includes('code-verifier') && !key.includes('pkce')) {
              localStorage.removeItem(key);
            }
          }
        });
        // Sign out to clear session
        supabase.auth.signOut().catch(() => {
          // Ignore sign out errors
        });
      } catch (e) {
        // Ignore errors
      }
    }
  });
}

