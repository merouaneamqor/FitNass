'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/home/HeroSection';
import PopularCitiesSection from '@/components/home/PopularCitiesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import FeaturedVenuesSection, { Venue } from '@/components/home/FeaturedVenuesSection';
import TestimonialsSection, { Testimonial } from '@/components/home/TestimonialsSection';
import MobileAppSection from '@/components/home/MobileAppSection';
import StatsSection from '@/components/home/StatsSection';
import CTASection from '@/components/home/CTASection';
import { FiSearch, FiUsers, FiCalendar, FiMapPin, FiStar, FiZap } from 'react-icons/fi';
import FindMatchSection from '@/components/home/FindMatchSection';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import Cookies from 'js-cookie';

// Get current locale from cookie
function getCurrentLocale(): string {
  if (typeof window !== 'undefined') {
    return Cookies.get('NEXT_LOCALE') || 'en';
  }
  return 'en';
}

// Mock translation function until real i18n is set up
const t = (key: string, locale: string): string => {
  const translations: Record<string, Record<string, string>> = {
    en: {
      "home.featuredVenues": "Featured Venues",
      "home.viewAllVenues": "View All Venues",
      "home.popularCities": "Popular Cities",
      "home.viewAllCities": "View All Cities"
    },
    fr: {
      "home.featuredVenues": "Établissements en Vedette",
      "home.viewAllVenues": "Voir Tous les Établissements",
      "home.popularCities": "Villes Populaires",
      "home.viewAllCities": "Voir Toutes les Villes"
    },
    ar: {
      "home.featuredVenues": "المواقع المميزة",
      "home.viewAllVenues": "عرض جميع المواقع",
      "home.popularCities": "المدن الشهيرة",
      "home.viewAllCities": "عرض جميع المدن"
    }
  };

  return translations[locale]?.[key] || translations.en[key] || key;
};

// Example featured venues (adjust to match Playtomic - Padel/Tennis focus)
const featuredVenues: Venue[] = [
  {
    id: 'central-padel',
    name: 'Central Padel Club',
    address: '123 Padel Ave',
    city: 'Casablanca',
    rating: 4.9,
    _count: { reviews: 150 },
    description: 'Premium indoor padel courts with modern amenities.',
    facilities: ['Indoor Courts', 'Locker Rooms', 'Cafe'],
    images: ['/images/padel-court-1.jpg'], // Replace with actual image paths
    type: 'club', 
  },
  {
    id: 'riverside-tennis',
    name: 'Riverside Tennis Center',
    address: '456 Tennis Rd',
    city: 'Rabat',
    rating: 4.7,
    _count: { reviews: 85 },
    description: 'Scenic outdoor tennis courts with professional coaching.',
    facilities: ['Outdoor Courts', 'Pro Shop', 'Parking'],
    images: ['/images/tennis-court-1.jpg'], // Replace with actual image paths
    type: 'club', 
  },
  {
    id: 'anfa-sports-complex',
    name: 'Anfa Sports Complex',
    address: '789 Sports Blvd',
    city: 'Casablanca',
    rating: 4.8,
    _count: { reviews: 210 },
    description: 'Multi-sport facility with Padel, Tennis, and more.',
    facilities: ['Padel Courts', 'Tennis Courts', 'Showers'],
    images: ['/images/sports-complex-1.jpg'], // Replace with actual image paths
    type: 'club', 
  }
];

// Example testimonials (adjust to be more sport/match focused)
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Karim B.',
    comment: 'Found a perfect padel match within minutes! The level matching is spot on.',
    image: 'https://randomuser.me/api/portraits/men/11.jpg',
    rating: 5,
    city: 'Casablanca',
    profession: 'Padel Player'
  },
  {
    id: 2,
    name: 'Fatima Z.',
    comment: 'Booking tennis courts is so easy with this platform. Love the interface!',
    image: 'https://randomuser.me/api/portraits/women/22.jpg',
    rating: 5,
    city: 'Rabat',
    profession: 'Tennis Enthusiast'
  },
  {
    id: 3,
    name: 'Youssef A.',
    comment: 'Great way to find new people to play with. The community features are fantastic.',
    image: 'https://randomuser.me/api/portraits/men/33.jpg',
    rating: 4,
    city: 'Marrakech',
    profession: 'Social Player'
  }
];

