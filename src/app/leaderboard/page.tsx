export const metadata = {
  title: 'Leaderboard Globale | cpstest.it',
  description: 'Classifica globale dei migliori clicker in Italia. Scopri chi è il più veloce!',
};

export default function LeaderboardPage() {
  return (
    <main className="main-content container animate-fade-in" style={{ padding: '60px 20px' }}>
      <h1 className="text-center" style={{ marginBottom: '40px' }}>Leaderboard</h1>
      
      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px', color: 'var(--color-primary-light)' }}>Classifica in arrivo</h2>
        <p className="text-muted" style={{ lineHeight: 1.6 }}>
          Il database è in fase di configurazione. Presto potrai confrontare i tuoi risultati con quelli degli altri giocatori italiani e scalare le vette della classifica!
        </p>
      </div>
    </main>
  );
}
