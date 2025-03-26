export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateGymSchema = z.object({
  name: z.string().min(2, 'Gym name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
});

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session || session.user.role !== 'GYM_OWNER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateGymSchema.parse(body);

    // First find the gym
    const gym = await prisma.gym.findFirst({
      where: {
        ownerId: session.user.id,
      },
    });

    if (!gym) {
      return NextResponse.json(
        { error: 'Gym not found' },
        { status: 404 }
      );
    }

    // Then update it
    const updatedGym = await prisma.gym.update({
      where: {
        id: gym.id,
      },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        email: validatedData.email,
        phone: validatedData.phone,
      },
    });

    return NextResponse.json(updatedGym);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating gym settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || session.user.role !== 'GYM_OWNER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const gym = await prisma.gym.findFirst({
      where: {
        ownerId: session.user.id,
      },
      select: {
        name: true,
        description: true,
        email: true,
        phone: true,
      },
    });

    if (!gym) {
      return NextResponse.json(
        { error: 'Gym not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(gym);
  } catch (error) {
    console.error('Error fetching gym settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 