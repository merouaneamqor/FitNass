import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; fieldId: string } }
) {
  try {
    const url = new URL(req.url);
    const start = url.searchParams.get("start");
    const end = url.searchParams.get("end");
    const status = url.searchParams.get("status");

    // Build filter based on query parameters
    let filter: any = {
      sportFieldId: params.fieldId,
    };

    // If start and end dates are provided, only show reservations in that range
    if (start && end) {
      filter.OR = [
        {
          // Reservation starts within the range
          startTime: {
            gte: new Date(start),
            lte: new Date(end),
          },
        },
        {
          // Reservation ends within the range
          endTime: {
            gte: new Date(start),
            lte: new Date(end),
          },
        },
        {
          // Reservation spans the entire range
          startTime: {
            lte: new Date(start),
          },
          endTime: {
            gte: new Date(end),
          },
        },
      ];
    }

    if (status) {
      filter.status = status;
    } else {
      // By default, only show PENDING and CONFIRMED reservations
      filter.status = { in: ["PENDING", "CONFIRMED"] };
    }

    // Get reservations
    const reservations = await db.reservation.findMany({
      where: filter,
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
        sportFieldId: true,
        userId: true,
        participantCount: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
} 