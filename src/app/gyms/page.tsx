'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiMapPin, FiStar, FiFilter } from 'react-icons/fi';

// Mock data for demonstration
const mockGyms = [
  {
    id: 1,
    name: 'FitLife Gym',
    description: 'State-of-the-art equipment and personal trainers',
    location: 'Downtown, City',
    rating: 4.8,
    reviewCount: 120,
    priceRange: '$$',
    facilities: ['Cardio', 'Weights', 'Classes', 'Pool'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'PowerFit Center',
    description: '24/7 access with modern equipment',
    location: 'Westside, City',
    rating: 4.6,
    reviewCount: 85,
    priceRange: '$$$',
    facilities: ['Cardio', 'Weights', 'Classes', 'Spa'],
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'CrossFit Zone',
    description: 'CrossFit certified trainers and programs',
    location: 'Eastside, City',
    rating: 4.9,
    reviewCount: 150,
    priceRange: '$$',
    facilities: ['CrossFit', 'Weights', 'Classes', 'Nutrition'],
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
];

export default function GymsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredGyms = mockGyms.filter((gym) =>
    gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gym.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search gyms by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FiFilter className="mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Gym Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGyms.map((gym) => (
            <div key={gym.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <img
                  src={gym.image}
                  alt={gym.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
                  {gym.priceRange}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{gym.name}</h3>
                <div className="mt-2 flex items-center text-gray-600">
                  <FiMapPin className="h-5 w-5 mr-1" />
                  <span>{gym.location}</span>
                </div>
                <div className="mt-2 flex items-center">
                  <FiStar className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-gray-600">{gym.rating} ({gym.reviewCount} reviews)</span>
                </div>
                <p className="mt-4 text-gray-600">{gym.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {gym.facilities.map((facility) => (
                    <span
                      key={facility}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/gyms/${gym.id}`}
                  className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredGyms.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No gyms found</h3>
            <p className="mt-2 text-gray-600">
              Try adjusting your search to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 