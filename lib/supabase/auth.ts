import { supabase } from './client';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  is_approved?: boolean;
  is_blocked?: boolean;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error('No user data returned');
  }

  // Fetch user profile with role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError) {
    throw profileError;
  }

  const userProfile = profile as UserProfile;

  // Check if user is blocked
  if (userProfile.is_blocked) {
    throw new Error('Your account has been blocked. Please contact support.');
  }

  // Note: We allow login even if user is not approved
  // The app will handle showing appropriate UI and restrictions

  return {
    user: data.user,
    profile: userProfile,
  };
}

/**
 * Sign up with email and password (creates user account only)
 */
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
        role: 'user', // Ensure role is set in metadata
      },
    },
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error('No user data returned');
  }

  // Wait for the trigger to create the profile automatically
  // The trigger function uses SECURITY DEFINER so it bypasses RLS
  let profile = null;
  let attempts = 0;
  const maxAttempts = 10; // Increased attempts
  const delayMs = 300; // Increased delay

  while (attempts < maxAttempts && !profile) {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileData) {
      profile = profileData;
      break;
    }

    // If it's a 406 or other error, continue retrying
    // Only log if it's not a "not found" error
    if (profileError && profileError.code !== 'PGRST116') {
      console.log(`Attempt ${attempts + 1}: Waiting for profile creation...`, profileError.code);
    }
    
    attempts++;
  }

  // If profile still doesn't exist after retries, the trigger might have failed
  // In this case, we'll return the user without profile and let the auth state change handler deal with it
  if (!profile) {
    console.warn('Profile not created by trigger after signup. It may be created shortly.');
    // Return a temporary profile structure - the auth state change listener will fetch it
    return {
      user: data.user,
      profile: {
        id: data.user.id,
        email: data.user.email || email,
        name: name,
        role: 'user',
      } as UserProfile,
    };
  }

  // Ensure role is 'user' (in case it was set differently)
  if (profile.role !== 'user') {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'user' })
      .eq('id', data.user.id);

    if (!updateError) {
      profile = { ...profile, role: 'user' };
    }
  }

  // Send admin notification email
  try {
    const dashboardUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/dashboard`
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/dashboard';
    
    await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'admin_signup_notification',
        data: {
          name: name,
          email: email,
          signupDate: new Date().toISOString(),
          dashboardUrl: dashboardUrl,
        },
      }),
    });
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    // Don't fail signup if email fails
  }

  return {
    user: data.user,
    profile: profile as UserProfile,
  };
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    throw error;
  }

  // The OAuth flow will redirect, so we don't return user data here
  return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * Get the current user and their profile
 */
export async function getCurrentUser(): Promise<{ user: any; profile: UserProfile | null } | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    // Handle invalid refresh token errors
    if (error) {
      // If it's a token refresh error, clear the session
      if (error.message?.includes('refresh_token') || error.message?.includes('Invalid Refresh Token')) {
        console.warn('Invalid refresh token, clearing session');
        try {
          await supabase.auth.signOut();
        } catch (signOutError) {
          console.error('Error signing out:', signOutError);
        }
        // Clear localStorage if available
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('sb-auth-token');
            localStorage.removeItem(`sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`);
          } catch (e) {
            // Ignore localStorage errors
          }
        }
      }
      return null;
    }

    if (!user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return { user, profile: null };
    }

    const userProfile = profile as UserProfile;

    // Check if user is blocked
    if (userProfile?.is_blocked) {
      return null; // Return null if blocked
    }

    // Check if user is approved (only for non-admin users)
    if (userProfile?.role === 'user' && !userProfile?.is_approved) {
      return null; // Return null if not approved
    }

    return {
      user,
      profile: userProfile,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (result: { user: any; profile: UserProfile | null } | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    // Handle token refresh errors
    if (event === 'TOKEN_REFRESHED' && !session) {
      // Token refresh failed, clear session
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Error signing out after token refresh failure:', error);
      }
      callback(null);
      return;
    }

    // Handle signed out events
    if (event === 'SIGNED_OUT' || !session?.user) {
      callback(null);
      return;
    }

    if (session?.user) {
      // Wait a bit for profile to be created if it's a new signup
      let profile = null;
      let attempts = 0;
      const maxAttempts = 5;

      while (attempts < maxAttempts) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileData) {
            profile = profileData;
            break;
          }

          // If it's a "not found" error, wait and retry
          if (profileError && profileError.code === 'PGRST116') {
            await new Promise(resolve => setTimeout(resolve, 200));
            attempts++;
          } else {
            // Other errors, break and return null profile
            break;
          }
        } catch (error) {
          console.error('Error fetching profile in auth state change:', error);
          break;
        }
      }

      const userProfile = profile as UserProfile | null;

      // Check if user is blocked or not approved
      if (userProfile) {
        if (userProfile.is_blocked) {
          callback(null); // Blocked users are logged out
          return;
        }
        if (userProfile.role === 'user' && !userProfile.is_approved) {
          callback(null); // Unapproved users are logged out
          return;
        }
      }

      callback({
        user: session.user,
        profile: userProfile,
      });
    } else {
      callback(null);
    }
  });
}

