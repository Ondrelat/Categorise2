import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';
import { NoteArticle } from '@/lib/articles';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig);
    const userId = session?.user?.id as string | undefined;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { articleId, rating } = await req.json();

    if (!articleId || typeof rating !== 'number') {
      return NextResponse.json(
        { error: 'Missing or invalid parameters' },
        { status: 400 }
      );
    }

    const result = await NoteArticle(articleId, rating, userId);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in rate API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optionnel : pour explicitement rejeter les autres méthodes
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}