// This file is the server component wrapper for the search page
import { Metadata } from 'next';
import { searchAction } from '@/app/actions/search';
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
  // Create URLSearchParams from searchParams object
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      params.set(key, value);
    } else if (Array.isArray(value)) {
      params.set(key, value[0] || '');
    }
  });

  // Fetch results using server action
  const searchResults = await searchAction(params);

  return <SearchResultsDisplay 
    initialResults={searchResults} 
    searchParams={searchParams as Record<string, string>} 
  />;
}