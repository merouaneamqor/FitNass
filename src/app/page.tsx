'use client';

import HeroSection from '@/components/home/HeroSection';
import PopularCitiesSection from '@/components/home/PopularCitiesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import FeaturedVenuesSection from '@/components/home/FeaturedVenuesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import MobileAppSection from '@/components/home/MobileAppSection';
import StatsSection from '@/components/home/StatsSection';
import CTASection from '@/components/home/CTASection';

// Example featured gyms data
const featuredGyms = [
  {
    id: 'fitlife-gym',
    name: 'FitLife Gym',
    address: 'Downtown',
    city: 'Casablanca',
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
    city: 'Rabat',
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
    city: 'Marrakech',
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

// Featured clubs data
const featuredClubs = [
  {
    id: 'elite-tennis-club',
    name: 'Elite Tennis Club',
    address: 'Sports District',
    city: 'Casablanca',
    rating: 4.7,
    _count: { reviews: 95 },
    description: 'Professional tennis courts with certified coaches for all levels.',
    facilities: ['Tennis Courts', 'Professional Coaching', 'Equipment Rental'],
    images: ['https://images.unsplash.com/photo-1622279457486-28f95c8c7fe3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
    priceRange: '€€',
    latitude: 0,
    longitude: 0
  },
  {
    id: 'aquatic-sports-center',
    name: 'Aquatic Sports Center',
    address: 'Marina Bay',
    city: 'Tangier',
    rating: 4.5,
    _count: { reviews: 78 },
    description: 'Olympic-size swimming pool and water sports facilities.',
    facilities: ['Swimming Pool', 'Water Sports', 'Sauna'],
    images: ['https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
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
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    rating: 5,
    city: 'Casablanca'
  },
  {
    id: 2,
    name: 'Ahmed M.',
    comment: 'After moving to a new neighborhood, FitNass made it easy to find gyms with the specific equipment I needed.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    city: 'Rabat'
  },
  {
    id: 3,
    name: 'Leila K.',
    comment: 'The reviews on FitNass were spot-on and helped me choose the perfect gym for my fitness journey.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    city: 'Marrakech'
  }
];

// Popular cities
const popularCities = [
  { name: 'Casablanca', image: 'https://images.unsplash.com/photo-1581443459255-e895f2a4222f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }, // Dynamic Casablanca shot
  { name: 'Rabat', image: 'https://images.unsplash.com/photo-1622924159221-c73e7245a2ea?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }, // Rabat waterfront/activity
  { name: 'Marrakech', image: 'https://images.unsplash.com/photo-1585004607620-fb4c44331e73?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }, // Fes Medina shot
  { name: 'Tangier', image: 'https://images.unsplash.com/photo-1633264542743-c1acdb5eff0e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }, // Tangier coast/activity
  { name: 'Fes', image: 'https://plus.unsplash.com/premium_photo-1697729887553-b0392581a691?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } // Tangier coast/activity
];

export default function Home() {
  // Combine gyms and clubs for the featured venues section
  const allVenues = [...featuredGyms, ...featuredClubs];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <HeroSection />
      <PopularCitiesSection cities={popularCities} />
      <FeaturesSection />
      <FeaturedVenuesSection venues={allVenues} />
      <TestimonialsSection testimonials={testimonials} />
      <MobileAppSection />
      <StatsSection />
      <CTASection />
    </div>
  );
}
