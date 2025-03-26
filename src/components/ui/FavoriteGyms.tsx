import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/user';
import { Gym } from '@/types/gym';
import GymCard from './GymCard';
import { FiHeart, FiLoader } from 'react-icons/fi';
import Link from 'next/link';

interface FavoriteGymsProps {
  profile: UserProfile;
  onRemoveFavorite?: (gymId: string) => Promise<void>;
  className?: string;
}

export const FavoriteGyms: React.FC<FavoriteGymsProps> = ({
  profile,
  onRemoveFavorite,
  className = "",
}) => {
  const [favoriteGyms, setFavoriteGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoriteGyms = async () => {
      if (!profile.favoriteGyms || profile.favoriteGyms.length === 0) {
        setFavoriteGyms([]);
        setLoading(false);
        return;
      }

      try {
        // In a real application, this would be an API call to fetch gyms by IDs
        // For this demo, we'll simulate it with mock data
        const mockGyms: Gym[] = [
          {
            id: '101',
            name: 'Fitness Zone',
            address: '123 Mohammed V Blvd',
            city: 'Casablanca',
            description: 'Modern fitness center with top equipment and personal trainers.',
            rating: 4.7,
            priceRange: '3',
            facilities: ['pool', 'sauna', 'parking', 'wifi', 'classes'],
            latitude: 33.5731,
            longitude: -7.5898,
            images: ['https://images.unsplash.com/photo-1570829460005-c840387bb1ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
          },
          {
            id: '102',
            name: 'PowerLift Club',
            address: '45 Hassan II Street',
            city: 'Rabat',
            description: 'Specialized in weightlifting and strength training.',
            rating: 4.5,
            priceRange: '2',
            facilities: ['parking', 'wifi', 'classes', 'personal-training'],
            latitude: 34.0209,
            longitude: -6.8416,
            images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
          }
        ];

        // Filter mock gyms to match the profile's favorite gym IDs
        const filteredGyms = mockGyms.filter(gym => 
          profile.favoriteGyms?.includes(gym.id) || false
        );

        setFavoriteGyms(filteredGyms);
      } catch (err) {
        console.error('Error fetching favorite gyms:', err);
        setError('Failed to load favorite gyms');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteGyms();
  }, [profile.favoriteGyms]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-rose-50 border border-rose-200 rounded-xl p-6 text-center ${className}`}>
        <p className="text-rose-700">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (favoriteGyms.length === 0) {
    return (
      <div className={`bg-white border border-neutral-200 rounded-xl p-6 text-center ${className}`}>
        <FiHeart className="mx-auto text-neutral-300 h-12 w-12 mb-4" />
        <h3 className="text-lg font-medium text-neutral-700">No Favorite Gyms</h3>
        <p className="text-neutral-500 mt-2">
          When you find gyms you like, you can add them to your favorites for quick access.
        </p>
        <Link 
          href="/gyms" 
          className="inline-block mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors"
        >
          Explore Gyms
        </Link>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteGyms.map((gym: Gym) => (
          <div key={gym.id} className="relative">
            <GymCard gym={gym} />
            
            {onRemoveFavorite && (
              <button
                onClick={() => onRemoveFavorite(gym.id)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-rose-50 transition-colors"
                aria-label="Remove from favorites"
              >
                <FiHeart className="text-rose-500 h-5 w-5" fill="currentColor" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteGyms; 