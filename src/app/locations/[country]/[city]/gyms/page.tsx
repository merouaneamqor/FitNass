import React from 'react';
import { fetchGymsByLocation } from '@/actions/placeActions'; // Import from placeActions instead
import { Gym } from '@/types/gym'; // Import the Gym type
import { Place } from '@/types/place'; // Import the Place type
import { Metadata, ResolvingMetadata } from 'next'; // Import Metadata types
import Link from 'next/link'; // Import Link for navigation
import { Routes } from '@/lib/routes'; // Import the route helper
import GymCard from '@/components/gyms/GymCard'; // Import the new GymCard component
import Script from 'next/script'; // Import Script component for JSON-LD

// Define props including params
interface CityGymsPageProps {
  params: {
    country: string;
    city: string;
  };
}

// --- generateMetadata Function ---
// Dynamically generate metadata based on city and country
export async function generateMetadata(
  { params }: CityGymsPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Decode URI components for display
  const city = decodeURIComponent(params.city);
  const country = decodeURIComponent(params.country);

  // TODO: Fetch data if needed for metadata (e.g., count of gyms)
  // const gyms = await fetchGymsByLocation(city);
  // const gymCount = gyms.length;

  const title = `Gyms in ${city}, ${country} | Fitnass`;
  const description = `Find the best gyms and fitness centers in ${city}, ${country}. Browse listings, ratings, and facilities on Fitnass.`;

  // Optionally merge with parent metadata
  // const previousImages = (await parent).openGraph?.images || [];

  const canonicalUrl = Routes.city.gyms(params.city);

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      // images: ['/some-specific-page-image.jpg', ...previousImages], // Add specific image later
      url: canonicalUrl, // Use generated URL
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      // images: ['/some-specific-page-image.jpg'], // Add specific image later
    },
    alternates: {
      canonical: canonicalUrl, // Use generated URL
    },
  };
}

// --- Page Component ---
// Make the component async to fetch data
export default async function CityGymsPage({ params }: CityGymsPageProps) {
  const city = decodeURIComponent(params.city); // Decode for fetching/display
  const country = decodeURIComponent(params.country); // Decode for display

  let places: Place[] = [];
  let error: string | null = null;

  try {
    places = await fetchGymsByLocation(country, city);
    
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

    // --- JSON-LD Schema Generation ---
    // Function to generate LocalBusiness schema for the page (list of gyms)
    const generateLocalBusinessSchema = (gymList: Gym[], url: string) => {
      return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'url': url, // URL of this specific page
        'numberOfItems': gymList.length,
        'itemListElement': gymList.map((gym, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            // Using SportsActivityLocation is more specific than LocalBusiness
            '@type': 'SportsActivityLocation',
            'name': gym.name,
            'description': gym.description || '',
            'url': `${process.env.NEXT_PUBLIC_BASE_URL || ''}${Routes.gyms.detail(gym.id)}`, // Absolute URL to the gym detail page
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': gym.address,
              'addressLocality': gym.city,
              // Add addressRegion (state) and postalCode if available and relevant
              // 'addressRegion': gym.state,
              // 'postalCode': gym.zipCode,
            },
            'geo': {
              '@type': 'GeoCoordinates',
              'latitude': gym.latitude,
              'longitude': gym.longitude,
            },
            'image': gym.images && gym.images.length > 0 ? gym.images[0] : undefined,
            // Add aggregateRating if you have review data aggregated
            /* 'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': gym.rating,
              'reviewCount': gym._count?.reviews
            }, */
            // Add openingHoursSpecification if available
            // 'openingHoursSpecification': [], 
            // Add telephone if available
            // 'telephone': gym.phone,
          }
        }))
      };
    };

    const jsonLdSchema = gyms.length > 0 ? generateLocalBusinessSchema(gyms, `${process.env.NEXT_PUBLIC_BASE_URL || ''}${Routes.city.gyms(params.city)}`) : null;

    return (
      <>
        {/* Add JSON-LD Script Tag */}
        {jsonLdSchema && (
          <Script 
            id="gym-list-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
          />
        )}

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Gyms in {city}, {country}</h1>
          <p className="text-lg text-gray-600 mb-6">Discover fitness centers near you.</p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {!error && gyms.length === 0 && (
            <p>No gyms found for {city}. Check back later or try a different location.</p>
          )}

          {!error && gyms.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gyms.map((gym) => (
                // Use the GymCard component
                <GymCard key={gym.id} gym={gym} />
              ))}
            </div>
          )}
        </div>
      </>
    );
  } catch (e) {
    console.error("Failed to fetch gyms:", e);
    error = `Could not load gyms for ${city}. Please try again later.`;
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Gyms in {city}, {country}</h1>
        <p className="text-lg text-gray-600 mb-6">Discover fitness centers near you.</p>
        
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }
} 