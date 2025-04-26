'use server';

import prisma from '@/lib/prisma';
import { Gym } from '@/types/gym';

export const fetchGyms = async (): Promise<Gym[]> => {
  try {
    const gyms = await prisma.gym.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        slug: true,
        citySlug: true,
        latitude: true,
        longitude: true,
        priceRange: true,
        facilities: true,
        images: true,
        rating: true,
        createdAt: true,
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return gyms.map((gym): Gym => ({
      ...gym,
      images: gym.images as string[],
      facilities: gym.facilities as string[],
    }));
  } catch (error: unknown) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch gyms: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// New action to fetch gyms by city
export const fetchGymsByLocation = async (city: string): Promise<Gym[]> => {
  if (!city) {
    throw new Error('City parameter is required.');
  }

  try {
    const gyms = await prisma.gym.findMany({
      where: {
        city: {
          // Use equals for exact match, or contains/mode: 'insensitive' for partial match
          equals: city,
          mode: 'insensitive', // Assuming case-insensitive matching is desired
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        latitude: true,
        longitude: true,
        priceRange: true,
        facilities: true,
        images: true,
        rating: true,
        createdAt: true,
        _count: {
          select: { reviews: true },
        },
      },
      orderBy: { rating: 'desc' }, // Order by rating for relevance within the city
    });

    return gyms.map((gym): Gym => ({
      ...gym,
      images: gym.images as string[],
      facilities: gym.facilities as string[],
    }));
  } catch (error: unknown) {
    console.error('Database Error fetching gyms by location:', error);
    throw new Error(
      `Failed to fetch gyms for city ${city}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};
