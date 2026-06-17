import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/ui/Sidebar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CPS Test - Misura i tuoi click al secondo | cpstest.it",
  description: "Il sito italiano di riferimento per il CPS Test. Misura quanti click al secondo riesci a fare, batti i record e condividi il risultato!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${outfit.variable}`}>
      <body>
        <div className="app-container">
          <Sidebar />
          <div className="main-panel">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
