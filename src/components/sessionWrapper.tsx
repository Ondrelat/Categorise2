// components/sessionWrapper.tsx
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { Session } from 'next-auth';

interface SessionProviderWrapperProps {
  children: ReactNode;
  session: Session | null;
}

export default function SessionProviderWrapper({ children, session }: SessionProviderWrapperProps) {
  return (
    <SessionProvider
      session={session}
      // Optimisations importantes pour éviter le polling
      refetchInterval={0} // Désactive le polling automatique
      refetchOnWindowFocus={false} // Évite les vérifications au focus
      refetchWhenOffline={false} // Évite les vérifications hors ligne
    >
      {children}
    </SessionProvider>
  );
}