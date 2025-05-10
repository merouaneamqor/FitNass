'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiStar, FiMapPin, FiDollarSign, FiBriefcase, FiClock, FiUsers, FiCalendar, FiCheck } from 'react-icons/fi';
import { GiSoccerField } from "react-icons/gi";
import { Routes } from '@/lib/routes';
// Import the SearchResult union type and specific types
import { SearchResult, GymSearchResult, ClubSearchResult, TrainerSearchResult, ClassSearchResult } from '@/types/search';
import { formatDateTime } from '@/lib/utils'; // Assuming formatDateTime exists or we add it

// --- Helper function to get detail URL based on type ---
const getDetailUrl = (result: SearchResult): string => {
  // For gyms, construct URL using citySlug and slug directly
  if (result.type === 'gym') {
    const gymResult = result as GymSearchResult;
    const citySlug = gymResult.citySlug || 'unknown-city'; // Fallback city
    const gymSlug = gymResult.slug || gymResult.id; // Fallback to id if slug is missing
    return `/gyms/${citySlug}/${gymSlug}`;
  }

  // Fallback/default slug logic for other types
  const slug = result.compositeSlug || result.id; 
  switch (result.type) {
    case 'club':    return Routes.clubs.detail(slug);
    case 'trainer': return Routes.trainers.detail(slug);
    case 'class':   return Routes.classes.detail(slug);
    default:        return '/search'; // Fallback URL to search page
  }
};

// --- Helper function to get default image based on type ---
const getDefaultImage = (type: SearchResult['type']): string => {
   switch (type) {
    case 'gym': return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    case 'club': return 'https://images.unsplash.com/photo-1594470117722-de4b9a02ebED?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Example club image
    case 'trainer': return '/images/default-trainer.png'; // Use placeholder added earlier
    case 'class': return '/images/default-class.png'; // Use placeholder added earlier
    default: return 'https://via.placeholder.com/300x200?text=Fitnass';
  }
}

// --- Function to get icon by result type ---
const getTypeIcon = (type: SearchResult['type']) => {
  switch(type) {
    case 'gym': return <FiStar className="h-4 w-4 text-red-600" />;
    case 'club': return <GiSoccerField className="h-4 w-4 text-amber-600" />;
    case 'trainer': return <FiUsers className="h-4 w-4 text-blue-600" />;
    case 'class': return <FiCalendar className="h-4 w-4 text-purple-600" />;
    default: return <FiCheck className="h-4 w-4 text-gray-600" />;
  }
};

