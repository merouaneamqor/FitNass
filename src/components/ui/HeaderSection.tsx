import React, { ReactNode } from 'react';
import { FiActivity } from 'react-icons/fi';
import ViewToggle from './ViewToggle';

interface HeaderSectionProps {
  title: string;
  viewMode?: 'list' | 'map';
  setViewMode?: (mode: 'list' | 'map') => void;
  showViewToggle?: boolean;
  icon?: ReactNode;
  className?: string;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  title,
  viewMode,
  setViewMode,
  showViewToggle = false,
  icon = <FiActivity className="h-6 w-6 mr-3 text-indigo-600" />,
  className = "",
}) => {
  return (
    <div className={`sticky top-0 z-10 bg-white backdrop-blur-lg bg-opacity-80 border-b border-neutral-200 text-neutral-900 shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {icon}
            <h1 className="text-2xl font-medium text-neutral-900">{title}</h1>
          </div>
          
          {showViewToggle && viewMode && setViewMode && (
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderSection; 