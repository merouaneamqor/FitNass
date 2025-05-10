'use client';

import Link from 'next/link';
import { FiSearch, FiMapPin, FiStar, FiAlertCircle, FiFilter, FiX, FiCpu, FiGrid, FiList, FiUsers, FiCalendar, FiChevronUp, FiHome, FiSliders, FiCheckCircle } from 'react-icons/fi';
import { GiSoccerField } from "react-icons/gi";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [searchResults, setSearchResults] = useState<SearchResultsData>(initialResults);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const currentQuery = searchParams.q || '';
  const currentCity = searchParams.city || '';
  const currentType = searchParams.type || 'all';

  // Listen for URL changes and update results
  useEffect(() => {
    // Don't refetch on initial render since we already have initialResults
    if (typeof window !== 'undefined' && window.history.state?.idx > 0) {
      console.log('URL changed, fetching new results');
      
      // Convert URLSearchParams to plain object
      const params: Record<string, string> = {};
      urlSearchParams.forEach((value, key) => {
        params[key] = value;
      });
      
      // Fetch new results based on URL parameters
      startTransition(async () => {
        const results = await searchAction(params);
        setSearchResults(results);
      });
    }
  }, [urlSearchParams, pathname]);

  // Initialize activeTab based on current type
  useEffect(() => {
    setActiveTab(currentType);
  }, [currentType]);

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
    // Create a copy of the current parameters
    const newParams: Record<string, string> = {};
    
    // Copy existing parameters except for page and the one being changed
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== 'page' && key !== param && value) {
        newParams[key] = value;
      }
    });
    
    // Add the new parameter if it has a value
    if (value && value !== 'all') {
      newParams[param] = value;
    }
    
    // Convert to query string
    const queryParams = new URLSearchParams(newParams);
    const queryString = queryParams.toString();
    const newPath = queryString ? `/search?${queryString}` : '/search';
    
    // Update the URL
    router.push(newPath);
    
    // Fetch new results using the server action
    startTransition(async () => {
      // Pass the newParams object to be consistent with how the server action expects parameters
      const results = await searchAction(newParams);
      setSearchResults(results);
    });

    // Close filter drawer after selection on mobile
    setIsFilterDrawerOpen(false);
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

  // YouTube-like sidebar navigation items
  const sidebarItems = [
    { icon: <FiHome className="h-5 w-5" />, label: 'Home', href: '/', value: null },
    { icon: <FiStar className="h-5 w-5" />, label: 'Gyms', value: 'gym', href: null },
    { icon: <GiSoccerField className="h-5 w-5" />, label: 'Clubs', value: 'club', href: null },
    { icon: <FiUsers className="h-5 w-5" />, label: 'Trainers', value: 'trainer', href: null },
    { icon: <FiCalendar className="h-5 w-5" />, label: 'Classes', value: 'class', href: null },
  ];

  // Advanced filter sidebar component
  const AdvancedFilters = () => (
    <>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <FiSliders className="h-5 w-5 mr-2"/> Advanced Filters
      </h2>
      
      {/* Keyword & City inputs with improved styling */}
      <div className="mb-5">
        <label htmlFor="search-term" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Keywords</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="text" 
            id="search-term" 
            readOnly 
            value={currentQuery} 
            placeholder="Any keywords..." 
            className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-50 text-base text-gray-600 border border-gray-200 shadow-inner cursor-not-allowed"
          />
        </div>
      </div>
      
      <div className="mb-5">
        <label htmlFor="city-term" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="text" 
            id="city-term" 
            readOnly 
            value={currentCity} 
            placeholder="Any city" 
            className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-50 text-base text-gray-600 border border-gray-200 shadow-inner cursor-not-allowed"
          />
        </div>
      </div>
      
      {/* Reset filters button */}
      <div className="mt-6">
        <button
          onClick={() => {
            router.push('/search');
            setIsFilterDrawerOpen(false);
          }}
          className="w-full flex items-center justify-center px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-base font-medium transition-colors"
        >
          <FiX className="h-5 w-5 mr-2" />
          Reset All Filters
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* YouTube-like sidebar - Hidden on mobile */}
        <aside className="hidden md:flex flex-col w-60 fixed left-0 top-0 bottom-0 p-4 bg-white dark:bg-gray-800 shadow-md z-30 overflow-y-auto">
          {/* Top items - main navigation */}
          <div className="mb-6">
            <div className="px-3 py-3 mb-4">
              <Link href="/" className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">FitNass</h1>
              </Link>
            </div>
            
            <nav>
              <ul className="space-y-1">
                {sidebarItems.map((item) => (
                  <li key={item.label}>
                    {item.value ? (
                      <button
                        onClick={() => handleFilterChange('type', item.value === 'all' ? null : item.value)}
                        className={`flex items-center w-full px-3 py-2.5 rounded-lg text-base transition-colors ${
                          currentType === item.value 
                            ? 'bg-gray-100 dark:bg-gray-700 font-medium' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.label}</span>
                        {currentType === item.value && (
                          <FiCheckCircle className="ml-auto h-4 w-4 text-blue-600" />
                        )}
                      </button>
                    ) : (
                      <Link 
                        href={item.href || '/'}
                        className="flex items-center px-3 py-2.5 rounded-lg text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          {/* Advanced filters section */}
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <AdvancedFilters />
          </div>
        </aside>

        {/* Main content - Use padding to make room for sidebar on desktop */}
        <main className="flex-1 md:ml-60 p-4">
          <div className="max-w-6xl mx-auto">
            {/* Header with search info */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {currentQuery ? `Search: "${currentQuery}"` : 'Search Results'}
              </h1>
              <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                <FiCpu className="h-5 w-5 mr-2 text-black dark:text-white"/>
                <span>
                  {totalResults > 0 
                    ? `Found ${totalResults} match${totalResults === 1 ? '' : 'es'} for your search.` 
                    : 'Discover gyms, clubs, trainers and classes near you.'}
                </span>
              </div>
            </div>

            {/* YouTube-like Filter Tabs */}
            <div className="mb-6 overflow-x-auto py-1 no-scrollbar">
              <div className="flex space-x-2 min-w-max">
                {[
                  { label: 'All', value: 'all', icon: typeIcons.all },
                  { label: 'Gyms', value: 'gym', icon: typeIcons.gym },
                  { label: 'Clubs', value: 'club', icon: typeIcons.club },
                  { label: 'Trainers', value: 'trainer', icon: typeIcons.trainer },
                  { label: 'Classes', value: 'class', icon: typeIcons.class },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => {
                      setActiveTab(tab.value);
                      handleFilterChange('type', tab.value === 'all' ? null : tab.value);
                    }}
                    className={`flex items-center px-4 py-2 rounded-full transition-colors ${
                      activeTab === tab.value
                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-medium'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="flex items-center">
                      {tab.value === activeTab ? (
                        <>{tab.icon} {tab.label}</>
                      ) : tab.label}
                    </span>
                  </button>
                ))}
                
                {/* Additional filter categories could go here */}
                <button className="flex items-center px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <FiSliders className="h-4 w-4 mr-2"/>
                  Filters
                </button>
              </div>
            </div>
            
            {/* Main content area */}
            {error && <ErrorMessage message={error} />}
            
            {isPending && (
              <div className="flex justify-center items-center py-12">
                <div className="w-14 h-14 border-4 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {!error && !isPending && (
              <div>
                {/* Results summary header */}
                {results.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-3 border-b border-gray-200 dark:border-gray-700 gap-3">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
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
                    <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
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
          </div>
        </main>
      </div>

      {/* Mobile Filter Drawer - Slides up from bottom */}
      <div 
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 md:hidden ${
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
          
          {/* Mobile Navigation */}
          <nav className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <ul className="space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.label}>
                  {item.value ? (
                    <button
                      onClick={() => handleFilterChange('type', item.value === 'all' ? null : item.value)}
                      className={`flex items-center w-full px-4 py-3 rounded-lg text-base transition-colors ${
                        currentType === item.value 
                          ? 'bg-gray-100 dark:bg-gray-700 font-medium' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                      {currentType === item.value && (
                        <FiCheckCircle className="ml-auto h-4 w-4 text-blue-600" />
                      )}
                    </button>
                  ) : (
                    <Link 
                      href={item.href || '/'}
                      className="flex items-center px-4 py-3 rounded-lg text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          
          <AdvancedFilters />
          
          <div className="h-16"></div> {/* Spacing at the bottom for safe area */}
        </div>
      </div>
      
      {/* Mobile Filter Button - Fixed at the bottom */}
      <div className={`fixed bottom-0 left-0 right-0 z-30 transition-transform duration-300 ${isScrolled ? 'translate-y-0' : 'translate-y-full md:translate-y-full'} md:hidden`}>
        <button
          onClick={() => setIsFilterDrawerOpen(true)}
          className="flex items-center justify-center w-full py-4 bg-black text-white dark:bg-white dark:text-black font-medium text-lg shadow-lg"
        >
          <FiFilter className="h-5 w-5 mr-2" />
          Filters
        </button>
      </div>
    </div>
  );
} 