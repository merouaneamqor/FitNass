import { prisma } from '@/lib/db';
import { SearchResult } from '@/types/search';
import { Prisma, PlaceType } from '@prisma/client';

export type SearchFilters = {
  query?: string;
  city?: string;
  type?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  facilities?: string[];
  sortBy?: 'relevance' | 'rating' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
};

export type SearchSuggestion = {
  id: string;
  type: 'place' | 'city' | 'facility';
  name: string;
  subtitle?: string;
  image?: string;
};

export async function search(filters: SearchFilters): Promise<{
  results: SearchResult[];
  total: number;
  pages: number;
}> {
  try {
    const {
      query = '',
      city,
      type = [],
      priceRange,
      rating,
      facilities = [],
      sortBy = 'relevance',
      page = 1,
      limit = 20
    } = filters;

    // Build the base query
    const where: Prisma.PlaceWhereInput = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
      status: 'ACTIVE',
    };

    // Add city filter
    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    // Add type filter
    if (type.length > 0) {
      where.type = { in: type as PlaceType[] };
    }

    // Add price range filter
    if (priceRange) {
      where.priceRange = {
        gte: priceRange.min.toString(),
        lte: priceRange.max.toString(),
      };
    }

    // Add rating filter
    if (rating) {
      where.rating = { gte: rating };
    }

    // Add facilities filter
    if (facilities.length > 0) {
      where.facilities = {
        hasEvery: facilities,
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Determine sorting
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
      default:
        // For relevance, we'll use a combination of factors
        orderBy = { rating: 'desc' };
    }

    // Execute the search query
    const [results, total] = await Promise.all([
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

    // Transform the results
    const transformedResults: SearchResult[] = results.map((result) => ({
      id: result.id,
      name: result.name,
      type: result.type,
      description: result.description,
      image: result.images[0] || null,
      city: result.city,
      rating: result.rating,
      reviewCount: result._count.reviews,
      bookingCount: 0, // We don't have this in our schema yet
      pricePerHour: parseFloat(result.priceRange || '0'),
      facilities: result.facilities,
      slug: result.slug,
    }));

    return {
      results: transformedResults,
      total,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Failed to perform search');
  }
}

export async function getSearchSuggestions(
  query: string,
  limit: number = 5
): Promise<SearchSuggestion[]> {
  if (!query || query.length < 2) return [];

  try {
    const suggestions: SearchSuggestion[] = [];

    // Search for places
    const places = await prisma.place.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
        status: 'ACTIVE',
      },
      take: limit,
      select: {
        id: true,
        name: true,
        city: true,
        images: true,
      },
    });

    // Add places to suggestions
    suggestions.push(
      ...places.map((place) => ({
        id: place.id,
        type: 'place' as const,
        name: place.name,
        subtitle: place.city,
        image: place.images[0],
      }))
    );

    // Search for unique cities
    const cities = await prisma.place.findMany({
      where: {
        city: { contains: query, mode: 'insensitive' },
        status: 'ACTIVE',
      },
      select: {
        city: true,
      },
      distinct: ['city'],
      take: 3,
    });

    // Add cities to suggestions
    suggestions.push(
      ...cities.map((city) => ({
        id: `city-${city.city}`,
        type: 'city' as const,
        name: city.city,
      }))
    );

    // Add facility suggestions if query matches
    const facilityOptions = [
      'pool',
      'sauna',
      'parking',
      'wifi',
      'classes',
      'personal-training',
      'lockers',
      'showers',
    ];

    const matchingFacilities = facilityOptions
      .filter((facility) =>
        facility.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 3);

    suggestions.push(
      ...matchingFacilities.map((facility) => ({
        id: `facility-${facility}`,
        type: 'facility' as const,
        name: facility.charAt(0).toUpperCase() + facility.slice(1),
      }))
    );

    return suggestions.slice(0, limit);
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    return [];
  }
} 