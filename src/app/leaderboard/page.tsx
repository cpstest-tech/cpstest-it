'use client';

import { useState } from 'react';
import LeaderboardPreview from '@/components/LeaderboardPreview';
import { Trophy } from 'lucide-react';

const DURATIONS = [
  { label: '1s', value: 1 },
  { label: '2s', value: 2 },
  { label: '5s', value: 5 },
  { label: '10s', value: 10 },
  { label: '15s', value: 15 },
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
  { label: 'Infinito', value: 0 },
];

export default function LeaderboardPage() {
  const [selectedDuration, setSelectedDuration] = useState(10);

  return (
    <main className="main-content animate-fade-in" style={{ padding: '40px 32px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px var(--color-primary-glow)'
          }}>
            <Trophy size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(to right, #a78bfa, #8b5cf6, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Leaderboard Globale
          </h1>
        </div>
        <p className="text-muted" style={{ fontSize: '1rem', lineHeight: 1.6 }}>
          I migliori clicker d&apos;Italia, classifica globale aggiornata in tempo reale.
        </p>
      </div>

      {/* Duration selector */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '28px' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
          Seleziona Durata
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {DURATIONS.map(({ label, value }) => {
            const isActive = value === selectedDuration;
            return (
              <button
                key={value}
                onClick={() => setSelectedDuration(value)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: isActive ? '1px solid var(--color-primary-light)' : '1px solid rgba(255,255,255,0.07)',
                  background: isActive ? 'var(--color-primary)' : 'var(--color-surface-hover)',
                  color: isActive ? '#fff' : 'var(--color-text-muted)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 4px 14px var(--color-primary-glow)' : 'none',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <LeaderboardPreview duration={selectedDuration} />
    </main>
  );
}
