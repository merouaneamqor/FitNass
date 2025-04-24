'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiStar, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Re-define or import the type - ensure consistency
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
        sportFields?: number;
    }
};

// Define animation variant here
const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
};

// Search Result Card Client Component - Full Card Clickable
export default function SearchResultCard({ result }: { result: SearchResult }) {
    const defaultImage = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    const imageUrl = Array.isArray(result.images) && result.images.length > 0 ? result.images[0] : defaultImage;
    const detailUrl = `/${result.type === 'gym' ? 'gyms' : 'clubs'}/${result.id}`;

    return (
        <Link href={detailUrl} className="block group">
            <motion.div 
                className="bg-white rounded-xl overflow-hidden flex flex-col shadow-md shadow-black/5 transition-shadow duration-300 h-full"
                variants={fadeInUp} 
                whileHover={{ scale: 1.02, y: -3, shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -4px rgba(0, 0, 0, 0.07)' }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
            >
                <div className="relative h-48 sm:h-52 overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={result.name}
                        fill
                        className="object-cover opacity-95"
                    />
                    <span className={`absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${result.type === 'gym' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
                        {result.type.toUpperCase()}
                    </span>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 pr-2 line-clamp-1">
                            {result.name}
                        </h3>
                        {typeof result.rating === 'number' && result.rating > 0 && (
                            <div className="flex-shrink-0 flex items-center">
                                <FiStar className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                                <span className="ml-1 font-bold text-xs text-gray-700">{result.rating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                    {result.address && (
                        <div className="mb-3 flex items-center text-gray-500 text-xs">
                            <FiMapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                            <span className="line-clamp-1">{result.address}, {result.city}</span>
                        </div>
                    )}
                    {result.facilities && result.facilities.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-1.5">
                            {result.facilities.slice(0, 3).map((facility) => (
                                <span
                                    key={facility}
                                    className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                                >
                                    {facility}
                                </span>
                            ))}
                        </div>
                    )}
                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-gray-500 text-xs font-medium">
                            {result.type === 'club' && result._count?.sportFields ? `${result._count.sportFields} Fields` : ``}
                            {result.type === 'gym' && result._count?.reviews ? `${result._count.reviews} Reviews` : ``}
                        </span>
                        <span
                            className="font-semibold text-xs text-yellow-600" 
                        >
                            Details
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
} 