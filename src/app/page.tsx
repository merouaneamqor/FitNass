'use client';

import Link from 'next/link';
import { FiSearch, FiMapPin, FiStar, FiActivity } from 'react-icons/fi';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-fitnass-coral to-fitnass-pink text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        {/* Diagonal accent lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 top-1/4 h-96 w-4 bg-fitnass-neon rotate-12 transform opacity-80"></div>
          <div className="absolute -right-32 top-1/3 h-96 w-4 bg-fitnass-neon rotate-12 transform opacity-80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Find Your Perfect Gym
          </h1>
          <p className="mt-6 text-xl max-w-3xl">
            Discover the best gyms and fitness centers near you. Read reviews, compare facilities, and find the perfect place to achieve your fitness goals.
          </p>
          <div className="mt-10">
            <div className="max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by location or gym name..."
                  className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-fitnass-pink"
                />
                <button className="absolute right-3 top-3 text-gray-400 hover:text-fitnass-pink">
                  <FiSearch className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gyms Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-fitnass-dark mb-8">Featured Gyms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Gym Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Gym 1"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-fitnass-pink text-white px-2 py-1 rounded-full text-sm">
                  Featured
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-fitnass-dark">FitLife Gym</h3>
                <div className="mt-2 flex items-center text-gray-600">
                  <FiMapPin className="h-5 w-5 mr-1" />
                  <span>Downtown, City</span>
                </div>
                <div className="mt-2 flex items-center">
                  <FiStar className="h-5 w-5 text-fitnass-neon" />
                  <span className="ml-1 text-gray-600">4.8 (120 reviews)</span>
                </div>
                <p className="mt-4 text-gray-600">
                  State-of-the-art equipment, personal trainers, and group classes available.
                </p>
                <Link
                  href="/gyms/fitlife-gym"
                  className="mt-4 inline-block bg-gradient-to-r from-fitnass-coral to-fitnass-pink text-white px-4 py-2 rounded-lg hover:opacity-90"
                >
                  View Details
                </Link>
              </div>
            </div>

            {/* Featured Gym Card 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <img
                  src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Gym 2"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-fitnass-pink text-white px-2 py-1 rounded-full text-sm">
                  Featured
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-fitnass-dark">PowerFit Center</h3>
                <div className="mt-2 flex items-center text-gray-600">
                  <FiMapPin className="h-5 w-5 mr-1" />
                  <span>Westside, City</span>
                </div>
                <div className="mt-2 flex items-center">
                  <FiStar className="h-5 w-5 text-fitnass-neon" />
                  <span className="ml-1 text-gray-600">4.6 (85 reviews)</span>
                </div>
                <p className="mt-4 text-gray-600">
                  ️24/7 access, swimming pool, and specialized training programs.
                </p>
                <Link
                  href="/gyms/powerfit-center"
                  className="mt-4 inline-block bg-gradient-to-r from-fitnass-coral to-fitnass-pink text-white px-4 py-2 rounded-lg hover:opacity-90"
                >
                  View Details
                </Link>
              </div>
            </div>

            {/* Featured Gym Card 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <img
                  src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Gym 3"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-fitnass-pink text-white px-2 py-1 rounded-full text-sm">
                  Featured
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-fitnass-dark">CrossFit Zone</h3>
                <div className="mt-2 flex items-center text-gray-600">
                  <FiMapPin className="h-5 w-5 mr-1" />
                  <span>Eastside, City</span>
                </div>
                <div className="mt-2 flex items-center">
                  <FiStar className="h-5 w-5 text-fitnass-neon" />
                  <span className="ml-1 text-gray-600">4.9 (150 reviews)</span>
                </div>
                <p className="mt-4 text-gray-600">
                  CrossFit certified trainers, functional training, and nutrition guidance.
                </p>
                <Link
                  href="/gyms/crossfit-zone"
                  className="mt-4 inline-block bg-gradient-to-r from-fitnass-coral to-fitnass-pink text-white px-4 py-2 rounded-lg hover:opacity-90"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-fitnass-coral to-fitnass-pink text-white py-16 relative overflow-hidden">
        {/* Diagonal accent line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 top-1/4 h-96 w-4 bg-fitnass-neon rotate-12 transform opacity-80"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FiActivity className="h-16 w-16 text-fitnass-neon mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold mb-4">Ready to Start Your Fitness Journey?</h2>
          <p className="text-xl mb-8">
            Join thousands of members who have found their perfect gym through FitNass.
          </p>
          <Link
            href="/gyms"
            className="inline-block bg-fitnass-neon text-fitnass-dark px-8 py-3 rounded-lg font-bold text-lg hover:opacity-90"
          >
            Find Your Gym
          </Link>
        </div>
      </section>
    </div>
  );
}
