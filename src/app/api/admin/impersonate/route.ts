import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting impersonation process');
    
    // Check if the current user is an admin
    const session = await getServerSession();
    
    if (!session || !session.user) {
      console.log('No session found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const adminEmail = session.user.email;
    if (!adminEmail) {
      console.log('No email in session');
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 400 }
      );
    }

    console.log('Admin email:', adminEmail);

    // Verify admin status
    const admin = await prisma.user.findUnique({
      where: { email: adminEmail },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!admin) {
      console.log('Admin not found in database');
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    if (admin.role !== 'ADMIN') {
      console.log('User is not an admin:', admin.role);
      return NextResponse.json(
        { error: 'Unauthorized - Admin privileges required' },
        { status: 403 }
      );
    }

    // Get the user ID to impersonate
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      console.log('No userId provided');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('Impersonating user ID:', userId);

    // Find the user to impersonate
    const userToImpersonate = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!userToImpersonate) {
      console.log('User to impersonate not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Found user to impersonate:', userToImpersonate.email);

    // Store original admin ID in a cookie for later restoration
    const cookieStore = cookies();
    cookieStore.set('admin-impersonating', admin.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      sameSite: 'lax',
      path: '/',
    });

    console.log('Set admin-impersonating cookie:', admin.id);

    // Return the user info to be set in the client session
    return NextResponse.json({
      success: true,
      message: 'Successfully prepared for impersonation',
      user: {
        id: userToImpersonate.id,
        name: userToImpersonate.name,
        email: userToImpersonate.email,
        role: userToImpersonate.role,
        isImpersonating: true,
        originalAdmin: adminEmail
      }
    });
  } catch (error) {
    console.error('Error in user impersonation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to impersonate user',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 