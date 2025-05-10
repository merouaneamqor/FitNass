'use server';

import prisma from '@/lib/prisma';
import { Trainer } from '@/types/trainer'; // Assuming type is defined

// Fetch trainers by city
export const fetchTrainersByLocation = async (city: string): Promise<Trainer[]> => {
  if (!city) {
    throw new Error('City parameter is required to fetch trainers.');
  }

  try {
    const trainers = await prisma.trainer.findMany({
      where: {
        city: {
          equals: city,
          mode: 'insensitive', // Case-insensitive city matching
        },
        status: 'ACTIVE', // Only fetch active trainers by default
      },
      select: {
        id: true,
        name: true,
        bio: true,
        specialties: true,
        certifications: true,
        city: true,
        rating: true,
        images: true,
        hourlyRate: true,
        // Add other fields needed for the TrainerCard
        // e.g., _count for reviews if added later
      },
      orderBy: {
        // Order by rating or name, depending on desired default sort
        rating: 'desc',
        // name: 'asc',
      },
      // Add pagination if needed later (take, skip)
    });

    // Map Prisma result to Trainer type, handling potential type differences
    return trainers.map((trainer): Trainer => ({
      ...trainer,
      rating: trainer.rating as number | null,
      hourlyRate: trainer.hourlyRate as number | null,
      images: trainer.images as string[],
      specialties: trainer.specialties as string[],
      certifications: trainer.certifications as string[],
      phone: null, // Add missing required properties with null values
      email: null,
      website: null
    }));

  } catch (error: unknown) {
    console.error(`Database Error fetching trainers for city ${city}:`, error);
    throw new Error(
      `Failed to fetch trainers for city ${city}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};

// Add fetchTrainerById if needed later
/*
export const fetchTrainerById = async (trainerId: string): Promise<Trainer | null> => {
  // Implementation similar to fetchClubById
};
*/ 