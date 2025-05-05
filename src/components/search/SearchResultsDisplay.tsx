'use client';

import Link from 'next/link';
import { FiSearch, FiMapPin, FiStar, FiAlertCircle, FiFilter, FiX, FiCpu, FiGrid, FiList, FiUsers, FiCalendar, FiChevronUp } from 'react-icons/fi';
import { GiSoccerField } from "react-icons/gi";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition, useEffect } from 'react';

import AnimatedBackground from '@/components/ui/AnimatedBackground';
import SearchResultsGrid from '@/components/search/SearchResultsGrid';
import PaginationControls from '@/components/search/PaginationControls';
import { SearchResult } from '@/types/search';
import { searchAction } from '@/app/actions/search';

interface SearchResultsData {
  results: SearchResult[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
  error: string | null;
}

interface SearchResultsDisplayProps {
  initialResults: SearchResultsData;
  searchParams: Record<string, string>;
}

export function SearchResultsDisplay({ initialResults, searchParams }: SearchResultsDisplayProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchResults, setSearchResults] = useState<SearchResultsData>(initialResults);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const currentQuery = searchParams.q || '';
  const currentCity = searchParams.city || '';
  const currentType = searchParams.type || 'all';

  // Handle scroll events to show/hide the filter button
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Update results client-side when filter changes
  const handleFilterChange = (param: string, value: string | null) => {
    const params = new URLSearchParams(urlSearchParams?.toString() || '');
    
    // Remove page and the param being changed
    params.delete('page');
    params.delete(param);
    
    // Add the new param if it has a value
    if (value && value !== 'all') {
      params.set(param, value);
    }
    
    const queryString = params.toString();
    const newPath = queryString ? `/search?${queryString}` : '/search';
    
    // Update the URL
    router.push(newPath);
    
    // Fetch new results using the server action
    startTransition(async () => {
      const results = await searchAction(params);
      setSearchResults(results);
    });

    // Close filter drawer after selection on mobile
    setIsFilterDrawerOpen(false);
  };

  // Helper to generate type badges with appropriate colors
  const getTypeBadge = (type: string) => {
    switch(type) {
      case 'gym':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700';
      case 'club':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700';
      case 'trainer':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700';
      case 'class':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700';
    }
  };

  // Icons for type filters
  const typeIcons = {
    'all': <FiGrid className="h-5 w-5 mr-2" />,
    'gym': <FiStar className="h-5 w-5 mr-2" />,
    'club': <GiSoccerField className="h-5 w-5 mr-2" />,
    'trainer': <FiUsers className="h-5 w-5 mr-2" />,
    'class': <FiCalendar className="h-5 w-5 mr-2" />
  };

