'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function TimeSelect({ currentDuration }: { currentDuration: number }) {
  const pathname = usePathname();
  const times = [1, 2, 5, 10, 15, 30, 60];
  
  const [showModal, setShowModal] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [error, setError] = useState(false);

  const handleCustomSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const num = parseInt(customValue, 10);
    if (!isNaN(num) && num > 0) {
      window.location.href = `/cps-test-${num}-second`;
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ 
      position: 'sticky', 
      bottom: '-24px', 
      zIndex: 40, 
      background: 'rgba(9, 9, 11, 0.85)', 
      backdropFilter: 'blur(16px)', 
      padding: '24px 24px 32px 24px', 
      margin: '24px -24px 0 -24px', 
      borderTop: '1px solid rgba(255,255,255,0.05)',
      boxShadow: '0 -10px 40px rgba(0,0,0,0.5)'
    }}>
      <div className="text-center" style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', fontSize: '1rem', color: 'var(--color-primary-light)' }}>
        Seleziona Tempo
      </div>
      
      <div className="time-select-container" style={{ 
        display: 'flex', 
        gap: '8px', 
        overflowX: 'auto', 
        paddingBottom: '8px',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none', // Nasconde scrollbar su Firefox
        msOverflowStyle: 'none', // Nasconde scrollbar su IE/Edge
      }}>
        {/* Hack per nascondere la scrollbar su webkit aggiungendo stile inline se necessario, o affidandosi a global css */}
        <style dangerouslySetInnerHTML={{__html: `
          .time-select-container::-webkit-scrollbar { display: none; }
        `}} />
        
        {times.map((t) => {
          const isActive = t === currentDuration;
          const href = t === 10 ? '/' : `/cps-test-${t}-second`;

          return (
            <Link 
              key={t}
              href={href}
              style={{
                background: isActive ? 'var(--color-primary)' : 'var(--color-surface)',
                color: isActive ? '#fff' : 'var(--color-text)',
                padding: '12px 16px',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                boxShadow: isActive ? '0 4px 14px var(--color-primary-glow)' : 'none',
                border: isActive ? '1px solid var(--color-primary-light)' : '1px solid rgba(255,255,255,0.05)',
                flex: '1 0 auto',
                minWidth: '80px'
              }}
              onMouseOver={(e) => {
                if (!isActive) e.currentTarget.style.background = 'var(--color-surface-hover)';
              }}
              onMouseOut={(e) => {
                if (!isActive) e.currentTarget.style.background = 'var(--color-surface)';
              }}
            >
              {t}s
            </Link>
          );
        })}

        <button 
          onClick={() => setShowModal(true)}
          style={{
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            padding: '12px 16px',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: '1px solid rgba(255,255,255,0.05)',
            cursor: 'pointer',
            flex: '1 0 auto',
            minWidth: '120px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'var(--color-surface)'; }}
        >
          CUSTOM
        </button>

        <Link 
          href="/cps-test-infinito"
          style={{
            background: currentDuration === 0 ? 'var(--color-primary)' : 'var(--color-surface)',
            color: currentDuration === 0 ? '#fff' : 'var(--color-text)',
            padding: '12px 16px',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: currentDuration === 0 ? '1px solid var(--color-primary-light)' : '1px dashed var(--color-primary-light)',
            cursor: 'pointer',
            flex: '1 0 auto',
            minWidth: '100px',
            boxShadow: currentDuration === 0 ? '0 4px 14px var(--color-primary-glow)' : 'none',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { if (currentDuration !== 0) e.currentTarget.style.background = 'var(--color-surface-hover)'; }}
          onMouseOut={(e) => { if (currentDuration !== 0) e.currentTarget.style.background = 'var(--color-surface)'; }}
        >
          INFINITO
        </Link>
      </div>

      {showModal && typeof document !== 'undefined' && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form className="glass-panel animate-fade-in" onSubmit={handleCustomSubmit} style={{ padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '400px', border: '1px solid var(--color-primary-glow)', background: 'var(--color-bg)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#fff', textAlign: 'center' }}>Durata Personalizzata</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: '0.9rem', textAlign: 'center' }}>Scegli quanti secondi vuoi che duri il test.</p>
            
            <input 
              type="number" 
              autoFocus
              value={customValue}
              onChange={e => { setCustomValue(e.target.value); setError(false); }}
              placeholder="es. 25"
              style={{ width: '100%', padding: '16px', fontSize: '1.5rem', background: 'var(--color-surface-hover)', border: error ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', textAlign: 'center', outline: 'none' }}
            />
            {error && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '8px', textAlign: 'center' }}>Inserisci un numero valido!</p>}
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button type="button" className="btn-secondary" style={{ flex: 1, padding: '12px' }} onClick={() => setShowModal(false)}>Annulla</button>
              <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px' }}>Avvia Test</button>
            </div>
          </form>
        </div>,
        document.body
      )}
    </div>
  );
}
