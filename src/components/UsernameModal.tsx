'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface UsernameModalProps {
  userId: string;
  onSuccess: (username: string) => void;
}

export default function UsernameModal({ userId, onSuccess }: UsernameModalProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || username.trim().length < 3) {
      setError('L\'username deve avere almeno 3 caratteri.');
      return;
    }
    
    // Alphanumeric only
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Solo lettere, numeri e underscore (_).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Controlla se esiste
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        setError('Questo username è già in uso. Scegline un altro.');
        setLoading(false);
        return;
      }

      // Inserisci
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId, username });

      if (insertError) {
        throw insertError;
      }

      onSuccess(username);
    } catch (err: any) {
      console.error(err);
      setError('Errore durante il salvataggio. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form className="glass-panel animate-fade-in" onSubmit={handleSubmit} style={{ padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '400px', border: '1px solid var(--color-primary-glow)', background: 'var(--color-bg)' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#fff', textAlign: 'center' }}>Scegli un Username</h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: '0.9rem', textAlign: 'center' }}>
          Apparirai nella classifica globale con questo nome. Sceglilo con cura!
        </p>
        
        <input 
          type="text" 
          autoFocus
          value={username}
          onChange={e => { setUsername(e.target.value.toLowerCase()); setError(''); }}
          placeholder="es. progamer_99"
          style={{ width: '100%', padding: '16px', fontSize: '1.2rem', background: 'var(--color-surface-hover)', border: error ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', textAlign: 'center', outline: 'none' }}
        />
        {error && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '8px', textAlign: 'center' }}>{error}</p>}
        
        <div style={{ marginTop: '32px' }}>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1rem' }} disabled={loading}>
            {loading ? 'Verifica in corso...' : 'Conferma Username'}
          </button>
        </div>
      </form>
    </div>
  );
}
