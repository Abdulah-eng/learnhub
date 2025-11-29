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
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes('supabase') || key.includes('sb-') || key.includes('auth-token')) {
            localStorage.removeItem(key);
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
    if (error?.message?.includes('refresh_token') || 
        error?.message?.includes('Invalid Refresh Token') ||
        error?.message?.includes('Refresh Token Not Found')) {
      console.warn('Caught refresh token error, clearing session');
      event.preventDefault(); // Prevent error from showing in console
      
      // Clear invalid tokens
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes('supabase') || key.includes('sb-') || key.includes('auth-token')) {
            localStorage.removeItem(key);
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

