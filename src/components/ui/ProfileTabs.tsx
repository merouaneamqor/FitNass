import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { FiHeart, FiClock, FiStar, FiCalendar, FiSettings } from 'react-icons/fi';

interface Tab {
  name: string;
  key: string;
  icon: React.ReactNode;
  count?: number;
}

interface ProfileTabsProps {
  // userId: string;
  isOwnProfile: boolean;
  className?: string;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  // userId,
  isOwnProfile,
  className = "",
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'favorites';
  
  const tabs: Tab[] = [
    {
      name: 'Favorites',
      key: 'favorites',
      icon: <FiHeart className="h-5 w-5" />,
    },
    {
      name: 'Reviews',
      key: 'reviews',
      icon: <FiStar className="h-5 w-5" />,
    },
  ];
  
  // Only add these tabs for the user's own profile
  if (isOwnProfile) {
    tabs.push(
      {
        name: 'Bookings',
        key: 'bookings',
        icon: <FiCalendar className="h-5 w-5" />,
      },
      {
        name: 'Subscriptions',
        key: 'subscriptions',
        icon: <FiClock className="h-5 w-5" />,
      },
      {
        name: 'Settings',
        key: 'settings',
        icon: <FiSettings className="h-5 w-5" />,
      }
    );
  }

  return (
    <div className={`bg-white border-b border-neutral-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex overflow-x-auto py-2 custom-scrollbar">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.key;
            
            // Construct the URL with the tab parameter
            const params = new URLSearchParams();
            // Copy all existing parameters
            searchParams.forEach((value, key) => {
              params.set(key, value);
            });
            // Set the tab parameter
            params.set('tab', tab.key);
            
            return (
              <Link
                key={tab.name}
                href={`${pathname}?${params.toString()}`}
                className={`px-4 py-3 flex items-center rounded-lg whitespace-nowrap mr-4 transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <span className={`mr-2 ${isActive ? 'text-indigo-600' : ''}`}>
                  {tab.icon}
                </span>
                {tab.name}
                {tab.count !== undefined && (
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                    isActive
                      ? 'bg-indigo-200 text-indigo-800'
                      : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default ProfileTabs; 