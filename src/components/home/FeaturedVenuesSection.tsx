'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMapPin, FiStar, FiArrowRight, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Venue type
export type Venue = {
  id: string;
  name: string;
  address: string;
  city: string;
  rating: number;
  _count: { reviews: number };
  description: string;
  facilities: string[];
  images: string[];
  priceRange: string;
  latitude: number;
  longitude: number;
};

type FeaturedVenuesSectionProps = {
  venues: Venue[];
};

export default function FeaturedVenuesSection({ venues }: FeaturedVenuesSectionProps) {
  const [activeTab, setActiveTab] = useState('trending');

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Featured Venues</h2>
          
          <div className="flex space-x-4">
            <Link href="/gyms" className="text-indigo-600 hover:text-indigo-800 flex items-center group">
              View all
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-10 border-b border-gray-200">
          <div className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('trending')}
              className={`py-4 text-lg font-medium px-1 ${
                activeTab === 'trending' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Trending Now
            </button>
            <button 
              onClick={() => setActiveTab('new')}
              className={`py-4 text-lg font-medium px-1 ${
                activeTab === 'new' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              New Additions
            </button>
            <button 
              onClick={() => setActiveTab('top')}
              className={`py-4 text-lg font-medium px-1 ${
                activeTab === 'top' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Top Rated
            </button>
          </div>
        </div>

        {/* Venues grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues.map((venue) => (
            <motion.div 
              key={venue.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-gray-100 group"
            >
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={venue.images[0]}
                  alt={venue.name}
                  width={400}
                  height={240}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    venue.id.includes('gym') 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-purple-600 text-white'
                  }`}>
                    {venue.id.includes('gym') ? 'Gym' : 'Sports Club'}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <button className="h-10 w-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-indigo-600 transition-colors">
                    <FiHeart className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{venue.name}</h3>
                  <div className="flex items-center bg-indigo-50 px-2 py-1 rounded">
                    <FiStar className="h-4 w-4 text-amber-500 fill-current" />
                    <span className="ml-1 font-medium text-gray-700">{venue.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="mb-3 flex items-center text-gray-600">
                  <FiMapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{venue.address}, {venue.city}</span>
                </div>
                <p className="text-gray-600 line-clamp-2 text-sm mb-4">{venue.description}</p>
                <div className="mb-5 flex flex-wrap gap-2">
                  {venue.facilities.slice(0, 3).map((facility) => (
                    <span
                      key={facility}
                      className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">{venue._count.reviews} reviews</span>
                  <Link
                    href={`/${venue.id.includes('gym') ? 'gyms' : 'clubs'}/${venue.id}`}
                    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 