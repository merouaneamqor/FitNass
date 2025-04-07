import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const city = searchParams.get('city') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    console.log(`Club search query: "${query}", city: "${city}", page: ${page}, limit: ${limit}`);

    // Build where clause
    const whereClause: any = {
      OR: [],
    };

    // Add query conditions if a search query is provided
    if (query) {
      whereClause.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    } else {
      // If no query, only return active clubs
      whereClause.status = 'ACTIVE';
    }

    // Add city filter if provided
    if (city) {
      whereClause.city = { contains: city, mode: 'insensitive' };
    }

    // Search clubs with constructed where clause
    const clubs = await prisma.club.findMany({
      where: whereClause,
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

    console.log(`Found ${clubs.length} clubs matching query "${query}"${city ? ` in city "${city}"` : ''}`);
    
    // If no results are found and we have search criteria, try a more general search
    if (clubs.length === 0 && (query || city)) {
      console.log('No results found, attempting a more general search');
      
      // Just get some clubs to show something
      const allClubs = await prisma.club.findMany({
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