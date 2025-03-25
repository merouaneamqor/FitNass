import React from 'react';
import { FiList, FiMap } from 'react-icons/fi';

interface ViewToggleProps {
  viewMode: 'list' | 'map';
  setViewMode: (mode: 'list' | 'map') => void;
  className?: string;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  setViewMode,
  className = ""
}) => {
  return (
    <div className={`flex items-center space-x-2 bg-neutral-100 rounded-full p-1 ${className}`}>
      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
        aria-label="List View"
      >
        <FiList className="h-5 w-5" />
      </button>
      <button
        onClick={() => setViewMode('map')}
        className={`p-2 rounded-full transition-all ${viewMode === 'map' ? 'bg-white text-indigo-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
        aria-label="Map View"
      >
        <FiMap className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ViewToggle; 