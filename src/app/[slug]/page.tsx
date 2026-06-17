import { notFound } from 'next/navigation';
import CpsTestArea from '@/components/CpsTestArea';
import AdSlot from '@/components/ui/AdSlot';
import TimeSelect from '@/components/TimeSelect';
import LeaderboardPreview from '@/components/LeaderboardPreview';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  
  if (slug === 'cps-test-infinito') {
    return {
      title: `CPS Test Infinito | cpstest.it`,
      description: `Mettiti alla prova con il CPS Test Infinito. Clicca finché hai energia e scopri il tuo vero potenziale su cpstest.it!`,
    };
  }

  const match = slug.match(/^cps-test-(\d+)-second$/);
  if (!match) return { title: 'Pagina Non Trovata' };
  const seconds = match[1];

  return {
    title: `CPS Test in ${seconds} Secondi | cpstest.it`,
    description: `Mettiti alla prova con il CPS Test di ${seconds} secondi. Quanti click riesci a fare? Batti il record italiano su cpstest.it!`,
  };
}

export default async function CpsTestPage({ params }: PageProps) {
  const { slug } = await params;
  
  let durationSeconds = 0;
  if (slug !== 'cps-test-infinito') {
    const match = slug.match(/^cps-test-(\d+)-second$/);
    if (!match) {
      notFound();
    }
    durationSeconds = parseInt(match[1], 10);
  }

  return (
    <main className="animate-fade-in" style={{ padding: '24px', width: '100%', maxWidth: '100%' }}>

      <div style={{ marginBottom: '24px' }}>
        <AdSlot height="120px" />
      </div>

      <div className="grid-dense" style={{ display: 'grid', gridTemplateColumns: '1fr 300px 100px', gap: '24px', alignItems: 'stretch' }}>
        
        {/* Left Column: Test Area */}
        <div>
          <CpsTestArea durationSeconds={durationSeconds} />
        </div>

        {/* Leaderboard & CTA */}
        <div className="desktop-only leaderboard-preview">
          <LeaderboardPreview />
        </div>

        {/* Vertical Ad */}
        <div className="desktop-only ad-vertical">
          <AdSlot height="100%" type="vertical" />
        </div>
        
      </div>

      {/* Time Select sotto */}
      <TimeSelect currentDuration={durationSeconds} />

      {/* Second Ad Slot */}
      <div style={{ marginTop: '24px' }}>
        <AdSlot height="90px" />
      </div>

      {/* SEO Text */}
      <section style={{ marginTop: '40px', paddingBottom: '60px' }}>
        <div className="glass-panel" style={{ padding: '40px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '24px' }}>
            {durationSeconds === 0 ? 'CPS Test Infinito' : `CPS Test ${durationSeconds} Secondi`}
          </h1>
          <p className="text-muted" style={{ lineHeight: 1.7, fontSize: '1.1rem', marginBottom: '16px' }}>
            {durationSeconds === 0 ? 
              "Hai scelto la modalità Infinita. In questa modalità il test non finisce mai automaticamente: il timer continuerà a salire finché tu non smetterai di cliccare per almeno un secondo. È la prova di resistenza definitiva!" 
              : `Hai scelto la modalità da ${durationSeconds} secondi.`
            }
            {durationSeconds > 0 && durationSeconds <= 5 && " Un test breve come questo misura il tuo 'burst' puro. La resistenza non conta, qui devi solo sprigionare la massima velocità iniziale."}
            {durationSeconds > 5 && durationSeconds <= 30 && " Questa è la modalità classica. Richiede una buona velocità iniziale ma anche la capacità di mantenere il ritmo (stamina) senza stancare l'avambraccio."}
            {durationSeconds > 30 && " Una vera maratona per le dita. In questo test non conta solo la tecnica ma soprattutto la resistenza fisica."}
          </p>
        </div>
      </section>
    </main>
  );
}
