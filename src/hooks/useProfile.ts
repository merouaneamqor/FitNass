import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/user';

interface UseProfileResult {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updatedProfile: Partial<UserProfile>) => Promise<boolean>;
  addFavoritePlace: (placeId: string) => Promise<boolean>;
  removeFavoritePlace: (placeId: string) => Promise<boolean>;
}

export function useProfile(userId: string): UseProfileResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      
      setLoading(true);
      setError(null);

      try {
        // Fetch profile data from API
        const response = await fetch(`/api/profiles/${userId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch profile (${response.status})`);
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      fetchProfile();
    }
  }, [userId]);

  const updateProfile = async (updatedProfile: Partial<UserProfile>): Promise<boolean> => {
    try {
      // Send update request to API
      const response = await fetch(`/api/profiles/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const data = await response.json();
      setProfile(data);
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      return false;
    }
  };

  const addFavoritePlace = async (placeId: string): Promise<boolean> => {
    try {
      // Send update request to API
      const response = await fetch(`/api/profiles/${userId}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ placeId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add favorite place');
      }
      
      const data = await response.json();
      setProfile(data);
      return true;
    } catch (err) {
      console.error('Error adding favorite place:', err);
      return false;
    }
  };

  const removeFavoritePlace = async (placeId: string): Promise<boolean> => {
    try {
      // Send update request to API
      const response = await fetch(`/api/profiles/${userId}/favorites/${placeId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove favorite place');
      }
      
      const data = await response.json();
      setProfile(data);
      return true;
    } catch (err) {
      console.error('Error removing favorite place:', err);
      return false;
    }
  };

  return { 
    profile, 
    loading, 
    error,
    updateProfile,
    addFavoritePlace,
    removeFavoritePlace
  };
}

export default useProfile; 