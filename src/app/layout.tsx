// app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from '../components/sessionWrapper';
import Navbar from '@/components/ui/navbar';
import Footer from './footer';
import SideBar from '@/components/Category/Sidebar';
import { getSession } from '@/lib/session';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Categorise - Renseignez-vous sur tous les sujets",
  description: "Une plateforme pour explorer, apprendre et classer des sujets.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Récupérer la session UNE seule fois dans le layout
  const session = await getSession();

  return (
    <html lang="fr" className="h-full">
      <body className={`${inter.className} bg-gray-50 flex flex-col min-h-screen`}>
        <SessionProviderWrapper session={session}>
          <div className="flex flex-col min-h-screen">
            <Navbar session={session} />

            <div className="flex flex-1 h-full mt-4 justify-center">
              <div className="relative">
                {/* Sidebar fixe disponible sur toutes les pages */}
                <div className="absolute -translate-x-full">
                  <SideBar session={session} />
                </div>

                {children}
              </div>
            </div>

            <Footer />
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}