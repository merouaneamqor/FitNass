'use server';

import prisma from '@/lib/prisma';
import { Club } from '@/types/club';

// Fetch a single club by its ID
export const fetchClubById = async (clubId: string): Promise<Club | null> => {
  if (!clubId) {
    console.error('fetchClubById Error: clubId parameter is required.');
    return null; // Or throw new Error('Club ID is required.');
  }

  try {
    const club = await prisma.club.findUnique({
      where: {
        id: clubId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        latitude: true,
        longitude: true,
        phone: true,
        website: true,
        email: true,
        rating: true,
        images: true,
        facilities: true,
        openingHours: true,
        status: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { reviews: true, sportFields: true },
        },
        // Add relations if needed, e.g., reviews: true
      },
    });

    if (!club) {
      return null;
    }

    // Ensure the returned object matches the Club type
    // Prisma returns Decimal for Float, cast if necessary or adjust type
    // Prisma returns Json for Json, cast if necessary or adjust type
    return {
      ...club,
      // Ensure correct types if Prisma returns different types (e.g., Decimal)
      latitude: club.latitude as number | null,
      longitude: club.longitude as number | null,
      rating: club.rating as number | null,
      openingHours: club.openingHours as any | null, // Cast Json
      images: club.images as string[],
      facilities: club.facilities as string[],
    } as Club;

  } catch (error: unknown) {
    console.error(`Database Error fetching club ${clubId}:`, error);
    // Don't rethrow; return null or a specific error object
    // throw new Error(`Failed to fetch club ${clubId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
};

// Add fetchClubsByLocation if needed later
/*
export const fetchClubsByLocation = async (city: string): Promise<Club[]> => {
  // Implementation similar to fetchGymsByLocation
};
*/ 