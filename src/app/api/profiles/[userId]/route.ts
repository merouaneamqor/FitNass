import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile, getUserProfileByEmail, updateUserProfile } from '@/lib/profile';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET /api/profiles/[userId]
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    
    // Handle special case for 'me' - get currently logged in user
    if (userId === 'me') {
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.email) {
        return NextResponse.json(
          { error: 'Unauthorized - you must be logged in to access your profile' },
          { status: 401 }
        );
      }
      
      // Use email to get the full user profile
      const currentUserEmail = session.user.email;
      
      try {
        // Get user profile by email
        const profile = await getUserProfileByEmail(currentUserEmail);
        
        if (!profile) {
          return NextResponse.json(
            { error: 'User profile not found. You may need to create a profile first.' },
            { status: 404 }
          );
        }
        
        return NextResponse.json(profile);
      } catch (dbError) {
        console.error('Database error fetching current user profile:', dbError);
        return NextResponse.json(
          { error: 'Database error fetching your profile' },
          { status: 500 }
        );
      }
    }
    
    // Regular user lookup by ID
    try {
      const profile = await getUserProfile(userId);
      
      if (!profile) {
        return NextResponse.json(
          { error: 'User profile not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(profile);
    } catch (dbError) {
      console.error('Database error fetching user profile:', dbError);
      return NextResponse.json(
        { error: 'Database error fetching user profile' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in GET /api/profiles/[userId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/profiles/[userId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const session = await getServerSession(authOptions);
    const data = await request.json();
    
    // Check if user is authorized to update this profile
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - you must be logged in to update a profile' },
        { status: 401 }
      );
    }
    
    let profileUserId = userId;
    
    // Handle special case for 'me'
    if (userId === 'me') {
      profileUserId = session.user.id;
    } else if (session.user.id !== userId && session.user.role !== 'admin') {
      // Only allow users to update their own profile unless they're an admin
      return NextResponse.json(
        { error: 'Forbidden - you can only update your own profile' },
        { status: 403 }
      );
    }
    
    try {
      const updatedProfile = await updateUserProfile(profileUserId, data);
      
      if (!updatedProfile) {
        return NextResponse.json(
          { error: 'User profile not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(updatedProfile);
    } catch (dbError) {
      console.error('Database error updating profile:', dbError);
      return NextResponse.json(
        { error: 'Database error updating profile' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in PATCH /api/profiles/[userId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 