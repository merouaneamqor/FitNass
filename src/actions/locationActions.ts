'use server';

import prisma from '@/lib/prisma';
import { Place } from '@/types/place';
import { Trainer } from '@/types/trainer';

interface CityOverviewData {
  featuredGyms: Place[];
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
    const featuredGymsPromise = prisma.place.findMany({
      where: {
        city: { equals: city, mode: 'insensitive' },
        status: 'ACTIVE',
        type: 'GYM',
      },
      select: {
        id: true, name: true, description: true, address: true, city: true,
        state: true, zipCode: true, phone: true, website: true, email: true,
        images: true, rating: true, facilities: true, priceRange: true,
        latitude: true, longitude: true, type: true, slug: true, citySlug: true, 
        isVerified: true, status: true, viewCount: true, createdAt: true, updatedAt: true,
        _count: { select: { reviews: true, sportFields: true } },
        openingHours: true,
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
        phone: true, email: true, website: true, status: true, userId: true
      },
      orderBy: { rating: 'desc' },
      take: MAX_FEATURED_ITEMS,
    });

    // Fetch distinct class types available in the city (from active classes in active places)
    const availableClassTypesPromise = prisma.fitnessClass.findMany({
       where: {
         status: 'ACTIVE',
         place: { 
           city: { equals: city, mode: 'insensitive' }, 
           status: 'ACTIVE' 
         }
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

    // Map results to ensure correct types
    const mappedGyms = featuredGyms.map((place): Place => ({
      ...place, // Spread all selected fields
      images: place.images as string[],
      facilities: place.facilities as string[],
      rating: place.rating as number,
      latitude: place.latitude as number,
      longitude: place.longitude as number,
      openingHours: place.openingHours,
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