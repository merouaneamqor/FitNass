import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiClock, FiCalendar, FiSliders } from 'react-icons/fi';

interface Option {
  value: string;
  label: string;
}

interface Suggestion {
  id: string;
  name: string;
  type: 'club' | 'court' | 'coach' | 'location'; // Example types
}

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
  showFiltersButton?: boolean;
  showFilters?: boolean;
  setShowFilters?: (show: boolean) => void;
  className?: string;
  options?: Option[]; // Sport options
  selectedOption?: string;
  onOptionSelect?: (option: string) => void;
  date?: string;
  onDateChange?: (date: string) => void;
  time?: string;
  onTimeChange?: (time: string) => void;
  onSearch?: () => void;
  fetchSuggestions?: (query: string) => Promise<Suggestion[]>; // Prop for fetching suggestions
}

interface FilterOption {
  label: string;
  value: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  placeholder = "Search clubs, courts, coaches...", // Updated placeholder
  showFiltersButton = false,
  showFilters = false,
  setShowFilters,
  className = "bg-white dark:bg-gray-800 text-black dark:text-white",
  options = [], // Sport options
  selectedOption = "", // Sport selection
  onOptionSelect,
  date,
  onDateChange,
  time,
  onTimeChange,
  onSearch,
  fetchSuggestions, // Function to get suggestions
}) => {
  const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const sportDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Default sport options if none provided
  const defaultOptions: Option[] = [
    { value: 'padel', label: 'Padel' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'football', label: 'Football' },
    { value: 'football7', label: 'Football 7' },
    { value: 'futsal', label: 'Futsal' },
    { value: 'padbol', label: 'Padbol' },
  ];
  const displayOptions = options.length > 0 ? options : defaultOptions;

  // --- Filter Data (Example) ---
  const facilities: FilterOption[] = [
    { label: 'Indoor Courts', value: 'indoor' }, { label: 'Outdoor Courts', value: 'outdoor' },
    { label: 'Locker Rooms', value: 'lockers' }, { label: 'Showers', value: 'showers' },
    { label: 'Parking', value: 'parking' }, { label: 'Equipment Rental', value: 'equipment' },
    { label: 'Bar/Restaurant', value: 'restaurant' }, { label: 'Coaching Available', value: 'coaching' },
  ];
  const distances: FilterOption[] = [
    { label: '< 1 km', value: '1' }, { label: '< 5 km', value: '5' },
    { label: '< 10 km', value: '10' }, { label: '< 20 km', value: '20' },
    { label: 'Any distance', value: 'any' },
  ];
  // --- End Filter Data ---

  // --- Suggestion Logic --- (Needs Debouncing in real app)
  useEffect(() => {
    const loadSuggestions = async () => {
      if (searchQuery.length > 1 && fetchSuggestions && isSearchFocused) {
        setIsSuggesting(true);
        try {
          // In a real app, debounce this call
          const fetched = await fetchSuggestions(searchQuery);
          setSuggestions(fetched);
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
          setSuggestions([]); // Clear on error
        } finally {
          setIsSuggesting(false);
        }
      } else {
        setSuggestions([]); // Clear if query is short or input not focused
      }
    };

    const timeoutId = setTimeout(loadSuggestions, 300); // Basic debounce
    return () => clearTimeout(timeoutId);
    
  }, [searchQuery, fetchSuggestions, isSearchFocused]);
  // --- End Suggestion Logic ---

  // --- Click Outside Handlers ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close sport dropdown
      if (sportDropdownRef.current && !sportDropdownRef.current.contains(event.target as Node)) {
        setIsSportDropdownOpen(false);
      }
      // Close suggestions dropdown
      if (
        suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current && !searchInputRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
        setIsSearchFocused(false); // Also unfocus search if clicking outside suggestions & input
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // --- End Click Outside Handlers ---

  const handleSportSelect = (optionValue: string) => {
    if (onOptionSelect) {
      onOptionSelect(optionValue);
    }
    setIsSportDropdownOpen(false);
  };
  
  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSearchQuery(suggestion.name); // Set input to suggestion name
    setSuggestions([]); // Close suggestions
    // Optionally trigger search immediately or let user click search
    // if (onSearch) onSearch(); 
  };

  const toggleFacility = (value: string) => {
    setSelectedFacilities(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const currentDate = new Date().toISOString().split('T')[0];
  const defaultTime = '19:00';

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch();
    }
    setSuggestions([]); // Hide suggestions on search click
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(prev => !prev);
  };

  // Define base input classes for reuse - Remove opacity
  const inputBaseClasses = "w-full pl-10 pr-3 py-3.5 rounded-xl border border-transparent bg-neutral-100 dark:bg-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-fitnass-pink dark:focus:ring-red-500 transition-all appearance-none";
  const buttonBaseClasses = "flex items-center justify-between w-full px-4 py-3.5 rounded-xl border border-transparent bg-neutral-100 dark:bg-gray-700 dark:text-gray-100 hover:bg-neutral-200 dark:hover:bg-gray-600 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-fitnass-pink dark:focus:ring-red-500 transition-all";

  return (
    // Restore background and rounded corners from the className prop
    <div className={`rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white ${className}`}> 
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Main Search Row */}
        <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
          {/* Left section: Location input with Suggestions */}
          <div className="relative flex-1 min-w-[200px] w-full">
            <input
              ref={searchInputRef}
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              // Use base classes, remove individual border/bg
              className={`${inputBaseClasses} pl-10`} 
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={suggestions.length > 0}
              aria-controls="search-suggestions"
              aria-label="Search for clubs, courts, coaches, or locations"
            />
            {/* Use gray icon color in dark mode */}
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-gray-400 pointer-events-none" />
            {/* Suggestions Dropdown */} 
            {isSearchFocused && suggestions.length > 0 && (
              <div 
                id="search-suggestions"
                ref={suggestionsRef} 
                // Align dark styles with NavBar dropdowns (gray palette)
                className="absolute left-0 z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-b-lg shadow-lg max-h-60 overflow-y-auto"
                role="listbox"
              >
                {isSuggesting ? (
                   <div className="px-4 py-3 text-neutral-500 dark:text-gray-400 italic">Loading...</div>
                ) : (
                  suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      // Align dark hover/text with NavBar dropdowns
                      className="px-4 py-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-gray-700 transition-colors flex justify-between items-center"
                      onClick={() => handleSuggestionClick(suggestion)}
                      role="option"
                      aria-selected="false" 
                    >
                      <span className="dark:text-gray-100">{suggestion.name}</span>
                      {/* Align suggestion type styles */}
                      <span className="text-xs uppercase text-neutral-400 dark:text-gray-400 bg-neutral-100 dark:bg-gray-600 px-1.5 py-0.5 rounded">{suggestion.type}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sport dropdown */}
          <div className="relative min-w-[120px] w-full md:w-auto" ref={sportDropdownRef}>
            <button
              onClick={() => setIsSportDropdownOpen(!isSportDropdownOpen)}
              // Use base classes for buttons
              className={`${buttonBaseClasses}`}
              aria-haspopup="listbox"
              aria-expanded={isSportDropdownOpen}
              aria-label={`Selected sport: ${selectedOption || 'Padel'}`}
            >
              <span className="truncate">{selectedOption || "Padel"}</span>
              <FiChevronDown className={`ml-2 flex-shrink-0 transition-transform ${isSportDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isSportDropdownOpen && (
              <div 
                // Align dark styles with NavBar dropdowns
                className="absolute left-0 z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto"
                role="listbox"
              >
                {displayOptions.map((option) => (
                  <div
                    key={option.value}
                    // Align dark styles for selection/hover (using gray + fitnass accent)
                    className={`px-4 py-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedOption === option.value 
                        ? 'bg-indigo-50 dark:bg-gray-700 text-indigo-700 dark:text-red-500 font-medium' // Change neon to red for selected
                        : 'dark:text-gray-100' 
                    }`}
                    onClick={() => handleSportSelect(option.value)}
                    role="option"
                    aria-selected={selectedOption === option.value}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date input */}
          <div className="relative min-w-[150px] w-full md:w-auto">
             {/* Use gray icon color in dark mode */}
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-gray-400 pointer-events-none" />
            <input
              type="date" 
              value={date || currentDate}
              onChange={(e) => onDateChange && onDateChange(e.target.value)}
              // Use base classes
              className={`${inputBaseClasses}`}
              aria-label={`Selected date: ${date || 'Today'}`}
            />
          </div>

          {/* Time input */}
          <div className="relative min-w-[120px] w-full md:w-auto">
             {/* Use gray icon color in dark mode */}
            <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-gray-400 pointer-events-none" />
            <input
              type="time" 
              value={time || defaultTime}
              onChange={(e) => onTimeChange && onTimeChange(e.target.value)}
              // Use base classes
              className={`${inputBaseClasses}`}
              aria-label={`Selected time: ${time || defaultTime}`}
            />
          </div>

          {/* Search button */} 
          <button 
            onClick={handleSearchClick}
            // Match NavBar accent button style (assuming fitnass-coral/pink exist)
            className="flex-shrink-0 bg-gradient-to-r from-fitnass-coral to-fitnass-pink dark:from-red-600 dark:to-red-700 text-white font-bold w-full md:w-auto px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg hover:from-fitnass-pink hover:to-fitnass-coral dark:hover:from-red-700 dark:hover:to-red-600 whitespace-nowrap"
            aria-label="Submit search"
          >
            Search
          </button>
          
          {/* Advanced filters toggle (Keep styling as is, separate visual) */}
          {showFiltersButton && (
            <button
              onClick={toggleAdvancedFilters}
              // Align dark styles for toggle button states (gray + fitnass accent)
              className={`flex items-center justify-center w-full md:w-auto px-4 py-3.5 rounded-xl transition-all ${ 
                showAdvancedFilters 
                  ? 'bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-red-500 border border-indigo-200 dark:border-gray-600' // Active: gray bg, red text (not neon)
                  : 'bg-neutral-100 dark:bg-gray-800 text-neutral-600 dark:text-gray-300 border border-neutral-200 dark:border-gray-700 hover:bg-neutral-200 dark:hover:bg-gray-700' // Inactive: darker gray
              }`}
              aria-expanded={showAdvancedFilters}
              aria-controls="advanced-filters-panel"
            >
              <FiSliders className="mr-2" />
              {showAdvancedFilters ? 'Hide Filters' : 'Advanced Filters'}
            </button>
          )}
        </div>
        
        {/* Advanced Filters Panel (Keep styling as is) */}
        {showAdvancedFilters && (
            // Align dark styles for panel background/border
            <div id="advanced-filters-panel" className="mt-4 border-t border-neutral-200 dark:border-gray-700 pt-4 pb-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range Filter */}
              <div>
                {/* Align dark text */}
                <h3 className="text-sm font-medium text-neutral-700 dark:text-gray-300 mb-2">Price Range (€{priceRange[0]} - €{priceRange[1]})</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), Math.max(parseInt(e.target.value), priceRange[1])])}
                    // Align dark styles for slider track/thumb (gray + fitnass accent)
                    className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-neutral-200 dark:bg-gray-600 [&::-webkit-slider-thumb]:bg-fitnass-pink dark:[&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full"
                    aria-label="Minimum price"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([Math.min(priceRange[0], parseInt(e.target.value)), parseInt(e.target.value)])}
                    // Align dark styles for slider track/thumb (gray + fitnass accent)
                    className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-neutral-200 dark:bg-gray-600 [&::-webkit-slider-thumb]:bg-fitnass-pink dark:[&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full"
                    aria-label="Maximum price"
                  />
                </div>
              </div>
              
              {/* Facilities Filter */}
              <div>
                {/* Align dark text */}
                <h3 className="text-sm font-medium text-neutral-700 dark:text-gray-300 mb-2">Facilities</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {facilities.slice(0, 6).map((facility) => (
                    <div key={facility.value} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`facility-${facility.value}`}
                        checked={selectedFacilities.includes(facility.value)}
                        onChange={() => toggleFacility(facility.value)}
                        // Align dark styles for checkbox (gray + fitnass accent)
                        className="mr-2 h-4 w-4 text-fitnass-pink focus:ring-fitnass-pink dark:focus:ring-offset-gray-900 border-neutral-300 dark:border-gray-600 rounded cursor-pointer bg-white dark:bg-gray-800 dark:checked:bg-red-600"
                      />
                      {/* Align dark text */}
                      <label htmlFor={`facility-${facility.value}`} className="text-sm text-neutral-600 dark:text-gray-300 cursor-pointer">
                        {facility.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Distance Filter */}
              <div>
                {/* Align dark text */}
                <h3 className="text-sm font-medium text-neutral-700 dark:text-gray-300 mb-2">Distance</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {distances.map((distance) => (
                    <div key={distance.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`distance-${distance.value}`}
                        name="distance"
                        value={distance.value}
                        // Align dark styles for radio (gray + fitnass accent)
                        className="mr-2 h-4 w-4 text-fitnass-pink focus:ring-fitnass-pink dark:focus:ring-offset-gray-900 border-neutral-300 dark:border-gray-600 cursor-pointer bg-white dark:bg-gray-800 dark:checked:bg-red-600"
                        // Add state and onChange handler for distance selection
                      />
                      {/* Align dark text */}
                      <label htmlFor={`distance-${distance.value}`} className="text-sm text-neutral-600 dark:text-gray-300 cursor-pointer">
                        {distance.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Apply Filters button */}
            <div className="flex justify-end mt-4">
              {/* Align dark styles for button (using fitnass accent) */}
              <button className="px-4 py-2 bg-fitnass-pink dark:bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-fitnass-coral dark:hover:bg-red-700 transition-colors">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar; 