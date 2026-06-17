'use client';

import { X, Download, Share2, Copy } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  cps: number;
}

export default function ShareModal({ isOpen, onClose, imageUrl, cps }: ShareModalProps) {
  if (!isOpen) return null;

  const text = encodeURIComponent(`Ho appena fatto ${cps} CPS su cpstest.it! ⚡ Prova a battermi!`);
  const url = encodeURIComponent('https://cpstest.it');

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }} onClick={onClose}>
      <div 
        className="glass-panel" 
        style={{ padding: '32px', width: '90%', maxWidth: '500px', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Condividi il tuo Record</h2>

        <img src={imageUrl} alt="Result Preview" style={{ width: '100%', borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <a href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`} target="_blank" rel="noreferrer" className="btn-secondary" style={{ textAlign: 'center' }}>
            𝕏 Twitter
          </a>
          <a href={`https://api.whatsapp.com/send?text=${text} ${url}`} target="_blank" rel="noreferrer" className="btn-secondary" style={{ textAlign: 'center', borderColor: '#25D366', color: '#25D366' }}>
            WhatsApp
          </a>
          <a href={`https://t.me/share/url?url=${url}&text=${text}`} target="_blank" rel="noreferrer" className="btn-secondary" style={{ textAlign: 'center', borderColor: '#0088cc', color: '#0088cc' }}>
            Telegram
          </a>
          <button className="btn-secondary" onClick={() => {
            const link = document.createElement('a');
            link.download = 'cpstest-record.png';
            link.href = imageUrl;
            link.click();
          }}>
            <Download size={16} /> Salva Foto
          </button>
        </div>

        <button className="btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={() => {
          navigator.clipboard.writeText(`https://cpstest.it - Ho fatto ${cps} CPS!`);
          alert('Testo copiato negli appunti!');
        }}>
          <Copy size={16} /> Copia Testo
        </button>
      </div>
    </div>
  );
}
