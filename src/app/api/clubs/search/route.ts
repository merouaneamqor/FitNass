import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Import prisma directly

// Set route as dynamic to avoid static rendering failures
export const dynamic = 'force-dynamic';

// Define types (keep these)
export type ClubStatus =
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
  status?: ClubStatus;
  city?: { contains: string; mode: 'insensitive' };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const city = searchParams.get('city') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20'); // Keep limit reasonable
    const skip = (page - 1) * limit;
    const statusParam = searchParams.get('status');

    console.log(`API: Club search query: "${query}", city: "${city}", page: ${page}, limit: ${limit}, status: ${statusParam}`);

    // Build where clause directly for Prisma
    const whereClause: WhereClause = {};

    if (query) {
      whereClause.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
        // { description: { contains: query, mode: 'insensitive' } }, // Optional
      ];
    } else {
      // Default to only active clubs if no specific query or status
      if (!statusParam) {
          whereClause.status = "ACTIVE";
      }
    }

    if (city) {
      whereClause.city = { contains: city, mode: 'insensitive' };
    }

    // Add status filter only if explicitly provided
    if (statusParam) {
       const validStatuses: ClubStatus[] = ["ACTIVE", "INACTIVE", "PENDING_APPROVAL", "CLOSED"];
       const upperStatus = statusParam.toUpperCase();
       if (validStatuses.includes(upperStatus as ClubStatus)) {
           whereClause.status = upperStatus as ClubStatus;
       } else {
           console.warn(`Invalid status parameter received: ${statusParam}`);
       }
    } else if (!query && !city) {
        // Ensure default status is ACTIVE only when no other filters are applied
        whereClause.status = "ACTIVE";
    }

    console.log("Prisma Where Clause:", JSON.stringify(whereClause, null, 2));

    // Execute Prisma query directly
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
        status: true, // Include status
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
        name: 'asc',
        // rating: 'desc',
      },
    });

    console.log(`API: Found ${clubs.length} clubs.`);

    // Get total count for pagination (optional)
    const totalClubs = await prisma.club.count({ where: whereClause });
    console.log(`API: Total matching clubs: ${totalClubs}`);

    return NextResponse.json(clubs);

  } catch (error) {
    console.error('API Error searching clubs:', error);
    return NextResponse.json(
        { message: 'Failed to search clubs', error: (error instanceof Error) ? error.message : 'Unknown error' },
        { status: 500 }
    );
  }
} 