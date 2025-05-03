import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiClock, FiCalendar, FiSliders } from 'react-icons/fi';

interface NavbarSearchBarProps {
  className?: string;
  initialQuery?: string;
  initialSport?: string;
  initialDate?: string;
  initialTime?: string;
  onSearch?: () => void;
}

export default function NavbarSearchBar({
  className = "",
  initialQuery = "",
  initialSport = "padel",
  initialDate = "",
  initialTime = "",
  onSearch
}: NavbarSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showSportDropdown, setShowSportDropdown] = useState(false);
  const [selectedSport, setSelectedSport] = useState(initialSport);
  const [selectedDate, setSelectedDate] = useState(initialDate || (() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }));
  const [selectedTime, setSelectedTime] = useState(initialTime || '19:00');
  
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const sportDropdownRef = useRef<HTMLDivElement>(null);
  
  // Sport options
  const sportOptions = [
    { value: 'padel', label: 'Padel' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'football', label: 'Football' },
    { value: 'football7', label: 'Football 7' },
    { value: 'futsal', label: 'Futsal' },
    { value: 'padbol', label: 'Padbol' },
  ];

  // Handle clicking outside dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sportDropdownRef.current && !sportDropdownRef.current.contains(event.target as Node)) {
        setShowSportDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedSport) params.append('sport', selectedSport);
    if (selectedDate) params.append('date', selectedDate);
    if (selectedTime) params.append('time', selectedTime);
    
    router.push(`/search?${params.toString()}`);
    
    if (onSearch) onSearch();
  };

  return (
    <div ref={searchRef} className={`flex items-center gap-2 ${className}`}>
      {/* Location input */}
      <div className="relative">
        <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-red-900/40 rounded-full px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-yellow-500 dark:focus-within:ring-red-500">
          <FiSearch className="h-4 w-4 text-gray-500 dark:text-red-400" />
          <input
            type="text"
            placeholder="Address, club, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-2 bg-transparent border-0 focus:outline-none focus:ring-0 w-36 sm:w-48 text-sm"
            aria-label="Search location"
          />
        </div>
      </div>
      
      {/* Sport dropdown */}
      <div className="relative" ref={sportDropdownRef}>
        <button
          onClick={() => setShowSportDropdown(!showSportDropdown)}
          className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-300 dark:border-red-900/40 shadow-sm px-3 py-2 rounded-full text-sm"
          aria-expanded={showSportDropdown}
        >
          <span className="truncate">{selectedSport}</span>
          <FiChevronDown className={`ml-1 h-3 w-3 transition-transform ${showSportDropdown ? 'rotate-180' : ''}`} />
        </button>
        
        {showSportDropdown && (
          <div className="absolute right-0 z-50 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-red-900/40 rounded-lg shadow-lg">
            {sportOptions.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-red-950/20 ${
                  selectedSport === option.value
                    ? 'bg-yellow-50 dark:bg-red-950/30 text-yellow-600 dark:text-red-500 font-medium'
                    : 'dark:text-gray-100'
                }`}
                onClick={() => {
                  setSelectedSport(option.value);
                  setShowSportDropdown(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Search button */}
      <button
        onClick={handleSearch}
        className="bg-yellow-500 dark:bg-red-600 border border-yellow-600 dark:border-red-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all"
        aria-label="Search"
      >
        <FiSearch className="h-4 w-4" />
      </button>
    </div>
  );
} 