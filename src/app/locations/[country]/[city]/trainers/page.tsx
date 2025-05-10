import React from 'react';
import { fetchTrainersByLocation } from '@/actions/trainerActions';
import { Trainer } from '@/types/trainer';
import { Metadata, ResolvingMetadata } from 'next';
import { Routes } from '@/lib/routes';
import TrainerCard from '@/components/trainers/TrainerCard';
import Script from 'next/script'; // For potential JSON-LD

interface CityTrainersPageProps {
  params: {
    country: string;
    city: string;
  };
}

// --- generateMetadata Function ---
export async function generateMetadata(
  { params }: CityTrainersPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const city = decodeURIComponent(params.city);
  const country = decodeURIComponent(params.country);
  const title = `Personal Trainers in ${city}, ${country} | Fitnass`;
  const description = `Find certified personal trainers in ${city}, ${country}. Browse profiles, specialties, and ratings on Fitnass.`;
  const canonicalUrl = Routes.city.trainers(params.city);

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

// --- Page Component ---
export default async function CityTrainersPage({ params }: CityTrainersPageProps) {
  const city = decodeURIComponent(params.city);
  const country = decodeURIComponent(params.country);

  let trainers: Trainer[] = [];
  let error: string | null = null;

  try {
    trainers = await fetchTrainersByLocation(city);
  } catch (e) {
    console.error("Failed to fetch trainers:", e);
    error = `Could not load trainers for ${city}. Please try again later.`;
  }

  // --- JSON-LD Schema (Optional - Basic Example) ---
  // TODO: Refine schema based on available data and type (e.g., Person or Service)
  const generateTrainerSchema = (trainerList: Trainer[], url: string) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'url': url,
      'numberOfItems': trainerList.length,
      'itemListElement': trainerList.map((trainer, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'Person', // Or potentially 'Service' if focusing on the training service
          'name': trainer.name,
          'description': trainer.bio || '',
          'url': `${process.env.NEXT_PUBLIC_BASE_URL || ''}${Routes.trainers.detail(trainer.id)}`,
          'image': trainer.images && trainer.images.length > 0 ? trainer.images[0] : undefined,
          'jobTitle': 'Personal Trainer',
          'knowsAbout': trainer.specialties, // Use specialties
          // Add address/location if directly available on trainer model or assumed from city page
          /* 'address': {
            '@type': 'PostalAddress',
            'addressLocality': trainer.city || city, 
          },*/
          // Add aggregateRating if available
          /* 'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': trainer.rating,
            // 'reviewCount': trainer._count?.reviews 
          }, */
        }
      }))
    };
  };
  const jsonLdSchema = trainers.length > 0 ? generateTrainerSchema(trainers, `${process.env.NEXT_PUBLIC_BASE_URL || ''}${Routes.city.trainers(params.city)}`) : null;


  return (
    <>
      {/* Add JSON-LD Script Tag */}
      {jsonLdSchema && (
        <Script 
          id="trainer-list-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Trainers in {city}, {country}</h1>
        <p className="text-lg text-gray-600 mb-6">Find the right personal trainer for your fitness goals.</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {!error && trainers.length === 0 && (
          <p>No trainers found for {city}. Check back later or try a different location.</p>
        )}

        {!error && trainers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </div>
        )}
      </div>
    </>
  );
} 