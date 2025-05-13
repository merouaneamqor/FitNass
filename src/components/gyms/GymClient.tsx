'use client';

import { useState, useRef, Suspense } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import Image from 'next/image';

// Import types
import { Gym } from '@/types/gym';

// Import UI components
import {
  HeaderSection,
  SearchBar,
  GymFilters,
  StatsBar,
  ErrorAlert,
  GymCard,
  UnifiedSearch
} from '@/components/ui';

// Mapbox token - use environment variable
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiZml0bmFzcyIsImEiOiJjbGtqcnhiNHMwMXpjM2ZwYzEwOHVzM3F0In0.aBCbCWRsUZBbZ9YEys4aJQ';

interface GymClientProps {
  initialGyms: Gym[];
  uniqueCities: string[];
  allFacilities: string[];
  totalReviews: number;
  initialError: string | null;
}

export function GymClient({ 
  initialGyms, 
  uniqueCities, 
  allFacilities, 
  totalReviews,
  initialError
}: GymClientProps) {
  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  // Filter states
  const [cityFilter, setCityFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [facilitiesFilter, setFacilitiesFilter] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<string[]>([]);

  // Map states
  const [viewState, setViewState] = useState({
    latitude: 31.7917, // Morocco's approximate center
    longitude: -7.0926,
    zoom: 5
  });
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const mapRef = useRef(null);

  // Filter function
  const filterGyms = (
    search: string, 
    city: string, 
    rating: number, 
    facilities: string[], 
    priceRanges: string[]
  ): Gym[] => {
    return initialGyms.filter((gym) => {
      // Basic search filter
      const matchesSearch = search ? (
        gym.name.toLowerCase().includes(search.toLowerCase()) ||
        gym.city.toLowerCase().includes(search.toLowerCase()) ||
        gym.description.toLowerCase().includes(search.toLowerCase())
      ) : true;
      
      // Additional filters
      const matchesCity = city ? gym.city.toLowerCase() === city.toLowerCase() : true;
      const matchesRating = gym.rating >= rating;
      const matchesFacilities = facilities.length > 0 
        ? facilities.every(f => gym.facilities.some(gf => gf.toLowerCase().includes(f.toLowerCase())))
        : true;
      const matchesPrice = priceRanges.length > 0 
        ? priceRanges.includes(gym.priceRange)
        : true;

      return matchesSearch && matchesCity && matchesRating && matchesFacilities && matchesPrice;
    });
  };

  // Apply all filters
  const filteredGyms = filterGyms(
    searchQuery,
    cityFilter,
    ratingFilter,
    facilitiesFilter,
    priceFilter
  );

  const handleGymClick = (gym: Gym) => {
    setSelectedGym(gym);
    setViewState({
      latitude: gym.latitude,
      longitude: gym.longitude,
      zoom: 14
    });
    if (viewMode === 'list') {
      setViewMode('map');
    }
  };

  // Get price range color for map markers
  const getPriceRangeColor = (range: string) => {
    switch(range) {
      case '€': return 'bg-emerald-500';
      case '€€': return 'bg-amber-500';
      case '€€€': return 'bg-rose-500';
      default: return 'bg-emerald-500';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <HeaderSection 
        title="Find Your Gym" 
        viewMode={viewMode} 
        setViewMode={setViewMode}
        showViewToggle={true}
      />

      {/* Search Bar */}
      <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-4 h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />}>
        <UnifiedSearch
          variant="full"
          className="max-w-7xl mx-auto px-6 py-4"
          initialQuery={searchQuery}
          onSearch={({ query }) => setSearchQuery(query)}
          placeholder="Search gyms by name, city or features..."
          showFilters={showFilters}
        />
      </Suspense>

      {/* Filters Section */}
      {showFilters && (
        <GymFilters
          cityFilter={cityFilter}
          setCityFilter={setCityFilter}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          facilitiesFilter={facilitiesFilter}
          setFacilitiesFilter={setFacilitiesFilter}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          uniqueCities={uniqueCities}
          allFacilities={allFacilities}
        />
      )}

      {/* Stats Bar */}
      <StatsBar 
        filteredCount={filteredGyms.length}
        citiesCount={uniqueCities.length}
        reviewsCount={totalReviews}
      />

      {/* Error State */}
      {initialError && <ErrorAlert message={initialError} />}

      {/* Main Content Area */}
      {!initialError && (
        <div className="flex-1 flex flex-col">
          {/* View Mode: List */}
          {viewMode === 'list' && (
            <div className="max-w-7xl mx-auto px-6 py-8">
              {filteredGyms.length === 0 ? (
                <div className="text-center py-28">
                  <p className="text-neutral-500 text-lg">No gyms found matching your search criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredGyms.map((gym) => (
                    <GymCard
                      key={gym.id}
                      gym={gym}
                      onCardClick={handleGymClick}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* View Mode: Map */}
          {viewMode === 'map' && (
            <div className="flex-1">
              <Map
                {...viewState}
                ref={mapRef}
                onMoveEnd={(evt: { viewState: typeof viewState }) => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/light-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
                style={{ width: '100%', height: '100%', minHeight: 'calc(100vh - 200px)' }}
              >
                <NavigationControl position="bottom-right" showCompass={false} />
                
                {filteredGyms.map((gym) => (
                  <Marker
                    key={gym.id}
                    latitude={gym.latitude}
                    longitude={gym.longitude}
                  >
                    <div 
                      className={`cursor-pointer w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedGym?.id === gym.id 
                          ? 'bg-indigo-600' 
                          : getPriceRangeColor(gym.priceRange)
                      } hover:bg-indigo-600 text-white shadow-lg transform transition-transform ${
                        selectedGym?.id === gym.id ? 'scale-125 z-10' : 'scale-100'
                      } pulse-marker`}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setSelectedGym(gym);
                      }}
                    >
                      {gym.priceRange}
                    </div>
                  </Marker>
                ))}

                {selectedGym && (
                  <Popup
                    latitude={selectedGym.latitude}
                    longitude={selectedGym.longitude}
                    anchor="bottom"
                    onClose={() => setSelectedGym(null)}
                    closeOnClick={false}
                    closeButton
                    className="gym-popup"
                  >
                    <div className="p-2 w-72">
                      <div className="relative w-full h-64 rounded-lg overflow-hidden">
                        <Image
                          src={selectedGym.images[0] || '/default-gym.jpg'}
                          alt={selectedGym.name}
                          width={288}
                          height={256}
                          className="object-cover w-full h-full"
                          priority
                        />
                      </div>
                      <h3 className="font-semibold text-neutral-900 text-lg">{selectedGym.name}</h3>
                      <div className="flex items-center mt-2 text-sm text-neutral-600">
                        <span className="truncate">{selectedGym.address}, {selectedGym.city}</span>
                      </div>
                      <div className="mt-3">
                        <a 
                          href={`/gyms/${selectedGym.id}`}
                          className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </Popup>
                )}
              </Map>
            </div>
          )}
        </div>
      )}

      {/* Custom styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e0e0e0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6366f1;
        }
        
        .gym-popup .mapboxgl-popup-content {
          padding: 16px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.05);
        }
        
        .gym-popup .mapboxgl-popup-close-button {
          font-size: 20px;
          padding: 4px 8px;
          color: #4b5563;
          right: 8px;
          top: 8px;
        }
        
        .pulse-marker {
          box-shadow: 0 0 0 rgba(99, 102, 241, 0.4);
          animation: pulse-ring 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(99, 102, 241, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
          }
        }
      `}</style>
    </div>
  );
}

export default GymClient; 