'use server';

import { prisma } from '@/lib/prisma';
// import { auth } from '@/lib/auth'; // Incorrect import for v4
import { getServerSession } from 'next-auth/next'; // Import getServerSession for v4
import { authOptions } from '@/lib/auth';      // Import your authOptions
// import { revalidatePath } from 'next/cache'; // Removed unused import
// import { redirect } from 'next/navigation'; // Removed unused import
import Stripe from 'stripe'; // Import Stripe for types
// import { stripe } from '@/lib/stripe'; // Stripe client instance will be added later

/**
 * Creates a Stripe Checkout Session for a user to subscribe to a plan.
 * TODO: Implement actual Stripe logic.
 * TODO: Handle free plans (no checkout needed).
 * TODO: Error handling.
 */
export async function createCheckoutSession(planId: string) {
  // Get session using getServerSession and authOptions
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // It's better to return an error object than throw in server actions usually
    // throw new Error('User must be logged in to subscribe.');
    return { success: false, message: 'User must be logged in to subscribe.', error: 'UNAUTHENTICATED' };
  }

  const userId = session.user.id;

  console.log(`User ${userId} attempting to subscribe to plan ${planId}`);

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    // throw new Error(`Plan with ID ${planId} not found.`);
     return { success: false, message: `Plan with ID ${planId} not found.`, error: 'PLAN_NOT_FOUND' };
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
export async function handleStripeWebhook(event: Stripe.Event) { 
  console.log(`Received Stripe webhook event: ${event.type}`);

  // Use specific types from Stripe.Event where possible
  switch (event.type) {
    case 'checkout.session.completed': {
      // Added braces to allow lexical declaration
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      // TODO: Extract user ID and plan ID from session metadata
      const userId = checkoutSession.metadata?.userId;
      const planId = checkoutSession.metadata?.planId;
      const stripeSubscriptionId = checkoutSession.subscription;
      
      if (!userId || !planId || !stripeSubscriptionId) {
        console.error('Missing metadata or subscription ID in checkout.session.completed', checkoutSession.id);
        // Consider returning an error status code if this were an API route
        return { received: false, error: 'Missing metadata' };
      }
      
      console.log('Checkout session completed:', checkoutSession.id, { userId, planId });
      // Call createSubscription
      await createSubscription(userId, planId, stripeSubscriptionId as string);
      break;
    }
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      let stripeSubscriptionId: string | null = null;
      // Attempt to get subscription ID ONLY from the first line item, assuming it exists
      if (invoice.lines?.data?.length > 0) {
        // Directly access subscription property, assuming it's present on line items for subscription invoices
        stripeSubscriptionId = invoice.lines.data[0].subscription as string | null;
      }

      if (stripeSubscriptionId) {
        console.log('Invoice payment succeeded for subscription ID:', stripeSubscriptionId);
        // TODO: DB updates
      } else {
        console.warn('Could not determine subscription ID from invoice.payment_succeeded event:', invoice.id);
      }
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      let stripeSubscriptionId: string | null = null;
       // Attempt to get subscription ID ONLY from the first line item, assuming it exists
      if (invoice.lines?.data?.length > 0) {
         // Directly access subscription property, assuming it's present on line items for subscription invoices
         stripeSubscriptionId = invoice.lines.data[0].subscription as string | null;
      }

      if (stripeSubscriptionId) {
        console.log('Invoice payment failed for subscription ID:', stripeSubscriptionId);
         // TODO: DB updates
      } else {
        console.warn('Could not determine subscription ID from invoice.payment_failed event:', invoice.id);
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      // TODO: Handle subscription cancellation in Stripe
      console.log('Customer subscription deleted:', subscription.id);
      // Update subscription status to CANCELLED or EXPIRED in your DB
      break;
    }
    // ... handle other relevant events
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { received: true };
} 