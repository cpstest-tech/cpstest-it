'use client';

import { useCpsTest } from '@/hooks/useCpsTest';
import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import ShareModal from '@/components/ShareModal';
import { Share2, Medal, MousePointer2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface CpsTestAreaProps {
  durationSeconds: number;
}

export default function CpsTestArea({ durationSeconds }: CpsTestAreaProps) {
  const { status, clicks, timeLeft, cps, handleClick, resetTest } = useCpsTest(durationSeconds);
  const [particles, setParticles] = useState<{ x: number, y: number, id: number, color: string, rotation: number, scale: number }[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  
  // Ref per evitare salvataggi doppi
  const hasSavedScoreRef = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
  }, []);

  useEffect(() => {
    if (status === 'idle') {
      hasSavedScoreRef.current = false;
      setIsNewRecord(false);
    }

    if (status === 'finished' && !hasSavedScoreRef.current) {
      hasSavedScoreRef.current = true;
      
      const pbKey = `cps_pb_${durationSeconds}`;
      const prevBest = parseFloat(localStorage.getItem(pbKey) || '0');
      
      if (cps > prevBest && durationSeconds > 0) {
        setIsNewRecord(true);
        localStorage.setItem(pbKey, cps.toString());
      } else {
        setIsNewRecord(false);
      }

      const saveScore = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              await supabase.from('scores').insert({
                user_id: session.user.id,
                cps: cps,
                clicks: clicks,
                duration: durationSeconds,
              });
            }
          }
        } catch (err) {
          console.error("Errore salvataggio punteggio:", err);
        }
      };
      
      saveScore();
    }
  }, [status, cps, clicks, durationSeconds]);
  
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const colors = ['#8B5CF6', '#F97316', '#10B981', '#3B82F6', '#EC4899', '#EAB308'];

  const onAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (status === 'finished') return; // Inibisce animazione a test finito
    
    handleClick();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newParticle = { 
      x, y, 
      id: Date.now() + Math.random(), 
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 1.5
    };
    
    setParticles((prev) => [...prev, newParticle]);
    
    setTimeout(() => {
      setParticles((prev) => prev.filter(p => p.id !== newParticle.id));
    }, 600);
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!shareCardRef.current || isCapturing) return;
    
    setIsCapturing(true);
    try {
      // Temporaneamente mostriamo la card per assicurarci che html-to-image la renderizzi bene
      shareCardRef.current.style.opacity = '1';
      shareCardRef.current.style.zIndex = '100';

      const dataUrl = await toPng(shareCardRef.current, { 
        cacheBust: true,
        pixelRatio: 2, // Immagine più definita
      });
      
      // La nascondiamo di nuovo
      shareCardRef.current.style.opacity = '0';
      shareCardRef.current.style.zIndex = '-10';
      
      setCapturedImage(dataUrl);

      if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'cpstest-record.png', { type: 'image/png' });
        await navigator.share({
          title: 'Il mio punteggio su cpstest.it',
          text: `Ho fatto ${cps} CPS su cpstest.it! ⚡ Prova a battermi!`,
          files: [file]
        }).catch(err => console.error("Error sharing", err));
      } else {
        setShareModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to capture image', err);
    } finally {
      setIsCapturing(false);
      if (shareCardRef.current) {
        shareCardRef.current.style.opacity = '0';
        shareCardRef.current.style.zIndex = '-10';
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', height: '100%', position: 'relative' }}>
      
      {/* Hidden Share Card for Image Generation */}
      <div 
        ref={shareCardRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle at center, #2e1065 0%, #09090b 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: "'Outfit', sans-serif",
          opacity: 0,
          zIndex: -10,
          pointerEvents: 'none',
          borderRadius: '24px',
          border: '2px solid #8B5CF6'
        }}
      >
        <Medal size={120} color="#F59E0B" style={{ filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.5))', marginBottom: '20px' }} />
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>Il mio Record</h2>
        <div style={{ fontSize: '8rem', fontWeight: 900, color: '#8B5CF6', textShadow: '0 0 40px rgba(139,92,246,0.6)', lineHeight: 1, margin: '20px 0' }}>
          {cps}
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#94A3B8', marginBottom: '40px' }}>Clicks Per Second</div>
        
        <div style={{ marginTop: 'auto', marginBottom: '40px', fontSize: '1.8rem', fontWeight: 900, background: 'linear-gradient(to right, #a78bfa, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          cpstest.it
        </div>
      </div>

      {/* 3 Stat Boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '16px', textAlign: 'center', border: '1px solid var(--color-primary-glow)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', color: 'var(--color-primary-light)' }}>
            {durationSeconds === 0 ? 'Tempo' : 'Timer'}
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{timeLeft.toFixed(1)}</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '16px', textAlign: 'center', border: '1px solid var(--color-primary-glow)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', color: 'var(--color-primary-light)' }}>Click/s</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{cps}</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '16px', textAlign: 'center', border: '1px solid var(--color-primary-glow)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', color: 'var(--color-primary-light)' }}>Score</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{clicks}</div>
        </div>
      </div>

      <div 
        onClick={onAreaClick}
        className={status === 'running' ? 'animate-glow' : ''}
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: '#000',
          borderRadius: '16px',
          flex: 1,
          minHeight: '450px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: status === 'finished' ? 'default' : 'pointer',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'none', // Previene doppio tap per zoom e scroll nativo
          transition: 'all 0.2s ease',
        }}
        // Aggiungiamo anche onTouchStart per bypassare il ritardo del click su mobile
        onTouchStart={(e) => {
          if (status !== 'finished') {
            onAreaClick(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }}
      >
        {status === 'idle' && (
          <div className="text-center animate-pulse animate-fade-in" style={{ padding: '20px' }}>
            <MousePointer2 size={48} color="var(--color-primary-light)" style={{ margin: '0 auto 16px auto', opacity: 0.8 }} />
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>Clicca per iniziare</h2>
            <p className="text-muted">Inizia a cliccare il più velocemente possibile!</p>
          </div>
        )}

        {status === 'running' && (
          <div style={{ fontSize: '6rem', fontWeight: 900, opacity: 0.1, position: 'absolute' }}>
            {clicks}
          </div>
        )}

        {status === 'finished' && (
          <div className="glass-panel animate-fade-in" style={{ padding: '40px', textAlign: 'center', zIndex: 10, background: 'rgba(9, 9, 11, 0.95)' }}>
            {isNewRecord && (
              <div style={{ color: '#FBBF24', fontWeight: 800, marginBottom: '16px', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                🎉 Nuovo Record Personale!
              </div>
            )}
            <h3 style={{ color: 'var(--color-primary-light)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>Il tuo Punteggio</h3>
            <div style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1 }}>{cps.toFixed(1)}</div>
            <div className="text-muted" style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '8px', marginBottom: '24px' }}>CPS</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Totale: {clicks} click in {durationSeconds}s
            </div>
            
            {!user && isNewRecord && (
              <div style={{ background: 'rgba(109, 40, 217, 0.1)', border: '1px solid var(--color-primary)', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem' }}>
                <strong>Non sei loggato!</strong><br />
                Accedi dal menu laterale per salvare questo punteggio nella classifica globale!
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: !user && isNewRecord ? '0' : '24px' }}>
              <button onClick={(e) => { e.stopPropagation(); resetTest(); }} className="btn-primary">Riprova</button>
              <button onClick={handleShareClick} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Share2 size={16} /> Condividi Immagine
              </button>
            </div>
          </div>
        )}

        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg) scale(${p.scale})`,
              width: '100px',
              height: '100px',
              border: `4px solid ${p.color}`,
              borderRadius: p.rotation > 180 ? '50%' : '12px', // Misto cerchi e quadrati
              boxShadow: `0 0 20px ${p.color}`,
              animation: 'coolPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
              pointerEvents: 'none'
            }}
          />
        ))}

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes coolPop {
            0% { transform: translate(-50%, -50%) rotate(0deg) scale(0); opacity: 1; border-width: 10px; }
            50% { opacity: 1; border-width: 4px; }
            100% { transform: translate(-50%, -50%) rotate(90deg) scale(2); opacity: 0; border-width: 0px; }
          }
        `}} />
      </div>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setShareModalOpen(false)} 
        imageUrl={capturedImage}
        cps={cps}
      />
    </div>
  );
}
