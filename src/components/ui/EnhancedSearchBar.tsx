'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiSearch, FiMapPin, FiStar, FiFilter, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchSuggestion } from '@/lib/search';
import Image from 'next/image';

interface EnhancedSearchBarProps {
  className?: string;
  onSearch?: (filters: any) => void;
  showFilters?: boolean;
}

export default function EnhancedSearchBar({
  className = '',
  onSearch,
  showFilters = true,
}: EnhancedSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [city, setCity] = useState(searchParams?.get('city') || '');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 1000 },
    rating: 0,
    facilities: [] as string[],
    sortBy: 'relevance',
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout>();

  // Handle clicks outside the search component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSuggestions([]);
        setShowAdvancedFilters(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceTimeout.current = setTimeout(async () => {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams?.toString());
    
    if (query) params.set('q', query);
    else params.delete('q');
    
    if (city) params.set('city', city);
    else params.delete('city');
    
    if (filters.rating > 0) params.set('rating', filters.rating.toString());
    else params.delete('rating');
    
    if (filters.facilities.length > 0) params.set('facilities', filters.facilities.join(','));
    else params.delete('facilities');
    
    if (filters.sortBy !== 'relevance') params.set('sortBy', filters.sortBy);
    else params.delete('sortBy');
    
    params.set('page', '1');
    
    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ''}`);
    
    if (onSearch) {
      onSearch({
        query,
        city,
        ...filters,
      });
    }
    
    setSuggestions([]);
    setShowAdvancedFilters(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'place':
        setQuery(suggestion.name);
        if (suggestion.subtitle) setCity(suggestion.subtitle);
        break;
      case 'city':
        setCity(suggestion.name);
        break;
      case 'facility':
        setFilters(prev => ({
          ...prev,
          facilities: [...prev.facilities, suggestion.name.toLowerCase()],
        }));
        break;
    }
    setSuggestions([]);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="flex flex-col md:flex-row gap-2">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gyms, clubs, trainers..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* City input */}
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {city && (
            <button
              onClick={() => setCity('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Search
        </button>

        {/* Filters button */}
        {showFilters && (
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center gap-2"
          >
            <FiFilter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-left"
              >
                {suggestion.type === 'place' && suggestion.image && (
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                    <Image
                      src={suggestion.image}
                      alt={suggestion.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="font-medium">{suggestion.name}</div>
                  {suggestion.subtitle && (
                    <div className="text-sm text-gray-500">{suggestion.subtitle}</div>
                  )}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced filters */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 left-0 right-0 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200"
          >
            {/* Rating filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFilters(prev => ({ ...prev, rating }))}
                    className={`p-2 rounded-lg ${
                      filters.rating === rating
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FiStar
                      className={`h-5 w-5 ${
                        filters.rating === rating ? 'fill-current' : ''
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Facilities filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facilities
              </label>
              <div className="flex flex-wrap gap-2">
                {['Pool', 'Sauna', 'Parking', 'Wifi', 'Classes'].map((facility) => (
                  <button
                    key={facility}
                    onClick={() => {
                      const facilityLower = facility.toLowerCase();
                      setFilters(prev => ({
                        ...prev,
                        facilities: prev.facilities.includes(facilityLower)
                          ? prev.facilities.filter(f => f !== facilityLower)
                          : [...prev.facilities, facilityLower],
                      }));
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.facilities.includes(facility.toLowerCase())
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {facility}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort by */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort by
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Rating</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 