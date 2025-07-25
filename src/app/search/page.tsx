// This file is the server component wrapper for the search page
import { Metadata } from 'next';
import { Suspense } from 'react';
import { search, searchPlaces } from '@/app/actions/search';
import { SearchResultsDisplay } from '@/components/search/SearchResultsDisplay';
import EnhancedSearchBar from '@/components/ui/EnhancedSearchBar';
import { SearchParams } from '@/types/search';
import { PlaceType } from '@prisma/client';

const sportOptions = [
  { value: 'padel', label: 'Padel' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'football', label: 'Football' },
  { value: 'football7', label: 'Football 7' },
  { value: 'futsal', label: 'Futsal' },
  { value: 'padbol', label: 'Padbol' },
];

const cityOptions = [
  { value: 'casablanca', label: 'Casablanca' },
  { value: 'rabat', label: 'Rabat' },
  { value: 'marrakech', label: 'Marrakech' },
  { value: 'tangier', label: 'Tangier' },
  { value: 'agadir', label: 'Agadir' },
  { value: 'fes', label: 'Fes' }
];

// Function to convert string to PlaceType
function getPlaceTypes(types: string[]): PlaceType[] {
  const validTypes = ['GYM', 'CLUB', 'STUDIO', 'CENTER', 'OTHER'];
  return types
    .map(t => t.toUpperCase())
    .filter(t => validTypes.includes(t)) as PlaceType[];
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Search Courts | FitNass',
  description: 'Find and book sports courts and facilities across Morocco',
};

// Server component that fetches data server-side and renders the results
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  try {
    // Extract and normalize search parameters
    const filters: SearchParams = {
      q: typeof searchParams.q === 'string' ? searchParams.q : '',
      city: typeof searchParams.city === 'string' ? searchParams.city : undefined,
      type: Array.isArray(searchParams.type) 
        ? getPlaceTypes(searchParams.type) 
        : typeof searchParams.type === 'string' 
          ? getPlaceTypes([searchParams.type]) 
          : [],
      rating: typeof searchParams.rating === 'string' 
        ? parseInt(searchParams.rating) 
        : undefined,
      facilities: typeof searchParams.facilities === 'string'
        ? searchParams.facilities.split(',')
        : [],
      sortBy: typeof searchParams.sortBy === 'string'
        ? (searchParams.sortBy as 'relevance' | 'rating' | 'price_asc' | 'price_desc')
        : 'relevance',
      page: typeof searchParams.page === 'string'
        ? parseInt(searchParams.page)
        : 1,
      limit: 20,
    };

    // Fetch search results
    const { results, total, pages } = await searchPlaces(filters);

    // Format results for the display component
    const formattedResults = {
      results,
      currentPage: filters.page || 1,
      totalPages: pages,
      totalResults: total,
      error: null,
    };

    return (
      <main className="container mx-auto px-4 py-8">
        {/* Enhanced Search Bar */}
        <div className="mb-8">
          <Suspense fallback={<div>Loading search bar...</div>}>
            <EnhancedSearchBar
              className="max-w-4xl mx-auto"
              options={sportOptions}
              cityOptions={cityOptions}
              selectedOption={typeof searchParams.type === 'string' ? searchParams.type : 'padel'}
              selectedCity={typeof searchParams.city === 'string' ? searchParams.city : ''}
              searchQuery={typeof searchParams.q === 'string' ? searchParams.q : ''}
              compact={true}
            />
          </Suspense>
        </div>

        {/* Search Results */}
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<div>Loading search results...</div>}>
            <SearchResultsDisplay
              initialResults={formattedResults}
              searchParams={searchParams as Record<string, string>}
            />
          </Suspense>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error in search page:', error);
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Suspense fallback={<div>Loading search bar...</div>}>
            <EnhancedSearchBar
              className="max-w-4xl mx-auto"
              options={sportOptions}
              cityOptions={cityOptions}
              selectedOption="padel"
              selectedCity=""
              searchQuery=""
              compact={true}
            />
          </Suspense>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <h2 className="text-lg font-semibold mb-2">Error</h2>
            <p>Sorry, we encountered an error while searching. Please try again later.</p>
          </div>
        </div>
      </main>
    );
  }
}