'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiSearch, FiMapPin, FiStar, FiFilter, FiX, FiChevronDown, FiClock, FiCalendar, FiSliders } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { SearchSuggestion } from '@/lib/search';

export type SearchVariant = 'full' | 'navbar' | 'simple' | 'dashboard';

interface UnifiedSearchProps {
  variant?: SearchVariant;
  className?: string;
  onSearch?: (filters: any) => void;
  showFilters?: boolean;
  placeholder?: string;
  initialQuery?: string;
  initialSport?: string;
  initialDate?: string;
  initialTime?: string;
  debounceTime?: number;
}

interface FilterState {
  priceRange: { min: number; max: number };
  rating: number;
  facilities: string[];
  sortBy: 'relevance' | 'rating' | 'price_asc' | 'price_desc' | 'distance';
}

const sportOptions = [
  { value: 'padel', label: 'Padel' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'football', label: 'Football' },
  { value: 'football7', label: 'Football 7' },
  { value: 'futsal', label: 'Futsal' },
  { value: 'padbol', label: 'Padbol' },
];

const facilityOptions = [
  { label: 'Indoor Courts', value: 'indoor' },
  { label: 'Outdoor Courts', value: 'outdoor' },
  { label: 'Locker Rooms', value: 'lockers' },
  { label: 'Showers', value: 'showers' },
  { label: 'Parking', value: 'parking' },
  { label: 'Equipment Rental', value: 'equipment' },
  { label: 'Bar/Restaurant', value: 'restaurant' },
  { label: 'Coaching Available', value: 'coaching' },
];

