// Define User interface for gym owners
export interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

// Define Gym interface
export interface Gym {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  email?: string;
  rating: number;
  priceRange: string;
  facilities: string[];
  images: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_APPROVAL' | 'CLOSED';
  isVerified: boolean;
  viewCount: number;
  ownerId: string;
  owner?: {
    id: string;
    name?: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Interface for update operations
export interface UpdateData {
  id?: string;
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
  email?: string;
  priceRange?: string;
  facilities?: string[];
  images?: string[];
  isVerified?: boolean;
  owner?: { connect: { id: string } };
} 