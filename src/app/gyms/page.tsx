import { fetchGyms } from '@/actions/gymActions';
import { Gym } from '@/types/gym';

// Import from the barrel file
import GymClient from '@/components/gyms';

export default async function GymsPage() {
  // Fetch gyms data directly in the server component
  let gyms: Gym[] = [];
  let error: string | null = null;
  
  try {
    gyms = await fetchGyms();
  } catch (err) {
    console.error('Error fetching gyms:', err);
    error = 'Failed to load gyms. Please try again later.';
  }
  
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