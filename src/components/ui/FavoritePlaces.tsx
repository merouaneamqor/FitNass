import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/user';
import { Place } from '@/types/place';
import PlaceCard from '@/components/places/PlaceCard';
import { FiHeart, FiLoader } from 'react-icons/fi';
import Link from 'next/link';

interface FavoritePlacesProps {
  profile: UserProfile;
  onRemoveFavorite?: (placeId: string) => Promise<void>;
  className?: string;
}

export const FavoritePlaces: React.FC<FavoritePlacesProps> = ({
  profile,
  onRemoveFavorite,
  className = "",
}) => {
  const [favoritePlaces, setFavoritePlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoritePlaces = async () => {
      if (!profile.favoritePlaces || profile.favoritePlaces.length === 0) {
        setFavoritePlaces([]);
        setLoading(false);
        return;
      }

      try {
        // In a real application, this would be an API call to fetch places by IDs
        // For this demo, we'll simulate it with mock data
        const mockPlaces: Place[] = [
          {
            id: '101',
            name: 'Fitness Zone',
            description: 'Modern fitness center with top equipment and personal trainers.',
            address: '123 Mohammed V Blvd',
            city: 'Casablanca',
            state: 'Casablanca-Settat',
            zipCode: '20000',
            latitude: 33.5731,
            longitude: -7.5898,
            phone: '+212 522 123456',
            website: 'https://fitnesszone.ma',
            email: 'contact@fitnesszone.ma',
            rating: 4.7,
            priceRange: '€€€',
            facilities: ['pool', 'sauna', 'parking', 'wifi', 'classes'],
            images: ['https://images.unsplash.com/photo-1570829460005-c840387bb1ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
            openingHours: null,
            type: 'GYM',
            slug: 'fitness-zone',
            citySlug: 'casablanca',
            isVerified: true,
            status: 'ACTIVE',
            viewCount: 1000,
            _count: {
              reviews: 150
            }
          },
          {
            id: '102',
            name: 'PowerLift Club',
            description: 'Specialized in weightlifting and strength training.',
            address: '45 Hassan II Street',
            city: 'Rabat',
            state: 'Rabat-Salé-Kénitra',
            zipCode: '10000',
            latitude: 34.0209,
            longitude: -6.8416,
            phone: '+212 537 123456',
            website: 'https://powerliftclub.ma',
            email: 'contact@powerliftclub.ma',
            rating: 4.5,
            priceRange: '€€',
            facilities: ['parking', 'wifi', 'classes', 'personal-training'],
            images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
            openingHours: null,
            type: 'GYM',
            slug: 'powerlift-club',
            citySlug: 'rabat',
            isVerified: true,
            status: 'ACTIVE',
            viewCount: 800,
            _count: {
              reviews: 120
            }
          }
        ];

        // Filter mock places to match the profile's favorite place IDs
        const filteredPlaces = mockPlaces.filter(place => 
          profile.favoritePlaces?.some(fav => fav.id === place.id) || false
        );

        setFavoritePlaces(filteredPlaces);
      } catch (err) {
        console.error('Error fetching favorite places:', err);
        setError('Failed to load favorite places');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritePlaces();
  }, [profile.favoritePlaces]);

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

  if (favoritePlaces.length === 0) {
    return (
      <div className={`bg-white border border-neutral-200 rounded-xl p-6 text-center ${className}`}>
        <FiHeart className="mx-auto text-neutral-300 h-12 w-12 mb-4" />
        <h3 className="text-lg font-medium text-neutral-700">No Favorite Places</h3>
        <p className="text-neutral-500 mt-2">
          When you find places you like, you can add them to your favorites for quick access.
        </p>
        <Link 
          href="/places" 
          className="inline-block mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors"
        >
          Explore Places
        </Link>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoritePlaces.map((place: Place) => (
          <div key={place.id} className="relative">
            <PlaceCard place={place} />
            
            {onRemoveFavorite && (
              <button
                onClick={() => onRemoveFavorite(place.id)}
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

export default FavoritePlaces; 