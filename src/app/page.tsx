'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiMapPin, FiStar, FiActivity, FiArrowRight, FiUsers, FiCheck } from 'react-icons/fi';
import { SearchBar } from '@/components/ui';

// Example featured gyms data
const featuredGyms = [
  {
    id: 'fitlife-gym',
    name: 'FitLife Gym',
    address: 'Downtown',
    city: 'City',
    rating: 4.8,
    _count: { reviews: 120 },
    description: 'State-of-the-art equipment, personal trainers, and group classes available.',
    facilities: ['Equipment', 'Trainers', 'Classes'],
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
    priceRange: '€€',
    latitude: 0,
    longitude: 0
  },
  {
    id: 'powerfit-center',
    name: 'PowerFit Center',
    address: 'Westside',
    city: 'City',
    rating: 4.6,
    _count: { reviews: 85 },
    description: '24/7 access, swimming pool, and specialized training programs.',
    facilities: ['24/7 Access', 'Swimming Pool', 'Training Programs'],
    images: ['https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
    priceRange: '€€',
    latitude: 0,
    longitude: 0
  },
  {
    id: 'crossfit-zone',
    name: 'CrossFit Zone',
    address: 'Eastside',
    city: 'City',
    rating: 4.9,
    _count: { reviews: 150 },
    description: 'CrossFit certified trainers, functional training, and nutrition guidance.',
    facilities: ['CrossFit', 'Functional Training', 'Nutrition Guidance'],
    images: ['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
    priceRange: '€€€',
    latitude: 0,
    longitude: 0
  }
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: 'Sarah J.',
    comment: 'FitNass helped me find a gym that perfectly matches my training style. Now I am making progress faster than ever!',
    image: 'https://randomuser.me/api/portraits/women/12.jpg'
  },
  {
    id: 2,
    name: 'Ahmed M.',
    comment: 'After moving to a new neighborhood, FitNass made it easy to find gyms with the specific equipment I needed.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 3,
    name: 'Leila K.',
    comment: 'The reviews on FitNass were spot-on and helped me choose the perfect gym for my fitness journey.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/gyms?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-700 to-indigo-500 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        {/* Diagonal accent lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 top-1/4 h-96 w-4 bg-indigo-300 rotate-12 transform opacity-80"></div>
          <div className="absolute -right-32 top-1/3 h-96 w-4 bg-indigo-300 rotate-12 transform opacity-80"></div>
          <div className="absolute left-1/4 bottom-0 h-96 w-3 bg-indigo-300 -rotate-12 transform opacity-60"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-28 px-6 sm:py-36 lg:px-8">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-7/12">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-2 drop-shadow-sm">
                Find Your Perfect <span className="text-indigo-200">Fitness Space</span>
              </h1>
              <p className="mt-6 text-xl max-w-3xl text-indigo-50">
                Discover the best gyms and fitness centers near you. Read reviews, compare facilities, and find the perfect place to achieve your fitness goals.
              </p>
              <div className="mt-10">
                <div className="max-w-xl">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <div className="relative drop-shadow-md">
                      <input
                        type="text"
                        placeholder="Search by location or gym name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-4 pl-12 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-base"
                      />
                      <button 
                        type="submit" 
                        className="absolute right-2 top-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-all"
                      >
                        <FiSearch className="h-5 w-5" />
                      </button>
                      <FiSearch className="absolute left-4 top-4 text-neutral-400" />
                    </div>
                  </form>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center text-indigo-100">
                  <FiCheck className="mr-2 h-5 w-5 text-indigo-200" />
                  <span>300+ Gyms</span>
                </div>
                <div className="flex items-center text-indigo-100">
                  <FiCheck className="mr-2 h-5 w-5 text-indigo-200" />
                  <span>Verified Reviews</span>
                </div>
                <div className="flex items-center text-indigo-100">
                  <FiCheck className="mr-2 h-5 w-5 text-indigo-200" />
                  <span>Easy Booking</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block lg:w-5/12">
              {/* Space for potential hero image or animation in the future */}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-xl hover:shadow-lg transition-all">
              <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <FiSearch className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Nearby Gyms</h3>
              <p className="text-neutral-600">Discover the perfect gym based on location, facilities, and pricing.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl hover:shadow-lg transition-all">
              <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <FiStar className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Read & Write Reviews</h3>
              <p className="text-neutral-600">Make informed decisions with honest reviews from real gym-goers.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl hover:shadow-lg transition-all">
              <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <FiUsers className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Join Fitness Community</h3>
              <p className="text-neutral-600">Connect with other fitness enthusiasts and share experiences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gyms Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900">Featured Gyms</h2>
            <Link href="/gyms" className="text-indigo-600 hover:text-indigo-800 flex items-center group">
              View all gyms
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGyms.map((gym) => (
              <div key={gym.id} className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-neutral-100 group">
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={gym.images[0]}
                    alt={gym.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-indigo-600 transition-colors">{gym.name}</h3>
                  <div className="mt-2 flex items-center text-neutral-600">
                    <FiMapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                    <span>{gym.address}, {gym.city}</span>
                  </div>
                  <div className="mt-3 flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(gym.rating) 
                              ? 'text-amber-400 fill-current' 
                              : 'text-neutral-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-neutral-700 font-medium">{gym.rating.toFixed(1)}</span>
                    <span className="ml-2 text-neutral-500 text-sm">({gym._count.reviews} reviews)</span>
                  </div>
                  <p className="mt-3 text-neutral-600 line-clamp-2 text-sm">{gym.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {gym.facilities.map((facility) => (
                      <span
                        key={facility}
                        className="px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5">
                    <Link
                      href={`/gyms/${gym.id}`}
                      className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-neutral-50 p-6 rounded-2xl shadow-sm">
                <p className="text-neutral-700 mb-4 italic">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="h-12 w-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-medium text-neutral-900">{testimonial.name}</h4>
                    <div className="flex text-amber-400">
                      <FiStar className="h-4 w-4 fill-current" />
                      <FiStar className="h-4 w-4 fill-current" />
                      <FiStar className="h-4 w-4 fill-current" />
                      <FiStar className="h-4 w-4 fill-current" />
                      <FiStar className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white py-20 relative overflow-hidden">
        {/* Diagonal accent line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 top-1/4 h-96 w-4 bg-indigo-300 rotate-12 transform opacity-40"></div>
          <div className="absolute left-1/4 bottom-0 h-96 w-3 bg-indigo-300 -rotate-12 transform opacity-30"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <FiActivity className="h-16 w-16 mx-auto mb-6 text-indigo-200" />
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Fitness Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-indigo-100">
            Join thousands of members who have found their perfect gym through FitNass. Sign up today and transform your fitness experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/gyms"
              className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-neutral-100 transition-all shadow-md"
            >
              Find Your Gym
            </Link>
            <Link
              href="/profile/me"
              className="inline-block bg-transparent text-white border border-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-indigo-600 transition-all"
            >
              Create Profile
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
