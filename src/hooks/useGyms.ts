import { useState, useEffect } from 'react';
import { Gym } from '@/types/gym';
import { Place } from '@/types/place';
import { fetchGyms } from '@/actions/placeActions';

interface UseGymsResult {
  gyms: Gym[];
  loading: boolean;
  error: string | null;
  uniqueCities: string[];
  allFacilities: string[];
  totalReviews: number;
  filterGyms: (search: string, city: string, rating: number, facilities: string[], priceRanges: string[]) => Gym[];
}

// Convert Place to Gym
const convertPlaceToGym = (place: Place): Gym => ({
  id: place.id,
  name: place.name,
  description: place.description,
  city: place.city,
  address: place.address,
  slug: place.slug,
  citySlug: place.citySlug,
  rating: place.rating,
  priceRange: place.priceRange || '€', // Provide default value if null
  facilities: place.facilities,
  images: place.images,
  latitude: place.latitude,
  longitude: place.longitude,
  _count: place._count
});

export const useGyms = (): UseGymsResult => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGyms() {
      try {
        setLoading(true);
        const placesData = await fetchGyms();
        // Convert Place[] to Gym[]
        const gymData = placesData.map(convertPlaceToGym);
        setGyms(gymData);
      } catch (err) {
        setError('Error loading gyms. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadGyms();
  }, []);

  // Extract all unique cities
  const uniqueCities = [...new Set(gyms.map(gym => gym.city))].sort();
  
  // Extract all unique facilities
  const allFacilities = [...new Set(gyms.flatMap(gym => gym.facilities))].sort();

  // Calculate total reviews
  const totalReviews = gyms.reduce((acc, gym) => acc + (gym._count?.reviews || 0), 0);

  // Filter function
  const filterGyms = (
    search: string, 
    city: string, 
    rating: number, 
    facilities: string[], 
    priceRanges: string[]
  ): Gym[] => {
    return gyms.filter((gym) => {
      // Basic search filter
      const matchesSearch = search ? (
        gym.name.toLowerCase().includes(search.toLowerCase()) ||
        gym.city.toLowerCase().includes(search.toLowerCase()) ||
        gym.description.toLowerCase().includes(search.toLowerCase())
      ) : true;
      
      // Additional filters
      const matchesCity = city ? gym.city.toLowerCase() === city.toLowerCase() : true;
      const matchesRating = gym.rating >= rating;
      const matchesFacilities = facilities.length > 0 
        ? facilities.every(f => gym.facilities.some(gf => gf.toLowerCase().includes(f.toLowerCase())))
        : true;
      const matchesPrice = priceRanges.length > 0 
        ? priceRanges.includes(gym.priceRange)
        : true;

      return matchesSearch && matchesCity && matchesRating && matchesFacilities && matchesPrice;
    });
  };

  return {
    gyms,
    loading,
    error,
    uniqueCities,
    allFacilities,
    totalReviews,
    filterGyms
  };
};

export default useGyms; 