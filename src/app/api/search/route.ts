import { search, SearchParams } from '@/app/actions/search';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get search parameters from URL
    const { searchParams } = new URL(request.url);
    
    // Extract search query
    const query = searchParams.get('q') || '';
    
    // Extract city if present
    const city = searchParams.get('city') || undefined;
    
    // Extract type and convert to appropriate types array
    const type = searchParams.get('type') || 'all';
    let types: string[] = ['PLACE', 'TRAINER', 'CLASS']; // Default to all types
    
    if (type === 'gym') types = ['PLACE']; 
    else if (type === 'club') types = ['PLACE']; 
    else if (type === 'trainer') types = ['TRAINER'];
    else if (type === 'class') types = ['CLASS'];
    
    // Get page from URL or default to 1
    const page = parseInt(searchParams.get('page') || '1', 10);
    
    // Set up search parameters
    const searchParams2: SearchParams = {
      query,
      city,
      types,
      limit: 20
    };
    
    // Perform search
    const searchResults = await search(searchParams2);
    
    // Format results for response
    const formattedResults = {
      results: searchResults,
      currentPage: page,
      totalPages: Math.ceil(searchResults.length / 20),
      totalResults: searchResults.length,
      error: null
    };
    
    // Return the search results
    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      {
        results: [],
        currentPage: 1,
        totalPages: 0,
        totalResults: 0,
        error: 'Failed to perform search'
      },
      { status: 500 }
    );
  }
} 