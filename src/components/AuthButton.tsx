'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { LogOut } from 'lucide-react';
import UsernameModal from './UsernameModal';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        const { data } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', currentUser.id)
          .single();
          
        if (data) {
          setUsername(data.username);
        }
      }
      setLoading(false);
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        const { data } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', currentUser.id)
          .single();
        setUsername(data?.username || null);
      } else {
        setUsername(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL === undefined) {
      alert("Configura le variabili d'ambiente di Supabase nel file .env.local per abilitare il login.");
      return;
    }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <div style={{ width: '100px', height: '40px' }}></div>;

  if (!user) {
    return (
      <button 
        onClick={handleLogin} 
        className="btn-secondary" 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Accedi
      </button>
    );
  }

  // Profilo standard avatar
  const standardAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.id;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', background: 'var(--color-surface-hover)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <img 
          src={standardAvatar} 
          alt="Avatar Standard" 
          style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--color-primary)' }} 
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{username || 'Nuovo Utente'}</span>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.8rem', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <LogOut size={12} /> Esci
          </button>
        </div>
      </div>
      
      {user && !username && !loading && (
        <UsernameModal 
          userId={user.id} 
          onSuccess={(newUsername) => setUsername(newUsername)} 
        />
      )}
    </>
  );
}
