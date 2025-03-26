import React from 'react';
import Link from 'next/link';
import { FiMapPin, FiStar, FiActivity } from 'react-icons/fi';
import { Gym } from '@/types/gym';
import Image from 'next/image';

interface GymCardProps {
  gym: Gym;
  onCardClick?: (gym: Gym) => void;
  featured?: boolean;
}

// Get price range color
const getPriceRangeColor = (range: string) => {
  switch(range) {
    case '€': return 'bg-emerald-500';
    case '€€': return 'bg-amber-500';
    case '€€€': return 'bg-rose-500';
    default: return 'bg-emerald-500';
  }
};

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

export const GymCard: React.FC<GymCardProps> = ({ gym, onCardClick, featured = false }) => {
  const handleClick = () => {
    if (onCardClick) {
      onCardClick(gym);
    }
  };

  return (
    <div 
      key={gym.id} 
      className="bg-white rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 cursor-pointer hover:shadow-xl border border-neutral-100"
      onClick={handleClick}
    >
      <div className="relative h-60">
        <Image
          src={gym.images?.[0] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48'}
          alt={gym.name}
          width={400}
          height={300}
          className="h-48 w-full object-cover rounded-t-xl"
        />
        <div className={`absolute top-4 right-4 ${featured ? 'bg-indigo-600' : getPriceRangeColor(gym.priceRange)} text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm backdrop-blur-sm bg-opacity-90`}>
          {featured ? 'Featured' : gym.priceRange}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
          <h3 className="text-2xl font-semibold text-white">{gym.name}</h3>
          <div className="flex items-center text-white/90 mt-2">
            <FiMapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">{gym.address}, {gym.city}</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-neutral-900 truncate">{gym.name}</h3>
        <div className="mt-2 flex items-center text-neutral-600">
          <FiMapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
          <span className="truncate">{gym.address}, {gym.city}</span>
        </div>
        <div className="mt-3 flex items-center">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(gym.rating) 
                    ? 'text-amber-400 fill-current' 
                    : i < gym.rating 
                      ? 'text-amber-400 fill-current' 
                      : 'text-neutral-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-neutral-700 font-medium">{gym.rating.toFixed(1)}</span>
          <span className="ml-2 text-neutral-500 text-sm">({gym._count?.reviews || 0} reviews)</span>
        </div>
        <p className="mt-3 text-neutral-600 line-clamp-2 text-sm">{gym.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {gym.facilities.slice(0, 4).map((facility) => (
            <span
              key={facility}
              className="px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs flex items-center"
            >
              {getFacilityIcon(facility)}
              {facility}
            </span>
          ))}
          {gym.facilities.length > 4 && (
            <span className="px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs">
              +{gym.facilities.length - 4} more
            </span>
          )}
        </div>
        <div className="mt-5">
          <Link
            href={`/gyms/${gym.id}`}
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GymCard; 