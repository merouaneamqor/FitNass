'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiMapPin, FiStar, FiActivity } from 'react-icons/fi';
import { SearchBar } from '@/components/ui';

// Example featured gyms data
const featuredGyms = [
  {
    id: 'fitlife-gym',
    name: 'FitLife Gym',
    address: 'Downtown',
    city: 'City',
    rating: 4.8,
    _count: { reviews: 120 },
    description: 'State-of-the-art equipment, personal trainers, and group classes available.',
    facilities: ['Equipment', 'Trainers', 'Classes'],
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
    priceRange: '€€',
    latitude: 0,
    longitude: 0
  },
  {
    id: 'powerfit-center',
    name: 'PowerFit Center',
    address: 'Westside',
    city: 'City',
    rating: 4.6,
    _count: { reviews: 85 },
    description: '24/7 access, swimming pool, and specialized training programs.',
    facilities: ['24/7 Access', 'Swimming Pool', 'Training Programs'],
    images: ['https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
    priceRange: '€€',
    latitude: 0,
    longitude: 0
  },
  {
    id: 'crossfit-zone',
    name: 'CrossFit Zone',
    address: 'Eastside',
    city: 'City',
    rating: 4.9,
    _count: { reviews: 150 },
    description: 'CrossFit certified trainers, functional training, and nutrition guidance.',
    facilities: ['CrossFit', 'Functional Training', 'Nutrition Guidance'],
    images: ['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
    priceRange: '€€€',
    latitude: 0,
    longitude: 0
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/gyms?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-indigo-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        {/* Diagonal accent lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 top-1/4 h-96 w-4 bg-indigo-400 rotate-12 transform opacity-80"></div>
          <div className="absolute -right-32 top-1/3 h-96 w-4 bg-indigo-400 rotate-12 transform opacity-80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-6 sm:py-32 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find Your Perfect Gym
          </h1>
          <p className="mt-6 text-xl max-w-3xl">
            Discover the best gyms and fitness centers near you. Read reviews, compare facilities, and find the perfect place to achieve your fitness goals.
          </p>
          <div className="mt-10">
            <div className="max-w-xl">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by location or gym name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-12 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-3 top-3 text-neutral-400 hover:text-indigo-600"
                  >
                    <FiSearch className="h-6 w-6" />
                  </button>
                  <FiSearch className="absolute left-4 top-3.5 text-neutral-400" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gyms Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Featured Gyms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGyms.map((gym) => (
              <div key={gym.id} className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-neutral-100">
                <div className="relative h-60">
                  <img
                    src={gym.images[0]}
                    alt={gym.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-neutral-900">{gym.name}</h3>
                  <div className="mt-2 flex items-center text-neutral-600">
                    <FiMapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                    <span>{gym.address}, {gym.city}</span>
                  </div>
                  <div className="mt-3 flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(gym.rating) 
                              ? 'text-amber-400 fill-current' 
                              : 'text-neutral-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-neutral-700 font-medium">{gym.rating.toFixed(1)}</span>
                    <span className="ml-2 text-neutral-500 text-sm">({gym._count.reviews} reviews)</span>
                  </div>
                  <p className="mt-3 text-neutral-600 line-clamp-2 text-sm">{gym.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {gym.facilities.map((facility) => (
                      <span
                        key={facility}
                        className="px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5">
                    <Link
                      href={`/gyms/${gym.id}`}
                      className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/gyms"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium text-lg transition-all shadow-sm"
            >
              Browse All Gyms
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16 relative overflow-hidden">
        {/* Diagonal accent line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 top-1/4 h-96 w-4 bg-indigo-400 rotate-12 transform opacity-80"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <FiActivity className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Fitness Journey?</h2>
          <p className="text-xl mb-8">
            Join thousands of members who have found their perfect gym through FitNass.
          </p>
          <Link
            href="/gyms"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-neutral-100 transition-all"
          >
            Find Your Gym
          </Link>
        </div>
      </section>
    </div>
  );
}
