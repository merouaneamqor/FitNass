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

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    // Select necessary fields for profile and settings
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
      // Add other fields needed for other tabs (like favorites)
      // favoriteClubs: true,
      // favorites: true,
    }
  });

  if (!user) {
    // This shouldn't happen if session is valid, but handle just in case
    redirect('/auth/signin');
  }

  const activeTab = searchParams?.tab || 'profile'; // Default to 'profile' tab

  return (
    <ProfileClientPage user={user as User} initialTab={activeTab} />
  );
} 