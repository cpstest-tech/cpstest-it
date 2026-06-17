import { notFound } from 'next/navigation';
import Link from 'next/link';

interface BlogProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogProps) {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, ' ').toUpperCase()} | cpstest.it Blog`,
  };
}

export default async function BlogPostPage({ params }: BlogProps) {
  const { slug } = await params;
  
  // Esempio base per MVP, i contenuti reali andrebbero nel DB o in file MDX
  const articles: Record<string, any> = {
    'cos-e-il-cps': {
      title: "Cos'è il CPS Test?",
      content: "Il CPS Test (Clicks Per Second) è un indicatore fondamentale per i gamer che misura quanti click riesci a fare in un secondo. Valori più alti indicano una maggiore reattività."
    },
    'come-aumentare-il-cps': {
      title: "Come Aumentare il tuo CPS",
      content: "Esistono diverse tecniche per aumentare il CPS: Jitter clicking (far vibrare il muscolo del braccio), Butterfly clicking (usare due dita in alternanza), e Drag clicking (sfruttare la frizione sul tasto)."
    },
    'migliori-mouse-per-cps': {
      title: "I Migliori Mouse per il CPS Test e Minecraft",
      content: "Non tutti i mouse sono uguali. I mouse con switch leggeri (es. Glorious Model O, Logitech G Pro X, Razer Viper) permettono di raggiungere CPS molto elevati e supportano il drag e butterfly clicking."
    }
  };

  const article = articles[slug];
  
  if (!article) notFound();

  return (
    <main className="main-content container animate-fade-in" style={{ padding: '60px 20px', maxWidth: '800px' }}>
      <Link href="/" className="text-muted" style={{ display: 'inline-block', marginBottom: '24px' }}>
        &larr; Torna alla Home
      </Link>
      
      <article className="glass-panel" style={{ padding: '40px' }}>
        <h1 style={{ marginBottom: '24px', color: 'var(--color-primary-light)' }}>{article.title}</h1>
        <div style={{ lineHeight: 1.8, color: 'var(--color-text)' }}>
          <p>{article.content}</p>
        </div>
      </article>
    </main>
  );
}
