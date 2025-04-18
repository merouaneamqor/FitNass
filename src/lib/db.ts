import { PrismaClient } from '@prisma/client';

// Define globalThis with prisma property
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a singleton Prisma client
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Only store in global in development to prevent memory leaks in production
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Utility to safely execute Prisma operations with fallback to mock data
export const prismaExec = async <T>(
  operation: () => Promise<T>,
  errorMessage = 'Database operation failed',
  mockFallback?: T
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    
    // If mock data is provided, return it when the database is unavailable
    if (mockFallback !== undefined) {
      console.log('Using mock data as fallback');
      return mockFallback;
    }
    
    throw error;
  }
};

// Mock data for development without database
export const mockData = {
  users: [
    {
      id: 'mock-user-1',
      name: 'Demo User',
      email: 'user@example.com',
      role: 'USER',
      createdAt: new Date(),
      image: 'https://ui-avatars.com/api/?name=Demo+User'
    },
    {
      id: 'mock-user-2',
      name: 'Gym Owner',
      email: 'owner@example.com',
      role: 'GYM_OWNER',
      createdAt: new Date(),
      image: 'https://ui-avatars.com/api/?name=Gym+Owner'
    }
  ],
  gyms: [
    {
      id: 'mock-gym-1',
      name: 'Fitness First',
      description: 'A premier fitness facility with state-of-the-art equipment',
      address: '123 Main St',
      city: 'Casablanca',
      state: 'Casablanca-Settat',
      zipCode: '20000',
      latitude: 33.5731,
      longitude: -7.5898,
      rating: 4.5,
      facilities: ['Weight Room', 'Cardio Area', 'Swimming Pool'],
      images: ['https://placehold.co/600x400/png?text=Fitness+First'],
      priceRange: 'MEDIUM',
      isVerified: true,
      status: 'ACTIVE',
      _count: { reviews: 12 }
    },
    {
      id: 'mock-gym-2',
      name: 'PowerFit Gym',
      description: 'Specialized in strength training and bodybuilding',
      address: '456 Sports Ave',
      city: 'Rabat',
      state: 'Rabat-Salé-Kénitra',
      zipCode: '10000',
      latitude: 34.0209,
      longitude: -6.8416,
      rating: 4.2,
      facilities: ['Powerlifting Area', 'Free Weights', 'Personal Training'],
      images: ['https://placehold.co/600x400/png?text=PowerFit+Gym'],
      priceRange: 'HIGH',
      isVerified: true,
      status: 'ACTIVE',
      _count: { reviews: 8 }
    }
  ],
  clubs: [
    {
      id: 'mock-club-1',
      name: 'Tennis Club Marrakech',
      description: 'Premier tennis facility with clay and hard courts',
      address: '789 Tennis Blvd',
      city: 'Marrakech',
      state: 'Marrakech-Safi',
      zipCode: '40000',
      latitude: 31.6295,
      longitude: -7.9811,
      rating: 4.7,
      facilities: ['Clay Courts', 'Hard Courts', 'Pro Shop', 'Lessons'],
      images: ['https://placehold.co/600x400/png?text=Tennis+Club+Marrakech'],
      isVerified: true,
      status: 'ACTIVE',
      _count: { reviews: 15, sportFields: 6 }
    },
    {
      id: 'mock-club-2',
      name: 'Agadir Soccer Academy',
      description: 'Professional soccer training facilities and fields',
      address: '321 Soccer Way',
      city: 'Agadir',
      state: 'Souss-Massa',
      zipCode: '80000',
      latitude: 30.4278,
      longitude: -9.5981,
      rating: 4.4,
      facilities: ['Soccer Fields', 'Training Grounds', 'Fitness Center'],
      images: ['https://placehold.co/600x400/png?text=Agadir+Soccer+Academy'],
      isVerified: true,
      status: 'ACTIVE',
      _count: { reviews: 10, sportFields: 4 }
    }
  ],
  sportFields: [
    {
      id: 'mock-field-1',
      name: 'Center Court',
      description: 'Main clay court for tournaments and premium play',
      type: 'TENNIS',
      surface: 'Clay',
      indoor: false,
      pricePerHour: 200,
      currency: 'MAD',
      amenities: ['Seating', 'Lighting', 'Water Station'],
      images: ['https://placehold.co/600x400/png?text=Center+Court'],
      clubId: 'mock-club-1',
      status: 'AVAILABLE'
    },
    {
      id: 'mock-field-2',
      name: 'Main Soccer Field',
      description: 'Professional-grade soccer field with natural grass',
      type: 'FOOTBALL',
      surface: 'Grass',
      indoor: false,
      pricePerHour: 350,
      currency: 'MAD',
      amenities: ['Seating', 'Lighting', 'Changing Rooms'],
      images: ['https://placehold.co/600x400/png?text=Main+Soccer+Field'],
      clubId: 'mock-club-2',
      status: 'AVAILABLE'
    }
  ]
};

export default prisma; 