import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';

// Get the current user's subscription
export async function GET() {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user details from session
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Invalid user session' },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get the user's active subscription with plan details
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        OR: [
          { status: 'ACTIVE' },
          { status: 'TRIALING' }
        ]
      },
      include: {
        plan: true,
        payments: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      }
    });

    if (!subscription) {
      return NextResponse.json({
        hasSubscription: false,
        message: 'No active subscription found'
      });
    }

    // Parse features if stored as string
    const plan = {
      ...subscription.plan,
      features: typeof subscription.plan.features === 'string' 
        ? JSON.parse(subscription.plan.features) 
        : subscription.plan.features
    };

    return NextResponse.json({
      hasSubscription: true,
      subscription: {
        ...subscription,
        plan
      }
    });
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

// Cancel subscription (sets autoRenew to false)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Invalid user session' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'cancel') {
      // Find active subscription
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId: user.id,
          OR: [
            { status: 'ACTIVE' },
            { status: 'TRIALING' }
          ]
        }
      });

      if (!subscription) {
        return NextResponse.json(
          { error: 'No active subscription found' },
          { status: 404 }
        );
      }

      // Update subscription to not auto-renew
      const updatedSubscription = await prisma.subscription.update({
        where: {
          id: subscription.id
        },
        data: {
          autoRenew: false
        }
      });

      return NextResponse.json({
        message: 'Subscription will not renew at the end of the current period',
        subscription: updatedSubscription
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
} 