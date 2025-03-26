import { prisma, prismaExec } from './db';
import { UserProfile } from '@/types/user';
import { Prisma } from '@prisma/client';

// Define types
// This type would be useful for when we need the full user relations
// Currently unused but kept for future implementation
// type UserWithRelations = Prisma.UserGetPayload<{
//   include: {
//     favorites: true;
//     reviews: {
//       include: {
//         gym: true;
//       }
//     }
//   }
// }>;

// Map Prisma Role enum to string
function mapRoleToString(role: string): "user" | "admin" | "gym-owner" {
  switch (role) {
    case 'ADMIN':
      return 'admin';
    case 'GYM_OWNER':
      return 'gym-owner';
    default:
      return 'user';
  }
}

// Map Prisma User model to UserProfile type
const mapUserToProfile = async (user: Prisma.UserGetPayload<{ include: { favorites: true } }>): Promise<UserProfile> => {
  try {
    // Get user reviews with gym data
    const reviews = await prismaExec(
      () => prisma.review.findMany({
        where: { userId: user.id },
        include: { gym: true },
      }),
      'Error fetching user reviews'
    );

    // Get user favorite gyms
    const favoriteGyms = await prismaExec(
      () => prisma.gym.findMany({
        where: {
          favoritedBy: {
            some: {
              id: user.id
            }
          }
        }
      }),
      'Error fetching user favorite gyms'
    );

    // Map to UserProfile format
    return {
      id: user.id,
      name: user.name || '',
      email: user.email,
      role: mapRoleToString(user.role),
      city: user.city || '',
      createdAt: user.createdAt.toISOString(),
      image: user.image || '',
      bio: user.bio || '',
      memberSince: user.createdAt.toISOString(),
      favoriteGyms: favoriteGyms.map(gym => gym.id),
      reviews: reviews.map(review => ({
        id: review.id,
        gymId: review.gymId,
        gymName: review.gym.name,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt.toISOString(),
      })),
      // For now, we're returning empty arrays for subscriptions and bookings
      // These would be populated from additional database tables in a full implementation
      subscriptions: [],
      bookings: []
    };
  } catch (error) {
    console.error("Error mapping user to profile:", error);
    // Return a minimal profile with the data we have
    return {
      id: user.id,
      name: user.name || '',
      email: user.email,
      role: mapRoleToString(user.role),
      city: user.city || '',
      createdAt: user.createdAt.toISOString(),
      image: user.image || '',
      bio: user.bio || '',
      memberSince: user.createdAt.toISOString(),
      favoriteGyms: [],
      reviews: [],
      subscriptions: [],
      bookings: []
    };
  }
};

// Get user profile by ID
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const user = await prismaExec(() => 
      prisma.user.findUnique({
        where: { id: userId },
        include: { favorites: true }
      }),
      'Error fetching user profile'
    );

    if (!user) return null;

    // Use the existing mapUserToProfile function
    return mapUserToProfile(user);
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
}

// Get user profile by email
export const getUserProfileByEmail = async (email: string): Promise<UserProfile | null> => {
  try {
    const user = await prismaExec(
      () => prisma.user.findUnique({
        where: { email },
        include: { favorites: true }
      }),
      'Error fetching user profile by email'
    );

    if (!user) {
      return null;
    }

    return mapUserToProfile(user);
  } catch (error) {
    console.error('Error fetching user profile by email:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (id: string, data: Partial<UserProfile>): Promise<UserProfile | null> => {
  try {
    // Extract fields that belong to the User model
    interface UserUpdateData {
      name?: string;
      email?: string;
      city?: string;
      image?: string;
      bio?: string;
    }
    
    const userUpdate: UserUpdateData = {};
    if (data.name !== undefined) userUpdate.name = data.name;
    if (data.email !== undefined) userUpdate.email = data.email;
    if (data.city !== undefined) userUpdate.city = data.city;
    if (data.image !== undefined) userUpdate.image = data.image;
    if (data.bio !== undefined) userUpdate.bio = data.bio;

    // Update the user
    const user = await prismaExec(
      () => prisma.user.update({
        where: { id },
        data: userUpdate,
        include: { favorites: true }
      }),
      'Error updating user profile'
    );

    return mapUserToProfile(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Add a gym to user's favorites
export const addFavoriteGym = async (userId: string, gymId: string): Promise<UserProfile | null> => {
  try {
    // First check if the gym exists
    const gym = await prismaExec(
      () => prisma.gym.findUnique({
        where: { id: gymId }
      }),
      'Error finding gym'
    );

    if (!gym) {
      throw new Error('Gym not found');
    }

    // Add the gym to user's favorites
    await prismaExec(
      () => prisma.user.update({
        where: { id: userId },
        data: {
          favorites: {
            connect: { id: gymId }
          }
        },
      }),
      'Error adding gym to favorites'
    );

    // Get the updated user profile
    const user = await prismaExec(
      () => prisma.user.findUnique({
        where: { id: userId },
        include: { favorites: true }
      }),
      'Error fetching updated user profile'
    );

    if (!user) {
      throw new Error('User not found after update');
    }

    return mapUserToProfile(user);
  } catch (error) {
    console.error('Error adding favorite gym:', error);
    throw error;
  }
};

// Remove a gym from user's favorites
export const removeFavoriteGym = async (userId: string, gymId: string): Promise<UserProfile | null> => {
  try {
    // Remove the gym from user's favorites
    await prismaExec(
      () => prisma.user.update({
        where: { id: userId },
        data: {
          favorites: {
            disconnect: { id: gymId }
          }
        },
      }),
      'Error removing gym from favorites'
    );

    // Get the updated user profile
    const user = await prismaExec(
      () => prisma.user.findUnique({
        where: { id: userId },
        include: { favorites: true }
      }),
      'Error fetching updated user profile'
    );

    if (!user) {
      throw new Error('User not found after update');
    }

    return mapUserToProfile(user);
  } catch (error) {
    console.error('Error removing favorite gym:', error);
    throw error;
  }
}; 