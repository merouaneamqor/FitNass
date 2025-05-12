import { NextResponse } from 'next/server';
import { searchPlaces } from '@/app/actions/search';
import { PlaceType } from '@prisma/client';
import { SortOption } from '@/types/search';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract all search parameters
    const query = searchParams.get('q') || '';
    const city = searchParams.get('city') || undefined;
    const type = searchParams.getAll('type') as PlaceType[];
    const date = searchParams.get('date') || undefined;
    const time = searchParams.get('time') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Parse price range
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const priceRange = minPrice && maxPrice ? {
      min: parseFloat(minPrice),
      max: parseFloat(maxPrice)
    } : undefined;
    
    // Parse rating filter
    const rating = searchParams.get('rating') ? 
      parseFloat(searchParams.get('rating')!) : 
      undefined;
    
    // Parse facilities
    const facilities = searchParams.getAll('facilities');
    
    // Parse location data
    const distance = searchParams.get('distance') ? 
      parseFloat(searchParams.get('distance')) : 
      undefined;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const coordinates = lat && lng ? {
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    } : undefined;
    
    // Parse sort option
    const sortBy = (searchParams.get('sortBy') as SortOption) || 'relevance';

    const results = await searchPlaces({
      query,
      city,
      type,
      date,
      time,
      priceRange,
      rating,
      facilities,
      distance,
      coordinates,
      sortBy,
      page,
      limit
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
} 