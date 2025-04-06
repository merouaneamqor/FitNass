import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';

// GET handler to retrieve all available subscription plans
export async function GET() {
  try {
    // Fetch all active subscription plans and order by price
    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: {
        price: 'asc'
      }
    });

    // Parse features if stored as string
    const formattedPlans = plans.map(plan => ({
      ...plan,
      features: typeof plan.features === 'string' 
        ? JSON.parse(plan.features) 
        : plan.features
    }));

    return NextResponse.json(formattedPlans);
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription plans' },
      { status: 500 }
    );
  }
} 