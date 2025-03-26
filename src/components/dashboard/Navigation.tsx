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
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white transform shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-4 py-5 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <FiBarChart2 className="text-xl text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">FitNASS</h1>
            </div>
            <button 
              className="text-gray-500 hover:text-gray-700 lg:hidden"
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
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
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
          <div className="p-4 border-t border-gray-200">
            <Link 
              href="/"
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
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
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 lg:hidden">
        <button 
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={onMenuClick}
        >
          <FiMenu className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <FiBarChart2 className="text-lg text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">FitNASS</h1>
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