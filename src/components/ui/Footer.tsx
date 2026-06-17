import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: 'var(--glass-border)', padding: '40px 0', marginTop: 'auto', background: 'var(--color-bg)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>⚡ cpstest<span className="text-primary">.it</span></h3>
          <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
            Il sito di riferimento in Italia per misurare la velocità di click. Batti i record e scala la classifica!
          </p>
        </div>
        <div>
          <h4 style={{ marginBottom: '16px', color: 'var(--color-text)' }}>Modalità</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><Link href="/cps-test-1-second" className="text-muted">CPS Test 1 Secondo</Link></li>
            <li><Link href="/cps-test-5-second" className="text-muted">CPS Test 5 Secondi</Link></li>
            <li><Link href="/cps-test-10-second" className="text-muted">CPS Test 10 Secondi</Link></li>
            <li><Link href="/cps-test-30-second" className="text-muted">CPS Test 30 Secondi</Link></li>
            <li><Link href="/cps-test-60-second" className="text-muted">CPS Test 60 Secondi</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '16px', color: 'var(--color-text)' }}>Risorse</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><Link href="/blog/cos-e-il-cps" className="text-muted">Cos'è il CPS?</Link></li>
            <li><Link href="/blog/come-aumentare-il-cps" className="text-muted">Come aumentare il CPS</Link></li>
            <li><Link href="/blog/migliori-mouse-per-cps" className="text-muted">Migliori Mouse</Link></li>
            <li><Link href="/leaderboard" className="text-muted">Classifica Globale</Link></li>
          </ul>
        </div>
      </div>
      <div className="container" style={{ marginTop: '40px', paddingTop: '20px', borderTop: 'var(--glass-border)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
        © {new Date().getFullYear()} cpstest.it - Tutti i diritti riservati.
      </div>
    </footer>
  );
}
