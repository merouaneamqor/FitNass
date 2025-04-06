import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    console.log(`Gym search query: "${query}", page: ${page}, limit: ${limit}`);

    // Search gyms by name, city, address, or description
    const gyms = await db.gym.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
        // Status is optional, some gyms might not have a status field
        ...(query ? {} : { status: 'ACTIVE' }), // If no query, only return active gyms
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
        priceRange: true,
        facilities: true,
        images: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        rating: 'desc',
      },
    });

    console.log(`Found ${gyms.length} gyms matching query "${query}"`);
    
    // If no results are found for a specific query, try a more general search
    if (gyms.length === 0 && query) {
      console.log('No results found, attempting a more general search');
      
      // Just get some gyms to show something
      const allGyms = await db.gym.findMany({
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
          priceRange: true,
          facilities: true,
          images: true,
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      });
      
      console.log(`Returning ${allGyms.length} gyms for general results`);
      return NextResponse.json(allGyms);
    }

    return NextResponse.json(gyms);
  } catch (error) {
    console.error('Error searching gyms:', error);
    return NextResponse.json(
      { error: 'Failed to search gyms' },
      { status: 500 }
    );
  }
} 