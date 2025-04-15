import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Define a type for the where clause
export type GymStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING_APPROVAL"
  | "CLOSED";

type WhereClause = {
  OR: Array<{
    name?: { contains: string; mode: 'insensitive' };
    city?: { contains: string; mode: 'insensitive' };
    address?: { contains: string; mode: 'insensitive' };
    description?: { contains: string; mode: 'insensitive' };
  }>;
  status?: GymStatus;
  city?: { contains: string; mode: 'insensitive' };
};

// Set route as dynamic to avoid static rendering failures
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const city = searchParams.get('city') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    console.log(`Gym search query: "${query}", city: "${city}", page: ${page}, limit: ${limit}`);

    // Build where clause
    const whereClause: WhereClause = {
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
      // If no query, only return active gyms
      whereClause.status = "ACTIVE" as GymStatus;
    }

    // Add city filter if provided
    if (city) {
      whereClause.city = { contains: city, mode: 'insensitive' };
    }

    // Add status filter if provided
    if (searchParams.get('status')) {
      whereClause.status = searchParams.get('status')!.toUpperCase() as GymStatus;
    }

    // Search gyms with constructed where clause
    const gyms = await prisma.gym.findMany({
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

    console.log(`Found ${gyms.length} gyms matching query "${query}"${city ? ` in city "${city}"` : ''}`);
    
    // If no results are found and we have search criteria, try a more general search
    if (gyms.length === 0 && (query || city)) {
      console.log('No results found, attempting a more general search');
      
      // Just get some gyms to show something
      const allGyms = await prisma.gym.findMany({
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