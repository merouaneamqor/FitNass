import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for club creation validation
const clubSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  latitude: z.number(),
  longitude: z.number(),
  phone: z.string().optional(),
  website: z.string().url().optional().nullable(),
  email: z.string().email().optional().nullable(),
  images: z.array(z.string()).optional(),
  facilities: z.array(z.string()).optional(),
  openingHours: z.record(z.string(), z.any()).optional(),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const page = parseInt(url.searchParams.get("page") || "1");
  const skip = (page - 1) * limit;

  try {
    const clubs = await db.club.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
        ],
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        latitude: true,
        longitude: true,
        images: true,
        facilities: true,
        rating: true,
        viewCount: true,
        _count: {
          select: {
            sportFields: true,
            reviews: true,
          },
        },
      },
      skip,
      take: limit,
    });

    const totalCount = await db.club.count({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
        ],
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      clubs,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching clubs:", error);
    return NextResponse.json(
      { error: "Failed to fetch clubs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to create a club" },
        { status: 401 }
      );
    }

    // Check if user has the appropriate role
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "CLUB_OWNER")) {
      return NextResponse.json(
        { error: "Insufficient permissions to create a club" },
        { status: 403 }
      );
    }

    const body = await req.json();
    
    // Validate request body
    const result = clubSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid club data", details: result.error.errors },
        { status: 400 }
      );
    }

    // Create the club
    const club = await db.club.create({
      data: {
        ...result.data,
        images: result.data.images || [],
        facilities: result.data.facilities || [],
        ownerId: session.user.id,
      },
    });

    // If user is not already a CLUB_OWNER, update their role
    if (user.role !== "CLUB_OWNER" && user.role !== "ADMIN") {
      await db.user.update({
        where: { id: session.user.id },
        data: { role: "CLUB_OWNER" },
      });
    }

    return NextResponse.json(club, { status: 201 });
  } catch (error) {
    console.error("Error creating club:", error);
    return NextResponse.json(
      { error: "Failed to create club" },
      { status: 500 }
    );
  }
} 