import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

// Schema for reservation update
const reservationUpdateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]).optional(),
  paymentStatus: z.enum(["UNPAID", "PAID", "REFUNDED", "PARTIALLY_PAID"]).optional(),
  paymentId: z.string().optional(),
  notes: z.string().optional(),
});

// Get a specific reservation by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to view this reservation" },
        { status: 401 }
      );
    }

    // Get the reservation
    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
      include: {
        sportField: {
          include: {
            club: {
              select: {
                id: true,
                name: true,
                address: true,
                city: true,
                state: true,
                zipCode: true,
                phone: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
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

    // Check if the user has permission to view this reservation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const isAdmin = user?.role === "ADMIN";
    const isOwner = reservation.userId === session.user.id;
    const isClubOwner = user?.role === "CLUB_OWNER" && 
                        reservation.sportField.club.id === 
                        (await prisma.club.findFirst({ 
                          where: { ownerId: session.user.id },
                          select: { id: true }
                        }))?.id;

    if (!isAdmin && !isOwner && !isClubOwner) {
      return NextResponse.json(
        { error: "You don't have permission to view this reservation" },
        { status: 403 }
      );
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservation details" },
      { status: 500 }
    );
  }
}

// Update a reservation
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to update a reservation" },
        { status: 401 }
      );
    }

    // Get the reservation
    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
      include: {
        sportField: {
          include: {
            club: true,
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

    // Check if the user has permission to update this reservation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const isAdmin = user?.role === "ADMIN";
    const isOwner = reservation.userId === session.user.id;
    const isClubOwner = user?.role === "CLUB_OWNER" && 
                        reservation.sportField.club.ownerId === session.user.id;

    if (!isAdmin && !isOwner && !isClubOwner) {
      return NextResponse.json(
        { error: "You don't have permission to update this reservation" },
        { status: 403 }
      );
    }

    const body = await req.json();
    
    // Validate request body
    const result = reservationUpdateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid update data", details: result.error.errors },
        { status: 400 }
      );
    }

    // Update the reservation
    const updatedReservation = await prisma.reservation.update({
      where: { id: params.id },
      data: result.data,
    });

    return NextResponse.json(updatedReservation);
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json(
      { error: "Failed to update reservation" },
      { status: 500 }
    );
  }
}

// Cancel a reservation
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to cancel a reservation" },
        { status: 401 }
      );
    }

    // Get the reservation
    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
      include: {
        sportField: {
          include: {
            club: true,
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

    // Check if the user has permission to cancel this reservation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const isAdmin = user?.role === "ADMIN";
    const isOwner = reservation.userId === session.user.id;
    const isClubOwner = user?.role === "CLUB_OWNER" && 
                        reservation.sportField.club.ownerId === session.user.id;

    if (!isAdmin && !isOwner && !isClubOwner) {
      return NextResponse.json(
        { error: "You don't have permission to cancel this reservation" },
        { status: 403 }
      );
    }

    // Check if reservation can be cancelled
    if (["COMPLETED", "CANCELLED", "NO_SHOW"].includes(reservation.status)) {
      return NextResponse.json(
        { error: `Cannot cancel a reservation with status: ${reservation.status}` },
        { status: 400 }
      );
    }

    // Update the reservation status to CANCELLED
    await prisma.reservation.update({
      where: { id: params.id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json(
      { message: "Reservation cancelled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    return NextResponse.json(
      { error: "Failed to cancel reservation" },
      { status: 500 }
    );
  }
} 