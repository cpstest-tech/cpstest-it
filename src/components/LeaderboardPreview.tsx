'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trophy } from 'lucide-react';
import { User } from '@supabase/supabase-js';

export default function LeaderboardPreview({ duration }: { duration: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly' | 'lifetime'>('daily');
  const [leaderboardData, setLeaderboardData] = useState<{name: string, cps: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('scores')
          .select('cps, profiles!inner(username), created_at')
          .eq('duration', duration)
          .order('cps', { ascending: false })
          .limit(100);
          
        if (activeTab === 'daily') {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          query = query.gte('created_at', yesterday.toISOString());
        } else if (activeTab === 'monthly') {
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          query = query.gte('created_at', lastMonth.toISOString());
        }
        
        const { data, error } = await query;
        if (error) throw error;
        
        // Filter unique users in JS to simulate GROUP BY user_id
        const uniqueUsers = new Set();
        const result: {name: string, cps: string}[] = [];
        
        if (data) {
          for (const row of data) {
            const username = (row.profiles as any).username;
            if (!uniqueUsers.has(username)) {
              uniqueUsers.add(username);
              result.push({ name: username, cps: Number(row.cps).toFixed(1) });
              if (result.length >= 15) break;
            }
          }
        }
        
        setLeaderboardData(result);
      } catch (err) {
        console.error("Errore fetch classifica:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeTab]);

  return (
    <div className="glass-panel leaderboard-preview" style={{ height: '100%', padding: '24px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary-light)', marginBottom: '16px', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <Trophy size={20} /> Classifica ({duration === 0 ? 'Infinito' : `${duration}s`})
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '400px' }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Caricamento classifica...
          </div>
        ) : leaderboardData.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Nessun record in questo periodo. Sii il primo!
          </div>
        ) : (
          leaderboardData.map((player, i) => (
            <div key={i} style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--color-surface-hover)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                <span style={{ color: 'var(--color-text-muted)', marginRight: '8px' }}>#{i+1}</span>
                {player.name}
              </span>
              <span style={{ color: 'var(--color-primary-light)', fontWeight: 800 }}>{player.cps}</span>
            </div>
          ))
        )}
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
