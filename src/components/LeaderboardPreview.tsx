'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trophy } from 'lucide-react';
import { User } from '@supabase/supabase-js';

export default function LeaderboardPreview() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly' | 'lifetime'>('daily');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fakeDaily = [
    { name: 'xX_GodClick_Xx', cps: '16.4' },
    { name: 'MinecraftPro99', cps: '15.8' },
    { name: 'Faker', cps: '15.1' },
    { name: 'NinjaClicker', cps: '14.7' },
    { name: 'NoobMaster', cps: '14.2' },
    { name: 'ItzMe_Mario', cps: '13.9' },
    { name: 'GigaChad_PvP', cps: '13.5' },
    { name: 'SweatyTryhard', cps: '13.1' },
    { name: 'FastestFinger', cps: '12.8' },
    { name: 'CasualGamer', cps: '11.5' },
    { name: 'ClickBot9000', cps: '11.2' },
    { name: 'RedBullDrinker', cps: '10.8' },
    { name: 'AverageJoe', cps: '10.1' },
    { name: 'SlowPoke', cps: '9.5' },
    { name: 'GrandmaClicks', cps: '8.2' },
  ];

  const fakeMonthly = fakeDaily.map(p => ({ ...p, cps: (parseFloat(p.cps) + 1.5).toFixed(1) }));
  const fakeLifetime = fakeDaily.map(p => ({ ...p, cps: (parseFloat(p.cps) + 3.2).toFixed(1) }));

  const currentList = activeTab === 'daily' ? fakeDaily : activeTab === 'monthly' ? fakeMonthly : fakeLifetime;

  return (
    <div className="glass-panel leaderboard-preview" style={{ height: '100%', padding: '24px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary-light)', marginBottom: '16px', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <Trophy size={20} /> Classifica
      </h3>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: 'var(--color-surface-hover)', padding: '4px', borderRadius: '8px' }}>
        <button 
          onClick={() => setActiveTab('daily')} 
          style={{ flex: 1, padding: '8px 4px', borderRadius: '4px', border: 'none', background: activeTab === 'daily' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'daily' ? '#fff' : 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.2s' }}
        >
          Oggi
        </button>
        <button 
          onClick={() => setActiveTab('monthly')} 
          style={{ flex: 1, padding: '8px 4px', borderRadius: '4px', border: 'none', background: activeTab === 'monthly' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'monthly' ? '#fff' : 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.2s' }}
        >
          Mese
        </button>
        <button 
          onClick={() => setActiveTab('lifetime')} 
          style={{ flex: 1, padding: '8px 4px', borderRadius: '4px', border: 'none', background: activeTab === 'lifetime' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'lifetime' ? '#fff' : 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.2s' }}
        >
          Sempre
        </button>
      </div>
      
      {/* List without forced scroll, taking natural height */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {currentList.map((player, i) => (
          <div key={i} style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--color-surface-hover)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>
              <span style={{ color: 'var(--color-text-muted)', marginRight: '8px' }}>#{i+1}</span>
              {player.name}
            </span>
            <span style={{ color: 'var(--color-primary-light)', fontWeight: 800 }}>{player.cps}</span>
          </div>
        ))}
      </div>

      {!user ? (
        <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(109, 40, 217, 0.1)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(109, 40, 217, 0.3)' }}>
          <p style={{ fontSize: '0.9rem', marginBottom: '16px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            Accedi per salvare i tuoi record ed entrare nella Leaderboard Globale!
          </p>
          <button 
            className="btn-primary" 
            style={{ width: '100%', fontSize: '0.9rem', padding: '10px' }} 
            onClick={() => {
              if (process.env.NEXT_PUBLIC_SUPABASE_URL === undefined) {
                alert("Configura le variabili d'ambiente di Supabase nel file .env.local per abilitare il login.");
                return;
              }
              supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } })
            }}
          >
            Accedi con Google
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', textAlign: 'center', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 600 }}>
          Sei loggato! Batti il record per scalare la classifica.
        </div>
      )}
    </div>
  );
}
