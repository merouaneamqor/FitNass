'use server';

import prisma from '@/lib/prisma';
import { Place } from '@/types/place';

// Fetch a single place (club) by its ID
export const fetchClubById = async (clubId: string): Promise<Place | null> => {
  if (!clubId) {
    console.error('fetchClubById Error: clubId parameter is required.');
    return null; // Or throw new Error('Club ID is required.');
  }

  try {
    const place = await prisma.place.findUnique({
      where: {
        id: clubId,
        type: 'CLUB',
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
        type: true,
        slug: true,
        citySlug: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { reviews: true, sportFields: true },
        },
        // Add relations if needed, e.g., reviews: true
      },
    });

    if (!place) {
      return null;
    }

    // Ensure the returned object matches the Place type
    return {
      ...place,
      // Ensure correct types if Prisma returns different types (e.g., Decimal)
      latitude: place.latitude as number,
      longitude: place.longitude as number,
      rating: place.rating as number,
      openingHours: place.openingHours as any | null, // Cast Json
      images: place.images as string[],
      facilities: place.facilities as string[],
    } as Place;

  } catch (error: unknown) {
    console.error(`Database Error fetching club ${clubId}:`, error);
    // Don't rethrow; return null or a specific error object
    return null;
  }
};

// Add fetchClubsByLocation if needed later
/*
export const fetchClubsByLocation = async (city: string): Promise<Place[]> => {
  // Implementation similar to fetchGymsByLocation
};
*/ 