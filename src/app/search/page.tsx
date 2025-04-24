// import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiMapPin, FiStar, FiAlertCircle, FiChevronLeft, FiChevronRight, FiFilter, FiX, FiCpu } from 'react-icons/fi';
import { GiSoccerField } from "react-icons/gi";
import prisma from '@/lib/db';
import { motion } from 'framer-motion'; // Import motion
// import { Prisma } from '@prisma/client';

// Import NEW client components
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import SearchResultsGrid from '@/components/search/SearchResultsGrid';
import PaginationControls from '@/components/search/PaginationControls';

// --- TYPES ---
// Combine Gym & Club for search results, ensuring necessary fields exist
// Using Prisma generated types might be better if structures diverge significantly
type SearchResult = {
    id: string;
    name: string;
    description: string | null;
    address: string | null;
    city: string | null;
    images: string[];
    rating: number | null;
    facilities: string[];
    type: 'club' | 'gym';
    _count?: {
        reviews?: number;
        sportFields?: number; // Specific to clubs
    }
};

type SearchParams = {
    q?: string;
    city?: string;
    type?: 'gym' | 'club' | string;
    page?: string;
};

const ITEMS_PER_PAGE = 12; // Define how many results per page

// --- SERVER-SIDE DATA FETCHING ---
async function fetchSearchResults(searchParams: SearchParams) {
    const query = searchParams.q || '';
    const city = searchParams.city || '';
    const typeFilter = searchParams.type;
    const page = parseInt(searchParams.page || '1');
    const skip = (page - 1) * ITEMS_PER_PAGE;

    console.log(`Server Fetch: query="${query}", city="${city}", type="${typeFilter}", page=${page}`);

    // --- Build Common Where Clause Components ---
    const cityWhereClause = city ? { city: { contains: city, mode: 'insensitive' as const } } : {};
    const queryWhereClause = query ? {
        OR: [
            { name: { contains: query, mode: 'insensitive' as const } },
            { address: { contains: query, mode: 'insensitive' as const } },
            // Add other relevant fields if desired
            // { description: { contains: query, mode: 'insensitive' as const } },
        ]
    } : {};

    // Combine base filters
    const baseWhere = { ...cityWhereClause, ...queryWhereClause }; // AND condition

    // --- Prepare Promises for Gyms and Clubs ---
    const fetchGyms = typeFilter !== 'club'; // Fetch gyms if type is 'all' or 'gym'
    const fetchClubs = typeFilter !== 'gym'; // Fetch clubs if type is 'all' or 'club'

    const gymWhere = { ...baseWhere, status: 'ACTIVE' as const }; // Assuming default status
    const clubWhere = { ...baseWhere, status: 'ACTIVE' as const }; // Assuming default status

    const gymQueryOptions = {
        where: gymWhere,
        select: {
            id: true, name: true, description: true, address: true, city: true,
            images: true, rating: true, facilities: true,
             _count: { select: { reviews: true } }
        },
        skip: fetchGyms ? skip : 0, // Apply pagination only if fetching this type specifically or 'all'
        take: fetchGyms ? ITEMS_PER_PAGE : 0, // Fetch 0 if not needed
        orderBy: { name: 'asc' as const }
    };

    const clubQueryOptions = {
        where: clubWhere,
        select: {
            id: true, name: true, description: true, address: true, city: true,
            images: true, rating: true, facilities: true,
            _count: { select: { reviews: true, sportFields: true } }
        },
        skip: fetchClubs ? skip : 0,
        take: fetchClubs ? ITEMS_PER_PAGE : 0,
        orderBy: { name: 'asc' as const }
    };

    try {
        // Fetch data and counts concurrently
        const [gyms, clubs, totalGyms, totalClubs] = await Promise.all([
            fetchGyms ? prisma.gym.findMany(gymQueryOptions) : Promise.resolve([]),
            fetchClubs ? prisma.club.findMany(clubQueryOptions) : Promise.resolve([]),
            fetchGyms ? prisma.gym.count({ where: gymWhere }) : Promise.resolve(0),
            fetchClubs ? prisma.club.count({ where: clubWhere }) : Promise.resolve(0)
        ]);

        // Combine results and add type
        const combinedResults: SearchResult[] = [
            ...gyms.map(gym => ({ ...gym, type: 'gym' as const })),
            ...clubs.map(club => ({ ...club, type: 'club' as const }))
        ];

        // Sort combined results if needed (e.g., by name) - Prisma handles order within type
        // combinedResults.sort((a, b) => a.name.localeCompare(b.name));

        // Determine total count based on filter
        let totalResults = 0;
        if (typeFilter === 'gym') {
            totalResults = totalGyms;
        } else if (typeFilter === 'club') {
            totalResults = totalClubs;
        } else { // 'all' or undefined
            // This count isn't perfect for pagination across types, simple sum for now
            totalResults = totalGyms + totalClubs;
        }

        const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

        console.log(`Server Fetch: Found ${combinedResults.length} results for page ${page}. Total matching: ${totalResults}`);

        return {
            results: combinedResults,
            currentPage: page,
            totalPages: totalPages,
            totalResults: totalResults,
            error: null
        };

    } catch (error) {
        console.error('Server Fetch Error:', error);
        return {
            results: [],
            currentPage: page,
            totalPages: 0,
            totalResults: 0,
            error: 'Failed to fetch search results. Please try again later.'
        };
    }
}

