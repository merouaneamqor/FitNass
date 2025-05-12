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
  distance?: number; // Distance from user's location if provided
  availability?: {
    date: string;
    slots: string[];
  };
};

export type SortOption = 'relevance' | 'rating' | 'price_asc' | 'price_desc' | 'distance';

// Type for search parameters
export type SearchParams = {
  q?: string;
  city?: string;
  type?: PlaceType[];
  date?: string;
  time?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  facilities?: string[];
  distance?: number; // Distance in kilometers
  coordinates?: {
    lat: number;
    lng: number;
  };
  sortBy?: SortOption;
  page?: number;
  limit?: number;
};

// For backward compatibility
export type GymSearchResult = SearchResult & { type: 'GYM' };
export type ClubSearchResult = SearchResult & { type: 'CLUB' }; 