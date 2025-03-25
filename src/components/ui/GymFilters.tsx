import React from 'react';
import { FiDollarSign, FiActivity } from 'react-icons/fi';

interface GymFiltersProps {
  cityFilter: string;
  setCityFilter: (city: string) => void;
  ratingFilter: number;
  setRatingFilter: (rating: number) => void;
  facilitiesFilter: string[];
  setFacilitiesFilter: (facilities: string[]) => void;
  priceFilter: string[];
  setPriceFilter: (prices: string[]) => void;
  uniqueCities: string[];
  allFacilities: string[];
  className?: string;
}

// Get facility icon
const getFacilityIcon = (facility: string) => {
  const facilityMap: Record<string, JSX.Element> = {
    'Musculation': <span className="mr-1">💪</span>,
    'Cardio': <span className="mr-1">🏃</span>,
    'Yoga': <span className="mr-1">🧘</span>,
    'Piscine': <span className="mr-1">🏊</span>,
    'Sauna': <span className="mr-1">🧖</span>,
    'CrossFit': <span className="mr-1">🏋️</span>,
    'Coach personnel': <span className="mr-1">👨‍🏫</span>,
    'Massage': <span className="mr-1">💆</span>,
    'Pilates': <span className="mr-1">🤸</span>,
    'Boxe': <span className="mr-1">🥊</span>,
    'MMA': <span className="mr-1">🥋</span>,
  };
  
  return facilityMap[facility] || <FiActivity className="mr-1" />;
};

export const GymFilters: React.FC<GymFiltersProps> = ({
  cityFilter,
  setCityFilter,
  ratingFilter,
  setRatingFilter,
  facilitiesFilter,
  setFacilitiesFilter,
  priceFilter,
  setPriceFilter,
  uniqueCities,
  allFacilities,
  className = "",
}) => {
  const toggleFacilityFilter = (facility: string) => {
    if (facilitiesFilter.includes(facility)) {
      setFacilitiesFilter(facilitiesFilter.filter(f => f !== facility));
    } else {
      setFacilitiesFilter([...facilitiesFilter, facility]);
    }
  };

  const togglePriceFilter = (price: string) => {
    if (priceFilter.includes(price)) {
      setPriceFilter(priceFilter.filter(p => p !== price));
    } else {
      setPriceFilter([...priceFilter, price]);
    }
  };

  const resetFilters = () => {
    setCityFilter('');
    setRatingFilter(0);
    setFacilitiesFilter([]);
    setPriceFilter([]);
  };

  return (
    <div className={`bg-white border-b border-neutral-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* City Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">City</label>
            <select 
              value={cityFilter} 
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">All Cities</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          
          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Minimum Rating</label>
            <select 
              value={ratingFilter} 
              onChange={(e) => setRatingFilter(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="0">Any Rating</option>
              <option value="3">3+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
          </div>
          
          {/* Price Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Price Range</label>
            <div className="flex flex-wrap gap-2">
              {['€', '€€', '€€€'].map((price) => (
                <button
                  key={price}
                  onClick={() => togglePriceFilter(price)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    priceFilter.includes(price) 
                      ? 'bg-indigo-600 text-white shadow-sm transform scale-105' 
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <FiDollarSign className="inline-block mr-1" />
                  {price}
                </button>
              ))}
            </div>
          </div>
          
          {/* Facilities Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Facilities</label>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-2 custom-scrollbar">
              {allFacilities.slice(0, 10).map((facility) => (
                <button
                  key={facility}
                  onClick={() => toggleFacilityFilter(facility)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    facilitiesFilter.includes(facility) 
                      ? 'bg-indigo-600 text-white shadow-sm transform scale-105' 
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {getFacilityIcon(facility)}
                  {facility}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Filter Actions */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default GymFilters; 