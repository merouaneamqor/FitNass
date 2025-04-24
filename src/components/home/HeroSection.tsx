'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiMapPin, FiCpu, FiArrowRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants (simplified easing)
const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
};

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCityFocused, setIsCityFocused] = useState(false);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (cityQuery) params.append('city', cityQuery);
    router.push(`/search?${params.toString()}`);
  };

  return (
    // Increased height, even more subtle background
    <section className="relative h-[85vh] min-h-[650px] md:h-[95vh] flex items-center justify-center text-gray-900 overflow-hidden">
      {/* Extremely Subtle Animated Background */} 
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ 
          background: [
            'linear-gradient(150deg, #fdfdfe 0%, #fbfbfc 100%)', // Very very light start
            'linear-gradient(150deg, #fbfbfc 0%, #f9fafc 100%)', // Almost identical light
            'linear-gradient(150deg, #f9fafc 0%, #fbfbfc 100%)', // Back
            'linear-gradient(150deg, #fbfbfc 0%, #fdfdfe 100%)', // Back to start
          ]
        }}
        transition={{
          duration: 25, // Even slower animation
          ease: "linear",
          repeat: Infinity,
        }}
      />
      
      {/* Content Container - Max width adjusted */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, ease: "easeOut" }}
          // Increased size on large screens, stronger secondary color
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase tracking-wide mb-6 text-gray-800"
        >
          <span 
            // Richer gradient
            className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500"
          >
            AI-Optimized
          </span> Fitness
          <br className="hidden md:block" /> <span className="text-gray-700">Personalized Results.</span>
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          // Stronger paragraph color, increased bottom margin
          className="mt-5 text-base md:text-lg max-w-xl mx-auto text-gray-600 font-inter mb-14 leading-relaxed"
        >
          Unlock peak performance. Our AI analyzes your data to craft hyper-personalized training recommendations.
        </motion.p>

        {/* Search Bar - More premium materials and spacing */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          // Increased opacity, blur, padding, softer corners, refined shadow
          className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl shadow-black/10 border border-gray-200/50"
        >
           <div className="flex items-center justify-center mb-3">
            <FiCpu className="h-4 w-4 text-yellow-600 mr-1.5" />
            <span className="text-xs text-gray-500 font-medium font-inter">Describe your goals or desired venue...</span>
          </div>
          {/* Increased gap */} 
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Search Query Input - Refined appearance */}
            <div className="relative flex-grow w-full sm:w-auto">
              <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 pointer-events-none transition-colors duration-200 ${isSearchFocused ? 'text-yellow-600' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Describe your ideal fitness spot..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                // More opaque bg, taller padding, softer corners, refined focus
                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-100/90 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white transition-all duration-200 border ${isSearchFocused ? 'border-yellow-500/90 ring-2 ring-yellow-400/40' : 'border-transparent'} font-inter shadow-sm`}
              />
            </div>
            {/* City Input - Refined appearance */} 
            <div className="relative sm:w-[160px] flex-shrink-0 w-full sm:w-auto"> {/* Even wider city input */}
               <FiMapPin className={`absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 pointer-events-none transition-colors duration-200 ${isCityFocused ? 'text-yellow-600' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Location"
                value={cityQuery}
                onFocus={() => setIsCityFocused(true)}
                onBlur={() => setIsCityFocused(false)}
                onChange={(e) => setCityQuery(e.target.value)}
                // Consistent refined styling
                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-100/90 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white transition-all duration-200 border ${isCityFocused ? 'border-yellow-500/90 ring-2 ring-yellow-400/40' : 'border-transparent'} font-inter shadow-sm`}
              />
            </div>
            {/* Submit Button - Elevated style */}
            <motion.button
              type="submit"
              // Subtle gradient shift on hover
              whileHover={{ scale: 1.02, backgroundImage: 'linear-gradient(to right, #FACC15, #FBBF24)' }} 
              whileTap={{ scale: 0.98, backgroundColor: '#FBBF24' }} // yellow-500
              transition={{ duration: 0.15 }}
              // Richer base color, increased padding, softer corners
              className="flex-shrink-0 w-full sm:w-auto bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all duration-150 shadow-md shadow-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/40 flex items-center justify-center font-inter focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-white/95"
            >
              Search
              <FiArrowRight className="h-4.5 w-4.5 ml-2" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
} 