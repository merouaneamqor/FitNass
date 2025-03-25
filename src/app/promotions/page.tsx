'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiTag, FiClock, FiMapPin } from 'react-icons/fi';

// Mock data for demonstration
const mockPromotions = [
  {
    id: 1,
    gymId: 1,
    gymName: 'FitLife Gym',
    title: 'New Year Special',
    description: 'Get 3 months of membership for the price of 2! Plus, a free personal training session.',
    discount: '33% OFF',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    location: 'Downtown, City',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    gymId: 2,
    gymName: 'PowerFit Center',
    title: 'Summer Fitness Challenge',
    description: 'Join our 8-week summer challenge program with group classes and nutrition guidance.',
    discount: '20% OFF',
    startDate: '2024-04-01',
    endDate: '2024-05-31',
    location: 'Westside, City',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    gymId: 3,
    gymName: 'CrossFit Zone',
    title: 'Student Discount',
    description: 'Special rates for students with valid ID. Includes access to all classes and facilities.',
    discount: '25% OFF',
    startDate: '2024-03-15',
    endDate: '2024-12-31',
    location: 'Eastside, City',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
];

export default function PromotionsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPromotions = mockPromotions.filter((promotion) =>
    promotion.gymName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promotion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promotion.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gym Promotions</h1>
          <p className="text-xl text-gray-600">
            Discover the best deals and offers from gyms in your area
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search promotions by gym name, location, or offer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPromotions.map((promotion) => (
            <div key={promotion.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <img
                  src={promotion.image}
                  alt={promotion.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {promotion.discount}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{promotion.title}</h3>
                <div className="mt-2 flex items-center text-gray-600">
                  <FiMapPin className="h-5 w-5 mr-1" />
                  <span>{promotion.location}</span>
                </div>
                <div className="mt-2 flex items-center text-gray-600">
                  <FiClock className="h-5 w-5 mr-1" />
                  <span>
                    {new Date(promotion.startDate).toLocaleDateString()} -{' '}
                    {new Date(promotion.endDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-4 text-gray-600">{promotion.description}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-gray-500">{promotion.gymName}</span>
                  <Link
                    href={`/gyms/${promotion.gymId}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPromotions.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No promotions found</h3>
            <p className="mt-2 text-gray-600">
              Try adjusting your search to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 