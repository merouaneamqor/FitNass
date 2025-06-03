'use server';

import { prisma } from '@/lib/prisma';
import { SearchParams, SearchResult, SortOption } from '@/types/search';
import { PlaceType } from '@prisma/client';
import { Prisma } from '@prisma/client';

// Valid PlaceType values from the enum
const VALID_PLACE_TYPES = ['GYM', 'CLUB', 'STUDIO', 'CENTER', 'OTHER'];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

async function checkAvailability(placeId: string, date: string, time: string) {
  // Get the place's opening hours and sport fields with their reservations
  const place = await prisma.place.findUnique({
    where: { id: placeId },
    include: {
      sportFields: {
        include: {
          reservations: {
            where: {
              startTime: {
                gte: new Date(date),
                lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
              },
              status: 'CONFIRMED'
            }
          }
        }
      }
    }
  });

  if (!place || !place.openingHours) return undefined;

  // Get the day of week (0-6, where 0 is Sunday)
  const dayOfWeek = new Date(date).getDay();
  const daySchedule = (place.openingHours as any)[dayOfWeek];

  if (!daySchedule || !daySchedule.isOpen) return undefined;

  // Convert time to minutes for easier comparison
  const requestedTime = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
  const openingTime = parseInt(daySchedule.open.split(':')[0]) * 60 + parseInt(daySchedule.open.split(':')[1]);
  const closingTime = parseInt(daySchedule.close.split(':')[0]) * 60 + parseInt(daySchedule.close.split(':')[1]);

  // Check if requested time is within opening hours
  if (requestedTime < openingTime || requestedTime >= closingTime) {
    return undefined;
  }

  // Get available slots
  const slots = [];
  for (let i = openingTime; i < closingTime; i += 60) { // Assuming 1-hour slots
    const slotTime = `${Math.floor(i/60).toString().padStart(2, '0')}:${(i%60).toString().padStart(2, '0')}`;
    
    // Check if any sport field is available at this time
    const isTimeSlotAvailable = place.sportFields.some(field => {
      const hasConflictingReservation = field.reservations.some(reservation => {
        const reservationHour = reservation.startTime.getHours();
        const slotHour = parseInt(slotTime.split(':')[0]);
        return reservationHour === slotHour;
      });
      return !hasConflictingReservation;
    });

    if (isTimeSlotAvailable) {
      slots.push(slotTime);
    }
  }

  return {
    date,
    slots
  };
}

export async function searchPlaces(params: SearchParams): Promise<{
  results: SearchResult[];
  total: number;
  pages: number;
}> {
  const {
    q = '',
    city,
    type,
    date,
    time,
    priceRange,
    rating,
    facilities,
    distance: maxDistance,
    coordinates,
    sortBy = 'relevance',
    page = 1,
    limit = 20,
  } = params;

  try {
    // Base query conditions
    const where: Prisma.PlaceWhereInput = {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ],
      status: 'ACTIVE',
    };

    // Add filters
    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (type?.length) {
      // Filter out invalid types and convert to uppercase
      const validTypes = type
        .map(t => t.toUpperCase())
        .filter(t => VALID_PLACE_TYPES.includes(t));
      
      // Only add type filter if we have valid types
      if (validTypes.length > 0) {
        where.type = { in: validTypes as PlaceType[] };
      }
    }

    if (priceRange) {
      where.priceRange = {
        gte: priceRange.min.toString(),
        lte: priceRange.max.toString(),
      };
    }

    if (rating) {
      where.rating = { gte: rating };
    }

    if (facilities?.length) {
      where.facilities = {
        hasEvery: facilities,
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Determine sort order
    let orderBy: Prisma.PlaceOrderByWithRelationInput = {};
    switch (sortBy) {
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'price_asc':
        orderBy = { priceRange: 'asc' };
        break;
      case 'price_desc':
        orderBy = { priceRange: 'desc' };
        break;
      case 'distance':
        // Distance sorting will be handled in memory after fetching results
        orderBy = { rating: 'desc' }; // Default secondary sort
        break;
      default:
        orderBy = { rating: 'desc' };
    }

    // Fetch results and total count
    const [places, totalCount] = await Promise.all([
      prisma.place.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      }),
      prisma.place.count({ where }),
    ]);

    // Transform and enhance results
    let results = await Promise.all(places.map(async (place) => {
      // Calculate distance if coordinates provided
      let distance: number | undefined;
      if (coordinates) {
        distance = calculateDistance(
          coordinates.lat,
          coordinates.lng,
          place.latitude,
          place.longitude
        );
      }

      // Check availability if date and time provided
      let availability = undefined;
      if (date && time) {
        availability = await checkAvailability(place.id, date, time);
      }

      // Convert priceRange string to number
      const pricePerHour = parseFloat(place.priceRange || '0');

      return {
        id: place.id,
        name: place.name,
        type: place.type,
        description: place.description,
        image: place.images[0] || null,
        city: place.city,
        rating: place.rating,
        reviewCount: place._count.reviews,
        bookingCount: 0, // Since we don't track this anymore
        pricePerHour,
        facilities: place.facilities,
        slug: place.slug,
        distance,
        availability,
      };
    }));

    // Filter by distance if specified
    if (maxDistance && coordinates) {
      results = results.filter(result => 
        result.distance !== undefined && result.distance <= maxDistance
      );
    }

    // Sort by distance if requested
    if (sortBy === 'distance' && coordinates) {
      results.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }

    // Apply pagination after distance filtering
    const filteredTotal = results.length;
    results = results.slice(skip, skip + limit);

    return {
      results,
      total: filteredTotal,
      pages: Math.ceil(filteredTotal / limit),
    };
  } catch (error) {
    console.error('Error searching places:', error);
    throw new Error('Failed to search places');
  }
}

// Legacy search function for backward compatibility
export async function search(params: SearchParams): Promise<SearchResult[]> {
  const results = await searchPlaces(params);
  return results.results;
} 