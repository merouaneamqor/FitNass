import { NextRequest, NextResponse } from 'next/server';
import { addFavoriteGym } from '@/lib/profile';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// POST /api/profiles/[userId]/favorites - Add a gym to favorites
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const { gymId } = await request.json();
    
    if (!gymId) {
      return NextResponse.json(
        { error: 'Gym ID is required' },
        { status: 400 }
      );
    }
    
    // Check if user is authorized
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - you must be logged in to add favorites' },
        { status: 401 }
      );
    }
    
    let profileUserId = userId;
    
    // Handle special case for 'me'
    if (userId === 'me') {
      profileUserId = session.user.id;
    } else if (session.user.id !== userId && session.user.role !== 'admin') {
      // Only allow users to modify their own favorites unless they're an admin
      return NextResponse.json(
        { error: 'Forbidden - you can only modify your own favorites' },
        { status: 403 }
      );
    }
    
    try {
      const updatedProfile = await addFavoriteGym(profileUserId, gymId);
      
      if (!updatedProfile) {
        return NextResponse.json(
          { error: 'Failed to add favorite gym - profile not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(updatedProfile);
    } catch (dbError: Error) {
      console.error('Database error adding favorite gym:', dbError);
      
      // Check for specific error messages
      if ('message' in dbError && dbError.message?.includes('Gym not found')) {
        return NextResponse.json(
          { error: 'Gym not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: 'Database error adding favorite gym' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/profiles/[userId]/favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 