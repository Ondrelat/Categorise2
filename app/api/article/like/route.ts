import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';
import { likeArticle } from '@/lib/articles';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    const userId = session?.user?.id as string | undefined;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { articleId, liked } = await request.json();
    
    if (!articleId || typeof liked !== 'boolean') {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const result = await likeArticle(articleId, liked, userId);
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error in like API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}