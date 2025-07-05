// components/sessionWrapper.tsx
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface SessionProviderWrapperProps {
  children: ReactNode;
}

export default async function SessionProviderWrapper({ children }: SessionProviderWrapperProps) {
  const session = await auth();

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