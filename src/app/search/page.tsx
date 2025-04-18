// import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiMapPin, FiStar, FiAlertCircle, FiChevronLeft, FiChevronRight, FiFilter, FiX } from 'react-icons/fi';
import { GiSoccerField } from "react-icons/gi";
import prisma from '@/lib/db';
// import { Prisma } from '@prisma/client';

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

// --- UI COMPONENTS ---

// Error Message (Server Component)
function ErrorMessage({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-blood-red/10 p-6 rounded-md border border-blood-red/50">
            <FiAlertCircle className="h-10 w-10 text-blood-red mb-4" />
            <p className="text-blood-red font-semibold mb-2 font-poppins">Search Failed</p>
            <p className="text-neutral-300 text-sm font-poppins">{message}</p>
        </div>
    );
}

// No Results Message (Server Component)
function NoResultsMessage() {
    return (
        <div className="text-center py-20">
            <FiAlertCircle className="h-10 w-10 mx-auto text-neutral-500 mb-4" />
            <p className="text-neutral-400 font-semibold font-poppins">No venues found matching your criteria.</p>
            <p className="text-neutral-500 text-sm mt-1 font-poppins">Try adjusting your search query or city.</p>
        </div>
    );
}

// Search Result Card (Server Component)
function SearchResultCard({ result }: { result: SearchResult }) {
    const defaultImage = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    const imageUrl = Array.isArray(result.images) && result.images.length > 0 ? result.images[0] : defaultImage;

    return (
        <div className="bg-gunmetal-gray rounded-lg overflow-hidden transition-all duration-300 border border-neutral-700/80 hover:border-blood-red group flex flex-col shadow-lg">
            <div className="relative h-52 sm:h-56 overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={result.name}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out opacity-80 group-hover:opacity-100"
                />
                <span className={`absolute top-3 left-3 inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${result.type === 'gym' ? 'bg-blood-red/80 text-white' : 'bg-neon-yellow text-black'}`}>
                    {result.type}
                </span>
                {/* Placeholder for favorite button - would need client interaction or server action */}
                {/* <button className="absolute top-3 right-3 h-8 w-8 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-blood-red transition-colors duration-200">
                    <FiHeart className="h-4 w-4" />
                </button> */}
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bebas uppercase tracking-wide text-white group-hover:text-neon-yellow transition-colors pr-2 line-clamp-1">
                        <Link href={`/${result.type}s/${result.id}`}>{result.name}</Link>
                    </h3>
                    {typeof result.rating === 'number' && result.rating > 0 && (
                        <div className="flex-shrink-0 flex items-center bg-jet-black/50 px-2 py-0.5 rounded-md border border-neutral-700">
                            <FiStar className="h-3 w-3 text-neon-yellow fill-current" />
                            <span className="ml-1.5 font-bold text-xs text-white">{result.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>
                {result.address && (
                    <div className="mb-3 flex items-center text-neutral-400 text-xs font-poppins">
                        <FiMapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                        <span className="line-clamp-1">{result.address}, {result.city}</span>
                    </div>
                )}
                {result.facilities && result.facilities.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                        {result.facilities.slice(0, 3).map((facility) => (
                            <span
                                key={facility}
                                className="px-2 py-0.5 bg-neutral-700/60 text-neutral-300 rounded-sm text-[10px] uppercase font-medium"
                            >
                                {facility}
                            </span>
                        ))}
                    </div>
                )}
                <div className="mt-auto pt-4 border-t border-neutral-700/60 flex justify-between items-center">
                    <span className="text-neutral-500 text-xs font-medium">
                        {/* Display review count or sport field count? */}
                        {result.type === 'club' && result._count?.sportFields ? `${result._count.sportFields} Fields` : ``}
                        {result.type === 'gym' && result._count?.reviews ? `${result._count.reviews} Reviews` : ``}
                         {/* Fallback or combined logic might be needed */}
                    </span>
                    <Link
                        href={`/${result.type}s/${result.id}`}
                        className="inline-block bg-neon-yellow hover:bg-yellow-400 text-black px-4 py-1.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-colors duration-200 shadow-sm"
                    >
                        Details
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Pagination Controls (Server Component)
function PaginationControls({ currentPage, totalPages, searchParams }: {
    currentPage: number;
    totalPages: number;
    searchParams: SearchParams;
}) {
    if (totalPages <= 1) return null;

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams();
        if (searchParams.q) params.set('q', searchParams.q);
        if (searchParams.city) params.set('city', searchParams.city);
        if (searchParams.type && searchParams.type !== 'all') params.set('type', searchParams.type);
        params.set('page', String(pageNumber));
        return `/search?${params.toString()}`;
    };

    const hasPrev = currentPage > 1;
    const hasNext = currentPage < totalPages;

    // Basic Next/Prev links
    return (
        <div className="flex justify-center items-center gap-4 mt-12">
            {hasPrev ? (
                <Link href={createPageURL(currentPage - 1)}
                      className="inline-flex items-center px-4 py-2 bg-gunmetal-gray text-neutral-300 border border-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors">
                    <FiChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                </Link>
            ) : (
                <span className="inline-flex items-center px-4 py-2 bg-neutral-800 text-neutral-600 border border-neutral-700 rounded-md text-sm font-medium cursor-not-allowed">
                    <FiChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                </span>
            )}

            <span className="text-neutral-400 text-sm">
                Page {currentPage} of {totalPages}
            </span>

            {hasNext ? (
                <Link href={createPageURL(currentPage + 1)}
                      className="inline-flex items-center px-4 py-2 bg-gunmetal-gray text-neutral-300 border border-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors">
                    Next
                    <FiChevronRight className="ml-2 h-4 w-4" />
                </Link>
            ) : (
                 <span className="inline-flex items-center px-4 py-2 bg-neutral-800 text-neutral-600 border border-neutral-700 rounded-md text-sm font-medium cursor-not-allowed">
                    Next
                    <FiChevronRight className="ml-2 h-4 w-4" />
                </span>
            )}
        </div>
    );
    // TODO: Add numbered pagination if desired
}


// --- MAIN PAGE COMPONENT (Server Component) ---
export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {

    // Fetch data on the server
    const { results, currentPage, totalPages, totalResults, error } = await fetchSearchResults(searchParams);

    // Read filters directly from searchParams for UI state
    const currentQuery = searchParams.q || '';
    const currentCity = searchParams.city || '';
    const currentType = searchParams.type || 'all';

    const popularCities = ['Casablanca', 'Rabat', 'Marrakech', 'Tangier', 'Fez', 'Agadir'];

    // Helper to create URLs for filters
    const createFilterURL = (param: keyof SearchParams, value: string | null) => {
        const params = new URLSearchParams();
        if (searchParams.q) params.set('q', searchParams.q);
        if (searchParams.city && param !== 'city') params.set('city', searchParams.city);
        if (searchParams.type && searchParams.type !== 'all' && param !== 'type') params.set('type', searchParams.type);
        // page reset is implicit as it's not carried over

        if (value && value !== 'all') {
            params.set(param, value);
        } else {
           // Remove the param if value is null or 'all' (except for query)
           if (param === 'city') params.delete('city');
           if (param === 'type') params.delete('type');
        }
        return `/search?${params.toString()}`;
    };

    return (
        <div className="min-h-screen bg-jet-black text-neutral-200 font-poppins">
            {/* Header Section */}
            <div className="bg-gunmetal-gray py-10 md:py-12 px-6 border-b border-neutral-700/80">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bebas text-white uppercase tracking-wider mb-6">
                        Find Your Battleground
                    </h1>

                    {/* Search Form - Uses GET method for SSR */}
                    <form method="GET" action="/search" className="relative w-full max-w-2xl mb-5">
                        {/* Preserve existing city/type filters when searching */}
                        {currentCity && <input type="hidden" name="city" value={currentCity} />}
                        {currentType && currentType !== 'all' && <input type="hidden" name="type" value={currentType} />}

                        <input
                            type="text"
                            name="q" // Name attribute is crucial for GET form
                            placeholder="Search Gym, Club, Skill..."
                            defaultValue={currentQuery} // Use defaultValue for server components
                            className="w-full pl-10 pr-4 py-3 rounded-md bg-jet-black/50 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neon-yellow focus:bg-jet-black/80 transition-colors duration-200 border border-neutral-600/70 text-base"
                        />
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500 pointer-events-none" />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-neon-yellow text-black px-4 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-colors">
                            Search
                        </button>
                    </form>

                    {/* Popular Cities Links */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-neutral-400 text-xs uppercase font-semibold mr-2">Popular Cities:</span>
                        {popularCities.map(city => (
                            <Link
                                key={city}
                                href={createFilterURL('city', city)}
                                scroll={false} // Prevent scroll jump on navigation
                                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors duration-150 uppercase tracking-wide border ${currentCity === city
                                    ? 'bg-neon-yellow text-black border-neon-yellow'
                                    : 'bg-neutral-700/60 text-neutral-300 border-neutral-600/80 hover:bg-neutral-600/80 hover:border-neutral-500'
                                    }`}
                            >
                                {city}
                            </Link>
                        ))}
                    </div>

                    {/* Active City Filter Badge */}
                    {currentCity && (
                        <div className="mt-4 flex items-center">
                            <span className="text-neutral-400 text-xs uppercase font-semibold mr-2">Filtering by:</span>
                            <span className="bg-blood-red/80 text-white px-3 py-1 rounded-md flex items-center text-sm font-semibold">
                                <FiMapPin className="mr-1.5 h-4 w-4" />
                                {currentCity}
                                <Link
                                    href={createFilterURL('city', null)} // Link to clear filter
                                    scroll={false}
                                    className="ml-2 p-0.5 rounded-full hover:bg-black/20 transition-colors"
                                    aria-label="Clear city filter"
                                >
                                    <FiX className="h-4 w-4" />
                                </Link>
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Filter Tabs - Use Links for SSR */}
            <div className="bg-jet-black border-b border-neutral-800 sticky top-0 z-40"> {/* Adjust top offset if header height changes */} 
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex space-x-2 overflow-x-auto py-3">
                        <Link
                            href={createFilterURL('type', 'all')}
                            scroll={false}
                            className={`px-4 py-1.5 rounded-md font-bebas uppercase tracking-wider text-sm transition-all duration-150 border-b-2 ${currentType === 'all'
                                ? 'text-neon-yellow border-neon-yellow'
                                : 'text-neutral-400 border-transparent hover:text-white'
                                }`}
                        >
                            All ({/* TODO: Get accurate combined count if needed */ totalResults})
                        </Link>
                        <Link
                           href={createFilterURL('type', 'gym')}
                            scroll={false}
                            className={`px-4 py-1.5 rounded-md font-bebas uppercase tracking-wider text-sm transition-all duration-150 border-b-2 flex items-center space-x-1.5 ${currentType === 'gym'
                                ? 'text-neon-yellow border-neon-yellow'
                                : 'text-neutral-400 border-transparent hover:text-white'
                                }`}
                        >
                            <FiFilter className="h-4 w-4" />
                            <span>Gyms ({/* TODO: Show gym count? */})</span>
                        </Link>
                        <Link
                            href={createFilterURL('type', 'club')}
                            scroll={false}
                            className={`px-4 py-1.5 rounded-md font-bebas uppercase tracking-wider text-sm transition-all duration-150 border-b-2 flex items-center space-x-1.5 ${currentType === 'club'
                                ? 'text-neon-yellow border-neon-yellow'
                                : 'text-neutral-400 border-transparent hover:text-white'
                                }`}
                        >
                            <GiSoccerField className="h-4 w-4" />
                            <span>Clubs ({/* TODO: Show club count? */})</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
                {error ? (
                    <ErrorMessage message={error} />
                ) : results.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                            {results.map(result => (
                                <SearchResultCard key={result.id} result={result} />
                            ))}
                        </div>
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            searchParams={searchParams} />
                    </>
                ) : (
                    <NoResultsMessage />
                )}
            </div>
        </div>
    );
} 