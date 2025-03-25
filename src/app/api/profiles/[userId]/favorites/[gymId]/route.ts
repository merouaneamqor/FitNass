import { NextRequest, NextResponse } from 'next/server';
import { removeFavoriteGym } from '@/lib/profile';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// DELETE /api/profiles/[userId]/favorites/[gymId] - Remove a gym from favorites
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string; gymId: string } }
) {
  try {
    const { userId, gymId } = params;
    
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
        { error: 'Unauthorized - you must be logged in to remove favorites' },
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
      const updatedProfile = await removeFavoriteGym(profileUserId, gymId);
      
      if (!updatedProfile) {
        return NextResponse.json(
          { error: 'Failed to remove favorite gym - profile not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(updatedProfile);
    } catch (dbError: any) {
      console.error('Database error removing favorite gym:', dbError);
      
      if (dbError.message?.includes('User not found')) {
        return NextResponse.json(
          { error: 'User profile not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: 'Database error removing favorite gym' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in DELETE /api/profiles/[userId]/favorites/[gymId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 