'use client';

import SearchResultCard from './SearchResultCard'; // Import the card component

// Re-define or import the type - ensure consistency
type SearchResult = {
    id: string;
    name: string;
    description: string | null;
    address: string | null;
    city: string | null;
    images: string[];
    rating: number | null;
    facilities: string[];
    type: 'club' | 'gym';
    _count?: {
        reviews?: number;
        sportFields?: number;
    }
};

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