'use client';

import { useState, useEffect } from 'react';
// Import icons individually instead of using the FI namespace
import { FiMapPin, FiStar, FiPhone, FiGlobe, FiMail, FiLoader } from 'react-icons/fi';
import Image from 'next/image';

// Gym data interface
interface Gym {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  website?: string;
  email?: string;
  rating: number;
  priceRange: string;
  facilities: string[];
  images: string[];
  owner?: {
    name: string;
  };
  reviews?: {
    id?: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
      name: string;
      image?: string;
    };
  }[];
  _count?: {
    reviews: number;
  };
}

export default function GymDetailsPage({ params }: { params: { id: string } }) {
  const [gym, setGym] = useState<Gym | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGymData() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/gyms/${params.id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch gym data: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Ensure all required properties have default values if missing
        const safeData = {
          ...data,
          facilities: data.facilities || [],
          images: data.images || [],
          reviews: data.reviews || [],
          _count: data._count || { reviews: 0 }
        };
        
        setGym(safeData);
      } catch (err) {
        console.error('Error fetching gym:', err);
        setError('Failed to load gym details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchGymData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <FiLoader className="w-12 h-12 animate-spin text-blue-500" />
          <p className="mt-4 text-gray-600">Loading gym details...</p>
        </div>
      </div>
    );
  }

  if (error || !gym) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-600">{error || 'Gym not found'}</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Use a default image if none are available
  const defaultImage = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  const mainImage = gym.images && gym.images.length > 0 ? gym.images[selectedImage] : defaultImage;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gym Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-96 w-full">
            <Image
              src={gym.images[0]}
              alt={gym.name}
              fill
              className="object-cover rounded-xl"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <h1 className="text-3xl font-bold text-white">{gym.name}</h1>
              <div className="flex items-center text-white mt-2">
                <FiMapPin className="h-5 w-5 mr-1" />
                <span>{gym.city}, {gym.state}</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center">
              <FiStar className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-gray-600">
                {typeof gym.rating === 'number' ? gym.rating.toFixed(1) : '0.0'} 
                ({gym._count?.reviews || 0} reviews)
              </span>
            </div>
            <p className="mt-4 text-gray-600">{gym.description}</p>
          </div>
        </div>

        {/* Gym Details */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {gym.images && gym.images.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Gallery</h2>
                <div className="grid grid-cols-3 gap-4">
                  {gym.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-32 rounded-lg overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${gym.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Facilities */}
            {gym.facilities && gym.facilities.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Facilities</h2>
                <div className="flex flex-wrap gap-2">
                  {gym.facilities.map((facility, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              {gym.reviews && gym.reviews.length > 0 ? (
                <div className="space-y-6">
                  {gym.reviews.map((review, index) => (
                    <div key={review.id || index} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`h-5 w-5 ${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-gray-600">{review.user?.name || 'Anonymous'}</span>
                        </div>
                        <span className="text-gray-500">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Unknown date'}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet for this gym.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="h-5 w-5 mr-2" />
                  <span>{gym.address}, {gym.city}, {gym.state} {gym.zipCode}</span>
                </div>
                {gym.phone && (
                  <div className="flex items-center text-gray-600">
                    <FiPhone className="h-5 w-5 mr-2" />
                    <span>{gym.phone}</span>
                  </div>
                )}
                {gym.website && (
                  <div className="flex items-center text-gray-600">
                    <FiGlobe className="h-5 w-5 mr-2" />
                    <a href={gym.website.startsWith('http') ? gym.website : `https://${gym.website}`} 
                       className="text-blue-600 hover:underline" 
                       target="_blank" 
                       rel="noopener noreferrer">
                      {gym.website}
                    </a>
                  </div>
                )}
                {gym.email && (
                  <div className="flex items-center text-gray-600">
                    <FiMail className="h-5 w-5 mr-2" />
                    <a href={`mailto:${gym.email}`} className="text-blue-600 hover:underline">
                      {gym.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Price Range</h2>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-800">{gym.priceRange}</span>
                <span className="ml-2 text-gray-600">
                  {gym.priceRange === '$' && 'Budget-friendly'}
                  {gym.priceRange === '$$' && 'Mid-range'}
                  {gym.priceRange === '$$$' && 'Premium'}
                  {gym.priceRange === '$$$$' && 'Luxury'}
                </span>
              </div>
            </div>

            {/* Owner Information */}
            {gym.owner && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Managed By</h2>
                <p className="text-gray-600">{gym.owner.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 