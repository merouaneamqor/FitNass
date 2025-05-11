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
const mapUserToProfile = async (user: Prisma.UserGetPayload<{ include: { favoritePlaces: true } }>): Promise<UserProfile> => {
  try {
    // Get user's reviews (optimized to fetch minimal data)
    const reviews = await prisma.review.findMany({
      where: { userId: user.id },
      include: {
        place: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Map the full user data to our UserProfile format
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
      favoritePlaces: user.favoritePlaces.map(place => ({
        id: place.id,
        type: place.type,
      })),
      reviews: reviews.map(review => ({
        id: review.id,
        placeId: review.placeId || '',
        placeName: review.place?.name || 'Unknown',
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt.toISOString(),
      })),
      // For now, we're returning empty arrays for subscriptions and bookings
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
      favoritePlaces: [],
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
        include: { favoritePlaces: true }
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
        include: { favoritePlaces: true }
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
        include: { favoritePlaces: true }
      }),
      'Error updating user profile'
    );

    return mapUserToProfile(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Add a place to user's favorites
export const addFavoritePlace = async (userId: string, placeId: string): Promise<UserProfile | null> => {
  try {
    // First check if the place exists
    const place = await prismaExec(
      () => prisma.place.findUnique({
        where: { id: placeId }
      }),
      'Error finding place'
    );

    if (!place) {
      throw new Error('Place not found');
    }

    // Add the place to user's favorites
    await prismaExec(
      () => prisma.user.update({
        where: { id: userId },
        data: {
          favoritePlaces: {
            connect: { id: placeId }
          }
        },
      }),
      'Error adding place to favorites'
    );

    // Get the updated user profile
    const user = await prismaExec(
      () => prisma.user.findUnique({
        where: { id: userId },
        include: { favoritePlaces: true }
      }),
      'Error fetching updated user profile'
    );

    if (!user) {
      throw new Error('User not found after update');
    }

    return mapUserToProfile(user);
  } catch (error) {
    console.error('Error adding favorite place:', error);
    throw error;
  }
};

// Remove a place from user's favorites
export const removeFavoritePlace = async (userId: string, placeId: string): Promise<UserProfile | null> => {
  try {
    // Remove the place from user's favorites
    await prismaExec(
      () => prisma.user.update({
        where: { id: userId },
        data: {
          favoritePlaces: {
            disconnect: { id: placeId }
          }
        },
      }),
      'Error removing place from favorites'
    );

    // Get the updated user profile
    const user = await prismaExec(
      () => prisma.user.findUnique({
        where: { id: userId },
        include: { favoritePlaces: true }
      }),
      'Error fetching updated user profile'
    );

    if (!user) {
      throw new Error('User not found after update');
    }

    return mapUserToProfile(user);
  } catch (error) {
    console.error('Error removing favorite place:', error);
    throw error;
  }
};

// Maintain backwards compatibility with old functions
export const addFavoriteGym = async (userId: string, gymId: string): Promise<UserProfile | null> => {
  return addFavoritePlace(userId, gymId);
};

export const removeFavoriteGym = async (userId: string, gymId: string): Promise<UserProfile | null> => {
  return removeFavoritePlace(userId, gymId);
}; 