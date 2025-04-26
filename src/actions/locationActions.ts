'use server';

import prisma from '@/lib/prisma';
import { Gym } from '@/types/gym';
import { Trainer } from '@/types/trainer';

interface CityOverviewData {
  featuredGyms: Gym[];
  featuredTrainers: Trainer[];
  availableClassTypes: string[];
}

const MAX_FEATURED_ITEMS = 3; // Max number of featured gyms/trainers to show

export const fetchCityOverviewData = async (city: string): Promise<CityOverviewData> => {
  if (!city) {
    throw new Error('City parameter is required for overview data.');
  }

  try {
    // Fetch top N gyms by rating (or other criteria)
    const featuredGymsPromise = prisma.gym.findMany({
      where: {
        city: { equals: city, mode: 'insensitive' },
        status: 'ACTIVE',
      },
      select: { // Select fields needed for Gym type + GymCard
        id: true, name: true, description: true, address: true, city: true,
        images: true, rating: true, facilities: true,
        priceRange: true, // <-- Select priceRange
        latitude: true,   // <-- Select latitude
        longitude: true,  // <-- Select longitude
        slug: true,       // <-- Select slug (optional but good practice)
        citySlug: true,   // <-- Select citySlug (optional but good practice)
        _count: { select: { reviews: true } }
      },
      orderBy: { rating: 'desc' },
      take: MAX_FEATURED_ITEMS,
    });

    // Fetch top N trainers by rating (or other criteria)
    const featuredTrainersPromise = prisma.trainer.findMany({
      where: {
        city: { equals: city, mode: 'insensitive' },
        status: 'ACTIVE',
      },
      select: { // Select fields needed for Trainer type + TrainerCard
        id: true, name: true, bio: true, specialties: true, certifications: true,
        city: true, rating: true, images: true, hourlyRate: true,
        phone: true,      // <-- Select phone
        email: true,      // <-- Select email
        website: true,    // <-- Select website
        status: true,     // <-- Select status (if exists in model)
        userId: true      // <-- Select userId (if exists in model)
      },
      orderBy: { rating: 'desc' },
      take: MAX_FEATURED_ITEMS,
    });

    // Fetch distinct class types available in the city (from active classes in active gyms/clubs)
    const availableClassTypesPromise = prisma.fitnessClass.findMany({
       where: {
         status: 'ACTIVE',
         OR: [
           { gym: { city: { equals: city, mode: 'insensitive' }, status: 'ACTIVE' } },
           { club: { city: { equals: city, mode: 'insensitive' }, status: 'ACTIVE' } },
         ],
       },
       select: {
         type: true,
       },
       distinct: ['type'], // Get distinct types
    });

    // Execute promises concurrently
    const [featuredGyms, featuredTrainers, distinctClassTypesResult] = await Promise.all([
      featuredGymsPromise,
      featuredTrainersPromise,
      availableClassTypesPromise,
    ]);

    // Map distinct class types to a simple string array and lowercase for consistency
    const availableClassTypes = distinctClassTypesResult.map(c => c.type.toLowerCase()).sort();

    // Map results to ensure correct types (similar to other actions)
    const mappedGyms = featuredGyms.map((gym): Gym => ({
      ...gym, // Spread all selected fields
      images: gym.images as string[],
      facilities: gym.facilities as string[],
      rating: (gym.rating as number | null) ?? 0,
    }));
    const mappedTrainers = featuredTrainers.map((trainer): Trainer => ({
      ...trainer, // Spread all selected fields
      rating: trainer.rating as number | null,
      hourlyRate: trainer.hourlyRate as number | null,
      images: trainer.images as string[],
      specialties: trainer.specialties as string[],
      certifications: trainer.certifications as string[],
    }));

    return {
      featuredGyms: mappedGyms,
      featuredTrainers: mappedTrainers,
      availableClassTypes,
    };

  } catch (error: unknown) {
    console.error(`Database Error fetching overview data for city ${city}:`, error);
    throw new Error(
      `Failed to fetch overview data for city ${city}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}; 