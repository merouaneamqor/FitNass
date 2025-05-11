'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * Toggles the favorite status of a gym for the currently logged-in user.
 */
export async function toggleFavoriteGym(formData: FormData): Promise<void> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error('User must be logged in to favorite gyms.');
  }

  const gymId = formData.get('gymId') as string;
  const userId = session.user.id;

  if (!gymId) {
    throw new Error('Gym ID is required.');
  }

  let isCurrentlyFavorited = false;
  try {
    const userWithFavorite = await prisma.user.findUnique({
      where: { id: userId },
      select: { favoritePlaces: { where: { id: gymId, type: 'GYM' }, select: { id: true } } }
    });
    isCurrentlyFavorited = (userWithFavorite?.favoritePlaces?.length ?? 0) > 0;
  } catch (error) {
    console.error('Failed to check current favorite status:', error);
    throw new Error('Could not determine current favorite status.');
  }

  try {
    // Update the user's favorite gyms
    await prisma.user.update({
      where: { id: userId },
      data: {
        favoritePlaces: {
          [isCurrentlyFavorited ? 'disconnect' : 'connect']: { id: gymId },
        },
      },
    });

    console.log(`User ${userId} ${isCurrentlyFavorited ? 'unfavorited' : 'favorited'} gym ${gymId}`);

    // Revalidate the path to update the UI
    revalidatePath(`/gyms/${gymId}`);

  } catch (error) {
    console.error('Failed to toggle favorite gym:', error);
    throw new Error('Could not update favorite status. Please try again.');
  }
} 