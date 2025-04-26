// src/types/club.ts
export interface Club {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null; // Added from schema
  zipCode: string | null; // Added from schema
  latitude: number | null; // Changed from Float
  longitude: number | null; // Changed from Float
  phone: string | null;
  website: string | null;
  email: string | null;
  rating: number | null; // Changed from Float
  images: string[];
  facilities: string[];
  openingHours: any | null; // Assuming Json maps to any for now
  status?: string; // Added from schema (ClubStatus enum)
  viewCount?: number; // Added from schema
  createdAt?: Date; // Added from schema
  updatedAt?: Date; // Added from schema
  // Relations - Include counts or simplified related data if needed
  _count?: {
    reviews?: number;
    sportFields?: number;
  };
  // Add other relevant fields as needed
}

// Add other club-related types if necessary 