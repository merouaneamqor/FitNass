'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMapPin, FiStar, FiArrowRight, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Venue type - Ensure this matches the actual data structure
export type Venue = {
  id: string;
  name: string;
  address?: string; // Made optional
  city: string;
  rating?: number; // Made optional
  _count?: { reviews?: number }; // Made optional
  description?: string; // Made optional
  facilities?: string[]; // Made optional
  images: string[];
  priceRange?: string; // Made optional
  latitude?: number; // Made optional
  longitude?: number; // Made optional
  // Add type field if it exists in your actual data passed from page.tsx
  type?: 'gym' | 'club';
};

type FeaturedVenuesSectionProps = {
  venues: Venue[];
};

export default function FeaturedVenuesSection({ venues }: FeaturedVenuesSectionProps) {
  const [activeTab, setActiveTab] = useState('trending-now');
  const [hoveredVenue, setHoveredVenue] = useState<string | null>(null);

  // Note: The filtering logic based on activeTab is not implemented here.
  // You would typically filter the `venues` array based on the `activeTab` state.
  const displayedVenues = venues; // Using all venues for now

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bebas text-gray-900 uppercase tracking-wider mb-4 md:mb-0"
          >
            Featured Venues
          </motion.h2>
          <Link 
            href="/search" 
            className="text-yellow-600 hover:text-yellow-700 flex items-center group font-semibold transition-all duration-300"
          >
            <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-yellow-600 group-hover:after:w-full after:transition-all after:duration-300">View all</span>
            <motion.div
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <FiArrowRight className="ml-2" />
            </motion.div>
          </Link>
        </div>

        <div className="mb-10 border-b border-gray-200/80">
          <div className="flex space-x-5 md:space-x-10 overflow-x-auto pb-1">
            {[ 'Trending Now', 'New Additions', 'Top Rated'].map((tabName) => {
              const tabId = tabName.toLowerCase().replace(' ', '-');
              return (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`py-3 text-sm md:text-base font-semibold uppercase tracking-wide px-1 whitespace-nowrap transition-all duration-300 ${
                    activeTab === tabId
                      ? 'text-yellow-600 border-b-2 border-yellow-500'
                      : 'text-gray-500 hover:text-gray-800 border-b-2 border-transparent'
                  }`}
                >
                  {tabName}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {displayedVenues.map((venue, index) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onHoverStart={() => setHoveredVenue(venue.id)}
              onHoverEnd={() => setHoveredVenue(null)}
              className="bg-white rounded-xl overflow-hidden transition-all duration-300 border border-gray-200/80 hover:border-yellow-400 group flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
            >
              <div className="relative h-56 sm:h-60 overflow-hidden">
                <Image
                  src={venue.images?.[0] || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                  alt={venue.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-in-out opacity-95 group-hover:opacity-100 scale-100 group-hover:scale-105"
                />
                {/* Premium gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-20 group-hover:opacity-0 transition-opacity duration-300"></div>
                
                {venue.type && (
                   <span className={`absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${venue.type === 'gym' ? 'bg-red-600/90 text-white backdrop-blur-sm' : 'bg-yellow-500/90 text-black backdrop-blur-sm'}`}>
                    {venue.type}
                  </span>
                )}
                <button 
                  className="absolute top-4 right-4 h-9 w-9 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-600 transition-all duration-300 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                >
                  <FiHeart className={`h-4 w-4 ${hoveredVenue === venue.id ? 'scale-110' : 'scale-100'} transition-transform duration-300`} />
                </button>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold uppercase tracking-wide text-gray-900 group-hover:text-yellow-600 transition-colors pr-2 line-clamp-1">{venue.name}</h3>
                  {typeof venue.rating === 'number' && (
                    <div className="flex-shrink-0 flex items-center bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200/80">
                      <FiStar className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                      <span className="ml-1.5 font-bold text-xs text-gray-800">{venue.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                {venue.address && (
                  <div className="mb-3 flex items-center text-gray-600 text-sm">
                    <FiMapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-gray-500" />
                    <span className="line-clamp-1">{venue.address}, {venue.city}</span>
                  </div>
                )}
                {venue.facilities && venue.facilities.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {venue.facilities.slice(0, 3).map((facility) => (
                      <span
                        key={facility}
                        className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-[10px] uppercase font-medium tracking-wide"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-gray-500 text-xs font-medium">
                    {venue._count?.reviews || 0} Reviews
                  </span>
                  <Link
                    href={`/${venue.type === 'gym' ? 'gyms' : 'clubs'}/${venue.id}`}
                    className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black px-5 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                  >
                    Details
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