import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
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
            club: true,
          },
        },
      },
    });

    if (!reservation || !reservation.user || !reservation.sportField || !reservation.sportField.club) {
      throw new Error('Reservation, user, sport field, or club not found');
    }

    // Format the line items for Stripe
    const lineItems = [
      {
        price_data: {
          currency: 'mad',
          product_data: {
            name: `${reservation.sportField.name} at ${reservation.sportField.club.name}`,
            description: `Reservation for ${new Date(reservation.startTime).toLocaleString()} to ${new Date(reservation.endTime).toLocaleString()}`,
          },
          unit_amount: Math.round(parseFloat(reservation.totalPrice) * 100), // Stripe uses cents
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