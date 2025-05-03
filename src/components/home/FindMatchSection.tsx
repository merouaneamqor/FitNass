'use client';

import Link from 'next/link';
import { FiUsers, FiArrowRight } from 'react-icons/fi';

// Placeholder component for the Find Match section
export default function FindMatchSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <FiUsers className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Find Your Next Match
        </h2>
        <p className="text-lg text-gray-600 dark:text-neutral-300 mb-8 max-w-xl mx-auto">
          Whether you're looking for a competitive game or a friendly hit, connect with players at your level.
        </p>
        <Link
          href="/matches" // Adjust link as needed
          className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Browse Matches
          <FiArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
} 