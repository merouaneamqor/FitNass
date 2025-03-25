'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiUsers, FiBarChart2, FiMessageSquare, FiCalendar, FiSettings, FiTag } from 'react-icons/fi';

const DashboardSidebar = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  
  const menuItems = [
    { icon: FiHome, name: 'Overview', path: '/dashboard' },
    { icon: FiUsers, name: 'Members', path: '/dashboard/members' },
    { icon: FiTag, name: 'Promotions', path: '/dashboard/promotions' },
    { icon: FiMessageSquare, name: 'Reviews', path: '/dashboard/reviews' },
    { icon: FiCalendar, name: 'Schedule', path: '/dashboard/schedule' },
    { icon: FiBarChart2, name: 'Analytics', path: '/dashboard/analytics' },
    { icon: FiSettings, name: 'Settings', path: '/dashboard/settings' },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gradient-start via-gradient-middle to-gradient-end text-white w-64 flex flex-col">
      <div className="p-4 flex items-center space-x-2 border-b border-white border-opacity-20">
        <FiBarChart2 className="text-2xl text-fitnass-neon" />
        <h1 className="text-xl font-bold">Gym Dashboard</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                href={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-fitnass-neon text-fitnass-dark font-bold'
                    : 'text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <item.icon className="text-xl" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-white border-opacity-20">
        <Link 
          href="/"
          className="flex items-center space-x-3 p-3 rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-colors"
        >
          <FiHome className="text-xl" />
          <span>Return to Site</span>
        </Link>
      </div>
    </div>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
} 