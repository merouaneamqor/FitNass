import { NextResponse } from 'next/server';
import { search } from '@/app/actions/search';
import { PlaceType } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const city = searchParams.get('city') || undefined;
    const type = searchParams.getAll('type') as PlaceType[];

    const results = await search({
      query,
      city,
      type,
      limit: 20
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
} 