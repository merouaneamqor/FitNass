'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiMapPin, FiCpu, FiArrowRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants 
const fadeInUp = {
  initial: { opacity: 0, y: 25 }, 
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -25 },
};

// -- Accent Colors --

// Yellow (Used for Light Mode)
const yellowAccentColor = 'yellow-400'; 
const lightYellowAccentTextClass = 'text-yellow-600';
const lightYellowAccentBorderClass = 'border-yellow-500';
const lightYellowAccentRingClass = 'ring-yellow-400/40';
const lightYellowAccentBgClass = 'bg-yellow-500';
const lightYellowAccentHoverBgClass = 'hover:bg-yellow-600';
const lightYellowAccentShadowClass = 'shadow-yellow-500/30';
const lightYellowAccentHoverShadowClass = 'hover:shadow-yellow-500/40';

// Red (Used for Aggressive Dark Mode Accents)
const redAccentColor = 'red-500'; 
const darkRedAccentTextClass = 'text-red-500'; 
const darkRedAccentBorderClass = 'border-red-500'; 
const darkRedFocusRingClass = 'ring-red-500/50'; // Red focus ring
const darkRedFocusBorderClass = 'border-red-500'; // Red focus border
const darkRedAccentBgClass = 'bg-red-600'; 
const darkRedAccentHoverBgClass = 'hover:bg-red-700'; 
const darkRedAccentShadowClass = 'shadow-red-600/40'; 
const darkRedAccentHoverShadowClass = 'hover:shadow-red-600/50';


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
    // Base light mode styles, dark mode overrides with dark: prefix
    <section className="relative min-h-screen flex items-center justify-center text-gray-900 dark:text-neutral-100 overflow-hidden bg-gradient-to-br from-white via-neutral-50 to-white dark:from-black dark:via-gray-950 dark:to-black transition-colors duration-300">
      {/* Noise Overlay - less visible in light mode */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.04] transition-opacity duration-300"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 800 800\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}>
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center"> 
        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.7, ease: [0.1, 0.8, 0.2, 1] }}
          // Base: Dark text. Dark mode: White text, stronger shadow
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bebas uppercase tracking-wide mb-4 text-gray-800 dark:text-white"
          style={{ textShadow: 'var(--hero-text-shadow, none)' }} // Use CSS var for shadow toggle
        >
          <style jsx global>{`
            :root {
              --hero-text-shadow: none;
            }
            .dark {
              --hero-text-shadow: 0 3px 20px rgba(0, 0, 0, 0.6);
            }
          `}</style>
          <span 
            // Light: Yellow gradient. Dark: Orange-to-Red gradient.
            className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 dark:from-red-700 dark:via-red-500 dark:to-red-600 drop-shadow-lg"
          >
            AI-Driven
          </span> Fitness
          {/* Base: Darker secondary text. Dark mode: Lighter */}
          <br className="hidden md:block" /> <span className="text-gray-600 dark:text-neutral-300 tracking-wider">Dominance.</span> 
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.7, delay: 0.1, ease: [0.1, 0.8, 0.2, 1] }}
          // Base: Darker text. Dark mode: Lighter text
          className="mt-3 text-base md:text-lg max-w-xl mx-auto text-gray-600 dark:text-neutral-300 font-inter mb-10 leading-relaxed"
        >
           Stop guessing. Start dominating. AI crafts your path to peak physical prowess.
        </motion.p>

        {/* Search Bar - Red focus in dark mode */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.7, delay: 0.2, ease: [0.1, 0.8, 0.2, 1] }}
          // Base: Light bg, light border. Dark mode: Dark bg, darker border
          className="w-full max-w-3xl mx-auto bg-white/90 dark:bg-gray-950/70 backdrop-blur-md p-4 rounded-lg shadow-xl dark:shadow-black/40 border border-gray-200/60 dark:border-neutral-700/70 transition-colors duration-300"
        >
           <div className="flex items-center justify-center mb-3">
            {/* Light: Dark Yellow icon. Dark: Red icon */}
            <FiCpu className={`h-4 w-4 ${lightYellowAccentTextClass} dark:${darkRedAccentTextClass} mr-1.5`} />
            {/* Base: Darker text. Dark mode: Lighter text */}
            <span className="text-xs text-gray-500 dark:text-neutral-400 font-medium font-inter">Find your edge...</span>
          </div>
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5 items-center"> 
            {/* Search Query Input - Red focus in dark */}
            <div className="relative flex-grow w-full sm:w-auto">
               {/* Light focus: Yellow icon. Dark focus: Red icon. */}
              <FiSearch className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none transition-colors duration-200 ${isSearchFocused ? lightYellowAccentTextClass + ' dark:' + darkRedAccentTextClass : 'text-gray-400 dark:text-neutral-500'}`} />
              <input
                type="text"
                placeholder="Venue, training type, or goal..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                // Light focus: Yellow. Dark focus: Red.
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-md bg-neutral-100/80 dark:bg-neutral-800/80 text-sm text-gray-900 dark:text-neutral-100 placeholder-gray-500 dark:placeholder-neutral-500 focus:outline-none focus:bg-white dark:focus:bg-neutral-800 transition-all duration-200 border-2 ${isSearchFocused ? lightYellowAccentBorderClass + ' dark:' + darkRedFocusBorderClass + ' ring-2 ' + lightYellowAccentRingClass + ' dark:' + darkRedFocusRingClass : 'border-gray-200/70 dark:border-neutral-700/80'} font-inter shadow-inner dark:shadow-black/20`}
              />
            </div>
            {/* City Input - Red focus in dark */}
            <div className="relative sm:w-[150px] flex-shrink-0 w-full sm:w-auto"> 
               {/* Light focus: Yellow icon. Dark focus: Red icon. */}
               <FiMapPin className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none transition-colors duration-200 ${isCityFocused ? lightYellowAccentTextClass + ' dark:' + darkRedAccentTextClass : 'text-gray-400 dark:text-neutral-500'}`} />
              <input
                type="text"
                placeholder="Location"
                value={cityQuery}
                onFocus={() => setIsCityFocused(true)}
                onBlur={() => setIsCityFocused(false)}
                onChange={(e) => setCityQuery(e.target.value)}
                // Light focus: Yellow. Dark focus: Red.
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-md bg-neutral-100/80 dark:bg-neutral-800/80 text-sm text-gray-900 dark:text-neutral-100 placeholder-gray-500 dark:placeholder-neutral-500 focus:outline-none focus:bg-white dark:focus:bg-neutral-800 transition-all duration-200 border-2 ${isCityFocused ? lightYellowAccentBorderClass + ' dark:' + darkRedFocusBorderClass + ' ring-2 ' + lightYellowAccentRingClass + ' dark:' + darkRedFocusRingClass : 'border-gray-200/70 dark:border-neutral-700/80'} font-inter shadow-inner dark:shadow-black/20`}
              />
            </div>
            {/* Submit Button - Red focus in dark */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03, filter: 'brightness(1.05)' }} // Adjusted hover brightness slightly
              whileTap={{ scale: 0.97, filter: 'brightness(0.95)' }} // Adjusted tap brightness slightly
              transition={{ duration: 0.1 }}
              // Light focus: Yellow ring. Dark focus: Red ring.
              className={`flex-shrink-0 w-full sm:w-auto ${lightYellowAccentBgClass} dark:${darkRedAccentBgClass} text-gray-900 dark:text-white px-5 py-2.5 rounded-md font-semibold text-sm uppercase tracking-wider transition-all duration-150 shadow-md ${lightYellowAccentShadowClass} dark:${darkRedAccentShadowClass} ${lightYellowAccentHoverBgClass} dark:${darkRedAccentHoverBgClass} hover:shadow-lg dark:hover:shadow-lg ${lightYellowAccentHoverShadowClass} dark:${darkRedAccentHoverShadowClass} flex items-center justify-center font-inter focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-950 focus:ring-${yellowAccentColor} dark:focus:ring-${redAccentColor}`}
            >
              Unleash
              <FiArrowRight className="h-4 w-4 ml-1.5 text-black dark:text-white" /> 
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
} 