// --- SERVER UI COMPONENTS --- (Keep ErrorMessage and NoResultsMessage)
// Error Message (Remains a Server Component)
function ErrorMessage({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-red-50/70 p-6 rounded-lg border border-red-200/80">
            <FiAlertCircle className="h-10 w-10 text-red-500 mb-4" />
            <p className="text-red-700 font-semibold mb-2">Search Failed</p>
            <p className="text-gray-600 text-sm">{message}</p>
        </div>
    );
}

// No Results Message (Remains a Server Component)
function NoResultsMessage() {
    return (
        <div className="text-center py-20">
            <FiAlertCircle className="h-10 w-10 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 font-semibold">No venues found matching your criteria.</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search query or city.</p>
        </div>
    );
}

// --- SEARCH PAGE COMPONENT (Server Component) ---
export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {

    const { results, currentPage, totalPages, totalResults, error } = await fetchSearchResults(searchParams);
    const currentQuery = searchParams.q || '';
    const currentCity = searchParams.city || '';
    const currentType = searchParams.type || null;

    const createFilterURL = (param: keyof SearchParams, value: string | null) => {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, val]) => {
             if (val && key !== 'page' && key !== param) { 
                 params.set(key, String(val));
             }
        });
        if (value) { 
            params.set(param, value);
        } 
        return `/search?${params.toString()}`;
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
             {/* Use AnimatedBackground client component */}
             <AnimatedBackground />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-bebas uppercase tracking-wider text-gray-900">
                        Search Venues
                    </h1>
                    <div className="flex items-center text-gray-600 mt-2 text-sm">
                         <FiCpu className="h-4 w-4 mr-1.5 text-yellow-600"/>
                        <span>
                             {totalResults > 0 ? `AI found ${totalResults} potential matches.` : 'Discover gyms or clubs near you.'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <aside className="md:col-span-1">
                        {/* Filter sidebar content remains the same - it doesn't use motion */}
                        <div className="bg-white/80 backdrop-blur-lg p-5 rounded-xl border border-gray-200/60 shadow-lg shadow-black/5 sticky top-20">
                             <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200/80 pb-2 flex items-center">
                                 <FiFilter className="h-4 w-4 mr-2"/> Filters
                             </h2>
                             {/* Read-only Keyword Filter */}
                             <div className="mb-5">
                                 <label htmlFor="search-term" className="block text-sm font-medium text-gray-700 mb-1.5">Keywords</label>
                                 <input 
                                     type="text" id="search-term" readOnly value={currentQuery} 
                                     placeholder="Any keywords..."
                                     className="w-full px-3 py-2 rounded-lg bg-gray-100/80 text-sm text-gray-600 border border-gray-200/70 cursor-not-allowed"
                                 />
                             </div>
                             {/* Read-only City Filter */}
                             <div className="mb-5">
                                 <label htmlFor="city-term" className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                                 <input 
                                     type="text" id="city-term" readOnly value={currentCity} 
                                     placeholder="Any city"
                                     className="w-full px-3 py-2 rounded-lg bg-gray-100/80 text-sm text-gray-600 border border-gray-200/70 cursor-not-allowed"
                                 />
                             </div>
                             {/* Type Filter Links */}
                             <div className="mb-5">
                                 <label className="block text-sm font-medium text-gray-700 mb-2">Venue Type</label>
                                 <div className="flex flex-col space-y-1.5">
                                     {[ { label: 'All Types', value: null }, { label: 'Gyms Only', value: 'gym' }, { label: 'Clubs Only', value: 'club' } ].map(type => (
                                         <Link 
                                             key={type.label}
                                             href={createFilterURL('type', type.value)}
                                             className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-sm transition-colors duration-150 ${
                                                 currentType === type.value
                                                 ? 'bg-yellow-100/90 text-yellow-900 font-semibold ring-1 ring-yellow-300/60'
                                                 : 'text-gray-600 hover:bg-gray-100/80'
                                             }`}
                                         >
                                             <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${ currentType === type.value ? 'bg-yellow-500 border-yellow-600' : 'border-gray-300 bg-white'}`}></span>
                                             <span>{type.label}</span>
                                         </Link>
                                     ))}
                                 </div>
                             </div>
                             <Link href="/search" className="mt-5 text-xs text-gray-500 hover:text-yellow-600 text-center block w-full">
                                 Reset Filters
                             </Link>
                         </div>
                     </aside>

                    <main className="md:col-span-3">
                        {error ? (
                            <ErrorMessage message={error} />
                        ) : results.length === 0 ? (
                            <NoResultsMessage />
                        ) : (
                            // Use SearchResultsGrid client component
                            <SearchResultsGrid results={results} />
                        )}

                        {!error && results.length > 0 && (
                             // Use PaginationControls client component
                             <PaginationControls 
                                currentPage={currentPage} 
                                totalPages={totalPages} 
                                searchParams={searchParams} 
                            />
                        )}
                    </main>
                </div> 
            </div>
        </div>
    );
} 