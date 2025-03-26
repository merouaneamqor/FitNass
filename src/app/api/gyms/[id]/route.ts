import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    try {
      // Use a simple query first to avoid field issues
      const simpleGym = await prisma.gym.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          address: true,
          city: true,
          state: true,
          zipCode: true,
          rating: true,
          priceRange: true,
          facilities: true,
          images: true,
          phone: true,
          website: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          ownerId: true
        }
      });
      
      if (!simpleGym) {
        return NextResponse.json({ error: 'Gym not found' }, { status: 404 });
      }
      
      // After we got the basic gym data, fetch related data separately
      try {
        // Get owner info
        const owner = await prisma.user.findUnique({
          where: { id: simpleGym.ownerId },
          select: {
            name: true
          }
        });
        
        // Get reviews
        const reviews = await prisma.review.findMany({
          where: { gymId: id },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        });
        
        // Get review count
        const reviewCount = await prisma.review.count({
          where: { gymId: id }
        });
        
        // Combine all data
        const fullGym = {
          ...simpleGym,
          owner: owner,
          reviews: reviews,
          _count: {
            reviews: reviewCount
          }
        };
        
        return NextResponse.json(fullGym);
      } catch (relatedDataError) {
        console.error('Error fetching related data:', relatedDataError);
        // Return just the gym data if related data fails
        return NextResponse.json(simpleGym);
      }
    } catch (dbError) {
      console.error('Database error fetching gym:', dbError);
      
      // Last resort fallback with minimal fields
      try {
        const minimalGym = await prisma.gym.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            description: true,
            city: true,
            rating: true,
            priceRange: true,
            facilities: true,
            images: true
          }
        });
        
        if (!minimalGym) {
          return NextResponse.json({ error: 'Gym not found' }, { status: 404 });
        }
        
        return NextResponse.json(minimalGym);
      } catch (finalError) {
        console.error('Final error fetching gym:', finalError);
        return NextResponse.json({ error: 'Gym not found' }, { status: 404 });
      }
    }
  } catch (error) {
    console.error('Error fetching gym:', error);
    return NextResponse.json({ error: 'Failed to fetch gym' }, { status: 500 });
  }
} 