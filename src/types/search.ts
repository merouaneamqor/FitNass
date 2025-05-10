// src/types/search.ts
import { Gym } from './gym';
import { Club } from './club';
import { Trainer } from './trainer';
import { FitnessClass } from './fitnessClass';

// Define base properties common to most results
interface BaseSearchResult {
  id: string;
  name: string;
  description: string | null;
  address: string | null; // May not apply to classes directly
  city: string | null;
  images: string[];
  rating: number | null;
  type: 'gym' | 'club' | 'trainer' | 'class';
  slug?: string; // For simple items like categories or blog posts if searched
  compositeSlug?: string; // e.g., "casablanca-gold-s-gym"
}

// Extend base for specific types, adding unique fields
export interface GymSearchResult extends BaseSearchResult {
  type: 'gym';
  // Gym specific fields
  facilities?: string[];
  priceRange?: string;
  citySlug?: string | null;
  _count?: { reviews?: number };
}

export interface ClubSearchResult extends BaseSearchResult {
  type: 'club';
  facilities?: string[];
  citySlug?: string | null;
  _count?: { reviews?: number; sportFields?: number };
}

export interface TrainerSearchResult extends BaseSearchResult {
  type: 'trainer';
  specialties?: string[];
  hourlyRate?: number | null;
  citySlug?: string | null;
  // No address directly on trainer, but city might be present
}

export interface ClassSearchResult extends BaseSearchResult {
  type: 'class';
  classType?: string; // Alias for FitnessClass.type
  startTime?: Date | null;
  duration?: number | null;
  price?: number | null;
  citySlug?: string | null;
  capacity?: number | null;
  // Location derived from gym/club
  locationName?: string; 
  locationCity?: string;
  gymId?: string | null;
  clubId?: string | null;
}

// Union type for search results
export type SearchResult = GymSearchResult | ClubSearchResult | TrainerSearchResult | ClassSearchResult;

// Type for search parameters
export type SearchParams = {
    q?: string;
    city?: string;
    type?: 'gym' | 'club' | 'trainer' | 'class' | string; // Allow specific types or 'all' (implied by empty string)
    page?: string;
    // Add other filters like minRating, facilities, etc.
}; 