export default function UnifiedSearch({
  variant = 'full',
  className = '',
  onSearch,
  showFilters = true,
  placeholder = 'Search gyms, clubs, trainers...',
  initialQuery = '',
  initialSport = 'padel',
  initialDate = new Date().toISOString().split('T')[0],
  initialTime = '19:00',
  debounceTime = 300,
}: UnifiedSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [query, setQuery] = useState(initialQuery);
  const [sport, setSport] = useState(initialSport);
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [showSportDropdown, setShowSportDropdown] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: { min: 0, max: 1000 },
    rating: 0,
    facilities: [],
    sortBy: 'relevance',
  });

  // Refs
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout>();

  // Handle clicks outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSuggestions([]);
        setShowAdvancedFilters(false);
        setShowSportDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      }
    }, debounceTime);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query, debounceTime]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams?.toString());
    
    if (query) params.set('q', query);
    else params.delete('q');
    
    if (sport !== 'padel') params.set('sport', sport);
    else params.delete('sport');
    
    if (variant === 'full') {
      if (date) params.set('date', date);
      if (time) params.set('time', time);
      if (filters.rating > 0) params.set('rating', filters.rating.toString());
      if (filters.facilities.length > 0) params.set('facilities', filters.facilities.join(','));
      if (filters.sortBy !== 'relevance') params.set('sortBy', filters.sortBy);
      if (filters.priceRange.min > 0) params.set('minPrice', filters.priceRange.min.toString());
      if (filters.priceRange.max < 1000) params.set('maxPrice', filters.priceRange.max.toString());
    }
    
    params.set('page', '1');
    
    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ''}`);
    
    if (onSearch) {
      onSearch({
        query,
        sport,
        date,
        time,
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

  // Base styles with mobile-first approach
  const inputBaseClasses = `
    block w-full
    px-4 py-3
    bg-white/95 dark:bg-gray-900/95
    backdrop-blur-lg
    border-0
    text-base
    text-gray-900 dark:text-gray-100
    placeholder-gray-500 dark:placeholder-gray-400
    rounded-xl
    shadow-sm
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-red-500/30
    hover:shadow-md
    touch-manipulation
    -webkit-tap-highlight-color: transparent
    sm:text-sm sm:py-2.5
  `;

  const buttonBaseClasses = `
    w-full
    px-4 py-3
    rounded-xl
    font-medium
    text-base
    transition-all duration-200
    shadow-sm
    focus:outline-none
    active:scale-[0.98]
    touch-manipulation
    sm:w-auto sm:text-sm sm:py-2.5
  `;

  const iconBaseClasses = "h-5 w-5 sm:h-4 sm:w-4 text-gray-400 dark:text-gray-500 transition-colors duration-200";

  // Render different variants
  const renderSearchInput = () => (
    <div className="relative flex-1 min-w-[200px] group">
      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
        <FiSearch className={`${iconBaseClasses} group-focus-within:text-indigo-500 dark:group-focus-within:text-red-500`} />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder={placeholder}
        className={inputBaseClasses}
        autoComplete="off"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center opacity-60 hover:opacity-100 transition-opacity duration-200"
        >
          <FiX className={iconBaseClasses} />
        </button>
      )}
    </div>
  );

  

  const renderSportDropdown = () => (
    <div className="relative w-full sm:w-32 lg:w-40">
      <button
        onClick={() => setShowSportDropdown(!showSportDropdown)}
        className={`${inputBaseClasses} flex items-center justify-between group pr-2.5`}
      >
        <span className="truncate">{sportOptions.find(opt => opt.value === sport)?.label || 'Sport'}</span>
        <FiChevronDown className={`${iconBaseClasses} ml-1 transition-transform duration-300 ${showSportDropdown ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {showSportDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-lg shadow-lg overflow-hidden
              border border-gray-100/20 dark:border-gray-800/20"
          >
            <div className="max-h-48 overflow-y-auto">
              {sportOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSport(option.value);
                    setShowSportDropdown(false);
                  }}
                  className={`
                    w-full text-left px-3 py-2 text-sm
                    transition-all duration-200
                    hover:bg-indigo-50/50 dark:hover:bg-red-900/30
                    ${sport === option.value ? 'bg-indigo-50/80 dark:bg-red-900/50 text-indigo-600 dark:text-red-500 font-medium' : ''}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderDateTimeInputs = () => (
    <>
      <div className="relative w-full sm:w-36 lg:w-40 group">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
          <FiCalendar className={`${iconBaseClasses} group-focus-within:text-indigo-500 dark:group-focus-within:text-red-500`} />
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={`${inputBaseClasses} cursor-pointer`}
        />
      </div>
      <div className="relative w-full sm:w-28 lg:w-32 group">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
          <FiClock className={`${iconBaseClasses} group-focus-within:text-indigo-500 dark:group-focus-within:text-red-500`} />
        </div>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className={`${inputBaseClasses} cursor-pointer`}
        />
      </div>
    </>
  );

  // Render suggestions
  const renderSuggestions = () => (
    <AnimatePresence>
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-left"
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
                <div className="font-medium text-gray-900 dark:text-gray-100">{suggestion.name}</div>
                {suggestion.subtitle && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">{suggestion.subtitle}</div>
                )}
              </div>
              <span className="ml-auto text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {suggestion.type}
              </span>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render search button
  const renderSearchButton = () => (
    <button
      onClick={handleSearch}
      className={`
        ${buttonBaseClasses}
        bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-red-600 dark:to-red-500
        text-white
        hover:from-indigo-500 hover:to-indigo-400 dark:hover:from-red-500 dark:hover:to-red-400
        shadow-[0_2px_8px_rgba(99,102,241,0.25)] dark:shadow-[0_2px_8px_rgba(239,68,68,0.25)]
        hover:shadow-[0_4px_12px_rgba(99,102,241,0.35)] dark:hover:shadow-[0_4px_12px_rgba(239,68,68,0.35)]
        flex-1 lg:flex-none
        min-w-[100px]
        flex items-center justify-center gap-2
      `}
    >
      <FiSearch className="h-4 w-4" />
      <span>Search</span>
    </button>
  );

  // Render filters button
  const renderFiltersButton = () => (
    showFilters && (
      <button
        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        className={`
          ${buttonBaseClasses}
          bg-white/90 dark:bg-gray-900/90
          border border-gray-200/50 dark:border-gray-700/50
          hover:bg-gray-50/90 dark:hover:bg-gray-800/90
          text-gray-700 dark:text-gray-300
          flex-1 lg:flex-none
          min-w-[100px]
          flex items-center justify-center gap-2
          backdrop-blur-xl
        `}
      >
        <FiFilter className={`h-4 w-4 ${showAdvancedFilters ? 'text-indigo-500 dark:text-red-500' : ''}`} />
        <span>Filters</span>
      </button>
    )
  );

  // Add this before the return statement
  const renderAdvancedFilters = () => (
    <AnimatePresence>
      {showAdvancedFilters && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute z-50 left-0 right-0 mt-3 p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100/20 dark:border-gray-800/20"
        >
          {/* Price Range */}
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-800 dark:text-gray-200 mb-3">
              Price Range (€{filters.priceRange.min} - €{filters.priceRange.max})
            </label>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={filters.priceRange.min}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  priceRange: {
                    ...prev.priceRange,
                    min: Math.min(parseInt(e.target.value), prev.priceRange.max)
                  }
                }))}
                className="w-full accent-indigo-500 dark:accent-red-500"
              />
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={filters.priceRange.max}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  priceRange: {
                    ...prev.priceRange,
                    max: Math.max(parseInt(e.target.value), prev.priceRange.min)
                  }
                }))}
                className="w-full accent-indigo-500 dark:accent-red-500"
              />
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-800 dark:text-gray-200 mb-3">
              Minimum Rating
            </label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilters(prev => ({ ...prev, rating }))}
                  className={`
                    p-3 rounded-xl transition-all duration-200
                    ${filters.rating === rating
                      ? 'bg-indigo-500 dark:bg-red-500 text-white shadow-lg'
                      : 'bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-200/80 dark:hover:bg-gray-700/80'
                    }
                  `}
                >
                  <FiStar className={filters.rating === rating ? 'fill-current' : ''} />
                </button>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-800 dark:text-gray-200 mb-3">
              Facilities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {facilityOptions.map((facility) => (
                <label
                  key={facility.value}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                    ${filters.facilities.includes(facility.value)
                      ? 'bg-indigo-50 dark:bg-red-900/30 text-indigo-600 dark:text-red-400'
                      : 'bg-gray-50/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={filters.facilities.includes(facility.value)}
                    onChange={() => {
                      setFilters(prev => ({
                        ...prev,
                        facilities: prev.facilities.includes(facility.value)
                          ? prev.facilities.filter(f => f !== facility.value)
                          : [...prev.facilities, facility.value]
                      }));
                    }}
                    className="rounded border-gray-300 dark:border-gray-600 text-indigo-500 dark:text-red-500 focus:ring-indigo-500 dark:focus:ring-red-500"
                  />
                  <span className="text-sm">{facility.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-base font-medium text-gray-800 dark:text-gray-200 mb-3">
              Sort by
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                sortBy: e.target.value as FilterState['sortBy']
              }))}
              className={`
                ${inputBaseClasses}
                pr-10
                appearance-none
                bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236b7280%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')]
                bg-[length:1.5em_1.5em]
                bg-[right_0.5em_center]
                bg-no-repeat
              `}
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Rating: High to Low</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="distance">Distance</option>
            </select>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <motion.div 
        className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Main search section */}
        <div className="flex-1 flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:gap-2">
          {/* Search input - always visible */}
          <div className="relative flex-1 min-w-0">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className={iconBaseClasses} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={placeholder}
              className={`${inputBaseClasses} pl-11`}
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <FiX className={iconBaseClasses} />
              </button>
            )}
          </div>

          {/* Additional inputs based on variant */}
          {variant !== 'simple' && variant !== 'dashboard' && (
            <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:gap-2">
              {/* Sport dropdown */}
              <div className="relative w-full sm:w-40">
                <button
                  onClick={() => setShowSportDropdown(!showSportDropdown)}
                  className={`${inputBaseClasses} flex items-center justify-between pr-4`}
                >
                  <span className="truncate">{sportOptions.find(opt => opt.value === sport)?.label || 'Sport'}</span>
                  <FiChevronDown className={`${iconBaseClasses} ml-2 transition-transform duration-200 ${showSportDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showSportDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-50 w-full mt-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg
                        border border-gray-100/20 dark:border-gray-800/20 overflow-hidden"
                    >
                      <div className="max-h-60 sm:max-h-48 overflow-y-auto overscroll-contain">
                        {sportOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSport(option.value);
                              setShowSportDropdown(false);
                            }}
                            className={`
                              w-full text-left px-4 py-3 sm:py-2.5
                              text-base sm:text-sm
                              transition-colors duration-200
                              hover:bg-indigo-50/50 dark:hover:bg-red-900/30
                              active:bg-indigo-100/50 dark:active:bg-red-900/50
                              ${sport === option.value ? 'bg-indigo-50/80 dark:bg-red-900/50 text-indigo-600 dark:text-red-500 font-medium' : ''}
                            `}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Date and Time inputs for full variant */}
              {variant === 'full' && (
                <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:gap-2">
                  <div className="relative w-full sm:w-40">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiCalendar className={iconBaseClasses} />
                    </div>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={`${inputBaseClasses} pl-11 cursor-pointer`}
                    />
                  </div>
                  <div className="relative w-full sm:w-32">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiClock className={iconBaseClasses} />
                    </div>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className={`${inputBaseClasses} pl-11 cursor-pointer`}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className={`
              ${buttonBaseClasses}
              bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-red-600 dark:to-red-500
              text-white
              hover:from-indigo-500 hover:to-indigo-400 dark:hover:from-red-500 dark:hover:to-red-400
              active:from-indigo-700 active:to-indigo-600 dark:active:from-red-700 dark:active:to-red-600
            `}
          >
            <span className="flex items-center justify-center gap-2">
              <FiSearch className={iconBaseClasses.replace('text-gray-400', 'text-white')} />
              <span>Search</span>
            </span>
          </button>

          {variant === 'full' && showFilters && (
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`
                ${buttonBaseClasses}
                bg-white/95 dark:bg-gray-900/95
                border border-gray-200/50 dark:border-gray-700/50
                text-gray-700 dark:text-gray-300
                hover:bg-gray-50/95 dark:hover:bg-gray-800/95
                active:bg-gray-100/95 dark:active:bg-gray-700/95
              `}
            >
              <span className="flex items-center justify-center gap-2">
                <FiFilter className={`${iconBaseClasses} ${showAdvancedFilters ? 'text-indigo-500 dark:text-red-500' : ''}`} />
                <span>Filters</span>
              </span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute z-50 left-0 right-0 mt-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg 
              border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
          >
            <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto overscroll-contain">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 sm:py-2.5 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 
                    active:bg-gray-100/80 dark:active:bg-gray-700/80 flex items-center gap-3 text-left"
                >
                  {suggestion.type === 'place' && suggestion.image && (
                    <div className="relative w-12 h-12 sm:w-10 sm:h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={suggestion.image}
                        alt={suggestion.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-base sm:text-sm text-gray-900 dark:text-gray-100">{suggestion.name}</div>
                    {suggestion.subtitle && (
                      <div className="text-sm sm:text-xs text-gray-500 dark:text-gray-400">{suggestion.subtitle}</div>
                    )}
                  </div>
                  <span className="ml-auto text-xs uppercase text-gray-400 dark:text-gray-500 
                    bg-gray-100/80 dark:bg-gray-800/80 px-2 py-1 rounded-md">
                    {suggestion.type}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Filters */}
      {variant === 'full' && renderAdvancedFilters()}
    </div>
  );
} 