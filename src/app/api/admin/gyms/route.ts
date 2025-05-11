import { NextResponse } from 'next/server';
import { prisma, prismaExec } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // Check for admin authentication
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }
    
    try {
      // Fetch all gyms with owner information
      const gyms = await prismaExec(
        () => prisma.place.findMany({
          where: {
            type: 'GYM'
          },
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }),
        'Error fetching gyms'
      );
      
      return NextResponse.json(gyms);
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Fallback query without problematic fields/relations
      const simpleGyms = await prisma.place.findMany({
        where: {
          type: 'GYM'
        },
        select: {
          id: true,
          name: true,
          description: true,
          address: true,
          city: true,
          rating: true,
          createdAt: true,
          updatedAt: true,
          type: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return NextResponse.json(simpleGyms);
    }
  } catch (error) {
    console.error('Error fetching gyms:', error);
    return NextResponse.json({ error: 'Failed to fetch gyms' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check for admin authentication
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.ownerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    try {
      // Create new gym
      const newGym = await prismaExec(
        () => prisma.place.create({
          data: {
            name: data.name,
            description: data.description || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zipCode: data.zipCode || '',
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            phone: data.phone,
            website: data.website,
            email: data.email,
            priceRange: data.priceRange || '$',
            facilities: data.facilities || [],
            images: data.images || [],
            type: 'GYM',
            status: 'ACTIVE',
            owner: {
              connect: { id: data.ownerId }
            }
          }
        }),
        'Error creating gym'
      );
      
      return NextResponse.json(newGym, { status: 201 });
    } catch (dbError) {
      console.error('Database error creating gym:', dbError);
      
      // Try a simplified create operation without problematic fields
      const simpleGym = await prisma.place.create({
        data: {
          name: data.name,
          description: data.description || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zipCode || '',
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          priceRange: data.priceRange || '$',
          facilities: data.facilities || [],
          images: data.images || [],
          type: 'GYM',
          status: 'ACTIVE',
          owner: {
            connect: { id: data.ownerId }
          }
        }
      });
      
      return NextResponse.json(simpleGym, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating gym:', error);
    return NextResponse.json({ error: 'Failed to create gym' }, { status: 500 });
  }
} 