// --- Main Card Component ---
export default function SearchResultCard({ result }: { result: SearchResult }) {
    const detailUrl = getDetailUrl(result);
    const defaultImage = getDefaultImage(result.type);
    const imageUrl = Array.isArray(result.images) && result.images.length > 0 ? result.images[0] : defaultImage;
    const typeIcon = getTypeIcon(result.type);

    // Determine type label
    let typeLabel = result.type.charAt(0).toUpperCase() + result.type.slice(1);
    if (result.type === 'class') {
      typeLabel = (result as ClassSearchResult).classType || 'Class';
      typeLabel = typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1);
    }

    // Determine badge color based on type
    let badgeColor = "";
    switch(result.type) {
      case 'gym': badgeColor = "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"; break;
      case 'club': badgeColor = "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"; break;
      case 'trainer': badgeColor = "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"; break;
      case 'class': badgeColor = "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"; break;
      default: badgeColor = "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }

    return (
        <Link href={detailUrl} className="block group h-full">
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                {/* Thumbnail image */}
                <div className="relative aspect-video overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={result.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    />
                    {/* Type Badge */}
                    <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium">
                        <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${badgeColor}`}>
                            {typeIcon}
                            {typeLabel}
                        </span>
                    </span>
                    
                    {/* Duration badge for classes */}
                    {result.type === 'class' && (result as ClassSearchResult).duration && (
                        <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                            {(result as ClassSearchResult).duration} min
                        </div>
                    )}
                </div>
                
                {/* Content Section */}
                <div className="p-4 flex flex-col flex-grow">
                    {/* Title & Rating */}
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {result.name}
                        </h3>
                        {typeof result.rating === 'number' && result.rating > 0 && (
                            <div className="flex-shrink-0 flex items-center">
                                <FiStar className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="ml-1 font-bold text-xs text-gray-700 dark:text-gray-300">{result.rating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 gap-x-3 gap-y-1 mb-2">
                        {/* Location */}
                        {result.city && (
                            <span className="flex items-center">
                                <FiMapPin className="h-3.5 w-3.5 mr-1" />
                                {result.city}
                            </span>
                        )}
                        
                        {/* Price for Trainer/Class */}
                        {result.type === 'trainer' && (result as TrainerSearchResult).hourlyRate && (
                            <span className="flex items-center text-green-600 dark:text-green-400">
                                <FiDollarSign className="h-3.5 w-3.5 mr-0.5" />
                                {(result as TrainerSearchResult).hourlyRate}/hr
                            </span>
                        )}
                        {result.type === 'class' && (result as ClassSearchResult).price !== null && (
                            <span className="flex items-center text-green-600 dark:text-green-400">
                                <FiDollarSign className="h-3.5 w-3.5 mr-0.5" />
                                {(result as ClassSearchResult).price! > 0 ? `${(result as ClassSearchResult).price}` : 'Free'}
                            </span>
                        )}
                        
                        {/* Fields for Clubs */}
                        {result.type === 'club' && (result as ClubSearchResult)._count?.sportFields && (
                            <span className="flex items-center">
                                <GiSoccerField className="h-3.5 w-3.5 mr-1"/> 
                                {(result as ClubSearchResult)._count!.sportFields} Fields
                            </span>
                        )}
                        
                        {/* Class Capacity */} 
                        {result.type === 'class' && (result as ClassSearchResult).capacity && (
                            <span className="flex items-center">
                                <FiUsers className="h-3.5 w-3.5 mr-1" /> 
                                {(result as ClassSearchResult).capacity} spots
                            </span>
                        )}
                        
                        {/* Class Date/Time */}
                        {result.type === 'class' && (result as ClassSearchResult).startTime && (
                            <span className="flex items-center">
                                <FiCalendar className="h-3.5 w-3.5 mr-1" />
                                {formatDateTime((result as ClassSearchResult).startTime!)}
                            </span>
                        )}
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 flex-grow line-clamp-2">
                        {result.description ? result.description : 'Details available on the page.'}
                    </p>
                    
                    {/* Tags/Specialties/Facilities */}
                    <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex flex-wrap gap-1.5">
                            {/* Trainer Specialties */}
                            {result.type === 'trainer' && (result as TrainerSearchResult).specialties && (result as TrainerSearchResult).specialties!.length > 0 && 
                                (result as TrainerSearchResult).specialties!.slice(0, 3).map(specialty => (
                                    <span key={specialty} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                                        {specialty}
                                    </span>
                                ))
                            }
                            
                            {/* Gym/Club Facilities */}
                            {(result.type === 'gym' || result.type === 'club') && (result as (GymSearchResult | ClubSearchResult)).facilities && (result as (GymSearchResult | ClubSearchResult)).facilities!.length > 0 && 
                                (result as (GymSearchResult | ClubSearchResult)).facilities!.slice(0, 3).map(facility => (
                                    <span key={facility} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-full">
                                        {facility}
                                    </span>
                                ))
                            }
                            
                            {/* "More" indicator */}
                            {result.type === 'trainer' && (result as TrainerSearchResult).specialties && (result as TrainerSearchResult).specialties!.length > 3 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">+{(result as TrainerSearchResult).specialties!.length - 3} more</span>
                            )}
                            {(result.type === 'gym' || result.type === 'club') && (result as (GymSearchResult | ClubSearchResult)).facilities && (result as (GymSearchResult | ClubSearchResult)).facilities!.length > 3 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">+{(result as (GymSearchResult | ClubSearchResult)).facilities!.length - 3} more</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
} 