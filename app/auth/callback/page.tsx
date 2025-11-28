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

      if (code) {
        try {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('Error exchanging code for session:', exchangeError);
            alert('Failed to complete sign in. Please try again.');
            router.push('/');
            return;
          }

          if (data?.session?.user) {
            // Wait a moment for profile to be created
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Check if profile exists
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.session.user.id)
              .single();

            if (profile) {
              // Success - redirect to dashboard
              router.push('/dashboard');
            } else {
              // Profile not created yet, wait a bit more
              await new Promise(resolve => setTimeout(resolve, 1000));
              router.push('/dashboard');
            }
          } else {
            router.push('/');
          }
        } catch (error) {
          console.error('Error in OAuth callback:', error);
          alert('An error occurred during sign in. Please try again.');
          router.push('/');
        }
      } else {
        router.push('/');
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

