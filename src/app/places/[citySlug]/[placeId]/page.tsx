'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMapPin, FiArrowLeft, FiArrowRight, FiCalendar, FiClock, FiStar, FiCheck, FiInfo } from 'react-icons/fi';
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
  const [activeTab, setActiveTab] = useState('booking');

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
    
    let className = 'h-12 w-12 rounded-md flex items-center justify-center transition-all duration-200 border text-center'; 
    if (isUnavailable) {
      className += ' bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400';
    } else if (isSelected) {
      className += ' bg-blue-600 border-blue-700 text-white shadow-md transform scale-105';
    } else {
      className += ' bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer text-gray-700';
    }

    return (
      <td key={`${courtId}-${hour}`} className="p-1">
        <div 
          className={className}
          onClick={() => handleSlotClick(courtId, hour)}
        >
          {hour}
        </div>
      </td>
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
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-80 bg-blue-100 rounded-2xl mb-6"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-white rounded-2xl p-8 h-96 shadow-sm"></div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 h-64 shadow-sm"></div>
                <div className="bg-white rounded-2xl p-6 h-64 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl shadow-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiInfo className="text-red-500 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Place not found'}</p>
          <Link
            href="/places"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Back to Places
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <div className="relative h-80 bg-gradient-to-r from-blue-700 to-blue-500">
        {place.images?.[0] && (
          <div className="absolute inset-0 mix-blend-overlay">
            <Image 
              src={place.images[0]} 
              alt={place.name}
              fill 
              className="object-cover object-center" 
              priority
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-end pb-8">
          <div className="flex items-center space-x-2 text-white/80 text-sm mb-2">
            <FiMapPin className="w-4 h-4" />
            <span>{place.city}, {place.state}</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{place.name}</h1>
          <div className="flex items-center gap-3 text-white/90 mb-4">
            <div className="flex items-center">
              <FiStar className="text-yellow-400 mr-1" />
              <span>{place.rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span className="capitalize">{place.type}</span>
            <span>•</span>
            <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
              <span className="text-white/70 mr-2">ID:</span>
              <span className="font-mono font-medium">{place.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb & Navigation */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/clubs" className="hover:text-gray-900 transition-colors">Clubs</Link>
              <span>/</span>
              <span className="text-gray-900 truncate max-w-[200px]">{place.name}</span>
            </div>
            <div className="flex gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('booking')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'booking' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Book a Court
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'about' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'photos' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Photos
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'info' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Info & Hours
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
              
              {activeTab === 'booking' && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Book a Court</h2>
                    <div className="flex space-x-3">
                      <div className="flex items-center bg-gray-100 rounded-lg p-2">
                        <FiCalendar className="text-gray-500 mr-2" />
                        <select className="bg-transparent text-sm font-medium focus:outline-none">
                          <option>Today</option>
                          <option>Tomorrow</option>
                          <option>In 2 days</option>
                        </select>
                      </div>
                      <div className="flex items-center bg-gray-100 rounded-lg p-2">
                        <select className="bg-transparent text-sm font-medium focus:outline-none">
                          <option>Padel</option>
                          <option>Tennis</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left px-2 py-3 text-sm font-medium text-gray-500">Court</th>
                          <th className="text-center px-1 py-3 text-sm font-medium text-gray-500" colSpan={hours.length}>Available Times</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courts.map(court => (
                          <tr key={court.id} className="border-t border-gray-100">
                            <td className="px-2 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">{court.name}</td>
                            <td className="p-0" colSpan={hours.length}>
                              <div className="flex overflow-x-auto pb-2">
                                {hours.map(hour => renderSlot(court.id, hour))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-6 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 border border-gray-200 bg-white rounded-sm mr-2"></div>
                      <span className="text-gray-600">Available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-100 border-gray-200 rounded-sm mr-2"></div>
                      <span className="text-gray-600">Not available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-600 border-blue-700 rounded-sm mr-2"></div>
                      <span className="text-gray-600">Selected</span>
                    </div>
                  </div>
                  
                  {selectedCourt && selectedTime && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-medium text-gray-800">Your selection</h3>
                          <p className="text-gray-600 text-sm">
                            {courts.find(c => c.id === selectedCourt)?.name} • {selectedTime}:00 - {parseInt(selectedTime)+1}:00
                          </p>
                        </div>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                          Book Now
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'about' && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">About {place.name}</h2>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {place.description || `Clube de Padel com 3 campos indoor localizados na Figueira da Foz.`}
                  </p>
                  
                  <h3 className="font-semibold text-gray-800 mb-3">Location & Contact</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-start">
                      <FiMapPin className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-gray-600">
                        {place.address}, {place.city}, {place.state} {place.zipCode}
                      </p>
                    </div>
                    {place.phone && (
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">☎</span>
                        <p className="text-gray-600">{place.phone}</p>
                      </div>
                    )}
                    {place.email && (
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">✉</span>
                        <p className="text-gray-600">{place.email}</p>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-gray-800 mb-3">Nearby Clubs</h3>
                  <div className="space-y-3">
                    {nearbyClubs.map(club => (
                      <div key={club.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="ml-2">
                          <h4 className="font-medium text-gray-800">{club.name}</h4>
                          <p className="text-sm text-gray-500">{club.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'photos' && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Photos</h2>
                  
                  {place.images && place.images.length > 0 ? (
                    <div className="relative">
                      <div className="h-96 rounded-xl overflow-hidden relative">
                        <Image 
                          src={place.images[currentImageIndex]} 
                          alt={`${place.name} - Image ${currentImageIndex + 1}`} 
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button 
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-md hover:bg-white transition-colors"
                        aria-label="Previous image"
                      >
                        <FiArrowLeft className="w-5 h-5 text-gray-700" />
                      </button>
                      <button 
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-md hover:bg-white transition-colors"
                        aria-label="Next image"
                      >
                        <FiArrowRight className="w-5 h-5 text-gray-700" />
                      </button>
                      
                      <div className="mt-4 flex justify-center">
                        {place.images.map((_, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2.5 h-2.5 rounded-full mx-1 transition-colors ${
                              currentImageIndex === idx 
                                ? 'bg-blue-600' 
                                : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-60 bg-gray-100 rounded-xl flex items-center justify-center">
                      <p className="text-gray-500">No photos available</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'info' && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Facility Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <FiClock className="mr-2 text-blue-600" />
                        Opening Hours
                      </h3>
                      <div className="space-y-2">
                        {openingHours.map((item, index) => (
                          <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                            <span className="text-gray-700 font-medium">{item.day}</span>
                            <span className="text-gray-600">{item.hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <FiCheck className="mr-2 text-blue-600" />
                        Amenities
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {getAmenities().map((amenity, index) => (
                          <div key={index} className="flex items-center py-1">
                            <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                            <span className="text-gray-700">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar (1/3 width) */}
            <div className="space-y-8">
              {/* Map Card */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="h-56 bg-gray-200 relative">
                  <Image 
                    src="/images/map-placeholder.jpg" 
                    alt="Map" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                      <p className="text-sm font-medium text-gray-700">Interactive Map Coming Soon</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Location</h3>
                  <p className="text-sm text-gray-600">
                    {place.address}, {place.city}, {place.state} {place.zipCode}
                  </p>
                  <button className="mt-3 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                    Get Directions →
                  </button>
                </div>
              </div>
              
              {/* Rating Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">Rating & Reviews</h3>
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center bg-blue-600 text-white w-14 h-14 rounded-xl text-2xl font-bold mr-4">
                    {place.rating.toFixed(1)}
                  </div>
                  <div>
                    <div className="flex mb-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i}
                          className={`w-5 h-5 ${i < Math.round(place.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">Based on {place._count?.reviews || 0} reviews</p>
                  </div>
                </div>
                <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Write a Review
                </button>
              </div>
              
              {/* Available Sports Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">Available Sports</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">Padel</span>
                  {place.type === 'CENTER' && (
                    <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">Tennis</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} FitNass. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 