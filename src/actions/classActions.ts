'use server';

import prisma from '@/lib/prisma';
import { FitnessClass } from '@/types/fitnessClass';
import { Place, PlaceType, PlaceStatus } from '@/types/place';

interface FetchClassesParams {
  city: string;
  classType?: string; // Optional: Filter by specific class type (e.g., 'Yoga')
  // Add other filters like date range, time, difficulty etc. later
}

// Fetch fitness classes by location (city) and optionally by type
export const fetchClassesByLocation = async ({
  city,
  classType,
}: FetchClassesParams): Promise<FitnessClass[]> => {
  if (!city) {
    throw new Error('City parameter is required to fetch classes.');
  }

  try {
    const whereClause: any = {
      status: 'ACTIVE', // Only fetch active classes
      place: {
        city: { equals: city, mode: 'insensitive' },
        status: 'ACTIVE', // Ensure the place itself is active
      },
    };

    // Add class type filter if provided
    if (classType) {
      whereClause.type = { equals: classType, mode: 'insensitive' };
    }

    const classes = await prisma.fitnessClass.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        difficulty: true,
        duration: true,
        startTime: true,
        endTime: true,
        price: true,
        currency: true,
        images: true,
        capacity: true, // Include capacity if needed for ClassCard or filtering
        // Include place info for cards
        place: {
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
            priceRange: true, 
            facilities: true, 
            images: true,
            openingHours: true,
            type: true,
            slug: true, 
            citySlug: true,
            isVerified: true,
            status: true,
            viewCount: true,
            createdAt: true,
            updatedAt: true,
            _count: { select: { reviews: true, sportFields: true } }
          }
        },
        trainer: {
          // Select fields needed for the Trainer type
          select: { 
              id: true, name: true, bio: true, specialties: true, 
              certifications: true, city: true, rating: true, images: true, 
              phone: true, email: true, website: true, hourlyRate: true, 
              status: true, userId: true 
          } 
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Map Prisma result to FitnessClass type
    return classes.map((cls): FitnessClass => ({
      ...cls,
      price: cls.price as number | null,
      startTime: cls.startTime as Date | null,
      endTime: cls.endTime as Date | null,
      duration: cls.duration as number,
      images: cls.images as string[],
      place: cls.place ? {
        ...cls.place,
        rating: cls.place.rating as number,
        latitude: cls.place.latitude as number,
        longitude: cls.place.longitude as number,
        type: cls.place.type as PlaceType,
        status: cls.place.status as PlaceStatus,
        viewCount: cls.place.viewCount as number,
        isVerified: cls.place.isVerified as boolean,
      } : null,
      trainer: cls.trainer ? {
        ...cls.trainer,
        rating: cls.trainer.rating as number | null,
        hourlyRate: cls.trainer.hourlyRate as number | null
      } : null,
      capacity: cls.capacity as number | null,
      schedule: undefined,
      placeId: null,
      trainerId: null
    }));

  } catch (error: unknown) {
    console.error(`Database Error fetching classes for city ${city}:`, error);
    throw new Error(
      `Failed to fetch classes for city ${city}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};

// Add fetchClassById if needed later
/*
export const fetchClassById = async (classId: string): Promise<FitnessClass | null> => {
  // Implementation
};
*/ 