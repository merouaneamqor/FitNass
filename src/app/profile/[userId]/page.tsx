import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import ProfileClient from './ProfileClient';
import { getUserProfile, getUserProfileByEmail } from '@/lib/profile';
import type { UserProfile } from '@/types/user';

// Get user data server-side to enable server-side rendering
const getUser = async (userId: string): Promise<UserProfile | null> => {
  try {
    if (userId === 'me') {
      // Get currently authenticated user
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.email) {
        console.warn('No authenticated user found for /profile/me');
        return null;
      }

      try {
        // Get the actual user profile by email
        const profile = await getUserProfileByEmail(session.user.email);
        return profile;
      } catch (err) {
        console.error('Database error when fetching profile by email:', err);
        return null;
      }
    }
    
    // Regular user lookup by ID
    try {
      const profile = await getUserProfile(userId);
      return profile;
    } catch (err) {
      console.error('Database error when fetching profile by ID:', err);
      return null;
    }
  } catch (error) {
    console.error('Error in getUser:', error);
    return null;
  }
};

export async function generateMetadata({ params }: { params: { userId: string } }): Promise<Metadata> {
  const user = await getUser(params.userId);
  
  if (!user) {
    return {
      title: 'User Not Found | FitNass',
      description: 'The requested user profile could not be found',
    };
  }
  
  return {
    title: `${user.name}'s Profile | FitNass`,
    description: `View ${user.name}'s profile, favorite gyms, and reviews on FitNass.`,
  };
}

const UserProfile = async ({ params }: { params: { userId: string } }) => {
  const user = await getUser(params.userId);
  
  if (!user) {
    notFound();
  }
  
  // Check if current user is viewing their own profile
  const session = await getServerSession(authOptions);
  const isOwnProfile: boolean = 
    params.userId === 'me' || 
    !!(session?.user?.email && session.user.email === user.email);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <ProfileClient initialProfile={user} isOwnProfile={isOwnProfile} />
    </div>
  );
};

export default UserProfile; 