'use client';

import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchProps {
  onSearch: (value: string) => void;
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
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [value, onSearch, debounceTime]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          placeholder-gray-500 dark:placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-red-500/30
          focus:border-indigo-500/50 dark:focus:border-red-500/50
          transition-all duration-200"
      />
    </div>
  );
} 