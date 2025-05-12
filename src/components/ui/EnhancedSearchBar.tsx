'use client';

import { UnifiedSearch, SearchVariant } from '@/components/ui';

interface EnhancedSearchBarProps {
  variant?: SearchVariant;
  className?: string;
  showFilters?: boolean;
  placeholder?: string;
  initialQuery?: string;
  initialCity?: string;
  initialSport?: string;
  initialDate?: string;
  initialTime?: string;
  onSearch?: (filters: {
    query: string;
    city: string;
    sport: string;
    date: string;
    time: string;
    facilities: string[];
    priceRange: { min: number; max: number };
    rating: number;
    sortBy: string;
  }) => void;
}

export default function EnhancedSearchBar({
  variant = 'full',
  className = '',
  showFilters = true,
  placeholder = 'Search gyms, clubs, trainers...',
  initialQuery = '',
  initialCity = '',
  initialSport = 'padel',
  initialDate = new Date().toISOString().split('T')[0],
  initialTime = '19:00',
  onSearch,
}: EnhancedSearchBarProps) {
  return (
    <UnifiedSearch
      variant={variant}
      className={className}
      showFilters={showFilters}
      placeholder={placeholder}
      initialQuery={initialQuery}
      initialCity={initialCity}
      initialSport={initialSport}
      initialDate={initialDate}
      initialTime={initialTime}
      onSearch={onSearch}
    />
  );
} 