'use server';

import prisma from '@/lib/prisma';
import { Place } from '@/types/place';

export const fetchGyms = async (): Promise<Place[]> => {
  try {
    const places = await prisma.place.findMany({
      where: {
        type: 'GYM',
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
        priceRange: true,
        images: true,
        facilities: true,
        openingHours: true,
        type: true,
        slug: true,
        citySlug: true,
        isVerified: true,
        status: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { reviews: true, sportFields: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return places.map((place): Place => ({
      ...place,
      images: place.images as string[],
      facilities: place.facilities as string[],
      latitude: place.latitude as number,
      longitude: place.longitude as number,
      rating: place.rating as number,
    }));
  } catch (error: unknown) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch gyms: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Action to fetch gyms by city
export const fetchGymsByLocation = async (city: string): Promise<Place[]> => {
  if (!city) {
    throw new Error('City parameter is required.');
  }

  try {
    const places = await prisma.place.findMany({
      where: {
        city: {
          equals: city,
          mode: 'insensitive',
        },
        type: 'GYM',
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
        priceRange: true,
        images: true,
        facilities: true,
        openingHours: true,
        type: true,
        slug: true,
        citySlug: true,
        isVerified: true,
        status: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { reviews: true, sportFields: true }
        }
      },
      orderBy: { rating: 'desc' },
    });

    return places.map((place): Place => ({
      ...place,
      images: place.images as string[],
      facilities: place.facilities as string[],
      latitude: place.latitude as number,
      longitude: place.longitude as number,
      rating: place.rating as number,
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
