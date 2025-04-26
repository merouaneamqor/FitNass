'use server';

import prisma from '@/lib/prisma';
import { FitnessClass } from '@/types/fitnessClass';

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
      OR: [ // Classes can belong to a Gym OR a Club in the specified city
        {
          gym: {
            city: { equals: city, mode: 'insensitive' },
            status: 'ACTIVE', // Ensure the gym itself is active
          },
        },
        {
          club: {
            city: { equals: city, mode: 'insensitive' },
            status: 'ACTIVE', // Ensure the club itself is active
          },
        },
      ],
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
        // Include simplified Gym/Club/Trainer info if needed for cards
        gym: {
          select: { // Select all fields needed for the Gym type
            id: true, name: true, description: true, city: true, address: true,
            slug: true, citySlug: true, rating: true, priceRange: true, 
            facilities: true, images: true, latitude: true, longitude: true, 
            _count: { select: { reviews: true } }
          }
        },
        club: {
          select: { // Select all fields needed for the Club type
            id: true, name: true, description: true, address: true, city: true, 
            state: true, zipCode: true, latitude: true, longitude: true, phone: true,
            website: true, email: true, rating: true, images: true, facilities: true,
            openingHours: true, status: true, viewCount: true, createdAt: true, updatedAt: true,
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
              // Skip relations like user or classes for this context unless needed
          } 
        },
        // Add schedule later if needed
      },
      orderBy: {
        // Order by start time or name, depending on desired sort
        startTime: 'asc', 
        // name: 'asc',
      },
      // Add pagination if needed
    });

    // Map Prisma result to FitnessClass type
    return classes.map((cls): FitnessClass => ({
      ...cls,
      price: cls.price as number | null,
      startTime: cls.startTime as Date | null,
      endTime: cls.endTime as Date | null,
      duration: cls.duration as number,
      images: cls.images as string[],
      // Type assertions might be needed if Prisma returns slightly different types (e.g., Decimal)
      gym: cls.gym ? {
        ...cls.gym,
        rating: cls.gym.rating as number, // Assert number type if Prisma returns Decimal
        latitude: cls.gym.latitude as number, // Assert number type
        longitude: cls.gym.longitude as number // Assert number type
      } : null,
      club: cls.club ? {
        ...cls.club,
        rating: cls.club.rating as number | null, // Assert number | null type
        latitude: cls.club.latitude as number | null, // Assert number | null type
        longitude: cls.club.longitude as number | null // Assert number | null type
      } : null,
      trainer: cls.trainer ? {
        ...cls.trainer,
        // Add assertions if Prisma types differ (e.g., Decimal for rating/hourlyRate)
        rating: cls.trainer.rating as number | null,
        hourlyRate: cls.trainer.hourlyRate as number | null
      } : null,
      capacity: cls.capacity as number | null,
      schedule: undefined,
      gymId: null,
      clubId: null,
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