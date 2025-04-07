import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to make a payment" },
        { status: 401 }
      );
    }

    // Get the reservation
    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // Check if the user owns this reservation
    if (reservation.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to pay for this reservation" },
        { status: 403 }
      );
    }

    // Check if payment is already completed
    if (reservation.paymentStatus === "PAID") {
      return NextResponse.json(
        { error: "This reservation has already been paid for" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const { url, sessionId } = await createCheckoutSession(params.id);

    return NextResponse.json({ url, sessionId });
  } catch (error) {
    console.error("Error creating payment session:", error);
    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 }
    );
  }
} 