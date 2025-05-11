// This file is the server component wrapper for the search page
import { Metadata } from 'next';
import { search, SearchParams } from '@/app/actions/search';
import { SearchResultsDisplay } from '@/components/search/SearchResultsDisplay';

export const metadata: Metadata = {
  title: 'Search Results | FitNass',
  description: 'Find gyms, clubs, trainers and fitness classes near you.',
};

// Server component that fetches data server-side and renders the results
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Extract query from search params
  const query = typeof searchParams.q === 'string' ? searchParams.q : 
                (Array.isArray(searchParams.q) ? searchParams.q[0] : '');
  
  // Extract city if present
  const city = typeof searchParams.city === 'string' ? searchParams.city : 
               (Array.isArray(searchParams.city) ? searchParams.city[0] : undefined);
  
  // Extract type if present and map to appropriate types array
  const type = typeof searchParams.type === 'string' ? searchParams.type : 
              (Array.isArray(searchParams.type) ? searchParams.type[0] : 'all');
  
  // Map old type values to new type values
  let types: string[] = ['PLACE', 'TRAINER', 'CLASS']; // Default to all types
  if (type === 'gym') types = ['PLACE']; // Search only places of type GYM
  else if (type === 'club') types = ['PLACE']; // Search only places of type CLUB
  else if (type === 'trainer') types = ['TRAINER'];
  else if (type === 'class') types = ['CLASS'];
  
  // Set up search parameters for new search function
  const searchParams2: SearchParams = {
    query: query || '',
    city,
    types,
    limit: 20
  };

  // Fetch results using server action
  const searchResults = await search(searchParams2);
  
  // Format results for the search display component
  const formattedResults = {
    results: searchResults,
    currentPage: Number(typeof searchParams.page === 'string' ? searchParams.page : '1'),
    totalPages: Math.ceil(searchResults.length / 20),
    totalResults: searchResults.length,
    error: null
  };

  return <SearchResultsDisplay 
    initialResults={formattedResults} 
    searchParams={searchParams as Record<string, string>} 
  />;
}