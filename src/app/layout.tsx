// layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from '../components/sessionWrapper';
import Navbar from '@/components/ui/navbar';
import Footer from './footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Categorise - Renseignez-vous sur tous les sujets",
  description: "Une plateforme pour explorer, apprendre et classer des sujets.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className={`${inter.className} bg-gray-50 flex flex-col min-h-screen`}>
        <SessionProviderWrapper>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            {children}
            <Footer />
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
