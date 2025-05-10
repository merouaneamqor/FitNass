import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { fetchClassesByLocation } from '@/actions/classActions';
import { Routes } from '@/lib/routes';
import { capitalize } from '@/lib/utils';
import { FitnessClass } from '@/types/fitnessClass';
import ClassCard from '@/components/classes/ClassCard';

interface ClassTypePageProps {
  params: {
    country: string;
    city: string;
    classType: string;
  };
}

export async function generateMetadata(
  { params }: ClassTypePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { country, city, classType } = params;
  const decodedCity = decodeURIComponent(city);
  const decodedCountry = decodeURIComponent(country);
  const decodedClassType = decodeURIComponent(classType);
  
  const formattedClassType = capitalize(decodedClassType);
  
  const title = `${formattedClassType} Classes in ${decodedCity}, ${decodedCountry} | Fitnass`;
  const description = `Find and book ${formattedClassType.toLowerCase()} classes in ${decodedCity}, ${decodedCountry}. Browse schedules, prices, and instructors for all ${formattedClassType.toLowerCase()} fitness classes.`;
  
  // Use the Routes.city.classes URL with a query parameter for type
  const canonicalUrl = `${Routes.city.classes(city)}?type=${encodeURIComponent(classType)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ClassTypePage({ params }: ClassTypePageProps) {
  const { country, city, classType } = params;
  const decodedCity = decodeURIComponent(city);
  const decodedCountry = decodeURIComponent(country);
  const decodedClassType = decodeURIComponent(classType);
  
  const formattedClassType = capitalize(decodedClassType);
  
  let classes: FitnessClass[] = [];
  let error: string | null = null;
  
  try {
    classes = await fetchClassesByLocation({
      city: decodedCity,
      classType: decodedClassType,
    });
  } catch (e) {
    console.error(`Failed to fetch ${decodedClassType} classes in ${decodedCity}:`, e);
    error = `Could not load ${decodedClassType} classes for ${decodedCity}. Please try again later.`;
  }

  // Use the Routes object
  const cityOverviewUrl = Routes.city.overview(city);
  const cityGymsUrl = Routes.city.gyms(city);
  const cityTrainersUrl = Routes.city.trainers(city);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href={cityOverviewUrl} 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
        >
          <FiArrowLeft className="mr-2" /> Back to {decodedCity} Overview
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">{formattedClassType} Classes in {decodedCity}</h1>
        <p className="text-lg text-gray-600">
          Find and book {formattedClassType.toLowerCase()} fitness classes in {decodedCity}, {decodedCountry}.
        </p>
      </div>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((fitnessClass) => (
            <ClassCard key={fitnessClass.id} fitnessClass={fitnessClass} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No {formattedClassType} Classes Found</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            There are currently no {formattedClassType.toLowerCase()} classes available in {decodedCity}.
            Check back soon or explore other fitness options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={cityGymsUrl}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Explore Gyms
            </Link>
            <Link 
              href={cityTrainersUrl}
              className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Find Trainers
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
