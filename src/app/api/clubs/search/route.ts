import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    console.log(`Club search query: "${query}", page: ${page}, limit: ${limit}`);

    // Search clubs by name, city, address, or description
    const clubs = await db.club.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
        // Status is optional, some clubs might not have a status field
        ...(query ? {} : { status: 'ACTIVE' }), // If no query, only return active clubs
      },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        state: true,
        latitude: true,
        longitude: true,
        phone: true,
        website: true,
        email: true,
        rating: true,
        facilities: true,
        images: true,
        _count: {
          select: {
            reviews: true,
            sportFields: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        rating: 'desc',
      },
    });

    console.log(`Found ${clubs.length} clubs matching query "${query}"`);
    
    // If no results are found for a specific query, try a more general search
    if (clubs.length === 0 && query) {
      console.log('No results found, attempting a more general search');
      
      // Just get some clubs to show something
      const allClubs = await db.club.findMany({
        take: limit,
        orderBy: {
          rating: 'desc',
        },
        select: {
          id: true,
          name: true,
          description: true,
          address: true,
          city: true,
          state: true,
          latitude: true,
          longitude: true,
          phone: true,
          website: true,
          email: true,
          rating: true,
          facilities: true,
          images: true,
          _count: {
            select: {
              reviews: true,
              sportFields: true,
            },
          },
        },
      });
      
      console.log(`Returning ${allClubs.length} clubs for general results`);
      return NextResponse.json(allClubs);
    }

    return NextResponse.json(clubs);
  } catch (error) {
    console.error('Error searching clubs:', error);
    return NextResponse.json(
      { error: 'Failed to search clubs' },
      { status: 500 }
    );
  }
} 