'use client';

import SearchResultCard from './SearchResultCard'; // Import the card component
import { SearchResult } from '@/types/search'; // Import the shared type definition

interface SearchResultsGridProps {
    results: SearchResult[];
}

// Search Results Grid Client Component
export default function SearchResultsGrid({ results }: SearchResultsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {results.map(result => (
                <SearchResultCard key={result.id} result={result} />
            ))}
        </div>
    );
} 