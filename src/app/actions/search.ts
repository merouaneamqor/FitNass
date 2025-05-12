'use server';

import { prisma } from '@/lib/prisma';
import { SearchResult } from '@/types/search';
import { PlaceType } from '@prisma/client';

export interface SearchParams {
  query?: string;
  city?: string;
  type?: PlaceType[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  facilities?: string[];
  sortBy?: 'relevance' | 'rating' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}

interface PlaceRecord {
  id: string;
  name: string;
  city: string;
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
    priceRange,
    rating,
    facilities,
    sortBy = 'relevance',
    page = 1,
    limit = 20,
  } = params;

  try {
    const where: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
      status: 'ACTIVE',
    };

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

    const skip = (page - 1) * limit;

    let orderBy: any = {};
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
        orderBy = { rating: 'desc' };
    }

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

    const transformedResults: SearchResult[] = results.map((result) => ({
      id: result.id,
      name: result.name,
      type: result.type,
      description: result.description,
      image: result.images[0] || null,
      city: result.city,
      rating: result.rating,
      reviewCount: result._count.reviews,
      bookingCount: 0,
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
    console.error('Error searching places:', error);
    throw new Error('Failed to search places');
  }
}

export async function search(params: SearchParams): Promise<SearchResult[]> {
  const { query = '', city, type = [], limit = 20 } = params;

  // Return some initial results even if query is empty
  const queryIsEmpty = !query || query.trim() === '';

  try {
    const results = await searchPlaces({
      query,
      city,
      type,
      limit,
    });

    return results.results;
  } catch (error) {
    console.error('Error in search:', error);
    return [];
  }
} 