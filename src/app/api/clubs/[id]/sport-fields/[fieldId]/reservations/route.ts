import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!start || !end) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        startTime: {
          gte: new Date(start),
        },
        endTime: {
          lte: new Date(end),
        },
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        sportFieldId: true,
        participantCount: true,
        status: true,
      },
    });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
} 