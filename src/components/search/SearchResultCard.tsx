'use client';

import Link from 'next/link';
import { FiStar, FiMapPin, FiCheck } from 'react-icons/fi';
import { Routes } from '@/lib/routes';
import { SearchResult } from '@/types/search';
import SafeImage from '@/components/ui/SafeImage';

// --- Helper function to get detail URL based on type ---
function getDetailUrl(result: SearchResult): string {
  const citySlug = result.city.toLowerCase().replace(/\s+/g, '-');
  const placeId = result.slug || result.id;
  return `/places/${citySlug}/${placeId}`;
}

interface SearchResultCardProps {
  result: SearchResult;
  className?: string;
}

export default function SearchResultCard({ result, className = '' }: SearchResultCardProps) {
  return (
    <Link href={getDetailUrl(result)} className={`block ${className}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="relative h-48">
          <SafeImage
            src={result.image || '/images/placeholder.jpg'}
            alt={result.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{result.name}</h3>
              {result.city && (
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <FiMapPin className="w-4 h-4 mr-1" />
                  {result.city}
                </div>
              )}
            </div>
            {result.rating > 0 && (
              <div className="flex items-center bg-indigo-50 px-2 py-1 rounded">
                <FiStar className="w-4 h-4 text-indigo-600 mr-1" />
                <span className="text-indigo-600 font-medium">{result.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Facilities */}
          {result.facilities && result.facilities.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {result.facilities.slice(0, 3).map((facility) => (
                  <span
                    key={facility}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    <FiCheck className="w-3 h-3 mr-1" />
                    {facility}
                  </span>
                ))}
                {result.facilities.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{result.facilities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="mt-3 flex items-center justify-between">
            <div className="text-gray-900">
              {result.pricePerHour > 0 ? (
                <>
                  <span className="font-semibold">${result.pricePerHour.toFixed(2)}</span>
                  <span className="text-gray-600 text-sm">/hour</span>
                </>
              ) : (
                <span className="text-gray-600 text-sm">Price on request</span>
              )}
            </div>
            {result.reviewCount > 0 && (
              <div className="text-sm text-gray-600">
                {result.reviewCount.toLocaleString()} {result.reviewCount === 1 ? 'review' : 'reviews'}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
} 