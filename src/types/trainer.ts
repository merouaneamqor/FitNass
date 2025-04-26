import { FitnessClass } from './fitnessClass'; // Assuming fitnessClass type exists
import { User } from './user'; // Assuming User type exists

export interface Trainer {
  id: string;
  name: string;
  bio: string | null;
  specialties: string[];
  certifications: string[]; // Changed from String[]?
  city: string | null;
  userId?: string | null; // Optional link to User ID
  user?: User | null;     // Optional embedded User data
  rating: number | null;
  images: string[];
  phone: string | null;
  email: string | null;
  website: string | null;
  hourlyRate: number | null; // Changed from Float?
  status?: string; // TrainerStatus enum as string
  createdAt?: Date;
  updatedAt?: Date;

  // Relations
  classes?: FitnessClass[]; // Optional list of classes
  _count?: {
    classes?: number; // Count of classes taught
    // Add review count if reviews are added later
  };
}

// You might want to define TrainerStatus enum here as well, or import from Prisma types if possible
export enum TrainerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING'
} 