import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Place } from '@/types/place';
import { FaStar, FaHeart } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import FavoriteButton from '@/components/ui/FavoriteButton';

interface PlaceCardProps {
  place: Place;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
  showFavoriteButton?: boolean;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ 
  place, 
  isFavorited = false, 
  onToggleFavorite,
  showFavoriteButton = true
}) => {
  const { 
    id, 
    name, 
    type,
    city, 
    address, 
    images, 
    rating, 
    facilities,
    slug,
    citySlug,
    _count 
  } = place;

  // Placeholder image if no images are available
  const imageUrl = images && images.length > 0 
    ? images[0] 
    : '/images/placeholder-gym.jpg';

  // Create URL based on place type
  const getPlaceUrl = () => {
    if (!citySlug || !slug) return '#';

    switch (type) {
      case 'GYM':
        return `/gyms/${citySlug}/${slug}`;
      case 'CLUB':
        return `/clubs/${citySlug}/${slug}`;
      default:
        return `/places/${citySlug}/${slug}`;
    }
  };

  // Get type-specific icon or badge
  const getTypeIcon = () => {
    switch (type) {
      case 'GYM':
        return '💪';
      case 'CLUB':
        return '🏆';
      case 'STUDIO':
        return '🧘';
      case 'CENTER':
        return '🏋️';
      default:
        return '🏢';
    }
  };

  // Get type-specific color
  const getTypeColor = () => {
    switch (type) {
      case 'GYM':
        return 'bg-red-600';
      case 'CLUB':
        return 'bg-blue-600';
      case 'STUDIO':
        return 'bg-purple-600';
      case 'CENTER':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="relative">
        {/* Type Badge */}
        <div className={`absolute top-2 left-2 ${getTypeColor()} text-white text-xs px-2 py-1 rounded-md z-10 flex items-center`}>
          <span className="mr-1">{getTypeIcon()}</span>
          <span>{type}</span>
        </div>
        
        <Link href={getPlaceUrl()}>
          <div className="h-48 w-full relative">
            <Image 
              src={imageUrl} 
              alt={name} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>
        
        {showFavoriteButton && onToggleFavorite && (
          <FavoriteButton 
            isFavorited={isFavorited} 
            onClick={() => onToggleFavorite(id)} 
            className="absolute top-2 right-2"
          />
        )}
      </div>
      
      <div className="p-4">
        <Link href={getPlaceUrl()}>
          <h3 className="text-xl font-semibold text-gray-800 hover:text-neon-yellow transition-colors mb-2">{name}</h3>
        </Link>
        
        <div className="flex items-center text-gray-500 mb-2">
          <MdLocationOn className="mr-1" />
          <span>{address || city}</span>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
            <FaStar className="text-yellow-500 mr-1" />
            <span className="font-medium">{rating.toFixed(1)}</span>
            {_count?.reviews && (
              <span className="text-gray-500 text-sm ml-1">({_count.reviews})</span>
            )}
          </div>
        </div>
        
        {facilities && facilities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {facilities.slice(0, 3).map((facility, index) => (
              <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                {facility}
              </span>
            ))}
            {facilities.length > 3 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                +{facilities.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceCard; 