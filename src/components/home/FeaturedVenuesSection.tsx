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
  const [activeTab, setActiveTab] = useState('trending');

  // Note: The filtering logic based on activeTab is not implemented here.
  // You would typically filter the `venues` array based on the `activeTab` state.
  const displayedVenues = venues; // Using all venues for now

  return (
    <section className="py-16 md:py-24 bg-jet-black text-white border-t border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase tracking-wider mb-4 md:mb-0">
            Featured Venues
          </h2>
          <Link href="/search" className="text-blood-red hover:text-red-400 flex items-center group font-medium transition-colors">
            View all
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="mb-10 border-b border-neutral-700">
          <div className="flex space-x-4 md:space-x-6">
            {[ 'Trending Now', 'New Additions', 'Top Rated'].map((tabName) => {
              const tabId = tabName.toLowerCase().replace(' ', '-');
              return (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`py-2.5 text-sm md:text-base font-bebas uppercase tracking-wide px-1 transition-all duration-200 ${
                    activeTab === tabId
                      ? 'text-neon-yellow border-b-2 border-neon-yellow'
                      : 'text-neutral-400 hover:text-white border-b-2 border-transparent'
                  }`}
                >
                  {tabName}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayedVenues.map((venue, index) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-gunmetal-gray rounded-lg overflow-hidden transition-all duration-300 border border-neutral-700/80 hover:border-blood-red group flex flex-col shadow-lg"
            >
              <div className="relative h-52 sm:h-56 overflow-hidden">
                <Image
                  src={venue.images?.[0] || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                  alt={venue.name}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out opacity-80 group-hover:opacity-100"
                />
                {venue.type && (
                   <span className={`absolute top-3 left-3 inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${venue.type === 'gym' ? 'bg-blood-red/80 text-white' : 'bg-neon-yellow text-black'}`}>
                    {venue.type}
                  </span>
                )}
                <button className="absolute top-3 right-3 h-8 w-8 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-blood-red transition-colors duration-200">
                  <FiHeart className="h-4 w-4" />
                </button>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bebas uppercase tracking-wide text-white group-hover:text-neon-yellow transition-colors pr-2 line-clamp-1">{venue.name}</h3>
                  {typeof venue.rating === 'number' && (
                    <div className="flex-shrink-0 flex items-center bg-jet-black/50 px-2 py-0.5 rounded-md border border-neutral-700">
                      <FiStar className="h-3 w-3 text-neon-yellow fill-current" />
                      <span className="ml-1.5 font-bold text-xs text-white">{venue.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                {venue.address && (
                  <div className="mb-3 flex items-center text-neutral-400 text-xs font-poppins">
                    <FiMapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                    <span className="line-clamp-1">{venue.address}, {venue.city}</span>
                  </div>
                )}
                {venue.facilities && venue.facilities.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {venue.facilities.slice(0, 3).map((facility) => (
                      <span
                        key={facility}
                        className="px-2 py-0.5 bg-neutral-700/60 text-neutral-300 rounded-sm text-[10px] uppercase font-medium"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-auto pt-4 border-t border-neutral-700/60 flex justify-between items-center">
                  <span className="text-neutral-500 text-xs font-medium">
                    {venue._count?.reviews || 0} Reviews
                  </span>
                  <Link
                    href={`/${venue.type === 'gym' ? 'gyms' : 'clubs'}/${venue.id}`}
                    className="inline-block bg-neon-yellow hover:bg-yellow-400 text-black px-4 py-1.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-colors duration-200 shadow-sm"
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