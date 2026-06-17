import Link from 'next/link';
import { articles } from '@/lib/articles';

export const metadata = {
  title: 'Blog e Guide sul CPS Test | cpstest.it',
  description: 'Scopri tutte le guide, le tecniche e i segreti sul mondo del CPS Test. Impara a fare drag click, butterfly click e scegli il miglior mouse.',
};

export default function BlogIndexPage() {
  return (
    <main className="main-content container animate-fade-in" style={{ padding: '60px 20px', maxWidth: '1000px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--color-primary-light)', marginBottom: '16px' }}>Guide & Informazioni</h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Tutto quello che devi sapere sul mondo del clicking competitivo. Tecniche, recensioni mouse e consigli per la salute.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {articles.map((article) => (
          <Link 
            key={article.slug} 
            href={`/blog/${article.slug}`}
            className="glass-panel"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              padding: '24px', 
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '12px', lineHeight: 1.4 }}>{article.title}</h2>
            <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: 1.6, flex: 1, marginBottom: '24px' }}>
              {article.description}
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-primary-light)', fontWeight: 600 }}>
              Leggi l'articolo &rarr;
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
