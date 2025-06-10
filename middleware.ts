import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Liste des routes API publiques
const PUBLIC_ROUTES = [
  '/api/scores',  // vos routes qui n'ont pas besoin d'authentification
  // ajoutez d'autres routes publiques ici
];

export async function middleware(request: NextRequest) {
  // Ignorer les routes d'authentification
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Vérifier si la route est publique
  if (PUBLIC_ROUTES.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Pour toutes les autres routes API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: 'Non authentifié' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*'
  ]
};