export interface Place {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  website: string | null;
  email: string | null;
  rating: number;
  priceRange: string | null;
  images: string[];
  facilities: string[];
  openingHours: any | null; // Json type
  type: PlaceType; // Type of place (GYM, CLUB, etc.)
  slug: string | null;
  citySlug: string | null;
  isVerified: boolean;
  status: PlaceStatus;
  viewCount: number;
  createdAt?: Date;
  updatedAt?: Date;
  // Relations - Include counts or simplified related data if needed
  _count?: {
    reviews: number;
    sportFields?: number;
    classes?: number;
  };
}

export type PlaceType = 'GYM' | 'CLUB' | 'STUDIO' | 'CENTER' | 'OTHER';

export type PlaceStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING_APPROVAL' | 'CLOSED';

export interface PlaceFilters {
  city?: string;
  type?: PlaceType[];
  minRating?: number;
  facilities?: string[];
  priceRange?: string[];
} 