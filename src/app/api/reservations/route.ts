import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";
import { sendReservationConfirmationEmail } from "@/lib/email";

// Schema for reservation creation
const reservationSchema = z.object({
  startTime: z.string().transform(val => new Date(val)),
  endTime: z.string().transform(val => new Date(val)),
  sportFieldId: z.string(),
  participantCount: z.number().optional(),
  notes: z.string().optional(),
});

// Define a type for the filter
type ReservationFilter = {
  userId?: string;
  status?: string;
  sportFieldId?: string;
  startTime?: { gte: Date };
  endTime?: { lte: Date };
};

// Get all reservations for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to view reservations" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // Build filter based on query parameters
    const filter: ReservationFilter = {
      userId: session.user.id,
    };

    if (status) {
      filter.status = status;
    }

    // Get reservations with pagination
    const reservations = await prisma.reservation.findMany({
      where: filter,
      include: {
        sportField: {
          include: {
            club: {
              select: {
                id: true,
                name: true,
                address: true,
                city: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await prisma.reservation.count({
      where: filter,
    });

    return NextResponse.json({
      reservations,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}

// Create a new reservation
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to make a reservation" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Validate request body
    const result = reservationSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid reservation data", details: result.error.errors },
        { status: 400 }
      );
    }

    const { startTime, endTime, sportFieldId, participantCount, notes } = result.data;

    // Get the sport field details
    const sportField = await prisma.sportField.findUnique({
      where: { id: sportFieldId },
      select: { pricePerHour: true, status: true },
    });

    if (!sportField) {
      return NextResponse.json(
        { error: "Sport field not found" },
        { status: 404 }
      );
    }

    if (sportField.status !== "AVAILABLE") {
      return NextResponse.json(
        { error: "This sport field is not available for booking" },
        { status: 400 }
      );
    }

    // Check if the requested time is already booked
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        sportFieldId,
        status: { in: ["PENDING", "CONFIRMED"] },
        OR: [
          {
            // Start time falls between existing reservation
            startTime: { lte: startTime },
            endTime: { gt: startTime },
          },
          {
            // End time falls between existing reservation
            startTime: { lt: endTime },
            endTime: { gte: endTime },
          },
          {
            // Existing reservation is within the requested time
            startTime: { gte: startTime },
            endTime: { lte: endTime },
          },
        ],
      },
    });

    if (existingReservation) {
      return NextResponse.json(
        { error: "The selected time slot is already booked" },
        { status: 400 }
      );
    }

    // Calculate duration in hours
    const durationInMs = endTime.getTime() - startTime.getTime();
    const durationInHours = durationInMs / (1000 * 60 * 60);

    // Calculate total price
    const totalPrice = parseFloat(sportField.pricePerHour) * durationInHours;

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        startTime,
        endTime,
        sportFieldId,
        userId: session.user.id,
        totalPrice: totalPrice.toString(),
        participantCount,
        notes,
        status: "PENDING",
        paymentStatus: "UNPAID",
      },
    });

    // Send confirmation email
    try {
      await sendReservationConfirmationEmail(reservation.id);
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      // Continue even if email fails
    }

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    );
  }
} 