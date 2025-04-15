import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET handler to retrieve all available subscription plans
export async function GET() {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        billingCycle: true,
        features: true,
      },
      orderBy: {
        price: 'asc',
      },
    });

    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription plans' },
      { status: 500 }
    );
  }
}