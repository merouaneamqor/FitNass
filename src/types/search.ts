// src/types/search.ts
import { Place } from './place';
import { Trainer } from './trainer';
import { FitnessClass } from './fitnessClass';

export type SearchResultType = 'PLACE' | 'TRAINER' | 'CLASS';

interface BaseSearchResult {
  id: string;
  type: SearchResultType;
  name: string;
  image: string;
  city?: string;
  rating?: number;
}

export interface PlaceSearchResult extends BaseSearchResult {
  type: 'PLACE';
  placeType: string; // GYM, CLUB, STUDIO, etc.
  place: Place;
}

export interface TrainerSearchResult extends BaseSearchResult {
  type: 'TRAINER';
  specialties: string[];
}

export interface ClassSearchResult extends BaseSearchResult {
  type: 'CLASS';
  classType: string;
  trainerName?: string;
  location?: string;
}

export type SearchResult = PlaceSearchResult | TrainerSearchResult | ClassSearchResult;

// For backward compatibility
export type GymSearchResult = PlaceSearchResult & { placeType: 'GYM' };
export type ClubSearchResult = PlaceSearchResult & { placeType: 'CLUB' };

// Type for search parameters
export type SearchParams = {
    q?: string;
    city?: string;
    type?: 'gym' | 'club' | 'trainer' | 'class' | string; // Allow specific types or 'all' (implied by empty string)
    page?: string;
    // Add other filters like minRating, facilities, etc.
}; 