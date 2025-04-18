import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Import prisma directly

// Define types (keep these)
export type GymStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING_APPROVAL"
  | "CLOSED";

type WhereClause = {
  OR?: Array<{ // Make OR optional
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
    const limit = parseInt(searchParams.get('limit') || '20'); // Keep limit reasonable
    const skip = (page - 1) * limit;
    const statusParam = searchParams.get('status');

    console.log(`API: Gym search query: "${query}", city: "${city}", page: ${page}, limit: ${limit}, status: ${statusParam}`);

    // Build where clause directly for Prisma
    const whereClause: WhereClause = {};

    if (query) {
      whereClause.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
        // Removed description search for simplicity, add back if needed
        // { description: { contains: query, mode: 'insensitive' } },
      ];
    } else {
      // Default to only active gyms if no specific query or status
      if (!statusParam) {
          whereClause.status = "ACTIVE";
      }
    }

    if (city) {
      whereClause.city = { contains: city, mode: 'insensitive' };
    }

    // Add status filter only if explicitly provided
    if (statusParam) {
       // Basic validation for status
       const validStatuses: GymStatus[] = ["ACTIVE", "INACTIVE", "PENDING_APPROVAL", "CLOSED"];
       const upperStatus = statusParam.toUpperCase();
       if (validStatuses.includes(upperStatus as GymStatus)) {
           whereClause.status = upperStatus as GymStatus;
       } else {
           console.warn(`Invalid status parameter received: ${statusParam}`);
           // Optionally return an error or ignore invalid status
           // For now, we proceed without the invalid status filter
       }
    } else if (!query && !city) {
        // Ensure default status is ACTIVE only when no other filters are applied
        whereClause.status = "ACTIVE";
    }


    console.log("Prisma Where Clause:", JSON.stringify(whereClause, null, 2));

    // Execute Prisma query directly
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
        status: true, // Include status in selection
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        // Optional: Add default sorting if needed, e.g., by name or rating
         name: 'asc',
        // rating: 'desc',
      },
    });

    console.log(`API: Found ${gyms.length} gyms.`);

    // Get total count for pagination (optional but good practice)
    const totalGyms = await prisma.gym.count({ where: whereClause });
    console.log(`API: Total matching gyms: ${totalGyms}`);

    // Return results (and optionally pagination info)
    return NextResponse.json(gyms // Could return { data: gyms, total: totalGyms, page, limit } for pagination
    );

  } catch (error) {
    console.error('API Error searching gyms:', error);

    // Return a proper error response instead of mock data
    return NextResponse.json(
        { message: 'Failed to search gyms', error: (error instanceof Error) ? error.message : 'Unknown error' },
        { status: 500 }
    );
  }
}

// Removed mock data and filterMockGyms function 