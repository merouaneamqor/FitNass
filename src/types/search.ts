// src/types/search.ts
import { Place, PlaceType } from '@prisma/client';
import { Trainer } from './trainer';
import { FitnessClass } from './fitnessClass';

export type SearchResult = {
  id: string;
  name: string;
  type: PlaceType;
  description: string;
  image: string | null;
  city: string;
  rating: number;
  reviewCount: number;
  bookingCount: number;
  pricePerHour: number;
  facilities: string[];
  slug: string | null;
};

// For backward compatibility
export type GymSearchResult = SearchResult & { type: 'GYM' };
export type ClubSearchResult = SearchResult & { type: 'CLUB' };

// Type for search parameters
export type SearchParams = {
    q?: string;
    city?: string;
    type?: PlaceType | string; // Allow specific types or 'all' (implied by empty string)
    page?: string;
    // Add other filters like minRating, facilities, etc.
}; 