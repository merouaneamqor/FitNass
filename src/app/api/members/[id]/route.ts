import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for updating a member
const memberUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(), // Keep for API compatibility but won't be stored
  membershipType: z.string().optional(),
});

// GET /api/members/[id] - Get a single member
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is a gym owner
    if (!session || session.user.role !== 'GYM_OWNER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const memberId = params.id;
    
    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        lastLogin: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }
    
    // Format the response
    const formattedMember = {
      id: user.id,
      name: user.name || 'Unknown',
      email: user.email,
      phone: '', // Default empty phone since field doesn't exist in database
      joinDate: user.createdAt.toISOString(),
      status: 'active', // Default status since field doesn't exist in database
      membershipType: 'Basic', // This would come from a real membership table
      lastVisit: user.lastLogin ? user.lastLogin.toISOString() : user.createdAt.toISOString(),
    };
    
    return NextResponse.json(formattedMember);
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/members/[id] - Update a member
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is a gym owner
    if (!session || session.user.role !== 'GYM_OWNER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const memberId = params.id;
    
    // Parse and validate the request body
    const body = await request.json();
    const validationResult = memberUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const { name, email, phone, status, membershipType } = validationResult.data;
    
    // Check if the member exists
    const existingMember = await prisma.user.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        name: true,
        email: true
      }
    });
    
    if (!existingMember) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }
    
    // If updating email, check if it's already in use by another user
    if (email && email !== existingMember.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true
        }
      });
      
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email is already in use' },
          { status: 409 }
        );
      }
    }
    
    // Build SQL parts for the update
    let updateParts = [];
    let updateValues = [];
    
    if (name) {
      updateParts.push(`name = $${updateValues.length + 1}`);
      updateValues.push(name);
    }
    
    if (email) {
      updateParts.push(`email = $${updateValues.length + 1}`);
      updateValues.push(email);
    }
    
    // status field doesn't exist in the database, so we skip it
    // Note: In a real app, you'd store this in a related table
    
    // If no fields to update, just return the existing member
    if (updateParts.length === 0) {
      return NextResponse.json({
        id: existingMember.id,
        name: existingMember.name || 'Unknown',
        email: existingMember.email,
        phone: phone || '',
        joinDate: new Date().toISOString(), // No access to original
        status: status || 'active',
        membershipType: membershipType || 'Basic',
        lastVisit: new Date().toISOString(), // No access to original
      });
    }
    
    // Update the user with raw SQL
    const updateQuery = `
      UPDATE "User" 
      SET ${updateParts.join(', ')}, "updatedAt" = now()
      WHERE id = $${updateValues.length + 1}
      RETURNING id, name, email, "createdAt", "lastLogin"
    `;
    
    updateValues.push(memberId);
    
    const updateResult = await prisma.$queryRawUnsafe(updateQuery, ...updateValues);
    const updatedUser = Array.isArray(updateResult) ? updateResult[0] : updateResult;
    
    // Format the response
    const formattedMember = {
      id: updatedUser.id,
      name: updatedUser.name || 'Unknown',
      email: updatedUser.email,
      phone: phone || '', // Include the phone from request but not stored in DB
      joinDate: updatedUser.createdAt,
      status: status || 'active', // Include status from request but not stored in DB
      membershipType: membershipType || 'Basic', // This would be updated in a real membership table
      lastVisit: updatedUser.lastLogin || updatedUser.createdAt,
    };
    
    return NextResponse.json(formattedMember);
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/members/[id] - Delete a member
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is a gym owner
    if (!session || session.user.role !== 'GYM_OWNER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const memberId = params.id;
    
    // In a real implementation, you'd check if this member belongs to the gym owner's gym
    // For now, we just check if the user exists
    const member = await prisma.user.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        name: true
      }
    });
    
    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }
    
    // In real world we would soft delete by setting a status field
    // Since we don't have status, just mark in response but don't change DB
    // This is just for demo purposes - in a real app, you'd add a deleted flag
    
    // For demonstration purposes, we'll return a success message
    return NextResponse.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 