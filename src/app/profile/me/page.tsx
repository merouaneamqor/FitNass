import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { authOptions } from '@/lib/auth';
import ProfileClientPage from './ProfileClientPage';
import { User } from '@prisma/client'; // Import User type

export default async function ProfilePage({ searchParams }: { searchParams?: { tab?: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/profile/me'); // Redirect to signin if not logged in
  }

  try {
    // First try to find user by ID
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        city: true,
        bio: true,
        phoneNumber: true,
        createdAt: true,
      }
    });

    // If user not found by ID, try to find by email
    if (!user && session.user.email) {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          city: true,
          bio: true,
          phoneNumber: true,
          createdAt: true,
        }
      });
    }

    if (!user) {
      console.error('User not found in database:', session.user);
      redirect('/auth/signin');
    }

    const activeTab = searchParams?.tab || 'profile'; // Default to 'profile' tab

    return (
      <ProfileClientPage user={user as User} initialTab={activeTab} />
    );
  } catch (error) {
    console.error('Error fetching user profile:', error);
    redirect('/auth/signin');
  }
} 