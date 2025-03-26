export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma, prismaExec } from '@/lib/db'; // Update to use our singleton client
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const facilities = searchParams.get('facilities')?.split(',');
    const priceRange = searchParams.get('priceRange');
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;

    // Build filter conditions
    const where: Prisma.GymWhereInput = {};
    
    if (city) {
      where.city = {
        contains: city,
      };
    }
    
    if (facilities && facilities.length > 0) {
      where.facilities = {
        hasSome: facilities,
      };
    }
    
    if (priceRange) {
      where.priceRange = priceRange;
    }
    
    if (minRating) {
      where.rating = {
        gte: minRating,
      };
    }

    // Use a try-catch block specifically for the database query
    try {
      // Use prismaExec for safe database operations
      const gyms = await prismaExec(
        () => prisma.gym.findMany({
          where,
          include: {
            owner: {
              select: {
                name: true,
              },
            },
            reviews: {
              select: {
                rating: true,
              },
            },
            _count: {
              select: {
                reviews: true,
                promotions: true,
              },
            },
          },
          orderBy: {
            rating: 'desc',
          },
        }),
        'Error fetching gyms'
      );
      
      return NextResponse.json(gyms);
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Fallback query without problematic fields/relations
      const simpleGyms = await prisma.gym.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          address: true,
          city: true,
          rating: true,
          priceRange: true,
          facilities: true,
          images: true,
        },
        orderBy: {
          rating: 'desc',
        },
      });
      
      return NextResponse.json(simpleGyms);
    }
  } catch (error) {
    console.error('Error fetching gyms:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 