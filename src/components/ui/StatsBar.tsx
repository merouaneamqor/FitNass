import React from 'react';
import { FiMapPin, FiAward } from 'react-icons/fi';

interface StatsBarProps {
  filteredCount: number;
  countLabel?: string;
  citiesCount: number;
  reviewsCount: number;
  className?: string;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  filteredCount,
  countLabel = 'gyms',
  citiesCount,
  reviewsCount,
  className = "",
}) => {
  return (
    <div className={`bg-neutral-900 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex justify-between items-center flex-wrap gap-2 text-sm">
          <div>
            <span className="font-semibold">{filteredCount}</span> {countLabel} found
          </div>
          <div className="flex items-center space-x-6">
            <div>
              <FiMapPin className="inline-block mr-1.5" /> 
              <span className="font-semibold">{citiesCount}</span> cities
            </div>
            <div>
              <FiAward className="inline-block mr-1.5" /> 
              <span className="font-semibold">{reviewsCount}</span> reviews
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar; 