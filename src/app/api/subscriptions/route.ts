import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET handler to retrieve all available subscription plans
export async function GET() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        features: true,
        isActive: true,
      },
      where: {
        isActive: true,
      },
      orderBy: {
        price: 'asc',
      },
    });

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
} 