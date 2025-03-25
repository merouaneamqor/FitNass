import { useState, useEffect } from 'react';
import { Gym } from '@/types/gym';

interface UseGymsResult {
  gyms: Gym[];
  loading: boolean;
  error: string | null;
  uniqueCities: string[];
  allFacilities: string[];
  totalReviews: number;
  filterGyms: (search: string, city: string, rating: number, facilities: string[], priceRanges: string[]) => Gym[];
}

export const useGyms = (): UseGymsResult => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGyms() {
      try {
        setLoading(true);
        const response = await fetch('/api/gyms');
        if (!response.ok) {
          throw new Error('Failed to fetch gyms');
        }
        const data = await response.json();
        setGyms(data);
      } catch (err) {
        setError('Error loading gyms. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchGyms();
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