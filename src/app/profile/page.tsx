import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Il Tuo Profilo | cpstest.it',
};

export default function ProfilePage() {
  return (
    <main className="main-content container animate-fade-in" style={{ padding: '60px 20px' }}>
      <h1 className="text-center" style={{ marginBottom: '40px' }}>Profilo Utente</h1>
      
      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px', color: 'var(--color-primary-light)' }}>Statistiche in arrivo</h2>
        <p className="text-muted" style={{ lineHeight: 1.6 }}>
          Qui troverai i tuoi badge, lo storico dei test, il tuo livello e la tua streak giornaliera. Funzionalità disponibile a breve.
        </p>
      </div>
    </main>
  );
}
