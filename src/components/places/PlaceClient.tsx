'use client';

import React, { useState } from 'react';
import { Place, PlaceFilters } from '@/types/place';
import PlaceCard from './PlaceCard';
import { useRouter, usePathname } from 'next/navigation';

interface PlaceClientProps {
  places: Place[];
  isLoggedIn?: boolean;
  favorites?: string[];
  onToggleFavorite?: (id: string) => Promise<void>;
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
}

const PlaceClient: React.FC<PlaceClientProps> = ({ 
  places, 
  isLoggedIn = false, 
  favorites = [],
  onToggleFavorite,
  title = "Explore Fitness Places",
  subtitle = "Find the perfect place for your fitness journey",
  showFilters = true
}) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Filters state
  const [filters, setFilters] = useState<PlaceFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Apply filters to places
  const filteredPlaces = places.filter(place => {
    // Search filter
    if (searchTerm && !place.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // City filter
    if (filters.city && place.city !== filters.city) {
      return false;
    }
    
    // Type filter
    if (filters.type && filters.type.length > 0 && !filters.type.includes(place.type as any)) {
      return false;
    }
    
    // Rating filter
    if (filters.minRating && place.rating < filters.minRating) {
      return false;
    }
    
    // Facilities filter
    if (filters.facilities && filters.facilities.length > 0) {
      const hasFacilities = filters.facilities.every(facility => 
        place.facilities.includes(facility)
      );
      if (!hasFacilities) return false;
    }
    
    return true;
  });
  
  // Get unique cities for filter
  const cities = Array.from(new Set(places.map(place => place.city)));
  
  // Handle favorite toggle
  const handleToggleFavorite = async (id: string) => {
    if (!isLoggedIn) {
      // Redirect to login or show modal
      router.push('/login');
      return;
    }
    
    if (onToggleFavorite) {
      await onToggleFavorite(id);
    }
  };
  
  return (
    <div className="container mx-auto px-4">
      {/* Header section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bebasNeue tracking-wider text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>
      
      {/* Filters section */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search input */}
            <div>
              <label htmlFor="search" className="block text-gray-700 text-sm font-medium mb-1">Search</label>
              <input
                type="text"
                id="search"
                placeholder="Search places..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* City filter */}
            <div>
              <label htmlFor="city" className="block text-gray-700 text-sm font-medium mb-1">City</label>
              <select
                id="city"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={filters.city || ''}
                onChange={(e) => setFilters({...filters, city: e.target.value || undefined})}
              >
                <option value="">All Cities</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            {/* Type filter */}
            <div>
              <label htmlFor="type" className="block text-gray-700 text-sm font-medium mb-1">Type</label>
              <select
                id="type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={filters.type?.[0] || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilters({...filters, type: value ? [value as any] : undefined});
                }}
              >
                <option value="">All Types</option>
                <option value="GYM">Gym</option>
                <option value="CLUB">Club</option>
                <option value="STUDIO">Studio</option>
                <option value="CENTER">Center</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Places grid */}
      {filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlaces.map(place => (
            <PlaceCard
              key={place.id}
              place={place}
              isFavorited={favorites.includes(place.id)}
              onToggleFavorite={handleToggleFavorite}
              showFavoriteButton={isLoggedIn}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No places found</h3>
          <p className="text-gray-500">Try adjusting your search filters</p>
        </div>
      )}
    </div>
  );
};

export default PlaceClient; 