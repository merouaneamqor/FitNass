'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import bcrypt from 'bcryptjs'; // Make sure bcryptjs is installed: npm install bcryptjs @types/bcryptjs
import prisma from '@/lib/db';
import { authOptions } from '@/lib/auth';

// --- Validation Schemas ---

const profileUpdateSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').max(100),
  // email: z.string().email('Invalid email address'), // Usually email change requires verification, handle separately if needed
  city: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  phoneNumber: z.string().max(20).optional(), // Basic validation
});

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
}).refine(data => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from the current password.',
  path: ['newPassword'], // Attach error to newPassword field
});

// --- Server Actions ---

interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export async function updateProfile(
  prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Authentication required.' };
  }

  const rawData = Object.fromEntries(formData.entries());
  const result = profileUpdateSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: result.data.name,
        city: result.data.city,
        bio: result.data.bio,
        phoneNumber: result.data.phoneNumber,
        // Do NOT update email here without a verification flow
      },
    });

    revalidatePath('/profile/me'); // Revalidate to show updated data
    return { success: true, message: 'Profile updated successfully.' };

  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: 'Failed to update profile. Please try again.' };
  }
}

export async function changePassword(
  prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Authentication required.' };
  }

  const rawData = Object.fromEntries(formData.entries());
  const result = passwordChangeSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user?.password) {
      // User might have signed up via OAuth, cannot change password this way
      return { success: false, message: 'Cannot change password. Account may use social login.' };
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      result.data.currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return {
        success: false,
        message: 'Incorrect current password.',
        errors: { currentPassword: ['Incorrect current password.'] }
      };
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(result.data.newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword },
    });

    return { success: true, message: 'Password changed successfully.' };

  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, message: 'Failed to change password. Please try again.' };
  }
} 