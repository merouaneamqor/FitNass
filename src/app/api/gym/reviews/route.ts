export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
});

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || session.user.role !== 'GYM_OWNER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const gym = await prisma.gym.findFirst({
      where: {
        ownerId: session.user.id,
      },
    });

    if (!gym) {
      return NextResponse.json(
        { error: 'Gym not found' },
        { status: 404 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        gymId: gym.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate average rating
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    return NextResponse.json({
      reviews,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { gymId, ...reviewData } = body;
    const validatedData = reviewSchema.parse(reviewData);

    const gym = await prisma.gym.findUnique({
      where: {
        id: gymId,
      },
    });

    if (!gym) {
      return NextResponse.json(
        { error: 'Gym not found' },
        { status: 404 }
      );
    }

    // Check if user has already reviewed this gym
    const existingReview = await prisma.review.findFirst({
      where: {
        gymId,
        userId: session.user.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this gym' },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        ...validatedData,
        gymId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    // Update gym's average rating
    const allReviews = await prisma.review.findMany({
      where: {
        gymId,
      },
    });

    const newAverageRating = allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length;

    await prisma.gym.update({
      where: {
        id: gymId,
      },
      data: {
        rating: Number(newAverageRating.toFixed(1)),
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;
    const validatedData = reviewSchema.parse(updateData);

    const review = await prisma.review.findUnique({
      where: {
        id,
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    if (review.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updatedReview = await prisma.review.update({
      where: {
        id,
      },
      data: validatedData,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    // Update gym's average rating
    const allReviews = await prisma.review.findMany({
      where: {
        gymId: review.gymId,
      },
    });

    const newAverageRating = allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length;

    await prisma.gym.update({
      where: {
        id: review.gymId,
      },
      data: {
        rating: Number(newAverageRating.toFixed(1)),
      },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({
      where: {
        id,
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    if (review.userId !== session.user.id && session.user.role !== 'GYM_OWNER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const gymId = review.gymId;
    await prisma.review.delete({
      where: {
        id,
      },
    });

    // Update gym's average rating
    const allReviews = await prisma.review.findMany({
      where: {
        gymId,
      },
    });

    const newAverageRating = allReviews.length > 0
      ? Number((allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length).toFixed(1))
      : 0;

    await prisma.gym.update({
      where: {
        id: gymId,
      },
      data: {
        rating: Number(newAverageRating.toFixed(1)),
      },
    });

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 