'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiCpu, FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';
import EnhancedSearchBar from '@/components/ui/EnhancedSearchBar';
import Cookies from 'js-cookie';

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

// Get current locale from cookie
function getCurrentLocale(): string {
  if (typeof window !== 'undefined') {
    return Cookies.get('NEXT_LOCALE') || 'en';
  }
  return 'en';
}

// Translation function for hero section
const t = (key: string, locale: string): string => {
  const translations: Record<string, Record<string, string>> = {
    en: {
      "home.hero.title": "Find where and with whom to play <highlight>Padel</highlight> & <highlight>Tennis</highlight> instantly",
      "home.hero.subtitle": "Reach your best level, find equal level matches, courts around the world and teammates or rivals to play with",
      "home.hero.searchPlaceholder": "Address, club name, city..."
    },
    fr: {
      "home.hero.title": "Trouvez où et avec qui jouer au <highlight>Padel</highlight> et au <highlight>Tennis</highlight> instantanément",
      "home.hero.subtitle": "Atteignez votre meilleur niveau, trouvez des matchs de niveau égal, des terrains dans le monde entier et des coéquipiers ou des rivaux avec qui jouer",
      "home.hero.searchPlaceholder": "Adresse, nom du club, ville..."
    },
    ar: {
      "home.hero.title": "ابحث عن مكان ومع من تلعب <highlight>البادل</highlight> و <highlight>التنس</highlight> فوراً",
      "home.hero.subtitle": "حقق أفضل مستوى لك، وابحث عن مباريات بمستوى متساوٍ، وملاعب حول العالم وزملاء أو منافسين للعب معهم",
      "home.hero.searchPlaceholder": "العنوان، اسم النادي، المدينة..."
    }
  };

  return translations[locale]?.[key] || translations.en[key] || key;
};

// Helper function to format title with highlighted elements
const formatTitleWithHighlights = (title: string): React.ReactNode => {
  const parts = title.split(/<highlight>|<\/highlight>/);
  
  return parts.map((part, index) => {
    // Every even index (0, 2, 4...) is regular text
    // Every odd index (1, 3, 5...) is highlighted text
    const isHighlight = index % 2 === 1;
    
    return isHighlight ? (
      <span key={index} className="text-yellow-400 dark:text-red-500">{part}</span>
    ) : (
      <span key={index}>{part}</span>
    );
  });
};

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('padel');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const adjustedToday = new Date(today.getTime() - (offset*60*1000));
    return adjustedToday.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState('19:00');
  const router = useRouter();
  
  // State for client-side rendering control
  const [isClient, setIsClient] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('en');
  const [isRTL, setIsRTL] = useState(false);

  // Effect to set client-side rendering flag
  useEffect(() => {
    setIsClient(true);
    const locale = getCurrentLocale();
    setCurrentLocale(locale);
    setIsRTL(locale === 'ar');
  }, []);
  
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedSport) params.append('sport', selectedSport);
    if (selectedDate) params.append('date', selectedDate);
    if (selectedTime) params.append('time', selectedTime);
    
    router.push(`/search?${params.toString()}`);
  };

  const sportOptions = [
    { value: 'padel', label: 'Padel' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'football7', label: 'Football 7' },
    { value: 'futsal', label: 'Futsal' },
    { value: 'football', label: 'Football' },
    { value: 'padbol', label: 'Padbol' },
  ];

  // Always use English for server-side rendering to avoid hydration mismatch
  const heroTitle = isClient ? t('home.hero.title', currentLocale) : t('home.hero.title', 'en');
  const heroSubtitle = isClient ? t('home.hero.subtitle', currentLocale) : t('home.hero.subtitle', 'en');
  const searchPlaceholder = isClient ? t('home.hero.searchPlaceholder', currentLocale) : t('home.hero.searchPlaceholder', 'en');

  return (
    // Removed overflow-hidden
    <section className={`relative min-h-screen flex flex-col items-center justify-center text-white pt-24 pb-12 md:pt-32 md:pb-16 ${isClient && isRTL ? 'rtl' : 'ltr'}`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/hero-image.jpg)' }} // Replace with your actual image path
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      </div>
      
      {/* Content Area - Removed negative margin */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-6 text-center mb-10"> 
        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.7, ease: [0.1, 0.8, 0.2, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-4"
        >
          {formatTitleWithHighlights(heroTitle)}
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.7, delay: 0.1, ease: [0.1, 0.8, 0.2, 1] }}
          className="mt-3 text-base md:text-lg max-w-2xl mx-auto text-neutral-200 font-inter font-light mb-10 leading-relaxed"
        >
          {heroSubtitle}
        </motion.p>
      </div>

      {/* Search Bar Component Container - always show on home page */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.7, delay: 0.2, ease: [0.1, 0.8, 0.2, 1] }}
        className="relative z-20 w-full max-w-5xl px-4 lg:px-0 mx-auto shrink-0"
      >
        <Suspense fallback={<div className="rounded-xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg shadow-lg p-4 h-16 animate-pulse" />}>
          <EnhancedSearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder={searchPlaceholder}
            options={sportOptions}
            selectedOption={selectedSport}
            onOptionSelect={setSelectedSport}
            date={selectedDate}
            onDateChange={setSelectedDate}
            time={selectedTime}
            onTimeChange={setSelectedTime}
            onSearch={handleSearch}
            className="rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-xl"
          />
        </Suspense>
      </motion.div>

      {/* Floating Action Button */}
      <button 
        className={`fixed ${isClient && isRTL ? 'left-6' : 'right-6'} bottom-6 z-30 w-14 h-14 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl transition-colors duration-200`}
        aria-label="Chat support"
      >
        <FiMessageSquare size={24} />
      </button>
    </section>
  );
} 