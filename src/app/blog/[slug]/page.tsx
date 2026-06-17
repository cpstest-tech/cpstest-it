import { notFound } from 'next/navigation';
import Link from 'next/link';
import { articles } from '@/lib/articles';

interface BlogProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generiamo le static params per SSG
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: BlogProps) {
  const { slug } = await params;
  const article = articles.find(a => a.slug === slug);
  
  if (!article) return { title: 'Pagina Non Trovata' };

  return {
    title: `${article.title} | cpstest.it Blog`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      url: `https://cpstest.it/blog/${article.slug}`,
    }
  };
}

export default async function BlogPostPage({ params }: BlogProps) {
  const { slug } = await params;
  const article = articles.find(a => a.slug === slug);
  
  if (!article) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: {
      '@type': 'Organization',
      name: 'cpstest.it',
      url: 'https://cpstest.it'
    }
  };

  return (
    <main className="main-content container animate-fade-in" style={{ padding: '60px 20px', maxWidth: '800px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Link href="/blog" className="text-muted" style={{ display: 'inline-block', marginBottom: '24px' }}>
        &larr; Torna a tutte le Guide
      </Link>
      
      <article className="glass-panel" style={{ padding: '40px' }}>
        <h1 style={{ marginBottom: '16px', color: 'var(--color-primary-light)', fontSize: '2.5rem', lineHeight: 1.2 }}>{article.title}</h1>
        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '32px' }}>
          Pubblicato il: {new Date(article.date).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        
        {/* Il testo è formattato in HTML semplice in articles.ts */}
        <div 
          className="blog-content"
          style={{ lineHeight: 1.8, color: 'var(--color-text)', fontSize: '1.1rem' }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </main>
  );
}
