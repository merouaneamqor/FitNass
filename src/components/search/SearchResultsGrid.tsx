'use client';

import { motion } from 'framer-motion';
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

// Define animation variants here
const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08, // Faster stagger for results
    },
  },
};

// Search Results Grid Client Component
export default function SearchResultsGrid({ results }: SearchResultsGridProps) {
    return (
        <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
        >
            {results.map(result => (
                // SearchResultCard is already a motion component
                <SearchResultCard key={result.id} result={result} />
            ))}
        </motion.div>
    );
} 