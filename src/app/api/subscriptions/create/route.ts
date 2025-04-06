import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const { planId, paymentMethodId } = body;

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // Find the subscription plan
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Subscription plan not found' },
        { status: 404 }
      );
    }

    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE'
      }
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'User already has an active subscription', subscriptionId: existingSubscription.id },
        { status: 400 }
      );
    }

    // Calculate subscription end date (30 days from now for monthly)
    const endDate = new Date();
    if (plan.billingCycle === 'MONTHLY') {
      endDate.setDate(endDate.getDate() + 30);
    } else if (plan.billingCycle === 'QUARTERLY') {
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (plan.billingCycle === 'ANNUALLY') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Create the subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: plan.price === 0 ? 'TRIALING' : 'ACTIVE',
        startDate: new Date(),
        endDate,
        autoRenew: true,
        paymentMethodId
      }
    });

    // If this is a paid plan, create a payment record
    if (plan.price > 0 && paymentMethodId) {
      // In a real implementation, this would integrate with Stripe/payment processor
      // For now, we'll create a mock payment record
      await prisma.paymentRecord.create({
        data: {
          subscriptionId: subscription.id,
          amount: plan.price,
          status: 'PAID',
          paymentMethod: 'CREDIT_CARD',
          transactionId: `mock-transaction-${Date.now()}`
        }
      });
    }

    return NextResponse.json({
      message: 'Subscription created successfully',
      subscription
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
} 