// Popular cities (keep or adjust as needed)
const popularCities = [
  { name: 'Casablanca', image: 'https://images.unsplash.com/photo-1581443459255-e895f2a4222f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Rabat', image: 'https://images.unsplash.com/photo-1622924159221-c73e7245a2ea?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Marrakech', image: 'https://images.unsplash.com/photo-1585004607620-fb4c44331e73?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }, 
  { name: 'Tangier', image: 'https://images.unsplash.com/photo-1633264542743-c1acdb5eff0e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }, 
  { name: 'Fes', image: 'https://plus.unsplash.com/premium_photo-1697729887553-b0392581a691?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
];

export default function Home() {
  // Check if the current language is RTL (Arabic)
  const [isRTL, setIsRTL] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('en');

  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true);
    // Update locale and RTL state based on current locale
    const locale = getCurrentLocale();
    setCurrentLocale(locale);
    setIsRTL(locale === 'ar');
  }, []);

  // Only apply RTL styling after client-side hydration
  const rtlClass = isClient && isRTL ? 'rtl' : 'ltr';

  // Only use translated strings after client-side hydration
  const featuredVenuesTitle = isClient ? t('home.featuredVenues', currentLocale) : t('home.featuredVenues', 'en');
  const viewAllVenuesText = isClient ? t('home.viewAllVenues', currentLocale) : t('home.viewAllVenues', 'en');
  const popularCitiesTitle = isClient ? t('home.popularCities', currentLocale) : t('home.popularCities', 'en');
  const viewAllCitiesText = isClient ? t('home.viewAllCities', currentLocale) : t('home.viewAllCities', 'en');

  return (
    // Consider adding a background color if needed, Hero might cover viewport initially
    <div className={`min-h-screen bg-gray-50 dark:bg-black overflow-hidden ${rtlClass}`}>
      {/* Language switcher positioned at top-right corner */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      
      {/* 1. Hero Section (Booking Entry Point) */}
      <HeroSection /> 
      
      {/* 2. Features / How it Works */}
      <FeaturesSection 
        features={[
          { icon: <FiSearch className="h-8 w-8 text-blue-500" />, title: "home.features.findCourt", description: "home.features.findCourtDescription" },
          { icon: <FiUsers className="h-8 w-8 text-blue-500" />, title: "home.features.joinMatches", description: "home.features.joinMatchesDescription" },
          { icon: <FiCalendar className="h-8 w-8 text-blue-500" />, title: "home.features.easyBooking", description: "home.features.easyBookingDescription" }
        ]}
      />

      {/* 3. Discovery - Popular Clubs/Courts */}
      <FeaturedVenuesSection 
        venues={featuredVenues}
        title={featuredVenuesTitle}
        viewAllText={viewAllVenuesText}
      /> 

      {/* 4. Discovery - Popular Cities */}
      <PopularCitiesSection 
        cities={popularCities} 
        title={popularCitiesTitle}
        viewAllText={viewAllCitiesText}
      />

      {/* 5. Community/Engagement Hint */}
      <FindMatchSection /> 

      {/* 6. Platform Value - Stats */}
      <StatsSection 
         stats={[
           { icon: <FiMapPin className="h-7 w-7 text-blue-500" />, value: "1,500+", label: "home.stats.clubsWorldwide" },
           { icon: <FiUsers className="h-7 w-7 text-blue-500" />, value: "500K+", label: "home.stats.activePlayers" },
           { icon: <FiCalendar className="h-7 w-7 text-blue-500" />, value: "10M+", label: "home.stats.matchesPlayed" },
           { icon: <FiStar className="h-7 w-7 text-blue-500" />, value: "4.8/5", label: "home.stats.averageRating" }
         ]}
      />

      {/* 7. Trust - Testimonials */}
      <TestimonialsSection 
        testimonials={testimonials}
        title="home.testimonials.title"
        subtitle="home.testimonials.subtitle"
      /> 

      {/* 8. Mobile App Promotion */}
      <MobileAppSection />
      
      {/* 9. Final Call to Action */}
      <CTASection 
        title="home.cta.title"
        description="home.cta.description"
        primaryButtonText="home.cta.primaryButton"
        primaryButtonUrl="/search?type=match" // Example link
        secondaryButtonText="home.cta.secondaryButton"
        secondaryButtonUrl="/auth/signup"
        icon={<FiZap className="h-8 w-8 mb-4 text-blue-500" />}
      />
    </div>
  );
}
