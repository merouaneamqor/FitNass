'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (cityQuery) params.append('city', cityQuery);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative h-[75vh] min-h-[550px] md:h-[85vh] flex items-center justify-center text-white overflow-hidden bg-jet-black">
      {/* Background Image - Gritty Athlete */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Athlete training hard"
          fill
          className="object-cover opacity-40 md:opacity-50"
          priority
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-jet-black via-jet-black/70 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase tracking-wider mb-4 text-white drop-shadow-md"
        >
          FIND THE <span className="text-blood-red">TOUGHEST</span> COACHES.
          <br className="hidden md:block" /> TRAIN LIKE A <span className="text-blood-red">BEAST.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="mt-4 text-base md:text-lg max-w-2xl mx-auto text-neutral-300 font-medium mb-10 drop-shadow"
        >
          Connect with elite coaches, find hardcore gyms, and book intense training sessions.
          No excuses.
        </motion.p>

        {/* Search Bar - Brutalist hint */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          className="w-full max-w-2xl mx-auto bg-gunmetal-gray/80 backdrop-blur-sm p-3 rounded-md shadow-lg border border-neutral-700"
        >
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
            {/* Search Query Input */}
            <div className="relative flex-grow">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Coach, Gym, Club, Skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-sm bg-neutral-800/70 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neon-yellow focus:bg-neutral-700/90 transition-colors duration-200 border border-neutral-600"
              />
            </div>
            {/* City Input */}
            <div className="relative sm:w-1/3 flex-shrink-0">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500 pointer-events-none" />
              <input
                type="text"
                placeholder="City"
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-sm bg-neutral-800/70 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neon-yellow focus:bg-neutral-700/90 transition-colors duration-200 border border-neutral-600"
              />
            </div>
            {/* Submit Button - Neon Yellow Accent */}
            <button
              type="submit"
              className="flex-shrink-0 bg-neon-yellow hover:bg-yellow-400 text-black px-5 py-3 rounded-sm transition-colors duration-200 font-bold uppercase text-sm flex items-center justify-center shadow"
            >
              Find
              <FiSearch className="h-4 w-4 ml-2" />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
} 