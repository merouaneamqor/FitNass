'use client';

import { useState } from 'react';
import { FiMapPin, FiStar, FiPhone, FiGlobe, FiMail, FiClock } from 'react-icons/fi';

// Mock data for demonstration
const mockGym = {
  id: 1,
  name: 'FitLife Gym',
  description: 'State-of-the-art equipment and personal trainers',
  location: 'Downtown, City',
  address: '123 Fitness Street, City, State 12345',
  phone: '(555) 123-4567',
  website: 'www.fitlifegym.com',
  email: 'info@fitlifegym.com',
  rating: 4.8,
  reviewCount: 120,
  priceRange: '$$',
  facilities: ['Cardio', 'Weights', 'Classes', 'Pool', 'Spa', 'Personal Training'],
  images: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  ],
  hours: {
    monday: '6:00 AM - 10:00 PM',
    tuesday: '6:00 AM - 10:00 PM',
    wednesday: '6:00 AM - 10:00 PM',
    thursday: '6:00 AM - 10:00 PM',
    friday: '6:00 AM - 10:00 PM',
    saturday: '8:00 AM - 8:00 PM',
    sunday: '8:00 AM - 8:00 PM',
  },
  reviews: [
    {
      id: 1,
      user: 'John Doe',
      rating: 5,
      comment: 'Great gym with excellent equipment and friendly staff!',
      date: '2024-03-15',
    },
    {
      id: 2,
      user: 'Jane Smith',
      rating: 4,
      comment: 'Good facilities but can get crowded during peak hours.',
      date: '2024-03-10',
    },
    {
      id: 3,
      user: 'Mike Johnson',
      rating: 5,
      comment: 'Best gym in the area. Clean and well-maintained.',
      date: '2024-03-05',
    },
  ],
};

export default function GymDetailsPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gym Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-96">
            <img
              src={mockGym.images[selectedImage]}
              alt={mockGym.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <h1 className="text-3xl font-bold text-white">{mockGym.name}</h1>
              <div className="flex items-center text-white mt-2">
                <FiMapPin className="h-5 w-5 mr-1" />
                <span>{mockGym.location}</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center">
              <FiStar className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-gray-600">{mockGym.rating} ({mockGym.reviewCount} reviews)</span>
            </div>
            <p className="mt-4 text-gray-600">{mockGym.description}</p>
          </div>
        </div>

        {/* Gym Details */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Gallery</h2>
              <div className="grid grid-cols-3 gap-4">
                {mockGym.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-32 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${mockGym.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Facilities</h2>
              <div className="flex flex-wrap gap-2">
                {mockGym.facilities.map((facility) => (
                  <span
                    key={facility}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              <div className="space-y-6">
                {mockGym.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6">
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
                        <span className="ml-2 text-gray-600">{review.user}</span>
                      </div>
                      <span className="text-gray-500">{review.date}</span>
                    </div>
                    <p className="mt-2 text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="h-5 w-5 mr-2" />
                  <span>{mockGym.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiPhone className="h-5 w-5 mr-2" />
                  <span>{mockGym.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiGlobe className="h-5 w-5 mr-2" />
                  <a href={`https://${mockGym.website}`} className="text-blue-600 hover:underline">
                    {mockGym.website}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiMail className="h-5 w-5 mr-2" />
                  <span>{mockGym.email}</span>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Opening Hours</h2>
              <div className="space-y-2">
                {Object.entries(mockGym.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-gray-600">
                    <span className="capitalize">{day}</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 