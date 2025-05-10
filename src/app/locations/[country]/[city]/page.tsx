import React from 'react';
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';
import { Routes } from '@/lib/routes';
import { fetchCityOverviewData } from '@/actions/locationActions';
import { capitalize } from '@/lib/utils';
import GymCard from '@/components/gyms/GymCard';
import TrainerCard from '@/components/trainers/TrainerCard';

interface CityOverviewPageProps {
  params: {
    country: string;
    city: string;
  };
}

export async function generateMetadata(
  { params }: CityOverviewPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const city = decodeURIComponent(params.city);
  const country = decodeURIComponent(params.country);

  const title = `Fitness in ${city}, ${country}: Gyms, Trainers, Classes | Fitnass`;
  const description = `Explore and find gyms, personal trainers, and fitness classes available in ${city}, ${country} on Fitnass. Your guide to local fitness options.`;
  const canonicalUrl = Routes.city.overview(params.city);

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function CityOverviewPage({ params }: CityOverviewPageProps) {
  const { country, city } = params;
  const decodedCity = decodeURIComponent(city);
  const decodedCountry = decodeURIComponent(country);

  let overviewData;
  let error: string | null = null;

  try {
    overviewData = await fetchCityOverviewData(decodedCity);
  } catch (e) {
     console.error("Failed to fetch city overview data:", e);
     error = `Could not load overview data for ${decodedCity}. Please try again later.`;
     overviewData = {
       featuredGyms: [],
       featuredTrainers: [],
       availableClassTypes: [],
     };
  }

  const { featuredGyms, featuredTrainers, availableClassTypes } = overviewData;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Fitness Options in {decodedCity}, {decodedCountry}</h1>
      <p className="text-lg text-gray-600 mb-6">Explore gyms, trainers, and classes available in {decodedCity}.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href={Routes.city.gyms(city)} 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200/60">
          <h2 className="text-xl font-semibold mb-2">Gyms</h2>
          <p className="text-gray-600">Find fitness centers and gyms.</p>
        </Link>

        <Link href={Routes.city.trainers(city)}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200/60">
          <h2 className="text-xl font-semibold mb-2">Trainers</h2>
          <p className="text-gray-600">Discover personal trainers.</p>
        </Link>

        <div className="p-6 bg-white rounded-lg shadow border border-gray-200/60">
            <h2 className="text-xl font-semibold mb-2">Classes</h2>
            <ul className="space-y-1">
                {availableClassTypes.map(classType => (
                    <li key={classType}>
                       <Link href={`${Routes.city.classes(city)}?type=${classType}`}
                             className="text-blue-600 hover:underline capitalize">
                           {capitalize(classType)} Classes
                       </Link>
                    </li>
                ))}
                 {availableClassTypes.length === 0 && !error && 
                    <p className="text-gray-500 text-sm">No specific classes listed yet. Explore all gyms and trainers!</p>
                 }
                 {error && <p className="text-red-500 text-sm">Could not load class types.</p>}
            </ul>
        </div>
      </div>

      {featuredGyms.length > 0 && (
        <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Featured Gyms in {decodedCity}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredGyms.map(gym => (
                  <GymCard key={gym.id} gym={gym} />
              ))}
            </div>
        </div>
      )}

      {featuredTrainers.length > 0 && (
        <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Featured Trainers in {decodedCity}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTrainers.map(trainer => (
                   <TrainerCard key={trainer.id} trainer={trainer} />
                ))}
            </div>
        </div>
      )}

      {featuredGyms.length === 0 && featuredTrainers.length === 0 && !error && (
         <div className="mt-12 text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No featured gyms or trainers available in {decodedCity} yet.</p>
            <p className="text-gray-500 text-sm mt-1">Check back soon or explore the main lists!</p>
         </div>
      )}

       {error && featuredGyms.length === 0 && featuredTrainers.length === 0 && (
         <div className="mt-12 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error loading featured content: </strong>
            <span className="block sm:inline">{error}</span>
         </div>
       )}

    </div>
  );
} 