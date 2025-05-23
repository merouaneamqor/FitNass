import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

// Schema for place update validation
const placeUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  address: z.string().min(1, "Address is required").optional(),
  city: z.string().min(1, "City is required").optional(),
  state: z.string().min(1, "State is required").optional(),
  zipCode: z.string().min(1, "Zip code is required").optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().nullable(),
  email: z.string().email().optional().nullable(),
  images: z.array(z.string()).optional(),
  facilities: z.array(z.string()).optional(),
  openingHours: z.record(z.string(), z.any()).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "PENDING_APPROVAL", "CLOSED"]).optional(),
});

// Get a specific club by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Increment view count
    await prisma.place.update({
      where: { 
        id: params.id,
        type: 'CLUB'
      },
      data: { viewCount: { increment: 1 } },
    });

    // Get club details
    const club = await prisma.place.findUnique({
      where: { 
        id: params.id,
        type: 'CLUB'
      },
      include: {
        sportFields: {
          where: {
            status: "AVAILABLE",
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            reviews: true,
            sportFields: true,
            favoritedBy: true,
          },
        },
      },
    });

    if (!club) {
      return NextResponse.json(
        { error: "Club not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(club);
  } catch (error) {
    console.error("Error fetching club:", error);
    return NextResponse.json(
      { error: "Failed to fetch club details" },
      { status: 500 }
    );
  }
}

// Update a club
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to update a club" },
        { status: 401 }
      );
    }

    // Get the club to check ownership
    const club = await prisma.place.findUnique({
      where: { 
        id: params.id,
        type: 'CLUB'
      },
      select: { ownerId: true },
    });

    if (!club) {
      return NextResponse.json(
        { error: "Club not found" },
        { status: 404 }
      );
    }

    // Check if user has permission to update the club
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const isAdmin = user?.role === "ADMIN";
    const isOwner = club.ownerId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "You don't have permission to update this club" },
        { status: 403 }
      );
    }

    const body = await req.json();
    
    // Validate request body
    const result = placeUpdateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid club data", details: result.error.errors },
        { status: 400 }
      );
    }

    // Update the club, ensure we maintain the club type
    const updatedClub = await prisma.place.update({
      where: { id: params.id },
      data: {
        ...result.data,
        type: 'CLUB' // Ensure we maintain the club type
      },
    });

    return NextResponse.json(updatedClub);
  } catch (error) {
    console.error("Error updating club:", error);
    return NextResponse.json(
      { error: "Failed to update club" },
      { status: 500 }
    );
  }
}

// Delete a club
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to delete a club" },
        { status: 401 }
      );
    }

    // Get the club to check ownership
    const club = await prisma.place.findUnique({
      where: { 
        id: params.id,
        type: 'CLUB'
      },
      select: { ownerId: true },
    });

    if (!club) {
      return NextResponse.json(
        { error: "Club not found" },
        { status: 404 }
      );
    }

    // Check if user has permission to delete the club
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const isAdmin = user?.role === "ADMIN";
    const isOwner = club.ownerId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "You don't have permission to delete this club" },
        { status: 403 }
      );
    }

    // Delete the club (this will cascade to sportFields per the schema)
    await prisma.place.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Club deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting club:", error);
    return NextResponse.json(
      { error: "Failed to delete club" },
      { status: 500 }
    );
  }
} 