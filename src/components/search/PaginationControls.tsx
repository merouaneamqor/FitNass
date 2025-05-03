'use client';

import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Re-define or import the type - ensure consistency
type SearchParams = {
    q?: string;
    city?: string;
    type?: 'gym' | 'club' | string;
    page?: string;
};

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    searchParams: SearchParams;
}

// Pagination Controls Client Component
export default function PaginationControls({ currentPage, totalPages, searchParams }: PaginationControlsProps) {
    if (totalPages <= 1) return null;

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value && key !== 'page') {
                params.set(key, String(value));
            }
        });
        params.set('page', String(pageNumber));
        return `/search?${params.toString()}`;
    };

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }
    // TODO: Implement more advanced pagination logic for large number of pages if needed

    return (
        <nav className="mt-12 flex justify-center items-center space-x-1 sm:space-x-2">
            {currentPage > 1 && (
                <div>
                    <Link href={createPageURL(currentPage - 1)} className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors block">
                        <FiChevronLeft className="h-5 w-5" />
                    </Link>
                </div>
            )}

            {pageNumbers.map(page => (
                <div key={page}>
                    <Link
                        href={createPageURL(page)}
                        className={`px-3 sm:px-4 py-2 rounded-md text-sm transition-all duration-150 block ${
                            currentPage === page
                                ? 'bg-yellow-400 text-black font-semibold shadow-sm shadow-yellow-500/30' 
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                        }`}
                    >
                        {page}
                    </Link>
                </div>
            ))}

            {currentPage < totalPages && (
                <div>
                    <Link href={createPageURL(currentPage + 1)} className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors block">
                        <FiChevronRight className="h-5 w-5" />
                    </Link>
                </div>
            )}
        </nav>
    );
} 