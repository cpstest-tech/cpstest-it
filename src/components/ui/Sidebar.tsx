'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MousePointer2, Trophy, BookOpen, Clock, Activity } from 'lucide-react';
import AuthButton from '@/components/AuthButton';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'CPS Test (10s)', icon: <MousePointer2 size={18} /> },
    { href: '/cps-test-1-second', label: '1 Secondo', icon: <Activity size={18} /> },
    { href: '/cps-test-5-second', label: '5 Secondi', icon: <Clock size={18} /> },
    { href: '/cps-test-30-second', label: '30 Secondi', icon: <Clock size={18} /> },
    { href: '/cps-test-60-second', label: '60 Secondi', icon: <Clock size={18} /> },
    { href: '/leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> },
    { href: '/blog/cos-e-il-cps', label: 'Guide & Info', icon: <BookOpen size={18} /> },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
        <img 
          src="/logo.jpeg" 
          alt="cpstest.it Logo" 
          style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }} 
        />
        <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          cpstest<span style={{ color: 'var(--color-primary)' }}>.it</span>
        </span>
      </Link>

      {/* Nav Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', paddingLeft: '16px' }}>
          Modalità
        </div>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className={`sidebar-link ${isActive ? 'active' : ''}`}>
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Auth & Footer nel sidebar */}
      <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: 'var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AuthButton />
        <div style={{ fontSize: '0.8rem', textAlign: 'center' }} className="text-muted">
          © {new Date().getFullYear()} cpstest.it
        </div>
      </div>
    </aside>
  );
}
