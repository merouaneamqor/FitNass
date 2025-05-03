'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';
import { FiHome, FiUsers, FiBarChart2, FiMessageSquare, FiCalendar, FiSettings, FiTag, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

interface MenuItem {
  icon: IconType;
  name: string;
  path: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems: MenuItem[] = [
  { icon: FiHome, name: 'Overview', path: '/dashboard' },
  { icon: FiUsers, name: 'Members', path: '/dashboard/members' },
  { icon: FiUsers, name: 'Clients', path: '/dashboard/clients' },
  { icon: FiTag, name: 'Promotions', path: '/dashboard/promotions' },
  { icon: FiMessageSquare, name: 'Reviews', path: '/dashboard/reviews' },
  { icon: FiCalendar, name: 'Schedule', path: '/dashboard/schedule' },
  { icon: FiBarChart2, name: 'Analytics', path: '/dashboard/analytics' },
  { icon: FiSettings, name: 'Settings', path: '/dashboard/settings' },
];

export const DashboardSidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-red-900/30 transform shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-4 py-5 flex items-center justify-between border-b border-gray-200 dark:border-neutral-800/80">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 dark:from-red-600 dark:to-red-500 flex items-center justify-center">
                <FiBarChart2 className="text-xl text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-red-50">FitNASS</h1>
            </div>
            <button 
              className="text-gray-500 dark:text-red-400 hover:text-gray-700 dark:hover:text-red-300 lg:hidden"
              onClick={onClose}
            >
              <FiX />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    href={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                      isActive(item.path)
                        ? 'bg-yellow-50 dark:bg-red-950/30 text-yellow-600 dark:text-red-500 font-medium'
                        : 'text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-red-950/20 hover:text-yellow-600 dark:hover:text-red-400'
                    }`}
                    onClick={onClose}
                  >
                    <item.icon className="text-lg" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-neutral-800/80">
            <Link 
              href="/"
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <FiLogOut className="text-lg" />
              <span>Log Out</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export const TopBar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-950/95 border-b border-gray-200/80 dark:border-red-900/60 shadow-sm dark:shadow-[0_2px_8px_rgba(200,0,0,0.15)]">
      <div className="flex items-center justify-between px-4 py-3 lg:hidden">
        <button 
          className="text-gray-500 dark:text-red-400 hover:text-gray-700 dark:hover:text-red-300 focus:outline-none"
          onClick={onMenuClick}
        >
          <FiMenu className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 dark:from-red-600 dark:to-red-500 flex items-center justify-center">
            <FiBarChart2 className="text-lg text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-red-50">FitNASS</h1>
        </div>
        <div className="w-6"></div> {/* For balance */}
      </div>
    </header>
  );
};

export const DashboardNavigation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  
  return (
    <>
      <TopBar onMenuClick={toggleSidebar} />
      <DashboardSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
    </>
  );
}; 