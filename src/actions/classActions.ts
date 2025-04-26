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
        // Include simplified Gym/Club/Trainer info if needed for cards
        gym: {
          select: { id: true, name: true, city: true }
        },
        club: {
          select: { id: true, name: true, city: true }
        },
        trainer: {
          select: { id: true, name: true }
        },
        // Add capacity, schedule later if needed
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
      gym: cls.gym ? { ...cls.gym } : null, // Ensure nested types match
      club: cls.club ? { ...cls.club } : null,
      trainer: cls.trainer ? { ...cls.trainer } : null,
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