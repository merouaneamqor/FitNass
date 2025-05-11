'use server';

import prisma from '@/lib/prisma';
import { Place, PlaceType, PlaceFilters } from '@/types/place';

export async function fetchPlaces(filters?: PlaceFilters): Promise<Place[]> {
  try {
    const where: any = { isActive: true };
    
    if (filters) {
      if (filters.city) {
        where.city = filters.city;
      }
      
      if (filters.type && filters.type.length > 0) {
        where.type = { in: filters.type };
      }
      
      if (filters.minRating) {
        where.rating = { gte: filters.minRating };
      }
      
      if (filters.facilities && filters.facilities.length > 0) {
        where.facilities = { hasSome: filters.facilities };
      }
      
      if (filters.priceRange && filters.priceRange.length > 0) {
        where.priceRange = { in: filters.priceRange };
      }
    }
    
    const places = await prisma.place.findMany({
      where,
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
          select: {
            reviews: true,
            sportFields: true,
            classes: true,
          },
        },
      },
      orderBy: { rating: 'desc' },
    });
    
    return places;
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
}

export async function fetchGyms(filters?: PlaceFilters): Promise<Place[]> {
  return fetchPlaces({ ...filters, type: ['GYM'] });
}

export async function fetchClubs(filters?: PlaceFilters): Promise<Place[]> {
  return fetchPlaces({ ...filters, type: ['CLUB'] });
}

export async function fetchPlacesByLocation(country: string, city: string, type?: PlaceType[]): Promise<Place[]> {
  try {
    // You'll need to add a country field or use other location logic
    const places = await prisma.place.findMany({
      where: {
        city: city,
        ...(type && type.length > 0 ? { type: { in: type } } : {}),
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        phone: true,
        website: true,
        email: true,
        rating: true,
        priceRange: true,
        images: true,
        facilities: true,
        openingHours: true,
        latitude: true,
        longitude: true,
        type: true,
        slug: true,
        citySlug: true,
        isVerified: true,
        status: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            reviews: true,
            sportFields: true,
            classes: true,
          },
        },
      },
      orderBy: {
        rating: 'desc',
      },
    });
    
    // Map to ensure all fields match the Place type
    return places.map(place => ({
      ...place,
      images: place.images as string[],
      facilities: place.facilities as string[],
      rating: place.rating as number,
      latitude: place.latitude as number,
      longitude: place.longitude as number,
      openingHours: place.openingHours as any | null,
    })) as Place[];
  } catch (error) {
    console.error('Error fetching places by location:', error);
    return [];
  }
}

export async function fetchGymsByLocation(country: string, city: string): Promise<Place[]> {
  return fetchPlacesByLocation(country, city, ['GYM']);
}

export async function fetchClubsByLocation(country: string, city: string): Promise<Place[]> {
  return fetchPlacesByLocation(country, city, ['CLUB']);
}

export async function fetchPlaceById(id: string): Promise<Place | null> {
  try {
    const place = await prisma.place.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        sportFields: true,
        classes: {
          include: {
            trainer: true,
          },
        },
        _count: {
          select: {
            reviews: true,
            sportFields: true,
            classes: true,
          },
        },
      },
    });
    
    return place;
  } catch (error) {
    console.error('Error fetching place by id:', error);
    return null;
  }
}

export async function fetchPlaceBySlug(citySlug: string, placeSlug: string): Promise<Place | null> {
  try {
    const place = await prisma.place.findFirst({
      where: {
        citySlug,
        slug: placeSlug,
      },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        sportFields: true,
        classes: {
          include: {
            trainer: true,
          },
        },
        _count: {
          select: {
            reviews: true,
            sportFields: true,
            classes: true,
          },
        },
      },
    });
    
    return place;
  } catch (error) {
    console.error('Error fetching place by slug:', error);
    return null;
  }
}

export async function fetchGymBySlug(citySlug: string, gymSlug: string): Promise<Place | null> {
  try {
    const gym = await prisma.place.findFirst({
      where: {
        citySlug,
        slug: gymSlug,
        type: 'GYM',
      },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        classes: {
          include: {
            trainer: true,
          },
        },
        _count: {
          select: {
            reviews: true,
            classes: true,
          },
        },
      },
    });
    
    return gym;
  } catch (error) {
    console.error('Error fetching gym by slug:', error);
    return null;
  }
}

export async function incrementPlaceViewCount(id: string): Promise<void> {
  try {
    await prisma.place.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error('Error incrementing place view count:', error);
  }
} 