  // Error Message Component
  function ErrorMessage({ message }: { message: string }) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-red-50/70 p-6 rounded-xl border border-red-200/80 shadow-lg">
        <FiAlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-700 font-semibold mb-2 text-lg">Search Failed</p>
        <p className="text-gray-600">{message}</p>
        <Link href="/" className="mt-6 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors shadow-md">
          Return Home
        </Link>
      </div>
    );
  }

  // No Results Message Component
  function NoResultsMessage() {
    return (
      <div className="text-center py-20 bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/60 shadow-lg">
        <FiAlertCircle className="h-14 w-14 mx-auto text-gray-400 mb-5" />
        <p className="text-gray-700 font-semibold text-xl mb-2">No venues found matching your criteria.</p>
        <p className="text-gray-500 mb-6">Try adjusting your search query or city.</p>
        <Link href="/" className="inline-block px-6 py-3 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black rounded-lg transition-colors duration-200 shadow-md">
          Return to Homepage
        </Link>
      </div>
    );
  }

  const { results, currentPage, totalPages, totalResults, error } = searchResults;

  // Filter components - used in both mobile drawer and desktop sidebar
  const FilterComponents = () => (
    <>
      {/* Filters Header */}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 border-b border-gray-200/80 dark:border-gray-700/80 pb-2 flex items-center">
        <FiFilter className="h-5 w-5 mr-2"/> Filters
      </h2>
      
      {/* Keyword & City inputs with improved styling */}
      <div className="mb-5">
        <label htmlFor="search-term" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Keywords</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input 
            type="text" 
            id="search-term" 
            readOnly 
            value={currentQuery} 
            placeholder="Any keywords..." 
            className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/60 text-base text-gray-600 dark:text-gray-200 border border-gray-200/70 dark:border-gray-600/40 shadow-inner cursor-not-allowed"
          />
        </div>
      </div>
      
      <div className="mb-5">
        <label htmlFor="city-term" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input 
            type="text" 
            id="city-term" 
            readOnly 
            value={currentCity} 
            placeholder="Any city" 
            className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/60 text-base text-gray-600 dark:text-gray-200 border border-gray-200/70 dark:border-gray-600/40 shadow-inner cursor-not-allowed"
          />
        </div>
      </div>
      
      {/* Enhanced Type Filter */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Type</label>
        <div className="grid gap-2">
          {[ 
            { label: 'All Types', value: 'all', icon: typeIcons.all },
            { label: 'Gyms', value: 'gym', icon: typeIcons.gym }, 
            { label: 'Clubs', value: 'club', icon: typeIcons.club },
            { label: 'Trainers', value: 'trainer', icon: typeIcons.trainer },
            { label: 'Classes', value: 'class', icon: typeIcons.class }
          ].map(type => (
            <button 
              key={type.value}
              onClick={() => handleFilterChange('type', type.value === 'all' ? null : type.value)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg text-base transition-all duration-200 ${
                currentType === type.value
                ? 'bg-black text-white font-medium border border-black dark:bg-white dark:text-black dark:border-white shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/40 border border-transparent'
              }`}
            >
              <span className="flex items-center">
                {type.icon}
                {type.label}
              </span>
              {currentType === type.value && (
                <span className="bg-gray-700 text-white dark:bg-gray-200 dark:text-black text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Reset filters button */}
      <div className="mt-6">
        <button
          onClick={() => {
            router.push('/search');
            setIsFilterDrawerOpen(false);
          }}
          className="w-full flex items-center justify-center px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-base font-medium transition-colors"
        >
          <FiX className="h-5 w-5 mr-2" />
          Reset All Filters
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Header */}
        <div className="mb-6 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Search Results
          </h1>
          <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            <FiCpu className="h-5 w-5 mr-2 text-black dark:text-white"/>
            <span>
              {totalResults > 0 
                ? `Found ${totalResults} match${totalResults === 1 ? '' : 'es'} for your search.` 
                : 'Discover gyms, clubs, trainers and classes near you.'}
            </span>
          </div>
          
          {/* Active filters display as horizontal scrollable pills */}
          {(currentQuery || currentCity || currentType !== 'all') && (
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Active filters:</span>
              {currentQuery && (
                <span className="px-3 py-2 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white rounded-full text-sm flex items-center border border-gray-200 dark:border-gray-700 whitespace-nowrap">
                  <FiSearch className="h-4 w-4 mr-1.5" />
                  {currentQuery}
                </span>
              )}
              {currentCity && (
                <span className="px-3 py-2 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white rounded-full text-sm flex items-center border border-gray-200 dark:border-gray-700 whitespace-nowrap">
                  <FiMapPin className="h-4 w-4 mr-1.5" />
                  {currentCity}
                </span>
              )}
              {currentType !== 'all' && (
                <span className={`px-3 py-2 rounded-full text-sm flex items-center border whitespace-nowrap ${getTypeBadge(currentType)}`}>
                  {typeIcons[currentType as keyof typeof typeIcons]}
                  {currentType.charAt(0).toUpperCase() + currentType.slice(1)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Main grid layout - desktop has sidebar, mobile is full width */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Sidebar - Hidden on Mobile */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-6 rounded-xl border border-gray-200/60 dark:border-gray-700/40 shadow-xl shadow-black/5 sticky top-20">
              <FilterComponents />
            </div>
          </aside>

          {/* Main content - Goes full width on mobile */}
          <main className="col-span-1 lg:col-span-3">
            {error && <ErrorMessage message={error} />}
            
            {isPending && (
              <div className="flex justify-center items-center py-12">
                <div className="w-14 h-14 border-4 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {!error && !isPending && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 sm:p-6 rounded-xl border border-gray-200/60 dark:border-gray-700/40 shadow-xl shadow-black/5">
                {/* Results summary header */}
                {results.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-3 border-b border-gray-200/80 dark:border-gray-700/80 gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {totalResults} Result{totalResults !== 1 ? 's' : ''}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Page {currentPage} of {totalPages}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                      <select className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm px-3 py-2">
                        <option>Relevance</option>
                        <option>Rating</option>
                        <option>Price (low to high)</option>
                        <option>Price (high to low)</option>
                      </select>
                    </div>
                  </div>
                )}
                
                {results.length === 0 && !error && <NoResultsMessage />}
                
                {results.length > 0 && (
                  <>
                    <SearchResultsGrid results={results} />
                    <div className="mt-8 pt-4 border-t border-gray-200/80 dark:border-gray-700/80">
                      <PaginationControls 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        searchParams={searchParams} 
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Button - Fixed at the bottom */}
      <div className={`fixed bottom-0 left-0 right-0 z-30 transition-transform duration-300 ${isScrolled ? 'translate-y-0' : 'translate-y-full lg:translate-y-full'} lg:hidden`}>
        <button
          onClick={() => setIsFilterDrawerOpen(true)}
          className="flex items-center justify-center w-full py-4 bg-black text-white dark:bg-white dark:text-black font-medium text-lg shadow-lg"
        >
          <FiFilter className="h-5 w-5 mr-2" />
          Filters
        </button>
      </div>

      {/* Mobile Filter Drawer - Slides up from bottom */}
      <div 
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 lg:hidden ${
          isFilterDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsFilterDrawerOpen(false)}
      >
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl p-6 transition-transform duration-300 transform ${
            isFilterDrawerOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          onClick={e => e.stopPropagation()}
          style={{ maxHeight: '85vh', overflowY: 'auto' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <FiFilter className="h-5 w-5 mr-2"/> Filters
            </h2>
            <button 
              onClick={() => setIsFilterDrawerOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mb-2 w-16 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto"></div>
          
          <FilterComponents />
          
          <div className="h-16"></div> {/* Spacing at the bottom for safe area */}
        </div>
      </div>
    </div>
  );
} 