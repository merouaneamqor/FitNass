import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/db";
import { z } from "zod";

// Schema for sport field creation
const sportFieldSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum([
    "FOOTBALL", 
    "TENNIS", 
    "BASKETBALL", 
    "VOLLEYBALL", 
    "SQUASH", 
    "PADEL", 
    "SWIMMING_POOL", 
    "GOLF", 
    "OTHER"
  ]),
  surface: z.string().optional(),
  indoor: z.boolean().default(false),
  size: z.string().optional(),
  maxCapacity: z.number().optional(),
  pricePerHour: z.number().or(z.string().transform(val => parseFloat(val))),
  currency: z.string().default("MAD"),
  availability: z.record(z.string(), z.any()).optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

// Add a local type to match the SportFieldType enum values
type SportFieldType =
  | "FOOTBALL"
  | "TENNIS"
  | "BASKETBALL"
  | "VOLLEYBALL"
  | "SQUASH"
  | "PADEL"
  | "SWIMMING_POOL"
  | "GOLF"
  | "OTHER";

// Get all sport fields for a specific club
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const indoor = url.searchParams.get("indoor");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // Build filter based on query parameters
    const filter: Prisma.SportFieldWhereInput = {
      placeId: params.id,
      status: "AVAILABLE",
    };

    if (type) {
      filter.type = type.toUpperCase() as SportFieldType;
    }

    if (indoor !== null) {
      filter.indoor = indoor === "true";
    }

    // Get sport fields
    const sportFields = await prisma.sportField.findMany({
      where: filter,
      orderBy: {
        name: "asc",
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await prisma.sportField.count({
      where: filter,
    });

    return NextResponse.json({
      sportFields,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching sport fields:", error);
    return NextResponse.json(
      { error: "Failed to fetch sport fields" },
      { status: 500 }
    );
  }
}

// Create a new sport field for a club
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to create a sport field" },
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

    // Check if user has permission to add fields to this club
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const isAdmin = user?.role === "ADMIN";
    const isOwner = club.ownerId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "You don't have permission to add fields to this club" },
        { status: 403 }
      );
    }

    const body = await req.json();
    
    // Validate request body
    const result = sportFieldSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid sport field data", details: result.error.errors },
        { status: 400 }
      );
    }

    // Create the sport field
    const sportField = await prisma.sportField.create({
      data: {
        ...result.data,
        pricePerHour: result.data.pricePerHour,
        amenities: result.data.amenities || [],
        images: result.data.images || [],
        placeId: params.id,
      },
    });

    return NextResponse.json(sportField, { status: 201 });
  } catch (error) {
    console.error("Error creating sport field:", error);
    return NextResponse.json(
      { error: "Failed to create sport field" },
      { status: 500 }
    );
  }
} 