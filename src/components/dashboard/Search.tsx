import React, { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
  debounceTime?: number;
}

export function Search({
  onSearch,
  placeholder = 'Search...',
  initialValue = '',
  className = '',
  debounceTime = 300,
}: SearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedTerm, setDebouncedTerm] = useState(initialValue);

  // Update search term when input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Clear search input
  const handleClear = () => {
    setSearchTerm('');
    setDebouncedTerm('');
    onSearch('');
  };

  // Debounce search term to avoid too frequent API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceTime]);

  // Call onSearch when debounced term changes
  useEffect(() => {
    onSearch(debouncedTerm);
  }, [debouncedTerm, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
      />
      {searchTerm && (
        <button
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={handleClear}
          type="button"
        >
          <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
} 