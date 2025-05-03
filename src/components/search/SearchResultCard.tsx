'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiStar, FiMapPin, FiDollarSign, FiAward, FiBriefcase, FiTag, FiClock, FiUsers, FiCalendar } from 'react-icons/fi';
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

// --- Main Card Component ---
export default function SearchResultCard({ result }: { result: SearchResult }) {
    
    const detailUrl = getDetailUrl(result);
    const defaultImage = getDefaultImage(result.type);
    const imageUrl = Array.isArray(result.images) && result.images.length > 0 ? result.images[0] : defaultImage;

    // Determine badge text and color based on type
    let badgeText = result.type.toUpperCase();
    let badgeBgColor = 'bg-gray-100';
    let badgeTextColor = 'text-gray-700';

    switch (result.type) {
        case 'gym': badgeBgColor = 'bg-red-50'; badgeTextColor = 'text-red-700'; break;
        case 'club': badgeBgColor = 'bg-yellow-50'; badgeTextColor = 'text-yellow-700'; break;
        case 'trainer': badgeBgColor = 'bg-blue-50'; badgeTextColor = 'text-blue-700'; break;
        case 'class': badgeBgColor = 'bg-purple-50'; badgeTextColor = 'text-purple-700'; badgeText = (result as ClassSearchResult).classType || 'CLASS'; break;
    }

    return (
        <Link href={detailUrl} className="block group">
            <div className="bg-white rounded-xl overflow-hidden flex flex-col shadow-md shadow-black/5 transition-shadow duration-300 h-full hover:shadow-lg">
                {/* Image Section */}
                <div className="relative h-48 sm:h-52 overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={result.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Adjusted sizes
                        className="object-cover opacity-95 group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    />
                    {/* Type Badge */}
                    <span className={`absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${badgeBgColor} ${badgeTextColor} z-10 capitalize`}>
                        {/* Optional Icon per type? <FiTag className="h-3 w-3 mr-1" /> */}
                        {badgeText}
                    </span>
                </div>
                
                {/* Content Section */}
                <div className="p-5 flex flex-col flex-grow">
                    {/* Title & Rating */}
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-semibold text-gray-800 pr-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {result.name}
                        </h3>
                        {typeof result.rating === 'number' && result.rating > 0 && result.type !== 'class' && (
                            <div className="flex-shrink-0 flex items-center">
                                <FiStar className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                                <span className="ml-1 font-bold text-xs text-gray-700">{result.rating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>

                    {/* Location / Address (If applicable) */}
                    {(result.type === 'gym' || result.type === 'club') && result.address && (
                        <div className="mb-2 flex items-center text-gray-500 text-xs">
                            <FiMapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                            <span className="line-clamp-1">{result.address}, {result.city}</span>
                        </div>
                    )}
                     {/* Location for Classes */}
                    {result.type === 'class' && (result as ClassSearchResult).locationName && (
                        <div className="mb-2 flex items-center text-gray-500 text-xs">
                            <FiMapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                            <span className="line-clamp-1">{(result as ClassSearchResult).locationName}, {(result as ClassSearchResult).locationCity || result.city}</span>
                        </div>
                    )}
                    
                     {/* Trainer Specialties / Class Time */} 
                    {result.type === 'trainer' && (result as TrainerSearchResult).specialties && (result as TrainerSearchResult).specialties!.length > 0 && (
                         <div className="mb-2 flex flex-wrap items-center text-xs gap-1.5 text-blue-700">
                             <FiBriefcase className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" title="Specialties"/>
                             {(result as TrainerSearchResult).specialties!.slice(0, 2).map(s => <span key={s} className="bg-blue-50 px-1.5 rounded">{s}</span>)}
                             {(result as TrainerSearchResult).specialties!.length > 2 && <span className="text-gray-500">...</span>}
                         </div>
                    )}
                    {/* Refactored check: Ensure startTime exists before rendering the time block */}
                    {result.type === 'class' && (result as ClassSearchResult).startTime && (
                         <div className="mb-2 flex items-center text-gray-500 text-xs gap-3">
                            <span className="inline-flex items-center">
                               <FiCalendar className="h-3.5 w-3.5 mr-1" />
                               {formatDateTime((result as ClassSearchResult).startTime!)} {/* Safe due to the check above */}
                            </span>
                            {(result as ClassSearchResult).duration && (
                               <span className="inline-flex items-center">
                                   <FiClock className="h-3.5 w-3.5 mr-1" />
                                   {(result as ClassSearchResult).duration} min
                               </span>
                            )}
                         </div>
                    )}

                    {/* Description / Bio */}
                    <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-2">
                        {result.description ? result.description : 'Details available on the page.'}
                    </p>

                    {/* Bottom Section: Facilities / Reviews / Price / Capacity etc. */}
                    <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-2 text-gray-500">
                            {/* Gym/Club Facilities/Info */} 
                             {(result.type === 'gym' || result.type === 'club') && (result as (GymSearchResult | ClubSearchResult)).facilities && (result as (GymSearchResult | ClubSearchResult)).facilities!.length > 0 && (
                                <span title={(result as (GymSearchResult | ClubSearchResult)).facilities!.join(', ')} className="line-clamp-1">
                                   {(result as (GymSearchResult | ClubSearchResult)).facilities!.slice(0,1).join(', ')}...
                                </span>
                             )}
                             {result.type === 'club' && (result as ClubSearchResult)._count?.sportFields && (
                                 <span className="inline-flex items-center"><GiSoccerField className="mr-1"/> {(result as ClubSearchResult)._count!.sportFields} Fields</span>
                             )}
                             {/* Class Capacity */} 
                             {result.type === 'class' && (result as ClassSearchResult).capacity && (
                                 <span className="inline-flex items-center"><FiUsers className="mr-1" /> {(result as ClassSearchResult).capacity} spots</span>
                             )}
                        </div>
                        <div className="flex items-center">
                           {/* Price for Trainer/Class */} 
                           {result.type === 'trainer' && (result as TrainerSearchResult).hourlyRate && (
                               <span className="font-semibold text-green-600 mr-2 inline-flex items-center">
                                   <FiDollarSign className="h-3.5 w-3.5 mr-0.5" />
                                   {(result as TrainerSearchResult).hourlyRate} / hr
                               </span>
                           )}
                           {result.type === 'class' && (result as ClassSearchResult).price !== null && (
                              <span className="font-semibold text-green-600 mr-2 inline-flex items-center">
                                  <FiDollarSign className="h-3.5 w-3.5 mr-0.5" />
                                  {(result as ClassSearchResult).price! > 0 ? `${(result as ClassSearchResult).price}` : 'Free'}
                              </span>
                           )}
                            {/* Details Text */}
                            <span className="font-semibold text-yellow-600">
                                Details
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
} 