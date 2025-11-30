'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        alert('Authentication failed. Please try again.');
        router.push('/');
        return;
      }

      // With PKCE flow and detectSessionInUrl: true, Supabase automatically handles the code exchange
      // We just need to wait for it to complete and then check for the session
      if (code) {
        try {
          // Listen for auth state changes to know when session is established
          let sessionEstablished = false;
          
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              sessionEstablished = true;
              await handleSuccessfulAuth(session.user.id);
              subscription.unsubscribe();
            }
          });

          // Also wait a bit and check session directly (in case event already fired)
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          if (!sessionEstablished) {
            // Check if we have a session now
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
              console.error('Error getting session after callback:', sessionError);
              subscription.unsubscribe();
              alert('Failed to complete sign in. Please try signing in again.');
              router.push('/');
              return;
            }

            if (session?.user) {
              subscription.unsubscribe();
              await handleSuccessfulAuth(session.user.id);
            } else {
              subscription.unsubscribe();
              console.warn('No session found after OAuth callback');
              alert('Authentication failed. Please try signing in again.');
              router.push('/');
            }
          }
        } catch (error) {
          console.error('Error in OAuth callback:', error);
          alert('An error occurred during sign in. Please try again.');
          router.push('/');
        }
      } else {
        // No code parameter, redirect to home
        router.push('/');
      }
    };

    const handleSuccessfulAuth = async (userId: string) => {
      // Wait a moment for profile to be created
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile) {
        // Success - redirect to dashboard
        router.push('/dashboard');
      } else {
        // Profile not created yet, wait a bit more
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push('/dashboard');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}

