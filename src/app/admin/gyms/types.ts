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
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  status: string;
  viewCount: number;
  owner?: User;
}

// Define form data interface
export interface GymFormData {
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
  priceRange: string;
  facilities: string[];
  images: string[];
  status: string;
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
  owner?: { connect: { id: string } };
} 