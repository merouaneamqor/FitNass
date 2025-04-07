'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiSearch, FiMapPin, FiStar, FiActivity, FiUsers, FiCalendar, FiAlertCircle, FiX } from 'react-icons/fi';
import { GiTennisRacket, GiSoccerField, GiWeightLiftingUp } from 'react-icons/gi';
import Image from 'next/image';

type SearchResult = {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  images: string[];
  rating: number;
  facilities: string[];
  type: 'club' | 'gym';
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCity = searchParams.get('city') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [cityFilter, setCityFilter] = useState(initialCity);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'gyms' | 'clubs'>('all');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Popular cities in Morocco
  const popularCities = ['Casablanca', 'Rabat', 'Marrakech', 'Tangier', 'Fez', 'Agadir'];

  // Handle selecting a popular city
  const handleSelectCity = (city: string) => {
    setCityFilter(city);
    
    // Update URL with selected city
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    params.append('city', city);
    router.push(`/search?${params.toString()}`);
  };

  useEffect(() => {
    async function fetchSearchResults() {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching search results for: "${searchQuery}" in city: "${cityFilter}"`);
        
        // Build query params
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery);
        if (cityFilter) params.append('city', cityFilter);
        const queryString = params.toString();
        
        // Fetch gyms data
        const gymsResponse = await fetch(`/api/gyms/search?${queryString}`);
        if (!gymsResponse.ok) {
          throw new Error(`Failed to fetch gyms: ${gymsResponse.status} ${gymsResponse.statusText}`);
        }
        
        const gymsData = await gymsResponse.json();
        console.log(`Received ${gymsData.length} gyms:`, gymsData);
        
        // Fetch clubs data
        const clubsResponse = await fetch(`/api/clubs/search?${queryString}`);
        if (!clubsResponse.ok) {
          throw new Error(`Failed to fetch clubs: ${clubsResponse.status} ${clubsResponse.statusText}`);
        }
        
        const clubsData = await clubsResponse.json();
        console.log(`Received ${clubsData.length} clubs:`, clubsData);
        
        // Format the data with type markers
        const formattedGyms = Array.isArray(gymsData) 
          ? gymsData.map((gym) => ({
              ...gym,
              type: 'gym',
              // Ensure required properties exist
              name: gym.name || 'Unnamed Gym',
              description: gym.description || 'No description available',
              address: gym.address || 'No address provided',
              city: gym.city || 'Unknown location',
              rating: gym.rating || 0,
              facilities: gym.facilities || [],
              images: gym.images || [],
            }))
          : [];
        
        const formattedClubs = Array.isArray(clubsData)
          ? clubsData.map((club) => ({
              ...club,
              type: 'club',
              // Ensure required properties exist
              name: club.name || 'Unnamed Club',
              description: club.description || 'No description available',
              address: club.address || 'No address provided',
              city: club.city || 'Unknown location',
              rating: club.rating || 0,
              facilities: club.facilities || [],
              images: club.images || [],
            }))
          : [];
        
        // Combine results
        const combinedResults = [...formattedGyms, ...formattedClubs];
        console.log(`Combined ${combinedResults.length} total results`);
        
        setResults(combinedResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch search results');
      } finally {
        setIsLoading(false);
      }
    }
    
    // Only fetch if either search query or city filter is provided
    if (searchQuery || cityFilter) {
      fetchSearchResults();
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [searchQuery, cityFilter]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL with current search parameters
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (cityFilter) params.append('city', cityFilter);
    router.push(`/search?${params.toString()}`);
  };

  // Handle city filter removal
  const handleClearCityFilter = () => {
    setCityFilter('');
    
    // Update URL without city parameter
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    router.push(`/search?${params.toString()}`);
  };

  // Filter results based on active filter
  const filteredResults = results.filter(result => {
    if (activeFilter === 'all') return true;
    return result.type === activeFilter.slice(0, -1); // Remove 's' from 'gyms' or 'clubs'
  });

  // Get counts for each type
  const gymCount = results.filter(r => r.type === 'gym').length;
  const clubCount = results.filter(r => r.type === 'club').length;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Search Results</h1>
          
          {/* Search Input */}
          <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search for gyms or sports clubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-4 pl-12 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-base"
            />
            <FiSearch className="absolute left-4 top-4 text-neutral-400" />
            <button type="submit" className="hidden">Search</button>
          </form>
          
          {/* Popular Cities */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-white/80 text-sm">Popular cities:</span>
              {popularCities.map(city => (
                <button
                  key={city}
                  onClick={() => handleSelectCity(city)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    cityFilter === city
                      ? 'bg-white text-indigo-700'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
          
          {/* City filter badge - shown when filtering by city */}
          {cityFilter && (
            <div className="mt-4 flex items-center">
              <span className="text-white/80 mr-2">Filtered by city:</span>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full flex items-center text-sm">
                <FiMapPin className="mr-1 h-3 w-3" />
                {cityFilter}
                <button 
                  onClick={handleClearCityFilter}
                  className="ml-2 hover:text-white/80"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Filter Tabs */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-2 overflow-x-auto py-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeFilter === 'all'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All Results ({results.length})
            </button>
            <button
              onClick={() => setActiveFilter('gyms')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                activeFilter === 'gyms'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <GiWeightLiftingUp className="text-lg" />
              <span>Gyms ({gymCount})</span>
            </button>
            <button
              onClick={() => setActiveFilter('clubs')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                activeFilter === 'clubs'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <GiTennisRacket className="text-lg" />
              <span>Sports Clubs ({clubCount})</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Search Results */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <FiAlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <p className="text-red-600 mt-2">Please try again or use a different search term.</p>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-20">
            <FiSearch className="mx-auto h-12 w-12 text-neutral-300" />
            <h3 className="mt-4 text-xl font-medium text-neutral-900">No results found</h3>
            <p className="mt-2 text-neutral-600">
              {searchQuery || cityFilter
                ? `No results found${searchQuery ? ` for "${searchQuery}"` : ''}${cityFilter ? ` in ${cityFilter}` : ''}. Try different criteria.` 
                : 'Enter a search term or select a city to find gyms and sports clubs.'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-sm text-neutral-500">
              Found {filteredResults.length} results
              {searchQuery ? ` for "${searchQuery}"` : ''}
              {cityFilter ? ` in ${cityFilter}` : ''}
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {filteredResults.map((result) => (
                <SearchResultCard key={`${result.type}-${result.id}`} result={result} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SearchResultCard({ result }: { result: SearchResult }) {
  const isGym = result.type === 'gym';
  const router = useRouter();
  
  // Handle clicking on city badge
  const handleCityClick = (e: React.MouseEvent, city: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Navigate to search with this city filter
    const params = new URLSearchParams();
    params.append('city', city);
    router.push(`/search?${params.toString()}`);
  };
  
  // Different styling based on type
  const typeStyles = isGym 
    ? { 
        badge: 'bg-rose-100 text-rose-700',
        title: 'text-rose-700 hover:text-rose-800',
        button: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500',
        icon: <GiWeightLiftingUp className="mr-2" />
      }
    : {
        badge: 'bg-emerald-100 text-emerald-700',
        title: 'text-emerald-700 hover:text-emerald-800',
        button: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500',
        icon: <GiTennisRacket className="mr-2" />
      };
  
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-neutral-100">
      {/* Image */}
      <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
        <div className="relative w-full h-48 rounded-lg overflow-hidden">
          <Image
            src={result.images && result.images.length > 0 
              ? result.images[0]
              : `https://via.placeholder.com/300x200?text=${encodeURIComponent(result.name)}`}
            alt={result.name}
            fill
            className="object-cover"
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${typeStyles.badge}`}>
                {typeStyles.icon}
                {isGym ? 'Gym' : 'Sports Club'}
              </span>
              
              {/* City Badge - Clickable to filter by this city */}
              <button 
                onClick={(e) => handleCityClick(e, result.city)}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              >
                <FiMapPin className="mr-1 h-3 w-3" />
                {result.city}
              </button>
            </div>
            <h3 className={`text-xl font-semibold ${typeStyles.title}`}>
              <Link href={`/${isGym ? 'gyms' : 'clubs'}/${result.id}`} className="hover:underline">
                {result.name}
              </Link>
            </h3>
          </div>
          <div className="flex items-center">
            <FiStar className="h-4 w-4 text-amber-400 fill-current" />
            <span className="ml-1 font-medium">{typeof result.rating === 'number' ? result.rating.toFixed(1) : '0.0'}</span>
          </div>
        </div>
        
        <div className="flex items-center text-neutral-600 mb-4">
          <FiMapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span>{result.address}</span>
        </div>
        
        <p className="text-neutral-600 line-clamp-2 mb-4 flex-grow">{result.description}</p>
        
        {/* Features based on type */}
        <div className="flex flex-wrap gap-2 mb-4">
          {isGym ? (
            // Gym features with icons
            <>
              {result.facilities && result.facilities.slice(0, 3).map((facility) => (
                <span key={facility} className="px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs flex items-center">
                  <FiActivity className="mr-1" />
                  {facility}
                </span>
              ))}
              <span className="px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs flex items-center">
                <FiUsers className="mr-1" />
                Classes & Training
              </span>
            </>
          ) : (
            // Club features with icons
            <>
              {result.facilities && result.facilities.slice(0, 2).map((facility) => (
                <span key={facility} className="px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs flex items-center">
                  <FiActivity className="mr-1" />
                  {facility}
                </span>
              ))}
              <span className="px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs flex items-center">
                <GiSoccerField className="mr-1" />
                Sports Fields
              </span>
              <span className="px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs flex items-center">
                <FiCalendar className="mr-1" />
                Reservations
              </span>
            </>
          )}
        </div>
        
        <div className="mt-auto">
          <Link
            href={`/${isGym ? 'gyms' : 'clubs'}/${result.id}`}
            className={`inline-block text-white px-5 py-2 rounded-lg font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${typeStyles.button}`}
          >
            {isGym ? 'View Gym Details' : 'View Club & Book'}
          </Link>
        </div>
      </div>
    </div>
  );
} 