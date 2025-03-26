'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileEditForm, HeaderSection, LoadingSpinner, ErrorAlert } from '@/components/ui';
import { useProfile } from '@/hooks';
import { UserProfile } from '@/types/user';
import { FiArrowLeft } from 'react-icons/fi';

export default function EditProfilePage() {
  const router = useRouter();
  const { profile, loading, error, updateProfile } = useProfile('me'); // 'me' represents the current user
  const [submitError, setSubmitError] = useState<string | null>(null);

  // If the user isn't logged in, redirect to login
  useEffect(() => {
    if (!loading && !profile && !error) {
      router.push('/login?redirect=/profile/edit');
    }
  }, [loading, profile, error, router]);

  const handleSaveProfile = async (updatedProfile: Partial<UserProfile>) => {
    setSubmitError(null);
    
    try {
      const success = await updateProfile(updatedProfile);
      
      if (success) {
        router.push('/profile/me');
        return true;
      } else {
        setSubmitError('Failed to update profile. Please try again.');
        return false;
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setSubmitError('An unexpected error occurred. Please try again.');
      return false;
    }
  };

  const handleCancel = () => {
    router.push('/profile/me');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <LoadingSpinner className="mt-16" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <ErrorAlert 
          message="There was a problem loading your profile. Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <HeaderSection
        title="Edit Your Profile"
      />

      <div className="mt-8 max-w-4xl mx-auto">
        <button
          onClick={handleCancel}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to Profile
        </button>
        
        {submitError && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
            {submitError}
          </div>
        )}
        
        <ProfileEditForm
          profile={profile}
          onSave={handleSaveProfile}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
} 