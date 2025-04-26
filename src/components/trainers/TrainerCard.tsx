'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trainer } from '@/types/trainer';
import { Routes } from '@/lib/routes';
import { FiStar, FiMapPin, FiDollarSign, FiAward, FiBriefcase } from 'react-icons/fi';

interface TrainerCardProps {
  trainer: Trainer;
}

const TrainerCard: React.FC<TrainerCardProps> = ({ trainer }) => {
  const defaultImage = '/images/default-trainer.png'; // Placeholder - Add a default trainer image
  const imageUrl = Array.isArray(trainer.images) && trainer.images.length > 0 ? trainer.images[0] : defaultImage;

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col h-full">
      <Link href={Routes.trainers.detail(trainer.id)} className="block group relative">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={trainer.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />
          {/* Optional Gradient Overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div> */}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl font-semibold mb-1 text-gray-800 group-hover:text-blue-600 transition-colors">
          <Link href={Routes.trainers.detail(trainer.id)} className="hover:text-blue-600">
            {trainer.name}
          </Link>
        </h2>

        {/* Specialties Pills */}
        {trainer.specialties && trainer.specialties.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
                 <FiBriefcase className="h-3.5 w-3.5 mr-1 text-gray-400 flex-shrink-0 mt-0.5" title="Specialties"/>
                {trainer.specialties.slice(0, 3).map((specialty) => (
                    <span
                        key={specialty}
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs"
                    >
                        {specialty}
                    </span>
                ))}
                {trainer.specialties.length > 3 && (
                   <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">...</span>
                )}
            </div>
        )}

        <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-2">
          {trainer.bio ? trainer.bio : 'No bio available.'}
        </p>

        {/* Certifications (Optional) */}
        {trainer.certifications && trainer.certifications.length > 0 && (
            <div className="mb-3 flex items-center text-gray-500 text-xs gap-1.5">
                <FiAward className="h-3.5 w-3.5 mr-1 text-gray-400 flex-shrink-0" title="Certifications" />
                <span className="line-clamp-1 font-medium">{trainer.certifications.join(', ')}</span>
            </div>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
          <div className="flex items-center text-yellow-500">
            <FiStar className="h-4 w-4 mr-1 fill-current" />
            <span className="font-bold">{trainer.rating ? trainer.rating.toFixed(1) : 'N/A'}</span>
            {/* TODO: Add review count when available */}
            {/* <span className="text-gray-500 text-xs ml-1">({trainer._count?.reviews ?? 0} reviews)</span> */}
          </div>
          {trainer.hourlyRate && (
            <div className="flex items-center text-green-600 text-xs">
                <FiDollarSign className="h-3.5 w-3.5 mr-0.5" />
                <span className="font-semibold">{trainer.hourlyRate} / hr</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerCard; 