import Stripe from 'stripe';
import { prisma } from './db';

const isDevelopment = process.env.NODE_ENV === 'development';

// In development, we use a dummy key
const stripeSecretKey = isDevelopment 
  ? 'dummy_key_for_development'
  : process.env.STRIPE_SECRET_KEY;

// Use a mock implementation in development
const isDummyKey = isDevelopment || !stripeSecretKey;

const stripe = isDummyKey
  ? (new Proxy({}, {
      get: (target, prop) => {
        // Return a mock implementation for checkout.sessions
        if (prop === 'checkout') {
          return {
            sessions: {
              create: async () => ({ url: '#', id: 'dummy_session_id' }),
              retrieve: async () => ({ metadata: {} })
            }
          };
        }
        return () => {}; // Return empty function for other methods
      }
    }) as unknown as Stripe)
  : new Stripe(stripeSecretKey!, {
      apiVersion: '2025-03-31.basil',
    });

export default stripe;

export async function createCheckoutSession(reservationId: string) {
  try {
    // Get the reservation with related data
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        user: true,
        sportField: {
          include: {
            place: true,
          },
        },
      },
    });

    if (!reservation || !reservation.user || !reservation.sportField || !reservation.sportField.place) {
      throw new Error('Reservation, user, sport field, or place not found');
    }

    // Format the line items for Stripe
    const lineItems = [
      {
        price_data: {
          currency: 'mad',
          product_data: {
            name: `${reservation.sportField.name} at ${reservation.sportField.place.name}`,
            description: `Reservation for ${new Date(reservation.startTime).toLocaleString()} to ${new Date(reservation.endTime).toLocaleString()}`,
          },
          unit_amount: Math.round(Number(reservation.totalPrice ?? 0) * 100),
        },
        quantity: 1,
      },
    ];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/reservations/${reservationId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/reservations/${reservationId}`,
      metadata: {
        reservationId,
      },
      customer_email: reservation.user.email,
    });

    // Update the reservation with the session ID
    await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        paymentId: session.id,
      },
    });

    return { url: session.url, sessionId: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function handleStripeWebhook(event: Stripe.Event) {
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const reservationId = session.metadata?.reservationId;
        
        if (reservationId) {
          // Update the reservation status
          await prisma.reservation.update({
            where: { id: reservationId },
            data: {
              paymentStatus: 'PAID',
              status: 'CONFIRMED',
            },
          });
        }
        break;
      }
      
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const session = await stripe.checkout.sessions.retrieve(
          charge.payment_intent as string
        );
        
        const reservationId = session.metadata?.reservationId;
        
        if (reservationId) {
          // Update the reservation payment status
          await prisma.reservation.update({
            where: { id: reservationId },
            data: {
              paymentStatus: 'REFUNDED',
            },
          });
        }
        break;
      }
    }
    
    return { received: true };
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    throw error;
  }
} 