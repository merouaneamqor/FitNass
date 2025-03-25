import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/user';

interface UseProfileResult {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updatedProfile: Partial<UserProfile>) => Promise<boolean>;
  addFavoriteGym: (gymId: string) => Promise<boolean>;
  removeFavoriteGym: (gymId: string) => Promise<boolean>;
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

  const addFavoriteGym = async (gymId: string): Promise<boolean> => {
    try {
      // Send request to add favorite gym
      const response = await fetch(`/api/profiles/${userId}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gymId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add favorite gym');
      }
      
      const data = await response.json();
      setProfile(data);
      return true;
    } catch (err) {
      console.error('Error adding favorite gym:', err);
      return false;
    }
  };

  const removeFavoriteGym = async (gymId: string): Promise<boolean> => {
    try {
      // Send request to remove favorite gym
      const response = await fetch(`/api/profiles/${userId}/favorites/${gymId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove favorite gym');
      }
      
      const data = await response.json();
      setProfile(data);
      return true;
    } catch (err) {
      console.error('Error removing favorite gym:', err);
      return false;
    }
  };

  return { 
    profile, 
    loading, 
    error,
    updateProfile,
    addFavoriteGym,
    removeFavoriteGym
  };
}

export default useProfile; 