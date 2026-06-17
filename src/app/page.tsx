import CpsTestArea from '@/components/CpsTestArea';
import AdSlot from '@/components/ui/AdSlot';
import TimeSelect from '@/components/TimeSelect';
import LeaderboardPreview from '@/components/LeaderboardPreview';

export default function Home() {
  return (
    <main className="animate-fade-in" style={{ padding: '24px', width: '100%', maxWidth: '100%' }}>
      
      <div style={{ marginBottom: '24px' }}>
        <AdSlot height="120px" />
      </div>

      {/* Grid: Test Area | Leaderboard | Ad */}
      <div className="grid-dense" style={{ display: 'grid', gridTemplateColumns: '1fr 300px 100px', gap: '24px', alignItems: 'stretch' }}>
        
        {/* Colonna Sinistra: Test Area */}
        <div>
          <CpsTestArea durationSeconds={10} />
        </div>

        {/* Colonna Centro: Leaderboard & CTA */}
        <div className="desktop-only leaderboard-preview">
          <LeaderboardPreview duration={10} />
        </div>

        {/* Colonna Estrema: Vertical Ad */}
        <div className="desktop-only ad-vertical">
          <AdSlot height="100%" type="vertical" />
        </div>
        
      </div>

      {/* Time Select posizionato sotto */}
      <TimeSelect currentDuration={10} />

      {/* Second Ad Slot */}
      <div style={{ marginTop: '24px' }}>
        <AdSlot height="90px" />
      </div>

      {/* SEO Text */}
      <section style={{ marginTop: '40px', paddingBottom: '60px' }}>
        <div className="glass-panel" style={{ padding: '40px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '24px' }}>Cos'è il CPS Test?</h1>
          <p className="text-muted" style={{ lineHeight: 1.7, fontSize: '1.1rem', marginBottom: '16px' }}>
            Il <strong>CPS Test</strong> (Clicks Per Second) è lo strumento definitivo per misurare la tua velocità di click del mouse. 
            Utilizzato da migliaia di gamer italiani, in particolare giocatori di Minecraft PvP, è il modo migliore per testare e migliorare
            la propria reattività in combattimento.
          </p>
          <p className="text-muted" style={{ lineHeight: 1.7, fontSize: '1.1rem' }}>
            In questa homepage puoi provare direttamente la modalità classica da 10 secondi. Seleziona qui sopra 
            le altre modalità (1s, 5s, 30s, 60s) per allenare il tuo "burst" o la tua "stamina". Usa tecniche come Jitter Click, Butterfly o Drag clicking per scalare le classifiche!
          </p>
        </div>
      </section>
    </main>
  );
}
