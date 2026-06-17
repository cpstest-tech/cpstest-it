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
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${outfit.variable}`}>
      <head>
        {/* Iubenda Privacy Controls and Cookie Solution */}
        <script type="text/javascript" src="https://embeds.iubenda.com/widgets/7004ac4d-902a-464d-937c-acd24515a851.js"></script>
      </head>
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
