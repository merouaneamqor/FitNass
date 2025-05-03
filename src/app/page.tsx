'use client';

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

  return (
    // Consider adding a background color if needed, Hero might cover viewport initially
    <div className="min-h-screen bg-gray-50 dark:bg-black overflow-hidden">
      {/* 1. Hero Section (Booking Entry Point) */}
      <HeroSection /> 
      
      {/* 2. Features / How it Works */}
      <FeaturesSection 
        features={[
          { icon: <FiSearch className="h-8 w-8 text-blue-500" />, title: "Find Your Court", description: "Search thousands of Padel & Tennis courts by location, time, and sport." },
          { icon: <FiUsers className="h-8 w-8 text-blue-500" />, title: "Join Matches & Find Players", description: "Connect with players of your level and join public or private matches instantly." },
          { icon: <FiCalendar className="h-8 w-8 text-blue-500" />, title: "Easy Booking", description: "Reserve your court or spot in a match with just a few clicks. Manage bookings easily." }
        ]}
      />

      {/* 3. Discovery - Popular Clubs/Courts */}
      <FeaturedVenuesSection venues={featuredVenues} /> 

      {/* 4. Discovery - Popular Cities */}
      <PopularCitiesSection cities={popularCities} />

      {/* 5. Community/Engagement Hint */}
      <FindMatchSection /> 

      {/* 6. Platform Value - Stats */}
      <StatsSection 
         stats={[
           { icon: <FiMapPin className="h-7 w-7 text-blue-500" />, value: "1,500+", label: "Clubs Worldwide" },
           { icon: <FiUsers className="h-7 w-7 text-blue-500" />, value: "500K+", label: "Active Players" },
           { icon: <FiCalendar className="h-7 w-7 text-blue-500" />, value: "10M+", label: "Matches Played" },
           { icon: <FiStar className="h-7 w-7 text-blue-500" />, value: "4.8/5", label: "Average Rating" }
         ]}
      />

      {/* 7. Trust - Testimonials */}
      <TestimonialsSection testimonials={testimonials} /> 

      {/* 8. Mobile App Promotion */}
      <MobileAppSection />
      
      {/* 9. Final Call to Action */}
      <CTASection 
        title="Ready to Play?"
        description="Join the largest community of Padel & Tennis players. Find matches, book courts, and improve your game today!"
        primaryButtonText="Find a Match Now"
        primaryButtonUrl="/search?type=match" // Example link
        secondaryButtonText="Sign Up Free"
        secondaryButtonUrl="/auth/signup"
        icon={<FiZap className="h-8 w-8 mb-4 text-blue-500" />}
      />
    </div>
  );
}
