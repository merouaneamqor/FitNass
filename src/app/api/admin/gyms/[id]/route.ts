import { NextResponse } from 'next/server';
import { prisma, prismaExec } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';

// Get specific gym
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check for admin authentication
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }
    
    const { id } = params;
    
    try {
      // Fetch place (gym) with owner information
      const gym = await prismaExec(
        () => prisma.place.findUnique({
          where: { 
            id,
            type: 'GYM'
          },
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            },
            reviews: {
              select: {
                id: true,
                rating: true,
                comment: true,
                createdAt: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  }
                }
              },
              orderBy: {
                createdAt: 'desc'
              },
              take: 5
            }
          }
        }),
        'Error fetching gym details'
      );
      
      if (!gym) {
        return NextResponse.json({ error: 'Gym not found' }, { status: 404 });
      }
      
      return NextResponse.json(gym);
    } catch (dbError) {
      console.error('Database error fetching gym:', dbError);
      
      // Fallback query without problematic fields/relations
      const simpleGym = await prisma.place.findUnique({
        where: { 
          id,
          type: 'GYM'
        },
        select: {
          id: true,
          name: true,
          description: true,
          address: true,
          city: true,
          state: true,
          zipCode: true,
          rating: true,
          priceRange: true,
          facilities: true,
          images: true,
          createdAt: true,
          updatedAt: true,
        }
      });
      
      if (!simpleGym) {
        return NextResponse.json({ error: 'Gym not found' }, { status: 404 });
      }
      
      return NextResponse.json(simpleGym);
    }
  } catch (error) {
    console.error('Error fetching gym:', error);
    return NextResponse.json({ error: 'Failed to fetch gym' }, { status: 500 });
  }
}

// Update gym
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check for admin authentication
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }
    
    const { id } = params;
    const data = await request.json();
    
    // Check if gym exists
    const existingGym = await prismaExec(
      () => prisma.place.findUnique({
        where: { 
          id,
          type: 'GYM'
        }
      }),
      'Error checking if gym exists'
    );
    
    if (!existingGym) {
      return NextResponse.json({ error: 'Gym not found' }, { status: 404 });
    }
    
    // Prepare update data
    const updateData: Prisma.PlaceUpdateInput = {
      type: 'GYM' // Ensure we maintain the gym type
    };
    
    // Only include fields that are provided in the request
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.zipCode !== undefined) updateData.zipCode = data.zipCode;
    if (data.latitude !== undefined) updateData.latitude = data.latitude;
    if (data.longitude !== undefined) updateData.longitude = data.longitude;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.website !== undefined) updateData.website = data.website;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.priceRange !== undefined) updateData.priceRange = data.priceRange;
    if (data.facilities !== undefined) updateData.facilities = data.facilities;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.status !== undefined) updateData.status = data.status;
    
    // Handle owner change if provided
    if (data.ownerId) {
      updateData.owner = {
        connect: { id: data.ownerId }
      };
    }
    
    try {
      // Update gym
      const updatedGym = await prismaExec(
        () => prisma.place.update({
          where: { id },
          data: updateData,
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }),
        'Error updating gym'
      );
      
      return NextResponse.json(updatedGym);
    } catch (dbError) {
      console.error('Database error updating gym:', dbError);
      
      // Try a simplified update operation without problematic fields
      const simpleUpdateData: Prisma.PlaceUpdateInput = {
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        latitude: data.latitude,
        longitude: data.longitude,
        priceRange: data.priceRange,
        facilities: data.facilities,
        images: data.images,
        type: 'GYM' as const, // Ensure the type is correctly set
      };
      
      // Remove undefined values
      Object.keys(simpleUpdateData).forEach(key => {
        if (simpleUpdateData[key as keyof typeof simpleUpdateData] === undefined) {
          delete simpleUpdateData[key as keyof typeof simpleUpdateData];
        }
      });
      
      const simpleGym = await prisma.place.update({
        where: { id },
        data: simpleUpdateData
      });
      
      return NextResponse.json(simpleGym);
    }
  } catch (error) {
    console.error('Error updating gym:', error);
    return NextResponse.json({ error: 'Failed to update gym' }, { status: 500 });
  }
}

// Delete gym
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check for admin authentication
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }
    
    const { id } = params;
    
    // Check if gym exists
    const existingGym = await prismaExec(
      () => prisma.place.findUnique({
        where: { 
          id,
          type: 'GYM'
        }
      }),
      'Error checking if gym exists'
    );
    
    if (!existingGym) {
      return NextResponse.json({ error: 'Gym not found' }, { status: 404 });
    }
    
    try {
      // First delete all associated reviews
      await prismaExec(
        () => prisma.review.deleteMany({
          where: { placeId: id }
        }),
        'Error deleting associated reviews'
      );
      
      // Delete the place entity itself
      const deletedGym = await prismaExec(
        () => prisma.place.delete({
          where: { id }
        }),
        'Error deleting gym'
      );
      
      return NextResponse.json({ success: true, deletedGym });
    } catch (dbError) {
      console.error('Database error deleting gym:', dbError);
      return NextResponse.json({ error: 'Failed to delete gym due to database error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting gym:', error);
    return NextResponse.json({ error: 'Failed to delete gym' }, { status: 500 });
  }
} 