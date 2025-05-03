'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiMapPin, FiStar, FiAlertCircle, FiChevronLeft, FiChevronRight, FiFilter, FiX, FiCpu, FiGrid, FiList, FiUsers, FiCalendar } from 'react-icons/fi';
import { GiSoccerField } from "react-icons/gi";
import { motion } from 'framer-motion'; // Import motion
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

// Import components
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import SearchResultsGrid from '@/components/search/SearchResultsGrid';
import PaginationControls from '@/components/search/PaginationControls';
import { SearchResult, SearchParams } from '@/types/search';

// Create a client-side search page component
export default function ClientSearchPage() {
    const searchParams = useSearchParams();
    const [searchResults, setSearchResults] = useState<{
        results: SearchResult[],
        currentPage: number,
        totalPages: number,
        totalResults: number,
        error: string | null
    }>({
        results: [],
        currentPage: 1,
        totalPages: 1,
        totalResults: 0,
        error: null
    });
    const [loading, setLoading] = useState(true);
    
    const currentQuery = searchParams?.get('q') || '';
    const currentCity = searchParams?.get('city') || '';
    const currentType = searchParams?.get('type') || 'all';
    
    // Fetch search results from server
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Use the current URL to fetch the data
                const response = await fetch(`/api/search${window.location.search}`);
                if (!response.ok) throw new Error('Failed to fetch search results');
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Error fetching search results:', error);
                setSearchResults(prev => ({
                    ...prev,
                    error: 'Failed to fetch search results. Please try again later.'
                }));
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [searchParams]);
    
    const { results, currentPage, totalPages, totalResults, error } = searchResults;

    const createFilterURL = (param: string, value: string | undefined | null) => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        
        // Remove page and the param being changed
        params.delete('page');
        params.delete(param);
        
        // Add the new/updated param if it has a value
        if (value && value !== 'all') {
            params.set(param, value);
        }
        
        const queryString = params.toString();
        return queryString ? `/search?${queryString}` : '/search';
    };

    // Helper to generate type badges with appropriate colors
    const getTypeBadge = (type: string) => {
        switch(type) {
            case 'gym':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'club':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'trainer':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'class':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Icons for type filters
    const typeIcons = {
        'all': <FiGrid className="h-4 w-4 mr-2" />,
        'gym': <FiStar className="h-4 w-4 mr-2" />,
        'club': <GiSoccerField className="h-4 w-4 mr-2" />,
        'trainer': <FiUsers className="h-4 w-4 mr-2" />,
        'class': <FiCalendar className="h-4 w-4 mr-2" />
    };

    // Error Message Component
    function ErrorMessage({ message }: { message: string }) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-red-50/70 p-6 rounded-xl border border-red-200/80 shadow-lg">
                <FiAlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <p className="text-red-700 font-semibold mb-2 text-lg">Search Failed</p>
                <p className="text-gray-600">{message}</p>
                <Link href="/" className="mt-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-md">
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
                <Link href="/" className="inline-block px-5 py-2.5 bg-yellow-500 dark:bg-red-600 hover:bg-yellow-600 dark:hover:bg-red-700 text-white rounded-lg transition-colors duration-200 shadow-md">
                    Return to Homepage
                </Link>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen relative flex items-center justify-center">
                <AnimatedBackground />
                <div className="relative z-10 text-center">
                    <div className="w-16 h-16 border-4 border-yellow-500 dark:border-red-600 border-t-transparent dark:border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700 dark:text-gray-300">Loading search results...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            <AnimatedBackground />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                {/* Enhanced Header with Animation */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 md:mb-12"
                >
                    <h1 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider text-gray-900 dark:text-neutral-100 mb-2">
                        Search Results
                    </h1>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                        <FiCpu className="h-5 w-5 mr-2 text-yellow-600 dark:text-red-500"/>
                        <span>
                            {totalResults > 0 
                                ? `Found ${totalResults} match${totalResults === 1 ? '' : 'es'} for your search.` 
                                : 'Discover gyms, clubs, trainers and classes near you.'}
                        </span>
                    </div>
                    
                    {/* Active filters display */}
                    {(currentQuery || currentCity || currentType !== 'all') && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                            {currentQuery && (
                                <span className="px-3 py-1 bg-yellow-100 dark:bg-red-900/30 text-yellow-800 dark:text-red-200 rounded-full text-sm flex items-center border border-yellow-200 dark:border-red-800/40">
                                    <FiSearch className="h-3 w-3 mr-1.5" />
                                    {currentQuery}
                                </span>
                            )}
                            {currentCity && (
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center border border-blue-200 dark:border-blue-800/40">
                                    <FiMapPin className="h-3 w-3 mr-1.5" />
                                    {currentCity}
                                </span>
                            )}
                            {currentType !== 'all' && (
                                <span className={`px-3 py-1 rounded-full text-sm flex items-center border ${getTypeBadge(currentType)}`}>
                                    {typeIcons[currentType as keyof typeof typeIcons]}
                                    {currentType.charAt(0).toUpperCase() + currentType.slice(1)}
                                </span>
                            )}
                        </div>
                    )}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Enhanced Sidebar with Animations */}
                    <motion.aside 
                        className="md:col-span-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-6 rounded-xl border border-gray-200/60 dark:border-gray-700/40 shadow-xl shadow-black/5 sticky top-20">
                            {/* Filters Header */}
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 border-b border-gray-200/80 dark:border-gray-700/80 pb-2 flex items-center">
                                <FiFilter className="h-4 w-4 mr-2"/> Filters
                            </h2>
                            
                            {/* Keyword & City inputs with improved styling */}
                            <div className="mb-5">
                                <label htmlFor="search-term" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Keywords</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiSearch className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        id="search-term" 
                                        readOnly 
                                        value={currentQuery} 
                                        placeholder="Any keywords..." 
                                        className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/60 text-sm text-gray-600 dark:text-gray-200 border border-gray-200/70 dark:border-gray-600/40 shadow-inner cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-5">
                                <label htmlFor="city-term" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        id="city-term" 
                                        readOnly 
                                        value={currentCity} 
                                        placeholder="Any city" 
                                        className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/60 text-sm text-gray-600 dark:text-gray-200 border border-gray-200/70 dark:border-gray-600/40 shadow-inner cursor-not-allowed"
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
                                        <Link 
                                            key={type.value}
                                            href={createFilterURL('type', type.value)}
                                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                                currentType === type.value
                                                ? 'bg-yellow-100 dark:bg-red-900/40 text-yellow-900 dark:text-red-200 font-medium border border-yellow-200 dark:border-red-800/30 shadow-sm'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/40 border border-transparent'
                                            }`}
                                            scroll={false}
                                        >
                                            <span className="flex items-center">
                                                {type.icon}
                                                {type.label}
                                            </span>
                                            {currentType === type.value && (
                                                <span className="bg-yellow-200 dark:bg-red-800/40 text-yellow-800 dark:text-red-300 text-xs px-2 py-0.5 rounded-full">
                                                    Active
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            
                            {/* View options toggle */}
                            <div className="mb-5 pt-4 border-t border-gray-200/80 dark:border-gray-700/80">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">View Options</label>
                                <div className="flex space-x-2">
                                    <button className="flex-1 flex items-center justify-center bg-yellow-100 dark:bg-red-900/30 text-yellow-800 dark:text-red-200 border border-yellow-200 dark:border-red-800/40 rounded-lg px-3 py-2 text-sm font-medium shadow-sm">
                                        <FiGrid className="h-4 w-4 mr-1.5" />
                                        Grid
                                    </button>
                                    <button className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600/40 rounded-lg px-3 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors">
                                        <FiList className="h-4 w-4 mr-1.5" />
                                        List
                                    </button>
                                </div>
                            </div>
                            
                            {/* Reset filters button */}
                            <div className="mt-6">
                                <Link
                                    href="/search"
                                    className="w-full flex items-center justify-center px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <FiX className="h-4 w-4 mr-1.5" />
                                    Reset All Filters
                                </Link>
                            </div>
                        </div>
                    </motion.aside>

                    {/* Main content with animations */}
                    <motion.main 
                        className="md:col-span-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {error && <ErrorMessage message={error} />}
                        
                        {!error && (
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-200/60 dark:border-gray-700/40 shadow-xl shadow-black/5">
                                {/* Results summary header */}
                                {results.length > 0 && (
                                    <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200/80 dark:border-gray-700/80">
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
                                            <select className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm px-3 py-1.5">
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
                                                searchParams={Object.fromEntries(
                                                    Array.from(searchParams?.entries() || [])
                                                )} 
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </motion.main>
                </div>
            </div>
        </div>
    );
} 