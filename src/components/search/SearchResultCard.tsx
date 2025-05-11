'use client';

import Link from 'next/link';
import { FiStar, FiMapPin, FiCheck } from 'react-icons/fi';
import { Routes } from '@/lib/routes';
import { SearchResult, PlaceSearchResult } from '@/types/search';
import SafeImage from '@/components/ui/SafeImage';

// --- Helper function to get detail URL based on type ---
const getDetailUrl = (result: SearchResult): string => {
  if (result.type === 'PLACE') {
    const placeResult = result as PlaceSearchResult;
    const citySlug = placeResult.city?.toLowerCase().replace(/\s+/g, '-') || 'unknown-city';
    const placeId = placeResult.id;
    
    // Always use the places route prefix
    return `/places/${citySlug}/${placeId}`;
  }

  // Fallback/default slug logic for other types
  const id = result.id;
  const citySlug = result.city?.toLowerCase().replace(/\s+/g, '-') || 'unknown-city';
  const compositeSlug = `${citySlug}-${id}`;
  
  switch (result.type) {
    case 'TRAINER': return Routes.trainers.detail(compositeSlug);
    case 'CLASS': return Routes.classes.detail(compositeSlug);
    default: return '/search'; // Fallback URL to search page
  }
};

// --- Helper function to get default image based on type ---
const getDefaultImage = (type: SearchResult['type']): string => {
   switch (type) {
    case 'PLACE': return '/images/logo.svg';
    case 'TRAINER': return '/images/logo.svg';
    case 'CLASS': return '/images/logo.svg';
    default: return '/images/logo.svg';
  }
}

// --- Function to get icon by result type ---
const getTypeIcon = (type: SearchResult['type']) => {
  switch(type) {
    case 'PLACE': return <FiStar className="h-4 w-4 text-red-600" />;
    case 'TRAINER': return <FiStar className="h-4 w-4 text-blue-600" />;
    case 'CLASS': return <FiStar className="h-4 w-4 text-purple-600" />;
    default: return <FiCheck className="h-4 w-4 text-gray-600" />;
  }
};

// --- Main Card Component ---
export default function SearchResultCard({ result }: { result: SearchResult }) {
    const detailUrl = getDetailUrl(result);
    const defaultImage = getDefaultImage(result.type);
    const imageUrl = result.image || defaultImage;
    const typeIcon = getTypeIcon(result.type);

    // Determine type label
    let typeLabel = result.type.charAt(0).toUpperCase() + result.type.slice(1).toLowerCase();
    if (result.type === 'PLACE' && (result as PlaceSearchResult).placeType) {
      typeLabel = (result as PlaceSearchResult).placeType || 'Place';
    }

    // Determine badge color based on type
    let badgeColor = "";
    switch(result.type) {
      case 'PLACE': badgeColor = "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"; break;
      case 'TRAINER': badgeColor = "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"; break;
      case 'CLASS': badgeColor = "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"; break;
      default: badgeColor = "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }

    // Get description based on result type
    const getDescription = () => {
      if (result.type === 'PLACE') {
        return (result as PlaceSearchResult).place?.description || 'Details available on the page';
      }
      return 'Details available on the page';
    };

    return (
        <Link href={detailUrl} className="block group h-full">
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                {/* Thumbnail image */}
                <div className="relative aspect-video overflow-hidden">
                    <SafeImage
                        src={imageUrl}
                        alt={result.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-in-out"
                        fallbackType="fitnass"
                    />
                    {/* Type Badge */}
                    <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium">
                        <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${badgeColor}`}>
                            {typeIcon}
                            {typeLabel}
                        </span>
                    </span>
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
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 flex-grow line-clamp-2">
                        {getDescription()}
                    </p>
                </div>
            </div>
        </Link>
    );
} 