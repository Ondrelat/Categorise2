import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from './components/sessionWraper';
import Navbar from './ui/navbar';
import Footer from './footer';
import SideBar from './components/Sidebar';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <title>Dictée Interactive - Améliorez votre orthographe</title>
      </head>
      <body className={`${inter.className} bg-gray-50 flex flex-col min-h-screen`}>
        <SessionWrapper>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1 h-full">
              <SideBar />
               {children}
            </div>
            <Footer />
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}