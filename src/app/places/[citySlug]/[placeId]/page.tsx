'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMapPin, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useParams } from 'next/navigation';
import { fetchClubById } from '@/actions/clubActions';
import { Place } from '@/types/place';

// Define the structure for court data
interface Court {
  id: string;
  name: string;
}

// Define structure for booking availability
interface Availability {
  [courtId: string]: {
    [hour: string]: boolean; // true = not available, undefined/false = available
  };
}

export default function PlaceDetailsPage() {
  const params = useParams();
  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch place data
  useEffect(() => {
    const loadPlace = async () => {
      try {
        if (!params.placeId || !params.citySlug) return;
        
        const placeData = await fetchClubById(params.placeId as string);
        console.log(placeData);
        if (!placeData) {
          setError('Place not found');
          return;
        }

        setPlace(placeData);
      } catch (err) {
        console.error('Error loading place:', err);
        setError('Failed to load place details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPlace();
  }, [params.placeId, params.citySlug]);

  // Hours for time slots from 08 to 23
  const hours = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 8;
    return hour < 10 ? `0${hour}` : `${hour}`;
  });

  // Mock courts data
  const courts: Court[] = [
    { id: 'caixas', name: 'Campo - Caixas...' },
    { id: 'drbox', name: 'Campo - dr Box' },
    { id: 'bricoma', name: 'Campo - Bricoma...' }
  ];

  // Mock unavailable slots - true = not available
  const unavailableSlots: Availability = {
    'caixas': { '08': true, '10': true, '11': true, '12': true, '18': true, '19': true, '20': true, '22': true, '23': true },
    'drbox': { '08': true, '11': true, '12': true, '13': true, '17': true, '18': true, '19': true, '20': true, '22': true, '23': true },
    'bricoma': { '08': true, '10': true, '11': true, '17': true, '18': true, '19': true, '20': true, '21': true, '22': true, '23': true }
  };

  const handleSlotClick = (courtId: string, hour: string) => {
    // Only allow selection of available slots
    if (!unavailableSlots[courtId]?.[hour]) {
      if (selectedTime === hour && selectedCourt === courtId) {
        // Deselect if already selected
        setSelectedTime(null);
        setSelectedCourt(null);
      } else {
        setSelectedTime(hour);
        setSelectedCourt(courtId);
      }
    }
  };

  const renderSlot = (courtId: string, hour: string) => {
    const isUnavailable = unavailableSlots[courtId]?.[hour];
    const isSelected = selectedTime === hour && selectedCourt === courtId;
    
    let bgClass = 'bg-white'; // Available
    if (isUnavailable) {
      bgClass = 'bg-gray-200'; // Not available
    } else if (isSelected) {
      bgClass = 'bg-blue-600'; // Your booking
    }

    return (
      <td 
        key={`${courtId}-${hour}`}
        className={`${bgClass} border border-gray-100 h-10 cursor-pointer transition-colors`}
        onClick={() => handleSlotClick(courtId, hour)}
      ></td>
    );
  };

  // Image navigation for carousel
  const nextImage = () => {
    if (!place?.images) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === place.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!place?.images) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? place.images.length - 1 : prevIndex - 1
    );
  };

  // Mock nearby clubs
  const nearbyClubs = [
    { id: '1', name: 'Quinta d\'Anta', location: 'Maiorca' },
  ];

  // Mock amenities based on place facilities
  const getAmenities = () => {
    const defaultAmenities = [
      'Equipment Rental', 'Free Parking', 'Private Parking', 'Store',
      'Cafeteria', 'Snack Bar', 'Changing Room', 'Lockers', 'WiFi', 'Play Park'
    ];
    
    return place?.facilities || defaultAmenities;
  };

  // Mock opening hours
  const openingHours = [
    { day: 'Monday', hours: '09:00 - 00:00' },
    { day: 'Tuesday', hours: '09:00 - 00:00' },
    { day: 'Wednesday', hours: '09:00 - 00:00' },
    { day: 'Thursday', hours: '09:00 - 00:00' },
    { day: 'Friday', hours: '09:00 - 00:00' },
    { day: 'Saturday', hours: '09:00 - 00:00' },
    { day: 'Sunday', hours: '09:00 - 00:00' },
    { day: '* Holidays', hours: '09:00 - 00:00' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-64 bg-blue-100 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-7xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Place not found'}</p>
          <Link
            href="/places"
            className="inline-flex items-center text-blue-600 hover:text-blue-500 transition-colors"
          >
            Back to Places
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-8">
              <Image src="/images/logo.svg" alt="Playtomic" width={120} height={24} />
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/book-padel-courts" className="font-medium hover:text-blue-200 transition-colors">Book padel courts</Link>
              <Link href="/book-tennis-courts" className="font-medium hover:text-blue-200 transition-colors">Book tennis courts</Link>
              <Link href="/clubs" className="font-medium hover:text-blue-200 transition-colors">Clubs</Link>
              <Link href="/blog" className="font-medium hover:text-blue-200 transition-colors">Blog</Link>
            </nav>
          </div>
          <Link href="/are-you-a-club-manager" className="text-sm font-medium hover:text-blue-200 transition-colors">
            Are you a club manager?
          </Link>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-blue-600 text-white relative">
        <div className="absolute inset-0 opacity-40">
          <Image 
            src={place.images?.[0] || "/images/default-court.jpg"} 
            alt="Court" 
            fill 
            className="object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          <h4 className="text-lg font-medium mb-2">Book a court in</h4>
          <h1 className="text-4xl font-bold mb-2">{place.name}</h1>
          <p className="text-white/80">
            {place.type}, {place.address}
          </p>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/clubs" className="hover:text-gray-900 transition-colors">Clubs</Link>
            <span>/</span>
            <span className="text-gray-900">{place.name}</span>
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content (2/3 width) */}
            <div className="md:col-span-2">
              {/* Booking Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                {/* Sport and Date Selectors */}
                <div className="flex space-x-4 mb-8">
                  <div className="w-32">
                    <select className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full">
                      <option>Padel</option>
                    </select>
                  </div>
                  <div className="w-32">
                    <select className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full">
                      <option>Tomorrow</option>
                    </select>
                  </div>
                </div>

                {/* Booking Grid */}
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="w-40"></th>
                        {hours.map(hour => (
                          <th key={hour} className="text-center text-sm font-medium py-2">{hour}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {courts.map(court => (
                        <tr key={court.id}>
                          <td className="pr-4 py-2 text-sm font-medium">{court.name}</td>
                          {hours.map(hour => renderSlot(court.id, hour))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Legend */}
                <div className="flex items-center space-x-8 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-4 h-4 border border-gray-300 bg-white mr-2"></div>
                    <span>available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 mr-2"></div>
                    <span>not available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-600 mr-2"></div>
                    <span>your booking</span>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">All about {place.name}</h2>
                <p className="text-gray-700 mb-6">
                  {place.description || `Clube de Padel com 3 campos indoor localizados na Figueira da Foz.`}
                </p>
                <p className="text-sm text-gray-500 mb-4">ID: {place.id}</p>

                {/* Image Carousel */}
                {place.images && place.images.length > 0 && (
                  <div className="relative">
                    <div className="h-72 bg-gray-100 rounded-lg overflow-hidden relative">
                      <Image 
                        src={place.images[currentImageIndex]} 
                        alt={`${place.name} - Image ${currentImageIndex + 1}`} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button 
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                      aria-label="Previous image"
                    >
                      <FiArrowLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                      aria-label="Next image"
                    >
                      <FiArrowRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      {place.images.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`w-2 h-2 rounded-full mx-1 ${
                            currentImageIndex === idx ? 'bg-white' : 'bg-white/50'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Nearby Clubs */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">More available clubs near {place.name}</h2>
                <div className="space-y-4">
                  {nearbyClubs.map(club => (
                    <div key={club.id} className="border-b border-gray-100 pb-3">
                      <h3 className="font-semibold">{club.name}</h3>
                      <p className="text-sm text-gray-500">{club.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar (1/3 width) */}
            <div className="md:col-span-1 space-y-8">
              {/* Map */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-64 bg-gray-200">
                  {/* Map will go here */}
                  <Image 
                    src="/images/map-placeholder.jpg" 
                    alt="Map" 
                    width={400} 
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700">
                    {place.name}, {place.address}, {place.city}
                    {place.state ? `, ${place.state}` : ''}
                    {place.zipCode ? ` ${place.zipCode}` : ''}
                  </p>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-4">
                  {getAmenities().map((amenity, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <span className="text-green-600 mr-2">•</span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              {/* Opening Hours */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Opening hours</h2>
                <div className="space-y-2">
                  {openingHours.map((item, index) => (
                    <div key={index} className="flex justify-between py-1 border-b border-gray-100 last:border-0">
                      <span className="text-gray-600">{item.day}</span>
                      <span className="font-medium">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Sports */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Available sports</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-800">Padel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Image src="/images/logo.svg" alt="Playtomic" width={120} height={24} className="mb-4" />
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Playtomic</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Download our app</a></li>
                <li><a href="#" className="hover:text-gray-900">Work with us</a></li>
                <li><a href="#" className="hover:text-gray-900">Global padel report</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Legal conditions</a></li>
                <li><a href="#" className="hover:text-gray-900">Privacy policy</a></li>
                <li><a href="#" className="hover:text-gray-900">Cookies policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-500">
            © 2010-{new Date().getFullYear()} Playtomic S.L. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 