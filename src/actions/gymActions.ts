'use server';

import prisma from '@/lib/prisma';
import { Gym } from '@/types/gym';

export const fetchGyms = async (): Promise<Gym[]> => {
  try {
    const gyms = await prisma.gym.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        latitude: true,
        longitude: true,
        priceRange: true,
        facilities: true,
        images: true,
        rating: true,
        createdAt: true,
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return gyms.map((gym: any): Gym => ({
      ...gym,
      images: gym.images as string[],
      facilities: gym.facilities as string[],
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch gyms: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
