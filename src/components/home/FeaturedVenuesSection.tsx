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
    // Conditional background gradient
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            // Conditional heading text color
            className="text-4xl md:text-5xl lg:text-6xl font-bebas text-gray-900 dark:text-white uppercase tracking-wider mb-4 md:mb-0 transition-colors"
          >
            Featured Venues
          </motion.h2>
          <Link 
            href="/search" 
            // Conditional link text color & hover color
            className="text-yellow-600 dark:text-red-400 hover:text-yellow-700 dark:hover:text-red-300 flex items-center group font-semibold transition-all duration-300"
          >
            {/* Conditional underline color */}
            <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-yellow-600 dark:after:bg-red-400 group-hover:after:w-full after:transition-all after:duration-300">View all</span>
            <motion.div
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <FiArrowRight className="ml-2" />
            </motion.div>
          </Link>
        </div>

        {/* Conditional tab container border */}
        <div className="mb-10 border-b border-gray-200/80 dark:border-neutral-700/50 transition-colors">
          <div className="flex space-x-5 md:space-x-10 overflow-x-auto pb-1">
            {[ 'Trending Now', 'New Additions', 'Top Rated'].map((tabName) => {
              const tabId = tabName.toLowerCase().replace(' ', '-');
              return (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  // Conditional tab styling: active/inactive text and border
                  className={`py-3 text-sm md:text-base font-semibold uppercase tracking-wide px-1 whitespace-nowrap transition-all duration-300 ${
                    activeTab === tabId
                      ? 'text-yellow-600 dark:text-red-400 border-b-2 border-yellow-500 dark:border-red-500'
                      : 'text-gray-500 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 border-b-2 border-transparent'
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
              // Conditional card styling: bg, border, hover border, shadow, hover shadow
              className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden transition-all duration-300 border border-gray-200/80 dark:border-gray-700/50 hover:border-yellow-400 dark:hover:border-red-500 group flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
            >
              <div className="relative h-56 sm:h-60 overflow-hidden">
                <Image
                  src={venue.images?.[0] || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                  alt={venue.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-in-out opacity-95 group-hover:opacity-100 scale-100 group-hover:scale-105"
                />
                {/* Keep gradient overlay as is */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-20 group-hover:opacity-0 transition-opacity duration-300"></div>
                
                {venue.type && (
                   // Conditional type badge styling
                   <span className={`absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm transition-colors ${venue.type === 'gym' ? 'bg-red-600/90 text-white dark:bg-red-700/80 dark:text-red-100' : 'bg-yellow-500/90 text-black dark:bg-red-500/80 dark:text-white'}`}>
                    {venue.type}
                  </span>
                )}
                {/* Conditional favorite button styling */}
                <button 
                  className="absolute top-4 right-4 h-9 w-9 bg-white/80 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-all duration-300 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                >
                  <FiHeart className={`h-4 w-4 ${hoveredVenue === venue.id ? 'scale-110' : 'scale-100'} transition-transform duration-300`} />
                </button>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  {/* Conditional card title text color */}
                  <h3 className="text-lg font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-100 group-hover:text-yellow-600 dark:group-hover:text-red-400 transition-colors pr-2 line-clamp-1">{venue.name}</h3>
                  {typeof venue.rating === 'number' && (
                    // Conditional rating background and border
                    <div className="flex-shrink-0 flex items-center bg-gray-50 dark:bg-gray-800/50 px-2 py-0.5 rounded-md border border-gray-200/80 dark:border-gray-700/50 transition-colors">
                      {/* Conditional star color */}
                      <FiStar className="h-3.5 w-3.5 text-yellow-500 dark:text-red-400 fill-current transition-colors" />
                      {/* Conditional rating text color */}
                      <span className="ml-1.5 font-bold text-xs text-gray-800 dark:text-gray-200 transition-colors">{venue.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                {venue.address && (
                  // Conditional address text and icon color
                  <div className="mb-3 flex items-center text-gray-600 dark:text-neutral-400 text-sm transition-colors">
                    <FiMapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-gray-500 dark:text-neutral-500 transition-colors" />
                    <span className="line-clamp-1">{venue.address}, {venue.city}</span>
                  </div>
                )}
                {venue.facilities && venue.facilities.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {venue.facilities.slice(0, 3).map((facility) => (
                      // Conditional facility tag background and text color
                      <span
                        key={facility}
                        className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-[10px] uppercase font-medium tracking-wide transition-colors"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                )}
                {/* Conditional divider border */}
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center transition-colors">
                  {/* Conditional review count text color */}
                  <span className="text-gray-500 dark:text-neutral-400 text-xs font-medium transition-colors">
                    {venue._count?.reviews || 0} Reviews
                  </span>
                  <Link
                    href={`/${venue.type === 'gym' ? 'gyms' : 'clubs'}/${venue.id}`}
                    // Conditional "Details" button gradient and text color
                    className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-400 dark:from-red-600 dark:to-red-500 hover:from-yellow-600 hover:to-yellow-500 dark:hover:from-red-700 dark:hover:to-red-600 text-black dark:text-white px-5 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow transform hover:-translate-y-0.5"
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