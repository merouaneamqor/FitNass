import { NextResponse } from 'next/server';
import { getSearchSuggestions } from '@/lib/search';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = searchParams.get('limit');

    if (!query) {
      return NextResponse.json([], { status: 200 });
    }

    const suggestions = await getSearchSuggestions(
      query,
      limit ? parseInt(limit) : undefined
    );

    return NextResponse.json(suggestions, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Error in search suggestions API:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 