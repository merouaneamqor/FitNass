import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Get the original admin ID from cookie
    const cookieStore = cookies();
    const adminId = cookieStore.get('admin-impersonating')?.value;

    if (!adminId) {
      return NextResponse.json(
        { error: 'Not currently impersonating', details: 'No admin ID found in cookie' },
        { status: 400 }
      );
    }

    console.log('Found admin ID in cookie:', adminId);

    // Find the original admin
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin account not found', details: `No admin found with ID: ${adminId}` },
        { status: 404 }
      );
    }

    if (admin.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Not an admin account', details: `User with ID ${adminId} is not an admin` },
        { status: 403 }
      );
    }

    console.log('Found admin account:', admin.email);

    // Clear the impersonation cookie
    cookieStore.delete('admin-impersonating');

    // Return the admin info to be set in the client session
    return NextResponse.json({
      success: true,
      message: 'Successfully stopped impersonating',
      user: {
        id: admin.id,
        name: admin.name || 'Admin User',
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error stopping impersonation:', error);
    return NextResponse.json(
      { error: 'Failed to stop impersonating', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 