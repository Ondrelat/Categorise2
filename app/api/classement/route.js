import { NextResponse } from 'next/server';
import { getclassementsSortedByRating } from '@/lib/articles';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');

    console.log('API films called:', { category, sort });

    if (!category) {
      return NextResponse.json(
        { error: 'Missing category parameter' }, 
        { status: 400 }
      );
    }

    const films = await getclassementsSortedByRating(category, sort || 'imdb');
    
    return NextResponse.json(films, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { 
          details: error.message 
        })
      }, 
      { status: 500 }
    );
  }
}

// Support des autres méthodes HTTP si nécessaire
export async function POST(request) {
  return NextResponse.json(
    { error: 'Method not implemented' }, 
    { status: 501 }
  );
}