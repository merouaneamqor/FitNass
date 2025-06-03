'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMapPin, FiArrowLeft, FiArrowRight, FiCalendar, FiClock, FiStar, FiCheck, FiInfo } from 'react-icons/fi';
import { useParams, useRouter } from 'next/navigation';
import { fetchClubById } from '@/actions/clubActions';
import { Place } from '@/types/place';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import Cookies from 'js-cookie';

// Define the structure for court data
interface Court {
  id: string;
  name: string;
  price?: number; // Price per hour
}

// Define structure for booking availability
interface Availability {
  [courtId: string]: {
    [timeSlot: string]: boolean; // true = not available, undefined/false = available
  };
}

// Define booking duration options
interface DurationOption {
  value: number; // Duration in minutes
  label: string;
}

// Mock translation function until real i18n is set up
function getCurrentLocale(): string {
  if (typeof window !== 'undefined') {
    return Cookies.get('NEXT_LOCALE') || 'en';
  }
  return 'en';
}

const t = (key: string): string => {
  const translations: Record<string, Record<string, string>> = {
    en: {
      "bookCourt": "Book a Court",
      "available": "Available",
      "notAvailable": "Not available",
      "selected": "Selected",
      "reservation": "Your Reservation",
      "court": "Court",
      "date": "Date",
      "time": "Time",
      "duration": "Duration",
      "totalPrice": "Total Price",
      "confirmBooking": "Confirm Booking",
      "about": "About",
      "locationContact": "Location & Contact",
      "nearbyClubs": "Nearby Clubs",
      "photos": "Photos",
      "noPhotos": "No photos available",
      "facilityInfo": "Facility Information",
      "openingHours": "Opening Hours",
      "amenities": "Amenities",
      "location": "Location",
      "getDirections": "Get Directions",
      "ratingReviews": "Rating & Reviews",
      "basedOn": "Based on",
      "reviews": "reviews",
      "writeReview": "Write a Review",
      "availableSports": "Available Sports",
      "allRightsReserved": "All rights reserved"
    },
    fr: {
      "bookCourt": "Réserver un terrain",
      "available": "Disponible",
      "notAvailable": "Non disponible",
      "selected": "Sélectionné",
      "reservation": "Votre réservation",
      "court": "Terrain",
      "date": "Date",
      "time": "Heure",
      "duration": "Durée",
      "totalPrice": "Prix total",
      "confirmBooking": "Confirmer la réservation",
      "about": "À propos",
      "locationContact": "Emplacement & Contact",
      "nearbyClubs": "Clubs à proximité",
      "photos": "Photos",
      "noPhotos": "Aucune photo disponible",
      "facilityInfo": "Informations sur l'établissement",
      "openingHours": "Heures d'ouverture",
      "amenities": "Équipements",
      "location": "Emplacement",
      "getDirections": "Obtenir l'itinéraire",
      "ratingReviews": "Évaluations & Avis",
      "basedOn": "Basé sur",
      "reviews": "avis",
      "writeReview": "Écrire un avis",
      "availableSports": "Sports disponibles",
      "allRightsReserved": "Tous droits réservés"
    },
    ar: {
      "bookCourt": "حجز ملعب",
      "available": "متاح",
      "notAvailable": "غير متاح",
      "selected": "محدد",
      "reservation": "حجزك",
      "court": "ملعب",
      "date": "التاريخ",
      "time": "الوقت",
      "duration": "المدة",
      "totalPrice": "السعر الإجمالي",
      "confirmBooking": "تأكيد الحجز",
      "about": "حول",
      "locationContact": "الموقع والاتصال",
      "nearbyClubs": "النوادي القريبة",
      "photos": "الصور",
      "noPhotos": "لا توجد صور متاحة",
      "facilityInfo": "معلومات المنشأة",
      "openingHours": "ساعات العمل",
      "amenities": "المرافق",
      "location": "الموقع",
      "getDirections": "الحصول على الاتجاهات",
      "ratingReviews": "التقييمات والمراجعات",
      "basedOn": "بناءً على",
      "reviews": "مراجعات",
      "writeReview": "كتابة مراجعة",
      "availableSports": "الرياضات المتاحة",
      "allRightsReserved": "جميع الحقوق محفوظة"
    }
  };

  const locale = getCurrentLocale();
  return translations[locale]?.[key] || translations.en[key] || key;
};

