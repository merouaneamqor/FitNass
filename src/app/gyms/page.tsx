import { fetchGyms } from '@/actions/gymActions';
import { Place } from '@/types/place';
import { Gym } from '@/types/gym';

// Import from the barrel file
import GymClient from '@/components/gyms';

export default async function GymsPage() {
  // Fetch gyms data directly in the server component
  let places: Place[] = [];
  let error: string | null = null;
  
  try {
    places = await fetchGyms();
  } catch (err) {
    console.error('Error fetching gyms:', err);
    error = 'Failed to load gyms. Please try again later.';
  }
  
  // Convert Place[] to Gym[] to match the GymClient props type
  const gyms: Gym[] = places.map(place => ({
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
  }));
  
  // Calculate derived data on the server
  const uniqueCities = [...new Set(gyms.map(gym => gym.city))].sort();
  const allFacilities = [...new Set(gyms.flatMap(gym => gym.facilities))].sort();
  const totalReviews = gyms.reduce((acc, gym) => acc + (gym._count?.reviews || 0), 0);

  return (
    <GymClient 
      initialGyms={gyms}
      uniqueCities={uniqueCities}
      allFacilities={allFacilities}
      totalReviews={totalReviews}
      initialError={error}
    />
  );
} 