import React from 'react';
import { FaHeart } from 'react-icons/fa';

interface FavoriteButtonProps {
  isFavorited: boolean;
  onClick: () => void;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  isFavorited, 
  onClick, 
  className = '' 
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors ${className}`}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <FaHeart 
        className={`text-lg ${isFavorited ? 'text-red-500' : 'text-gray-300'}`} 
      />
    </button>
  );
};

export default FavoriteButton; 