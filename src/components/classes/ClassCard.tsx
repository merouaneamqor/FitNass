'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FitnessClass } from '@/types/fitnessClass';
import { Routes } from '@/lib/routes';
import { FiStar, FiMapPin, FiClock, FiUsers, FiTag, FiCalendar, FiDollarSign } from 'react-icons/fi';

interface ClassCardProps {
  fitnessClass: FitnessClass;
}

// Helper to format date/time
const formatDateTime = (date: Date | null | undefined): string => {
  if (!date) return 'Date TBD';
  return new Date(date).toLocaleString(undefined, {
    dateStyle: 'medium', 
    timeStyle: 'short' 
  });
};

const ClassCard: React.FC<ClassCardProps> = ({ fitnessClass }) => {
  const defaultImage = '/images/default-class.png'; // Placeholder - Add a default class image
  const imageUrl = Array.isArray(fitnessClass.images) && fitnessClass.images.length > 0 ? fitnessClass.images[0] : defaultImage;
  const locationName = fitnessClass.place?.name || 'Location TBD';
  const locationCity = fitnessClass.place?.city || null;

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col h-full">
      <Link href={Routes.classes.detail(fitnessClass.id)} className="block group relative">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={fitnessClass.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />
          {/* Type Badge */}
          <span className={`absolute top-3 left-3 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold tracking-wide bg-purple-50 text-purple-700 z-10`}>
             <FiTag className="h-3 w-3 mr-1" /> {fitnessClass.type}
          </span>
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl font-semibold mb-1 text-gray-800 group-hover:text-blue-600 transition-colors">
          <Link href={Routes.classes.detail(fitnessClass.id)} className="hover:text-blue-600 line-clamp-1">
            {fitnessClass.name}
          </Link>
        </h2>

        {/* Location Info */}
        <div className="mb-2 flex items-center text-gray-500 text-xs">
            <FiMapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-gray-400" />
            <span className="line-clamp-1">{locationName}{locationCity ? `, ${locationCity}` : ''}</span>
        </div>

         {/* Trainer Info (Optional) */}
         {fitnessClass.trainer && (
            <div className="mb-2 text-xs text-gray-600">
                Taught by: 
                <Link href={Routes.trainers.detail(fitnessClass.trainer.id)} className="font-medium text-blue-600 hover:underline ml-1">
                   {fitnessClass.trainer.name}
                </Link>
            </div>
        )}

        {/* Start Time & Duration */}
        <div className="mb-2 flex items-center text-gray-500 text-xs gap-3">
            <span className="inline-flex items-center">
               <FiCalendar className="h-3.5 w-3.5 mr-1" />
               {formatDateTime(fitnessClass.startTime)}
            </span>
            <span className="inline-flex items-center">
                <FiClock className="h-3.5 w-3.5 mr-1" />
                {fitnessClass.duration} min
            </span>
        </div>
        
        {/* Difficulty (Optional) */}
        {fitnessClass.difficulty && (
             <div className="mb-3">
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {fitnessClass.difficulty}
                </span>
            </div>
        )}

        <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-2">
          {fitnessClass.description ? fitnessClass.description : 'No description available.'}
        </p>

        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
          {/* Capacity (Optional) */}
          {fitnessClass.capacity && (
            <div className="flex items-center text-gray-500 text-xs">
                <FiUsers className="h-4 w-4 mr-1"/>
                <span>{fitnessClass.capacity} spots</span>
            </div>
          )}
          {/* Price (Optional) */}
          {fitnessClass.price !== null && fitnessClass.price !== undefined && (
            <div className="flex items-center text-green-600 text-xs">
                <FiDollarSign className="h-3.5 w-3.5 mr-0.5" />
                <span className="font-semibold">{fitnessClass.price > 0 ? `${fitnessClass.price} ${fitnessClass.currency || ''}`.trim() : 'Free'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassCard; 