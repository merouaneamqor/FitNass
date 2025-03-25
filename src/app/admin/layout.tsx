'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiUsers, FiDatabase, FiSettings, FiHome, FiActivity, FiShield } from 'react-icons/fi';

const AdminSidebar = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  
  const menuItems = [
    { icon: FiHome, name: 'Dashboard', path: '/admin' },
    { icon: FiUsers, name: 'Users', path: '/admin/users' },
    { icon: FiDatabase, name: 'Gyms', path: '/admin/gyms' },
    { icon: FiActivity, name: 'Activity Logs', path: '/admin/logs' },
    { icon: FiSettings, name: 'Settings', path: '/admin/settings' },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-fitnass-coral to-fitnass-pink text-white w-64 flex flex-col">
      <div className="p-4 flex items-center space-x-2 border-b border-white border-opacity-20">
        <FiShield className="text-2xl text-fitnass-neon" />
        <h1 className="text-xl font-bold">Admin Portal</h1>
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
} 