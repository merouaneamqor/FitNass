'use server';

import { prisma } from '@/lib/prisma';
import { SearchParams, SearchResult, SortOption } from '@/types/search';
import { PlaceType } from '@prisma/client';
import { Prisma } from '@prisma/client';

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
  // Get the place's schedule and bookings for the specified date
  const schedule = await prisma.schedule.findFirst({
    where: {
      placeId,
      date: new Date(date),
    },
    include: {
      bookings: true
    }
  });

  if (!schedule) return null;

  // Convert time to minutes for easier comparison
  const requestedTime = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
  const openingTime = parseInt(schedule.openingTime.split(':')[0]) * 60 + parseInt(schedule.openingTime.split(':')[1]);
  const closingTime = parseInt(schedule.closingTime.split(':')[0]) * 60 + parseInt(schedule.closingTime.split(':')[1]);

  // Check if requested time is within opening hours
  if (requestedTime < openingTime || requestedTime >= closingTime) {
    return null;
  }

  // Get available slots
  const slots = [];
  for (let i = openingTime; i < closingTime; i += 60) { // Assuming 1-hour slots
    const slotTime = `${Math.floor(i/60).toString().padStart(2, '0')}:${(i%60).toString().padStart(2, '0')}`;
    const isBooked = schedule.bookings.some(booking => 
      booking.startTime === slotTime
    );
    if (!isBooked) {
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
    query = '',
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
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
      status: 'ACTIVE',
    };

    // Add filters
    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (type?.length) {
      where.type = { in: type };
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
        orderBy = [
          { rating: 'desc' },
          { bookingCount: 'desc' }
        ];
    }

    // Fetch results and total count
    const [places, total] = await Promise.all([
      prisma.place.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              reviews: true,
              bookings: true,
            },
          },
          location: true, // Include location data for distance calculation
        },
      }),
      prisma.place.count({ where }),
    ]);

    // Transform and enhance results
    let results = await Promise.all(places.map(async (place) => {
      // Calculate distance if coordinates provided
      let distance: number | undefined;
      if (coordinates && place.location) {
        distance = calculateDistance(
          coordinates.lat,
          coordinates.lng,
          place.location.latitude,
          place.location.longitude
        );
      }

      // Check availability if date and time provided
      let availability = undefined;
      if (date && time) {
        availability = await checkAvailability(place.id, date, time);
      }

      return {
        id: place.id,
        name: place.name,
        type: place.type,
        description: place.description,
        image: place.images[0] || null,
        city: place.city,
        rating: place.rating,
        reviewCount: place._count.reviews,
        bookingCount: place._count.bookings,
        pricePerHour: parseFloat(place.priceRange || '0'),
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