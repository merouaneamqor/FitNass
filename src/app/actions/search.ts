'use server';

import prisma from '@/lib/db';
import { SearchResult, GymSearchResult, ClubSearchResult, TrainerSearchResult, ClassSearchResult } from '@/types/search';
import { slugify } from '@/lib/utils';

const ITEMS_PER_PAGE = 12;

export async function searchAction(searchParams: URLSearchParams | Record<string, string>) {
    // Handle both URLSearchParams and plain objects
    let query: string;
    let city: string;
    let typeFilter: string;
    let page: number;

    if (searchParams instanceof URLSearchParams) {
        // Handle URLSearchParams object
        query = searchParams.get('q') || '';
        city = searchParams.get('city') || '';
        typeFilter = searchParams.get('type') || 'all';
        page = parseInt(searchParams.get('page') || '1');
    } else {
        // Handle plain object
        query = searchParams.q || '';
        city = searchParams.city || '';
        typeFilter = searchParams.type || 'all';
        page = parseInt(searchParams.page || '1');
    }

    const skip = (page - 1) * ITEMS_PER_PAGE;

    console.log(`Server Action: query="${query}", city="${city}", type="${typeFilter}", page=${page}`);

    try {
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

        // Fetch data promises with inline select clauses
        const gymPromise = fetchGyms ? prisma.gym.findMany({
            where: gymWhere,
            select: { id: true, name: true, description: true, address: true, city: true, images: true, rating: true, facilities: true, priceRange: true, slug: true, citySlug: true, _count: { select: { reviews: true } } },
            skip: currentSkip, take: currentTake, orderBy: { rating: 'desc' }
        }) : Promise.resolve([]);
        
        const clubPromise = fetchClubs ? prisma.club.findMany({
            where: clubWhere,
            select: { id: true, name: true, description: true, address: true, city: true, images: true, rating: true, facilities: true, _count: { select: { reviews: true, sportFields: true } } },
            skip: currentSkip, take: currentTake, orderBy: { rating: 'desc' }
        }) : Promise.resolve([]);
        
        const trainerPromise = fetchTrainers ? prisma.trainer.findMany({
            where: trainerWhere,
            select: { id: true, name: true, bio: true, specialties: true, city: true, images: true, rating: true, hourlyRate: true },
            skip: currentSkip, take: currentTake, orderBy: { rating: 'desc' }
        }) : Promise.resolve([]);
        
        const classPromise = fetchClasses ? prisma.fitnessClass.findMany({
            where: classWhere,
            select: { id: true, name: true, description: true, type: true, images: true, startTime: true, duration: true, price: true, currency: true, gym: { select: { id: true, name: true, city: true, address: true } }, club: { select: { id: true, name: true, city: true, address: true } } },
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
        const combinedResults = [
            ...gyms.map((gym): GymSearchResult => {
                const citySlug = gym.citySlug || slugify(gym.city);
                const gymSlug = gym.slug ?? undefined; // Convert null to undefined
                const compositeSlug = `${citySlug}-${gymSlug || slugify(gym.name)}`; 
                return {
                    id: gym.id, 
                    name: gym.name, 
                    description: gym.description, 
                    address: gym.address, 
                    city: gym.city, 
                    images: gym.images as string[], 
                    rating: gym.rating as number | null, 
                    facilities: gym.facilities as string[] | undefined, 
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
                    facilities: club.facilities as string[] | undefined,
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

        console.log(`Server Action: Returning ${finalPaginatedResults.length} results for page ${page}. Total matching: ${totalResults}`);

        return {
            results: finalPaginatedResults,
            currentPage: page,
            totalPages: totalPages,
            totalResults: totalResults,
            error: null
        };

    } catch (error) {
        console.error('Server Action Error:', error);
        return {
            results: [],
            currentPage: page,
            totalPages: 0,
            totalResults: 0,
            error: 'Failed to fetch search results. Please try again later.'
        };
    }
} 