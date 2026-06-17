'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Supabase JS takes care of parsing the hash fragment (#access_token=...) 
    // automatically on page load when the client initializes.
    // We just wait a brief moment for it to process the token and save it to localStorage
    // and then we redirect the user cleanly to the home page without the ugly hash in the URL.
    
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push('/');
      }
    });

    // Fallback if the event doesn't fire for some reason but token was already processed
    const timer = setTimeout(() => {
      router.push('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-pulse" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--color-primary)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div>
        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Accesso in corso...</div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
