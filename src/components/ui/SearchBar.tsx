import React from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
  showFiltersButton?: boolean;
  showFilters?: boolean;
  setShowFilters?: (show: boolean) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  placeholder = "Search...",
  showFiltersButton = false,
  showFilters = false,
  setShowFilters,
  className = "",
}) => {
  return (
    <div className={`bg-white border-b border-neutral-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <FiSearch className="absolute left-4 top-4 text-neutral-400" />
          </div>
          
          {showFiltersButton && setShowFilters && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center px-5 py-3.5 rounded-xl transition-all ${
                showFilters 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                  : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200'
              }`}
            >
              {showFilters ? <FiX className="mr-2" /> : <FiFilter className="mr-2" />}
              {showFilters ? 'Close' : 'Filter'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 