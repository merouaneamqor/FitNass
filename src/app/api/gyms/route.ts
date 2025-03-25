import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const facilities = searchParams.get('facilities')?.split(',');
    const priceRange = searchParams.get('priceRange');
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;

    // Build filter conditions
    const where: any = {};
    
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

    const gyms = await prisma.gym.findMany({
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
    });

    return NextResponse.json(gyms);
  } catch (error) {
    console.error('Error fetching gyms:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 