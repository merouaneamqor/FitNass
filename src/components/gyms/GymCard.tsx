'use client'; // Assuming interactivity or hooks might be added later

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gym } from '@/types/gym';
import { Routes } from '@/lib/routes';
import { FiStar, FiMapPin, FiEye } from 'react-icons/fi'; // Added FiEye for views

interface GymCardProps {
  gym: Gym;
}

const GymCard: React.FC<GymCardProps> = ({ gym }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  const imageUrl = Array.isArray(gym.images) && gym.images.length > 0 ? gym.images[0] : defaultImage;

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col h-full">
      <Link href={Routes.gyms.detail(gym.id)} className="block group relative">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={gym.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
        </div>
        {/* Optional: Add overlay elements here if needed */}
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl font-semibold mb-1 text-gray-800 group-hover:text-blue-600 transition-colors">
          <Link href={Routes.gyms.detail(gym.id)} className="hover:text-blue-600">
            {gym.name}
          </Link>
        </h2>

        {gym.address && (
          <div className="mb-2 flex items-center text-gray-500 text-xs">
            <FiMapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-gray-400" />
            <span className="line-clamp-1">{gym.address}, {gym.city}</span>
          </div>
        )}

        <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-2">
          {gym.description ? gym.description : 'No description available.'}
        </p>

        {/* Facilities Pills */}
        {gym.facilities && gym.facilities.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
                {gym.facilities.slice(0, 3).map((facility) => (
                    <span
                        key={facility}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                        {facility}
                    </span>
                ))}
                {gym.facilities.length > 3 && (
                   <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">...</span>
                )}
            </div>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
          <div className="flex items-center text-yellow-500">
            <FiStar className="h-4 w-4 mr-1 fill-current" />
            <span className="font-bold">{gym.rating ? gym.rating.toFixed(1) : 'N/A'}</span>
            <span className="text-gray-500 text-xs ml-1">({gym._count?.reviews ?? 0} reviews)</span>
          </div>
          {/* Optional: Add View Count or Price Range */}
          {/* <div className="flex items-center text-gray-500 text-xs">
            <FiEye className="h-4 w-4 mr-1"/>
            <span>{gym.viewCount ?? 0}</span>
          </div> */} 
        </div>
      </div>
    </div>
  );
};

export default GymCard; 