'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { 
  ProfileHeader, 
  ProfileTabs, 
  ProfileEditForm,
  FavoriteGyms, 
  UserReviews,
  UserBookings,
  UserSubscriptions,
  ProfileSettings
} from '@/components/ui';
import { UserProfile } from '@/types/user';
import { useProfile } from '@/hooks';

interface ProfileClientProps {
  initialProfile: UserProfile;
  isOwnProfile: boolean;
}

export const ProfileClient: React.FC<ProfileClientProps> = ({ 
  initialProfile,
  isOwnProfile
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'favorites';
  const editing = searchParams.get('editing') === 'true';
  
  // Track if the database version of the profile has been loaded
  const [hasLoadedDbProfile, setHasLoadedDbProfile] = useState(false);
  const [clientSideProfile, setClientSideProfile] = useState<UserProfile>(initialProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Use the hook unconditionally
  const { profile: apiProfile, loading, error, updateProfile, /* addFavoriteGym, */ removeFavoriteGym } = useProfile(initialProfile.id);
  
  // Then conditionally use the result
  const profile = isOwnProfile ? apiProfile : null;
  
  // When the API data is loaded, update our state
  useEffect(() => {
    if (isOwnProfile && profile && !loading) {
      setClientSideProfile(profile);
      setHasLoadedDbProfile(true);
    }
  }, [isOwnProfile, profile, loading]);

  // If there's an error from the API, show it
  useEffect(() => {
    if (error) {
      // Only show the error if we don't have fallback data
      // (the initialProfile is our fallback)
      if (hasLoadedDbProfile) {
        setErrorMsg(error);
      } else {
        console.warn('API error, but using fallback data:', error);
      }
    }
  }, [error, hasLoadedDbProfile]);

  // const handleTabChange = (newTab: string) => {
  //   const params = new URLSearchParams(searchParams);
  //   params.set('tab', newTab);
  //   if (params.has('editing')) {
  //     params.delete('editing');
  //   }
  //   router.push(`${pathname}?${params.toString()}`);
  // };

  const handleEditClick = () => {
    router.push(`${pathname}?editing=true`);
  };

  const handleCancelEdit = () => {
    router.push(pathname);
  };

  const handleSaveProfile = async (updatedProfile: Partial<UserProfile>) => {
    if (!isOwnProfile) return false;
    
    setIsLoading(true);
    setErrorMsg(null);
    
    try {
      // Check if we have updateProfile function from the hook
      let success = false;
      
      if (updateProfile) {
        success = await updateProfile(updatedProfile);
      } else {
        // If API is not available in development, simulate success
        if (process.env.NODE_ENV === 'development') {
          success = true;
        }
      }
      
      if (success) {
        // Optimistically update the client-side profile
        setClientSideProfile(prev => ({
          ...prev,
          ...updatedProfile
        }));
        router.push(pathname);
        return true;
      } else {
        // If the API call fails but we're in development mode, still update the UI
        // This allows testing the UI without a working database
        if (process.env.NODE_ENV === 'development') {
          console.warn('API call failed, but updating UI in development mode');
          setClientSideProfile(prev => ({
            ...prev,
            ...updatedProfile
          }));
          router.push(pathname);
          return true;
        }
        
        setErrorMsg('Failed to update profile. Please try again.');
        return false;
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrorMsg('An unexpected error occurred. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (gymId: string) => {
    if (!isOwnProfile) return;
    
    setIsLoading(true);
    
    try {
      // If we have the API function, use it
      if (removeFavoriteGym) {
        await removeFavoriteGym(gymId);
      }
      
      // Always update the UI optimistically
      setClientSideProfile(prev => ({
        ...prev,
        favoriteGyms: prev.favoriteGyms?.filter(id => id !== gymId) || []
      }));
    } catch (err) {
      console.error('Error removing favorite:', err);
      setErrorMsg('Failed to remove favorite. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!isOwnProfile) return;
    
    setIsLoading(true);
    
    try {
      // Would implement API call to delete review
      console.log('Delete review', reviewId);
      
      // Always update the UI optimistically
      setClientSideProfile(prev => ({
        ...prev,
        reviews: prev.reviews?.filter(review => review.id !== reviewId) || []
      }));
    } catch (err) {
      console.error('Error deleting review:', err);
      setErrorMsg('Failed to delete review. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!isOwnProfile) return;
    
    setIsLoading(true);
    
    try {
      // Would implement API call to cancel booking
      console.log('Cancel booking', bookingId);
      
      // Always update the UI optimistically
      setClientSideProfile(prev => ({
        ...prev,
        bookings: prev.bookings?.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' } 
            : booking
        ) || []
      }));
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setErrorMsg('Failed to cancel booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!isOwnProfile) return;
    
    setIsLoading(true);
    
    try {
      // Would implement API call to cancel subscription
      console.log('Cancel subscription', subscriptionId);
      
      // Always update the UI optimistically
      setClientSideProfile(prev => ({
        ...prev,
        subscriptions: prev.subscriptions?.map(subscription => 
          subscription.id === subscriptionId 
            ? { ...subscription, status: 'cancelled' } 
            : subscription
        ) || []
      }));
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setErrorMsg('Failed to cancel subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    language: string;
  }) => {
    if (!isOwnProfile) return false;
    
    setIsLoading(true);
    
    try {
      // Would implement API call to save settings
      console.log('Save settings', settings);
      // Add a simulated delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (err) {
      console.error('Error saving settings:', err);
      setErrorMsg('Failed to save settings. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (!isOwnProfile) return;
    
    // Would implement API call to delete account
    console.log('Delete account');
    // After successful deletion, redirect to home page
    router.push('/');
  };

  const renderContent = () => {
    if (editing && isOwnProfile) {
      return (
        <ProfileEditForm
          profile={clientSideProfile}
          onSave={handleSaveProfile}
          onCancel={handleCancelEdit}
        />
      );
    }

    switch (tab) {
      case 'favorites':
        return (
          <FavoriteGyms
            profile={clientSideProfile}
            onRemoveFavorite={isOwnProfile ? handleRemoveFavorite : undefined}
          />
        );
      case 'reviews':
        return (
          <UserReviews
            profile={clientSideProfile}
            isOwnProfile={isOwnProfile}
            onDeleteReview={isOwnProfile ? handleDeleteReview : undefined}
          />
        );
      case 'bookings':
        if (!isOwnProfile) return null;
        return (
          <UserBookings
            profile={clientSideProfile}
            onCancelBooking={handleCancelBooking}
          />
        );
      case 'subscriptions':
        if (!isOwnProfile) return null;
        return (
          <UserSubscriptions
            profile={clientSideProfile}
            onCancelSubscription={handleCancelSubscription}
          />
        );
      case 'settings':
        if (!isOwnProfile) return null;
        return (
          <ProfileSettings
            onSaveSettings={handleSaveSettings}
            onDeleteAccount={handleDeleteAccount}
          />
        );
      default:
        return (
          <FavoriteGyms
            profile={clientSideProfile}
            onRemoveFavorite={isOwnProfile ? handleRemoveFavorite : undefined}
          />
        );
    }
  };

  // If we're in a loading state from the API, but we already have the initial profile
  // we can use the initial profile while waiting for the fresh data
  const isReallyLoading = loading && !hasLoadedDbProfile;

  if (errorMsg && hasLoadedDbProfile) {
    return (
      <div className="text-rose-600 p-4 bg-rose-50 rounded-xl">
        {errorMsg}
        <button 
          onClick={() => window.location.reload()}
          className="ml-4 underline hover:text-rose-800"
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <>
      {clientSideProfile && (
        <>
          <ProfileHeader 
            profile={clientSideProfile} 
            isOwnProfile={isOwnProfile} 
            onEditClick={handleEditClick} 
            className="mb-8"
          />
          
          <ProfileTabs 
            isOwnProfile={isOwnProfile} 
            className="mb-8"
          />
          
          <div className="mt-8 relative">
            {(isLoading || isReallyLoading) && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                <div className="rounded-full bg-indigo-600 p-3">
                  <div className="w-6 h-6 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
                </div>
              </div>
            )}
            
            {renderContent()}
          </div>
        </>
      )}
    </>
  );
};

export default ProfileClient; 