export default function PlaceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(60); // Default 60 minutes
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Check if the current language is RTL (Arabic)
  const isRTL = getCurrentLocale() === 'ar';

  // Apply RTL direction to document if needed
  useEffect(() => {
    if (isRTL) {
      document.documentElement.dir = 'rtl';
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.classList.remove('rtl');
    }
  }, [isRTL]);

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

  // Time slots for booking from 08:00 to 22:00, 30-minute intervals
  const timeSlots = Array.from({ length: 29 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = (i % 2) * 30;
    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    const formattedMinute = minute === 0 ? '00' : '30';
    return `${formattedHour}:${formattedMinute}`;
  });

  // Format time slot for display (with AM/PM)
  const formatTimeSlot = (timeSlot: string): string => {
    const [hourStr, minuteStr] = timeSlot.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    
    return `${displayHour}:${minute === 0 ? '00' : minute} ${period}`;
  };

  // Calculate end time based on start time and duration
  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    const endHour = endDate.getHours();
    const endMinute = endDate.getMinutes();
    
    const formattedEndHour = endHour < 10 ? `0${endHour}` : `${endHour}`;
    const formattedEndMinute = endMinute === 0 ? '00' : endMinute;
    
    return `${formattedEndHour}:${formattedEndMinute}`;
  };

  // Duration options
  const durationOptions: DurationOption[] = [
    { value: 30, label: '30 min' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' }
  ];

  // Mock courts data with prices
  const courts: Court[] = [
    { id: 'caixas', name: 'Campo - Caixas...', price: 12 },
    { id: 'drbox', name: 'Campo - dr Box', price: 14 },
    { id: 'bricoma', name: 'Campo - Bricoma...', price: 12 }
  ];

  // Mock unavailable slots - true = not available
  const unavailableSlots: Availability = {
    'caixas': { 
      '08:00': true, '08:30': true, 
      '10:00': true, '10:30': true, 
      '11:00': true, '11:30': true, 
      '12:00': true, '12:30': true, 
      '18:00': true, '18:30': true, 
      '19:00': true, '19:30': true, 
      '20:00': true, '20:30': true, 
      '22:00': true, '22:30': true 
    },
    'drbox': { 
      '08:00': true, '08:30': true, 
      '11:00': true, '11:30': true, 
      '12:00': true, '12:30': true, 
      '13:00': true, '13:30': true, 
      '17:00': true, '17:30': true, 
      '18:00': true, '18:30': true, 
      '19:00': true, '19:30': true,
      '20:00': true, '20:30': true, 
      '22:00': true, '22:30': true 
    },
    'bricoma': { 
      '08:00': true, '08:30': true, 
      '10:00': true, '10:30': true, 
      '11:00': true, '11:30': true, 
      '17:00': true, '17:30': true, 
      '18:00': true, '18:30': true, 
      '19:00': true, '19:30': true, 
      '20:00': true, '20:30': true, 
      '21:00': true, '21:30': true, 
      '22:00': true, '22:30': true 
    }
  };

  // Check if a time slot is available for the selected duration
  const isSlotAvailableForDuration = (courtId: string, startTime: string, durationMinutes: number): boolean => {
    // If the start time is unavailable, the entire slot is unavailable
    if (unavailableSlots[courtId]?.[startTime]) {
      return false;
    }

    // Check if any 30-minute slot within the duration is unavailable
    const slotsToCheck = Math.ceil(durationMinutes / 30);
    const startIndex = timeSlots.indexOf(startTime);
    
    if (startIndex === -1 || startIndex + slotsToCheck > timeSlots.length) {
      return false; // Invalid start time or extends beyond available slots
    }

    for (let i = 0; i < slotsToCheck; i++) {
      const timeSlot = timeSlots[startIndex + i];
      if (unavailableSlots[courtId]?.[timeSlot]) {
        return false;
      }
    }

    return true;
  };

  const handleSlotClick = (courtId: string, timeSlot: string) => {
    // Check if the slot is available for the selected duration
    if (isSlotAvailableForDuration(courtId, timeSlot, selectedDuration)) {
      if (selectedTimeSlot === timeSlot && selectedCourt === courtId) {
        // Deselect if already selected
        setSelectedTimeSlot(null);
        setSelectedCourt(null);
      } else {
        setSelectedTimeSlot(timeSlot);
        setSelectedCourt(courtId);
      }
    }
  };

  const handleDurationChange = (duration: number) => {
    setSelectedDuration(duration);
    // Reset selection if current selection is invalid with new duration
    if (selectedCourt && selectedTimeSlot) {
      if (!isSlotAvailableForDuration(selectedCourt, selectedTimeSlot, duration)) {
        setSelectedTimeSlot(null);
        setSelectedCourt(null);
      }
    }
  };

  const renderSlot = (courtId: string, timeSlot: string) => {
    const isAvailable = isSlotAvailableForDuration(courtId, timeSlot, selectedDuration);
    const isSelected = selectedTimeSlot === timeSlot && selectedCourt === courtId;
    
    let className = 'px-2 py-3 rounded-md flex items-center justify-center transition-all duration-200 border text-center min-w-[75px]'; 
    
    if (!isAvailable) {
      className += ' bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400';
    } else if (isSelected) {
      className += ' bg-blue-600 border-blue-700 text-white shadow-md transform scale-105';
    } else {
      className += ' bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer text-gray-700';
    }

    return (
      <td key={`${courtId}-${timeSlot}`} className="p-1">
        <div 
          className={className}
          onClick={() => handleSlotClick(courtId, timeSlot)}
        >
          {formatTimeSlot(timeSlot)}
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

  // Calculate total price if court and time slot are selected
  const calculateTotalPrice = (): number | null => {
    if (!selectedCourt || !selectedTimeSlot) return null;
    
    const court = courts.find(c => c.id === selectedCourt);
    if (!court || !court.price) return null;
    
    return (court.price * selectedDuration) / 60;
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${isRTL ? 'rtl' : 'ltr'}`}>
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

      {/* Breadcrumb & Language Selector */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/clubs" className="hover:text-gray-900 transition-colors">Clubs</Link>
              <span>/</span>
              <span className="text-gray-900 truncate max-w-[200px]">{place?.name}</span>
            </div>
            
            {/* Language selector */}
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Booking Section */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <h2 className="text-xl font-bold text-gray-800">{t('bookCourt')}</h2>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center bg-gray-100 rounded-lg p-2">
                      <FiCalendar className="text-gray-500 mr-2" />
                      <input
                        type="date"
                        className="bg-transparent text-sm font-medium focus:outline-none"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="flex items-center bg-gray-100 rounded-lg p-2">
                      <select 
                        className="bg-transparent text-sm font-medium focus:outline-none"
                        value={selectedDuration}
                        onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                      >
                        {durationOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
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
                        <th className="text-left px-2 py-3 text-sm font-medium text-gray-500">Price</th>
                        <th className="text-center px-1 py-3 text-sm font-medium text-gray-500" colSpan={timeSlots.length}>Available Times</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courts.map(court => (
                        <tr key={court.id} className="border-t border-gray-100">
                          <td className="px-2 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">{court.name}</td>
                          <td className="px-2 py-4 text-sm text-gray-800 whitespace-nowrap">€{court.price}/hour</td>
                          <td className="p-0" colSpan={timeSlots.length}>
                            <div className="flex overflow-x-auto pb-2">
                              {timeSlots.map(timeSlot => renderSlot(court.id, timeSlot))}
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
                    <span className="text-gray-600">{t('available')}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-100 border-gray-200 rounded-sm mr-2"></div>
                    <span className="text-gray-600">{t('notAvailable')}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-600 border-blue-700 rounded-sm mr-2"></div>
                    <span className="text-gray-600">{t('selected')}</span>
                  </div>
                </div>
                
                {selectedCourt && selectedTimeSlot && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <h3 className="font-medium text-gray-800 mb-2">{t('reservation')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{t('court')}</p>
                          <p className="text-gray-800 font-medium">
                            {courts.find(c => c.id === selectedCourt)?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{t('date')}</p>
                          <p className="text-gray-800 font-medium">
                            {new Date(selectedDate).toLocaleDateString(getCurrentLocale(), { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{t('time')}</p>
                          <p className="text-gray-800 font-medium">
                            {formatTimeSlot(selectedTimeSlot)} - {formatTimeSlot(calculateEndTime(selectedTimeSlot, selectedDuration))}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{t('duration')}</p>
                          <p className="text-gray-800 font-medium">
                            {durationOptions.find(opt => opt.value === selectedDuration)?.label}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-blue-100">
                        <div>
                          <p className="text-sm text-gray-600">{t('totalPrice')}</p>
                          <p className="text-lg font-bold text-gray-800">
                            €{calculateTotalPrice()?.toFixed(2)}
                          </p>
                        </div>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                          {t('confirmBooking')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* About Section */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{t('about')} {place?.name}</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {place?.description || `Clube de Padel com 3 campos indoor localizados na Figueira da Foz.`}
                </p>
                
                <h3 className="font-semibold text-gray-800 mb-3">{t('locationContact')}</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-start">
                    <FiMapPin className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                    <p className="text-gray-600">
                      {place?.address}, {place?.city}, {place?.state} {place?.zipCode}
                    </p>
                  </div>
                  {place?.phone && (
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">☎</span>
                      <p className="text-gray-600">{place.phone}</p>
                    </div>
                  )}
                  {place?.email && (
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">✉</span>
                      <p className="text-gray-600">{place.email}</p>
                    </div>
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-800 mb-3">{t('nearbyClubs')}</h3>
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
              
              {/* Photos Section */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{t('photos')}</h2>
                
                {place?.images && place.images.length > 0 ? (
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
                    <p className="text-gray-500">{t('noPhotos')}</p>
                  </div>
                )}
              </div>
              
              {/* Info Section */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-6">{t('facilityInfo')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <FiClock className="mr-2 text-blue-600" />
                      {t('openingHours')}
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
                      {t('amenities')}
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
                  <h3 className="font-semibold text-gray-800 mb-2">{t('location')}</h3>
                  <p className="text-sm text-gray-600">
                    {place?.address}, {place?.city}, {place?.state} {place?.zipCode}
                  </p>
                  <button className="mt-3 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                    {t('getDirections')} →
                  </button>
                </div>
              </div>
              
              {/* Rating Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">{t('ratingReviews')}</h3>
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center bg-blue-600 text-white w-14 h-14 rounded-xl text-2xl font-bold mr-4">
                    {place?.rating.toFixed(1)}
                  </div>
                  <div>
                    <div className="flex mb-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i}
                          className={`w-5 h-5 ${i < Math.round(place?.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">{t('basedOn')} {place?._count?.reviews || 0} {t('reviews')}</p>
                  </div>
                </div>
                <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  {t('writeReview')}
                </button>
              </div>
              
              {/* Available Sports Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">{t('availableSports')}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">Padel</span>
                  {place?.type === 'CENTER' && (
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
            © {new Date().getFullYear()} FitNass. {t('allRightsReserved')}
          </div>
        </div>
      </footer>
    </div>
  );
} 