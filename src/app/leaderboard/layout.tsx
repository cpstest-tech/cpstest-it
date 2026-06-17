import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leaderboard Globale | cpstest.it',
  description: 'Classifica globale dei migliori clicker in Italia. Scopri chi è il più veloce nel click per secondo!',
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
