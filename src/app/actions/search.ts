'use server';

import { prisma } from '@/lib/prisma';
import { SearchResult, PlaceSearchResult, TrainerSearchResult, ClassSearchResult } from '@/types/search';
import { Place, PlaceType } from '@/types/place';

export interface SearchParams {
  query: string;
  city?: string;
  types?: string[];
  limit?: number;
}

interface PlaceRecord {
  id: string;
  name: string;
  city: string;
}

export async function search(params: SearchParams): Promise<SearchResult[]> {
  const { query, city, types = ['PLACE', 'TRAINER', 'CLASS'], limit = 20 } = params;
  
  // Return some initial results even if query is empty
  const queryIsEmpty = !query || query.trim() === '';
  
  const results: SearchResult[] = [];
  
  try {
    // Search places if requested
    if (types.includes('PLACE')) {
      try {
        // Force Prisma to use any types to avoid TypeScript errors
        const prismaAny = prisma as any;
        
        // Create the where conditions for places
        const where: any = {
          // Allow initial results even without query
          ...(queryIsEmpty ? {} : {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { facilities: { hasSome: [query] } }
            ]
          }),
          // Always filter by active status
          status: 'ACTIVE'
        };
        
        // Add city filter if specified
        if (city) {
          where.city = city;
        }
        
        // Handle specific place type filtering
        if (types.length === 1 && types[0] === 'PLACE') {
          // Check if we're looking for a specific place type based on the URL
          const urlPath = new URL(`http://example.com${global.process?.env?.PATH_INFO || ''}`).pathname;
          if (urlPath.includes('/gyms')) {
            where.type = 'GYM';
          } else if (urlPath.includes('/clubs')) {
            where.type = 'CLUB';
          }
        }
        
        // Fetch places matching the criteria
        const places = await prismaAny.place.findMany({
          where,
          take: limit,
          include: {
            _count: {
              select: { reviews: true }
            }
          },
          orderBy: { rating: 'desc' }
        });
        
        console.log(`Found ${places.length} places matching query: "${query}"`);
        
        // Map places to search results
        for (const place of places) {
          results.push({
            id: place.id,
            type: 'PLACE',
            placeType: place.type,
            name: place.name,
            image: place.images?.[0] || '/images/placeholder-place.jpg',
            city: place.city,
            rating: place.rating,
            place: place
          });
        }
      } catch (error) {
        console.error('Error searching places:', error);
      }
    }
    
    // Search trainers if requested
    if (types.includes('TRAINER')) {
      try {
        const trainers = await prisma.trainer.findMany({
          where: {
            ...(queryIsEmpty ? {} : {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { bio: { contains: query, mode: 'insensitive' } },
                { specialties: { hasSome: [query] } }
              ]
            }),
            ...(city ? { city } : {}),
            status: 'ACTIVE'
          },
          take: limit,
          orderBy: { rating: 'desc' }
        });
        
        for (const trainer of trainers) {
          results.push({
            id: trainer.id,
            type: 'TRAINER',
            name: trainer.name,
            image: trainer.images?.[0] || '/images/placeholder-trainer.jpg',
            city: trainer.city || undefined,
            rating: trainer.rating || undefined,
            specialties: trainer.specialties
          });
        }
      } catch (error) {
        console.error('Error searching trainers:', error);
      }
    }
    
    // Search classes if requested
    if (types.includes('CLASS')) {
      try {
        // Use any to avoid TypeScript errors
        const prismaAny = prisma as any;
        
        // Fetch all classes matching the query
        const classes = await prismaAny.fitnessClass.findMany({
          where: {
            ...(queryIsEmpty ? {} : {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { type: { contains: query, mode: 'insensitive' } }
              ]
            }),
            status: 'ACTIVE'
          },
          take: limit,
          include: {
            trainer: true
          }
        });
        
        // Get all places to join with classes
        if (classes.length > 0) {
          // Extract place IDs from classes
          const placeIds: string[] = [];
          for (const cls of classes) {
            if (cls.placeId) {
              placeIds.push(cls.placeId);
            }
          }
          
          // If we have place IDs and city filter, fetch matching places
          if (placeIds.length > 0) {
            const places = await prismaAny.place.findMany({
              where: {
                id: { in: placeIds },
                ...(city ? { city } : {})
              },
              select: { id: true, name: true, city: true }
            });
            
            // Create map of place data
            const placeMap: Record<string, PlaceRecord> = {};
            for (const place of places) {
              placeMap[place.id] = {
                id: place.id,
                name: place.name,
                city: place.city
              };
            }
            
            // Filter classes by city and map to results
            for (const cls of classes) {
              // Skip if city filter is applied and class's place doesn't match
              if (city && cls.placeId && (!placeMap[cls.placeId] || placeMap[cls.placeId].city !== city)) {
                continue;
              }
              
              const placeId = cls.placeId as string | undefined;
              
              results.push({
                id: cls.id,
                type: 'CLASS',
                name: cls.name,
                image: cls.images?.[0] || '/images/placeholder-class.jpg',
                city: placeId && placeMap[placeId] ? placeMap[placeId].city : undefined,
                classType: cls.type,
                trainerName: cls.trainer?.name,
                location: placeId && placeMap[placeId] ? placeMap[placeId].name : undefined
              });
            }
          } else {
            // No place IDs or no city filter, just add all classes
            for (const cls of classes) {
              results.push({
                id: cls.id,
                type: 'CLASS',
                name: cls.name,
                image: cls.images?.[0] || '/images/placeholder-class.jpg',
                classType: cls.type,
                trainerName: cls.trainer?.name
              });
            }
          }
        }
      } catch (error) {
        console.error('Error searching classes:', error);
      }
    }
    
    // Fall back to initial results if we have no search results
    if (results.length === 0 && queryIsEmpty) {
      try {
        // Return some featured places
        const prismaAny = prisma as any;
        const featuredPlaces = await prismaAny.place.findMany({
          where: { status: 'ACTIVE' },
          take: 10,
          orderBy: [
            { viewCount: 'desc' },
            { rating: 'desc' }
          ],
          include: {
            _count: {
              select: { reviews: true }
            }
          }
        });
        
        for (const place of featuredPlaces) {
          results.push({
            id: place.id,
            type: 'PLACE',
            placeType: place.type,
            name: place.name,
            image: place.images?.[0] || '/images/placeholder-place.jpg',
            city: place.city,
            rating: place.rating,
            place: place
          });
        }
      } catch (error) {
        console.error('Error fetching featured places:', error);
      }
    }
    
    // Return results up to the limit
    return results.slice(0, limit);
  } catch (error) {
    console.error('Error during search:', error);
    return [];
  }
} 