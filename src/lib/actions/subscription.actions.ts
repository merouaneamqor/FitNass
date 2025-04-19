'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth'; // Assuming NextAuth session utility
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// import { stripe } from '@/lib/stripe'; // We'll add Stripe later

/**
 * Creates a Stripe Checkout Session for a user to subscribe to a plan.
 * TODO: Implement actual Stripe logic.
 * TODO: Handle free plans (no checkout needed).
 * TODO: Error handling.
 */
export async function createCheckoutSession(planId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('User must be logged in to subscribe.');
  }

  const userId = session.user.id;

  console.log(`User ${userId} attempting to subscribe to plan ${planId}`);

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    throw new Error(`Plan with ID ${planId} not found.`);
  }

  // --- Placeholder Logic --- 
  // If it's a free plan, create the subscription directly
  if (plan.price === 0) {
    console.log(`Plan ${planId} is free. Creating subscription directly.`);
    // TODO: Create the Subscription record in the database here
    // await createSubscription(userId, planId, null);
    // revalidatePath('/profile/billing'); // Example path
    // redirect('/profile/billing?success=true'); // Redirect to billing page
    return { success: true, message: 'Subscribed to free plan!' }; // Return status
  }

  // If it's a paid plan, proceed to Stripe Checkout (placeholder)
  console.log(`Plan ${planId} costs $${plan.price}. Redirecting to Stripe (placeholder).`);
  // TODO: Get or create Stripe customer ID for the user
  // TODO: Create Stripe Checkout Session
  // TODO: Return the session URL for redirection

  // For now, simulate success for testing UI integration
  // In reality, you would return { url: stripeSession.url } or similar
  // and the client-side would redirect.
  // return redirect('/pricing?error=stripe_not_implemented'); // Placeholder error 
  return { success: false, message: 'Stripe Checkout not implemented yet.' };
}

/**
 * Creates or updates a subscription record in the database.
 * Typically called after a successful payment webhook or for free plans.
 * TODO: Implement this function fully.
 */
export async function createSubscription(userId: string, planId: string, stripeSubscriptionId: string | null) {
  console.log(`Creating/updating subscription for user ${userId}, plan ${planId}, stripeId: ${stripeSubscriptionId}`);

  // TODO: Fetch plan details
  // TODO: Determine start/end dates (handle trials?)
  // TODO: Use prisma.subscription.upsert based on userId?
  // Ensure only one active subscription per user?

  // Example structure:
  // const subscription = await prisma.subscription.create({
  //   data: {
  //     userId: userId,
  //     planId: planId,
  //     stripeSubscriptionId: stripeSubscriptionId,
  //     status: 'ACTIVE', // or TRIALING
  //     startDate: new Date(),
  //     // endDate: calculateEndDate(), // Based on billing cycle
  //     // trialEndDate: calculateTrialEndDate(),
  //   }
  // });

  // revalidatePath('/profile/billing'); // Revalidate relevant pages
  return { success: true };
}

/**
 * Handles Stripe Webhooks (placeholder).
 * Needs a corresponding API route (e.g., /api/webhooks/stripe).
 */
export async function handleStripeWebhook(event: any) { // Use specific Stripe event type later
  console.log(`Received Stripe webhook event: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // TODO: Extract user ID and plan ID from session metadata
      // TODO: Extract stripeSubscriptionId
      // TODO: Call createSubscription
      console.log('Checkout session completed:', session.id);
      break;
    case 'invoice.payment_succeeded':
      // TODO: Handle recurring payments, update subscription end date
      console.log('Invoice payment succeeded');
      break;
    case 'invoice.payment_failed':
      // TODO: Update subscription status (e.g., PAST_DUE)
      console.log('Invoice payment failed');
      break;
    case 'customer.subscription.deleted':
      // TODO: Handle subscription cancellation in Stripe
      console.log('Customer subscription deleted');
      break;
    // ... handle other relevant events
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { received: true };
} 