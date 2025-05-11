import { Place } from './place';
import { Trainer } from './trainer';

export interface FitnessClass {
  id: string;
  name: string;
  description: string;
  type: string; // e.g., "Yoga", "HIIT"
  difficulty: string | null;
  duration: number; // minutes
  schedule: any | null; // Prisma Json
  startTime: Date | null; // Prisma DateTime
  endTime: Date | null; // Prisma DateTime
  capacity: number | null;
  price: number | null; // Prisma Float
  currency: string | null;
  placeId: string | null;
  place?: Place | null; // Optional embedded Place data
  trainerId: string | null;
  trainer?: Trainer | null; // Optional embedded Trainer data
  images: string[];
  status?: string; // ClassStatus enum as string
  createdAt?: Date;
  updatedAt?: Date;

  _count?: {
    // e.g., bookings: number;
  };
}

// Define ClassStatus enum
export enum ClassStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  FULL = 'FULL',
  PENDING = 'PENDING'
} 