'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiSearch, FiCheck, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`);
  };

  return (
    <section className="relative bg-gradient-to-br from-indigo-800 via-indigo-700 to-indigo-600 text-white">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      {/* Abstract shapes background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-5 md:right-20 top-1/3 h-64 w-64 bg-indigo-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -left-10 bottom-1/4 h-96 w-96 bg-indigo-300 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute right-1/4 top-10 h-32 w-32 bg-blue-300 rounded-full blur-2xl opacity-20"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto py-20 px-6 sm:py-28 lg:pt-36 lg:pb-44 lg:px-8 z-10">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-7/12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-2 drop-shadow-sm"
            >
              Find Your Perfect <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-blue-200">Fitness Space</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-xl max-w-3xl text-indigo-50"
            >
              Discover the best gyms and sports clubs near you. Read reviews, compare facilities, and find the perfect place to achieve your fitness goals.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10"
            >
              <div className="w-full max-w-xl bg-gradient-to-r from-indigo-600/20 to-blue-500/20 backdrop-blur-lg p-3 rounded-2xl shadow-xl border border-white/10">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-indigo-300" />
                      </div>
                      <input
                        type="text"
                        placeholder="Find your ideal workout space..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base shadow-inner border-0"
                      />
                    </div>
                    <div className="md:w-1/3">
                      <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        className="w-full px-4 py-4 rounded-xl bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base shadow-inner border-0"
                      >
                        <option value="all">All Venues</option>
                        <option value="gym">Fitness Gyms</option>
                        <option value="club">Sports Clubs</option>
                      </select>
                    </div>
                    <button 
                      type="submit" 
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white p-4 rounded-xl transition-all flex items-center justify-center font-medium shadow-lg"
                    >
                      <span className="hidden md:inline mr-2">Search</span>
                      <FiSearch className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Quick filter buttons */}
                  <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                    <span className="text-xs text-white/70 whitespace-nowrap">Popular:</span>
                    {['Weightlifting', 'Yoga', 'CrossFit', 'Swimming', 'Tennis', 'Basketball'].map((filter) => (
                      <button
                        key={filter}
                        onClick={(e) => {
                          e.preventDefault();
                          setSearchQuery(filter);
                        }}
                        className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-xs font-medium text-white whitespace-nowrap transition-colors flex items-center"
                      >
                        {filter === 'Weightlifting' && <FiActivity className="mr-1 h-3 w-3" />}
                        {filter === 'Yoga' && <span className="mr-1">🧘</span>}
                        {filter === 'CrossFit' && <span className="mr-1">💪</span>}
                        {filter === 'Swimming' && <span className="mr-1">🏊</span>}
                        {filter === 'Tennis' && <span className="mr-1">🎾</span>}
                        {filter === 'Basketball' && <span className="mr-1">🏀</span>}
                        {filter}
                      </button>
                    ))}
                  </div>
                </form>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center text-indigo-100">
                  <div className="flex h-6 w-6 rounded-full bg-indigo-500/30 items-center justify-center mr-2">
                    <FiCheck className="h-3.5 w-3.5 text-indigo-200" />
                  </div>
                  <span>300+ Gyms</span>
                </div>
                <div className="flex items-center text-indigo-100">
                  <div className="flex h-6 w-6 rounded-full bg-indigo-500/30 items-center justify-center mr-2">
                    <FiCheck className="h-3.5 w-3.5 text-indigo-200" />
                  </div>
                  <span>200+ Sports Clubs</span>
                </div>
                <div className="flex items-center text-indigo-100">
                  <div className="flex h-6 w-6 rounded-full bg-indigo-500/30 items-center justify-center mr-2">
                    <FiCheck className="h-3.5 w-3.5 text-indigo-200" />
                  </div>
                  <span>Verified Reviews</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="hidden lg:flex lg:w-5/12 items-center justify-center relative mt-10 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image 
                src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="People working out at a premium gym"
                width={800}
                height={600}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6">
                  <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-md mb-2 inline-block">FEATURED</span>
                  <h3 className="text-white text-lg font-medium">Find Your Perfect Workout Space</h3>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
          <path fill="#ffffff" fillOpacity="1" d="M0,96L80,80C160,64,320,32,480,21.3C640,11,800,21,960,37.3C1120,53,1280,75,1360,85.3L1440,96L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
} 