import Link from 'next/link';
import { FiUserX } from 'react-icons/fi';

export default function UserNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
      <div className="bg-white border border-neutral-200 rounded-xl p-8 max-w-lg mx-auto">
        <FiUserX className="mx-auto h-16 w-16 text-indigo-400 mb-6" />
        <h1 className="text-2xl font-semibold text-neutral-800 mb-3">
          User Not Found
        </h1>
        <p className="text-neutral-600 mb-6">
          The user profile you're looking for doesn't exist or may have been removed.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/"
            className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Go to Home
          </Link>
          <Link
            href="/gyms"
            className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors"
          >
            Explore Gyms
          </Link>
        </div>
      </div>
    </div>
  );
} 