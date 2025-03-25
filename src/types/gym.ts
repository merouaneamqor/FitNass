export interface Gym {
  id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  rating: number;
  priceRange: string;
  facilities: string[];
  images: string[];
  latitude: number;
  longitude: number;
  _count?: {
    reviews: number;
  };
}

export interface GymFilters {
  city?: string;
  minRating?: number;
  facilities?: string[];
  priceRange?: string[];
} 