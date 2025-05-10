'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Define the type for search parameters
type SearchParams = Record<string, string | string[] | undefined>;

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    searchParams: SearchParams;
}

// Pagination Controls Client Component
export default function PaginationControls({ currentPage, totalPages, searchParams }: PaginationControlsProps) {
    // Skip rendering if there's only one page or none
    if (totalPages <= 1) return null;
    
    const router = useRouter();
    const pathname = usePathname();

    // Create URL with correct parameters
    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams();
        
        // Copy all existing parameters except 'page'
        Object.entries(searchParams).forEach(([key, value]) => {
            if (key !== 'page' && value !== undefined) {
                if (typeof value === 'string') {
                    params.set(key, value);
                } else if (Array.isArray(value) && value.length > 0) {
                    params.set(key, value[0]);
                }
            }
        });
        
        // Set page parameter
        params.set('page', String(pageNumber));
        return `${pathname}?${params.toString()}`;
    };

    // Generate smart page sequence
    const generatePageSequence = (): number[] => {
        const sequence: number[] = [];
        const neighborsCount = 3; // Show 3 pages on each side of current
        
        // Always add first page
        sequence.push(1);
        
        // Add decade markers before current page neighborhood
        let lastDecadeMarker = 0;
        for (let i = 10; i < currentPage - neighborsCount; i += 10) {
            // Skip if too close to first page or current page neighborhood
            if (i > 1 + 5 && i < currentPage - (neighborsCount + 2)) {
                sequence.push(i);
                lastDecadeMarker = i;
            }
        }
        
        // Add pages around current page with spacing if needed
        if (currentPage - neighborsCount > lastDecadeMarker + 1 && currentPage - neighborsCount > 1 + 1) {
            sequence.push(-1); // -1 represents ellipsis
        }
        
        // Pages before current
        for (let i = Math.max(2, currentPage - neighborsCount); i < currentPage; i++) {
            sequence.push(i);
        }
        
        // Current page
        if (currentPage > 1 && currentPage < totalPages) {
            sequence.push(currentPage);
        }
        
        // Pages after current
        for (let i = currentPage + 1; i <= Math.min(totalPages - 1, currentPage + neighborsCount); i++) {
            sequence.push(i);
        }
        
        // Add ellipsis if there's a gap before remaining decade markers
        if (currentPage + neighborsCount < totalPages - 1 && Math.floor((currentPage + neighborsCount + 10) / 10) * 10 < totalPages) {
            sequence.push(-2); // -2 represents ellipsis (different key)
        }
        
        // Add decade markers after current page neighborhood
        lastDecadeMarker = Math.floor((currentPage + neighborsCount + 10) / 10) * 10;
        for (let i = lastDecadeMarker; i < totalPages; i += 10) {
            if (i > currentPage + neighborsCount && i < totalPages) {
                sequence.push(i);
            }
        }
        
        // Always add last page
        if (totalPages > 1 && !sequence.includes(totalPages)) {
            sequence.push(totalPages);
        }
        
        // Return the de-duped sequence
        return [...new Set(sequence)].sort((a, b) => a - b);
    };
    
    const pageSequence = generatePageSequence();

    return (
        <nav className="my-6 py-4 flex flex-wrap justify-center items-center gap-1 sm:gap-2" aria-label="Pagination">
            {/* Previous button */}
            {currentPage > 1 && (
                <Link 
                    href={createPageURL(currentPage - 1)}
                    className="px-3 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 inline-flex items-center"
                    aria-label="Page précédente"
                    prefetch={true}
                >
                    &lt; Précédent
                </Link>
            )}
            
            {/* Page numbers with smart sequence */}
            {pageSequence.map((page, index) => (
                page < 0 ? (
                    // Render ellipsis
                    <span 
                        key={`ellipsis-${page}-${index}`} 
                        className="px-2 text-gray-500"
                        aria-hidden="true"
                    >
                        ...
                    </span>
                ) : (
                    // Render page number as Link
                    <Link
                        key={`page-${page}`}
                        href={createPageURL(page)}
                        className={`px-4 py-2 rounded inline-flex items-center justify-center ${
                            currentPage === page
                                ? 'bg-blue-500 text-white font-medium border border-blue-500'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                        aria-current={currentPage === page ? 'page' : undefined}
                        aria-label={`Page ${page}`}
                        prefetch={true}
                    >
                        {page}
                    </Link>
                )
            ))}
            
            {/* Next button */}
            {currentPage < totalPages && (
                <Link 
                    href={createPageURL(currentPage + 1)}
                    className="px-3 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 inline-flex items-center"
                    aria-label="Page suivante"
                    prefetch={true}
                >
                    Suivant &gt;
                </Link>
            )}
        </nav>
    );
} 