import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';

// Input validation schema for creating a member
const memberCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  membershipType: z.string(),
});

// GET /api/members - Get all members
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is a gym owner
    if (!session || session.user.role !== 'GYM_OWNER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the gym owner id
    const ownerId = session.user.id;
    
    // Find the gym associated with this owner with explicit field selection
    const gym = await prisma.gym.findFirst({
      where: {
        ownerId: ownerId
      },
      select: {
        id: true,
        name: true
      }
    });
    
    if (!gym) {
      return NextResponse.json(
        { error: 'No gym found for this owner' },
        { status: 404 }
      );
    }

    // For now, we'll simulate members by querying users with USER role
    // In a real implementation, you would have a proper relationship between gyms and members
    const members = await prisma.user.findMany({
      where: {
        role: 'USER',
        // In a real implementation, you would filter by gym membership
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        lastLogin: true,
      },
    });
    
    // Transform to the expected member format
    const formattedMembers = members.map(user => ({
      id: user.id,
      name: user.name || 'Unknown',
      email: user.email,
      phone: '', // Default empty phone since field doesn't exist in database
      joinDate: user.createdAt.toISOString(),
      status: 'active', // Default status since field doesn't exist in database
      membershipType: 'Basic', // This would come from a real membership table
      lastVisit: user.lastLogin ? user.lastLogin.toISOString() : user.createdAt.toISOString(),
    }));
    
    return NextResponse.json(formattedMembers);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/members - Create a new member
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is a gym owner
    if (!session || session.user.role !== 'GYM_OWNER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate the request body
    const body = await request.json();
    const validationResult = memberCreateSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const { name, email, phone, membershipType } = validationResult.data;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true
      }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create new user as a member using raw SQL to avoid schema mismatches
    const newMember = await prisma.$queryRaw`
      INSERT INTO "User" (
        id, 
        name, 
        email, 
        role, 
        "createdAt", 
        "updatedAt"
      ) VALUES (
        ${`usr_${Date.now()}`}, 
        ${name}, 
        ${email}, 
        'USER'::public."Role", 
        now(), 
        now()
      ) 
      RETURNING id, name, email, "createdAt"
    `;
    
    // Format the response - newMember is now an array with one object
    const member = Array.isArray(newMember) ? newMember[0] : newMember;
    
    const formattedMember = {
      id: member.id,
      name: member.name || 'Unknown',
      email: member.email,
      phone: phone || '', // Store phone from input, but it's not saved to the database
      joinDate: member.createdAt,
      status: 'active', // Default status since field doesn't exist in database
      membershipType: membershipType,
      lastVisit: member.createdAt,
    };
    
    return NextResponse.json(formattedMember, { status: 201 });
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 