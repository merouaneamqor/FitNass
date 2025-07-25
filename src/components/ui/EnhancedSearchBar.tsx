'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiMapPin, FiCalendar, FiClock, 
  FiChevronDown, FiX, FiArrowRight 
} from 'react-icons/fi';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery?: (query: string) => void;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  selectedOption?: string;
  onOptionSelect?: (option: string) => void;
  cityOptions?: Array<{ value: string; label: string }>;
  selectedCity?: string;
  onCitySelect?: (city: string) => void;
  date?: string;
  onDateChange?: (date: string) => void;
  time?: string;
  onTimeChange?: (time: string) => void;
  onSearch?: () => void;
  className?: string;
  compact?: boolean;
}

// Default cities
const defaultCities = [
  { value: 'casablanca', label: 'Casablanca' },
  { value: 'rabat', label: 'Rabat' },
  { value: 'marrakech', label: 'Marrakech' },
  { value: 'tangier', label: 'Tangier' },
  { value: 'agadir', label: 'Agadir' },
  { value: 'fes', label: 'Fes' }
];

export default function EnhancedSearchBar({
  searchQuery = '',
  setSearchQuery,
  placeholder = 'Address, club name, city...',
  options = [],
  selectedOption = 'padel',
  onOptionSelect,
  cityOptions = defaultCities,
  selectedCity = '',
  onCitySelect,
  date = new Date().toISOString().split('T')[0],
  onDateChange,
  time = '19:00',
  onTimeChange,
  onSearch,
  className = '',
  compact = false,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(searchQuery);
  const [sport, setSport] = useState(selectedOption);
  const [city, setCity] = useState(selectedCity);
  const [selectedDate, setSelectedDate] = useState(date);
  const [selectedTime, setSelectedTime] = useState(time);
  
  const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  
  const searchBarRef = useRef<HTMLDivElement>(null);
  const sportDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Update parent state when local state changes
  useEffect(() => {
    if (typeof setSearchQuery === 'function') {
      setSearchQuery(query);
    }
  }, [query, setSearchQuery]);

  useEffect(() => {
    if (typeof onOptionSelect === 'function' && sport !== selectedOption) {
      onOptionSelect(sport);
    }
  }, [sport, onOptionSelect, selectedOption]);

  useEffect(() => {
    if (typeof onCitySelect === 'function' && city !== selectedCity) {
      onCitySelect(city);
    }
  }, [city, onCitySelect, selectedCity]);

  useEffect(() => {
    if (typeof onDateChange === 'function' && selectedDate !== date) {
      onDateChange(selectedDate);
    }
  }, [selectedDate, onDateChange, date]);

  useEffect(() => {
    if (typeof onTimeChange === 'function' && selectedTime !== time) {
      onTimeChange(selectedTime);
    }
  }, [selectedTime, onTimeChange, time]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sportDropdownRef.current && 
        !sportDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSportDropdownOpen(false);
      }
      
      if (
        cityDropdownRef.current && 
        !cityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCityDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof onSearch === 'function') {
      onSearch();
    }
  };

  const handleSportSelect = (value: string) => {
    setSport(value);
    setIsSportDropdownOpen(false);
  };

  const handleCitySelect = (value: string) => {
    setCity(value);
    setIsCityDropdownOpen(false);
  };

  return (
    <div 
      ref={searchBarRef}
      className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg ${className}`}
    >
      <form onSubmit={handleSubmit} className="w-full">
        <div className={`flex flex-col md:flex-row transition-all duration-300 ${isMobileExpanded ? 'max-h-[400px]' : compact ? 'max-h-16' : 'max-h-16 md:max-h-none'}`}>
          {/* Main input container */}
          <div className={`flex flex-1 items-center p-2 md:p-3 ${compact ? '' : 'border-b md:border-b-0 md:border-r'} border-gray-200 dark:border-gray-700`}>
            <div className="flex items-center flex-1 relative">
              <FiSearch className="text-gray-400 ml-2 mr-3 h-5 w-5 flex-shrink-0" />
              <input
                type="text"
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 dark:text-white placeholder-gray-500 text-base font-inter"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button 
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Mobile toggle button */}
            {!compact && (
              <button
                type="button"
                className="md:hidden flex items-center justify-center p-2 ml-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                onClick={() => setIsMobileExpanded(!isMobileExpanded)}
              >
                <FiChevronDown
                  className={`h-4 w-4 transition-transform ${isMobileExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          </div>

          {/* Options row - collapses on mobile */}
          <div className={`flex flex-col md:flex-row md:items-center ${compact ? 'md:w-auto' : ''}`}>
            {/* City dropdown */}
            <div 
              ref={cityDropdownRef}
              className={`relative px-4 py-3 ${compact ? 'border-l' : 'border-b md:border-b-0 md:border-r'} border-gray-200 dark:border-gray-700`}
            >
              <button
                type="button"
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              >
                <FiMapPin className="text-gray-400 mr-2 h-4 w-4" />
                <span className="text-sm font-medium font-inter">
                  {city ? cityOptions.find(opt => opt.value === city)?.label : 'Select City'}
                </span>
                <FiChevronDown className={`h-4 w-4 transition-transform ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCityDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700"
                  >
                    {cityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`block w-full text-left px-4 py-2 text-sm font-inter ${
                          city === option.value
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => handleCitySelect(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Sport dropdown */}
            <div 
              ref={sportDropdownRef}
              className={`relative px-4 py-3 ${compact ? 'border-l' : 'border-b md:border-b-0 md:border-r'} border-gray-200 dark:border-gray-700`}
            >
              <button
                type="button"
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsSportDropdownOpen(!isSportDropdownOpen)}
              >
                <span className="text-sm font-medium font-inter">
                  {options.find(opt => opt.value === sport)?.label || 'Sport'}
                </span>
                <FiChevronDown className={`h-4 w-4 transition-transform ${isSportDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isSportDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700"
                  >
                    {options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`block w-full text-left px-4 py-2 text-sm font-inter ${
                          sport === option.value
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => handleSportSelect(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!compact && (
              <>
                {/* Date picker */}
                <div className="px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 flex items-center">
                  <FiCalendar className="text-gray-400 mr-2 h-4 w-4" />
                  <input
                    type="date"
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 dark:text-gray-300 text-sm font-inter"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                {/* Time picker */}
                <div className="px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 flex items-center">
                  <FiClock className="text-gray-400 mr-2 h-4 w-4" />
                  <input
                    type="time"
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 dark:text-gray-300 text-sm font-inter"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Search button */}
            <div className={`p-3 ${compact ? 'border-l border-gray-200 dark:border-gray-700' : ''}`}>
              <button
                type="submit"
                className="flex items-center px-6 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium font-heading rounded-lg transition-colors"
              >
                <span className="mr-2">Find Courts</span>
                <FiArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}