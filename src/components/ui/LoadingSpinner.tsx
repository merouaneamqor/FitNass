import React from 'react';
import { FiActivity } from 'react-icons/fi';

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = "" }) => {
  return (
    <div className={`flex-grow flex justify-center items-center py-28 ${className}`}>
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-3 border-b-3 border-indigo-600 animate-spin"></div>
        <FiActivity className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600" />
      </div>
    </div>
  );
};

export default LoadingSpinner; 