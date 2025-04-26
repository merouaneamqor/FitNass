// import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiMapPin, FiStar, FiAlertCircle, FiChevronLeft, FiChevronRight, FiFilter, FiX, FiCpu } from 'react-icons/fi';
import { GiSoccerField } from "react-icons/gi";
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client'; // Import Prisma namespace
import { motion } from 'framer-motion'; // Import motion
// import { Prisma } from '@prisma/client';
import { SearchResult, SearchParams, GymSearchResult, ClubSearchResult, TrainerSearchResult, ClassSearchResult } from '@/types/search';
import { slugify } from '@/lib/utils'; // Import slugify

// Import NEW client components
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import SearchResultsGrid from '@/components/search/SearchResultsGrid';
import PaginationControls from '@/components/search/PaginationControls';

const ITEMS_PER_PAGE = 12; // Define how many results per page

// --- SERVER-SIDE DATA FETCHING ---
async function fetchSearchResults(searchParams: SearchParams) {
    const query = searchParams.q || '';
    const city = searchParams.city || '';
    const typeFilter = searchParams.type || 'all'; // Default to 'all'
    const page = parseInt(searchParams.page || '1');
    const skip = (page - 1) * ITEMS_PER_PAGE;

    console.log(`Server Fetch: query="${query}", city="${city}", type="${typeFilter}", page=${page}`);

    // --- Build Where Clauses --- 
    const queryWhereClause = query ? {
        OR: [
            { name: { contains: query, mode: 'insensitive' as const } },
            { description: { contains: query, mode: 'insensitive' as const } },
            { address: { contains: query, mode: 'insensitive' as const } }, // Gym/Club
            { bio: { contains: query, mode: 'insensitive' as const } }, // Trainer
            { specialties: { has: query } }, // Trainer
            { type: { contains: query, mode: 'insensitive' as const } }, // Class type field
        ]
    } : {};

    const gymWhere: any = { status: 'ACTIVE' };
    const clubWhere: any = { status: 'ACTIVE' };
    const trainerWhere: any = { status: 'ACTIVE' };
    const classWhere: any = { status: 'ACTIVE' };

    if (city) {
        gymWhere.city = { contains: city, mode: 'insensitive' };
        clubWhere.city = { contains: city, mode: 'insensitive' };
        trainerWhere.city = { contains: city, mode: 'insensitive' };
        // For classes, city must match the related Gym or Club
        classWhere.OR = [
            { gym: { city: { contains: city, mode: 'insensitive' }, status: 'ACTIVE' } },
            { club: { city: { contains: city, mode: 'insensitive' }, status: 'ACTIVE' } }
        ];
    }

    if (query) {
        // Combine query with existing where clauses using AND
        gymWhere.AND = [...(gymWhere.AND || []), queryWhereClause];
        clubWhere.AND = [...(clubWhere.AND || []), queryWhereClause];
        trainerWhere.AND = [...(trainerWhere.AND || []), queryWhereClause];
        classWhere.AND = [...(classWhere.AND || []), queryWhereClause];
    }

    // --- Prepare Promises & Selects --- 
    const fetchGyms = typeFilter === 'all' || typeFilter === 'gym';
    const fetchClubs = typeFilter === 'all' || typeFilter === 'club';
    const fetchTrainers = typeFilter === 'all' || typeFilter === 'trainer';
    const fetchClasses = typeFilter === 'all' || typeFilter === 'class';

    // --- Pagination Logic --- 
    const applyPagination = typeFilter !== 'all';
    const currentSkip = applyPagination ? skip : 0;
    const currentTake = applyPagination ? ITEMS_PER_PAGE : undefined; // Fetch all for 'all' type initially

    try {
        // Fetch data promises with inline select clauses
        const gymPromise = fetchGyms ? prisma.gym.findMany({
            where: gymWhere,
            select: { id: true, name: true, description: true, address: true, city: true, images: true, rating: true, facilities: true, priceRange: true, slug: true, citySlug: true, _count: { select: { reviews: true } } }, // Inline Select
            skip: currentSkip, take: currentTake, orderBy: { rating: 'desc' }
        }) : Promise.resolve([]);
        
        const clubPromise = fetchClubs ? prisma.club.findMany({
            where: clubWhere,
            select: { id: true, name: true, description: true, address: true, city: true, images: true, rating: true, facilities: true, _count: { select: { reviews: true, sportFields: true } } }, // Inline Select
            skip: currentSkip, take: currentTake, orderBy: { rating: 'desc' }
        }) : Promise.resolve([]);
        
        const trainerPromise = fetchTrainers ? prisma.trainer.findMany({
            where: trainerWhere,
            select: { id: true, name: true, bio: true, specialties: true, city: true, images: true, rating: true, hourlyRate: true }, // Inline Select
            skip: currentSkip, take: currentTake, orderBy: { rating: 'desc' }
        }) : Promise.resolve([]);
        
        const classPromise = fetchClasses ? prisma.fitnessClass.findMany({
            where: classWhere,
            select: { id: true, name: true, description: true, type: true, images: true, startTime: true, duration: true, price: true, currency: true, gym: { select: { id: true, name: true, city: true, address: true } }, club: { select: { id: true, name: true, city: true, address: true } } }, // Inline Select
            skip: currentSkip, take: currentTake, orderBy: { startTime: 'asc' }
        }) : Promise.resolve([]);
        
        // Fetch count promises
        const totalGymsPromise = fetchGyms ? prisma.gym.count({ where: gymWhere }) : Promise.resolve(0);
        const totalClubsPromise = fetchClubs ? prisma.club.count({ where: clubWhere }) : Promise.resolve(0);
        const totalTrainersPromise = fetchTrainers ? prisma.trainer.count({ where: trainerWhere }) : Promise.resolve(0);
        const totalClassesPromise = fetchClasses ? prisma.fitnessClass.count({ where: classWhere }) : Promise.resolve(0);

        // Execute all promises
        const [gyms, clubs, trainers, classes, totalGyms, totalClubs, totalTrainers, totalClasses] = await Promise.all([
            gymPromise, clubPromise, trainerPromise, classPromise,
            totalGymsPromise, totalClubsPromise, totalTrainersPromise, totalClassesPromise
        ]);

        // --- Map Results --- 
        const combinedResults: SearchResult[] = [
            ...gyms.map((gym): GymSearchResult => {
                const citySlug = gym.citySlug || slugify(gym.city);
                const gymSlug = gym.slug;
                const compositeSlug = `${citySlug}-${gymSlug || slugify(gym.name)}`; 
                return {
                    id: gym.id, 
                    name: gym.name, 
                    description: gym.description, 
                    address: gym.address, 
                    city: gym.city, 
                    images: gym.images as string[], 
                    rating: gym.rating as number | null, 
                    facilities: (gym.facilities as string[] | undefined) ?? [], 
                    type: 'gym', 
                    priceRange: gym.priceRange, 
                    _count: { reviews: gym._count?.reviews },
                    slug: gymSlug, 
                    citySlug: citySlug, 
                    compositeSlug: compositeSlug 
                };
            }),
            ...clubs.map((club): ClubSearchResult => {
                const citySlug = slugify(club.city); // Assuming Club doesn't have citySlug yet
                const compositeSlug = `${citySlug}-${slugify(club.name)}`;
                return {
                    id: club.id, 
                    name: club.name, 
                    description: club.description, 
                    address: club.address, 
                    city: club.city, 
                    images: club.images as string[], 
                    rating: club.rating as number | null, 
                    facilities: (club.facilities as string[] | undefined) ?? [],
                    type: 'club', 
                    _count: { reviews: club._count?.reviews, sportFields: club._count?.sportFields },
                    citySlug: citySlug,
                    compositeSlug: compositeSlug
                };
            }),
             ...trainers.map((trainer): TrainerSearchResult => {
                 const citySlug = slugify(trainer.city || '');
                 const compositeSlug = `${citySlug}-${slugify(trainer.name)}`;
                 return {
                    id: trainer.id, 
                    name: trainer.name, 
                    description: trainer.bio ?? null,
                    address: null, 
                    city: trainer.city, 
                    images: trainer.images as string[], 
                    rating: trainer.rating as number | null, 
                    type: 'trainer', 
                    specialties: trainer.specialties as string[], 
                    hourlyRate: trainer.hourlyRate as number | null, 
                    citySlug: citySlug, 
                    compositeSlug: compositeSlug 
                 };
             }),
             ...classes.map((cls): ClassSearchResult => {
                 const citySlug = slugify(cls.gym?.city || cls.club?.city || '');
                 const compositeSlug = `${citySlug}-${slugify(cls.name)}`;
                 return {
                    id: cls.id, 
                    name: cls.name, 
                    description: cls.description, 
                    address: cls.gym?.address || cls.club?.address || null, 
                    city: cls.gym?.city || cls.club?.city || null, 
                    images: cls.images as string[], 
                    rating: null, 
                    type: 'class', 
                    classType: cls.type, 
                    startTime: cls.startTime as Date | null, 
                    duration: cls.duration as number | null, 
                    price: cls.price as number | null, 
                    locationName: cls.gym?.name || cls.club?.name || undefined, 
                    locationCity: cls.gym?.city || cls.club?.city || undefined, 
                    gymId: cls.gym?.id || null, 
                    clubId: cls.club?.id || null, 
                    citySlug: citySlug, 
                    compositeSlug: compositeSlug 
                 };
             })
        ];

        // --- Sort & Paginate for 'all' --- 
        let finalPaginatedResults: SearchResult[] = [];
        let totalResults = 0;

        if (typeFilter === 'gym') totalResults = totalGyms;
        else if (typeFilter === 'club') totalResults = totalClubs;
        else if (typeFilter === 'trainer') totalResults = totalTrainers;
        else if (typeFilter === 'class') totalResults = totalClasses;
        else totalResults = totalGyms + totalClubs + totalTrainers + totalClasses;
        
        if (typeFilter === 'all') {
            // Optional: Sort combined results before slicing for pagination
            // combinedResults.sort((a, b) => a.name.localeCompare(b.name)); 
            const startIndex = skip;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            finalPaginatedResults = combinedResults.slice(startIndex, endIndex);
        } else {
             finalPaginatedResults = combinedResults; // Results were already paginated by Prisma
        }

        const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

        console.log(`Server Fetch: Returning ${finalPaginatedResults.length} results for page ${page}. Total matching: ${totalResults}`);

        return {
            results: finalPaginatedResults,
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
    const currentType = searchParams.type || 'all'; // Default to 'all'

    const createFilterURL = (param: keyof SearchParams, value: string | null) => {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, val]) => {
             // Use current values, but remove page and the param being changed
             if (val && key !== 'page' && key !== param) { 
                 params.set(key, String(val));
             }
        });
        // Add the new/updated param if it has a value
        if (value && value !== 'all') { // Don't add type=all explicitly
            params.set(param, value);
        } 
        // If setting type to 'all', ensure type param is removed
        if (param === 'type' && value === 'all') {
           params.delete('type');
        }
        const queryString = params.toString();
        return queryString ? `/search?${queryString}` : '/search';
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
             <AnimatedBackground />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                 {/* ... Header ... */}
                 <div className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-bebas uppercase tracking-wider text-gray-900">
                        Search Results
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
                        <div className="bg-white/80 backdrop-blur-lg p-5 rounded-xl border border-gray-200/60 shadow-lg shadow-black/5 sticky top-20">
                             {/* ... Filters Header ... */}
                              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200/80 pb-2 flex items-center">
                                 <FiFilter className="h-4 w-4 mr-2"/> Filters
                             </h2>
                             {/* ... Keyword & City inputs (readOnly) ... */}
                             <div className="mb-5">
                                 <label htmlFor="search-term" className="block text-sm font-medium text-gray-700 mb-1.5">Keywords</label>
                                 <input type="text" id="search-term" readOnly value={currentQuery} placeholder="Any keywords..." className="w-full px-3 py-2 rounded-lg bg-gray-100/80 text-sm text-gray-600 border border-gray-200/70 cursor-not-allowed"/>
                             </div>
                             <div className="mb-5">
                                 <label htmlFor="city-term" className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                                 <input type="text" id="city-term" readOnly value={currentCity} placeholder="Any city" className="w-full px-3 py-2 rounded-lg bg-gray-100/80 text-sm text-gray-600 border border-gray-200/70 cursor-not-allowed"/>
                             </div>
                             
                             {/* Type Filter Links */}
                             <div className="mb-5">
                                 <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                 <div className="flex flex-col space-y-1.5">
                                     {[ 
                                         { label: 'All Types', value: 'all' },
                                         { label: 'Gyms', value: 'gym' }, 
                                         { label: 'Clubs', value: 'club' },
                                         { label: 'Trainers', value: 'trainer' },
                                         { label: 'Classes', value: 'class' }
                                     ].map(type => (
                                         <Link 
                                             key={type.value}
                                             href={createFilterURL('type', type.value)}
                                             className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-sm transition-colors duration-150 ${
                                                 currentType === type.value
                                                 ? 'bg-yellow-100/90 text-yellow-900 font-semibold ring-1 ring-yellow-300/60'
                                                 : 'text-gray-600 hover:bg-gray-100/80'
                                             }`}
                                             scroll={false} // Prevent scroll jump on filter change
                                         >
                                             {type.label}
                                         </Link>
                                     ))}
                                 </div>
                             </div>
                             {/* Add other filters here later */}
                        </div>
                    </aside>

                    <main className="md:col-span-3">
                        {error && <ErrorMessage message={error} />}
                        {!error && results.length === 0 && <NoResultsMessage />}
                        {!error && results.length > 0 && (
                            <>
                                <SearchResultsGrid results={results} />
                                <PaginationControls 
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    searchParams={searchParams} 
                                />
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
} 