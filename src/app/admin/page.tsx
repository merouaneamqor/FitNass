'use client';

import { useState, useEffect } from 'react';
import { FiUsers, FiHome, FiStar, FiActivity, FiShield } from 'react-icons/fi';
import { useSession } from 'next-auth/react';

// Mock data for the dashboard
const mockStats = {
  totalUsers: 1254,
  totalGyms: 87,
  pendingApprovals: 12,
  reviewsThisWeek: 156,
  activePromotions: 34,
};

const mockRecentActivity = [
  { id: 1, action: 'New gym registered', time: '2 hours ago', user: 'FitLife Gym' },
  { id: 2, action: 'User reported a review', time: '5 hours ago', user: 'John Smith' },
  { id: 3, action: 'New promotion created', time: '1 day ago', user: 'PowerFit Center' },
  { id: 4, action: 'User account deleted', time: '1 day ago', user: 'Emily Johnson' },
  { id: 5, action: 'Gym information updated', time: '2 days ago', user: 'CoreStrength Studio' },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState(mockStats);
  const [recentActivity, setRecentActivity] = useState(mockRecentActivity);
  
  if (status === 'loading') {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }
  
  if (!session || session.user.role !== 'ADMIN') {
    return <div className="flex justify-center items-center h-full">Access denied. Admin privileges required.</div>;
  }
  
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-fitnass-dark">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {session.user.name}!</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard icon={FiUsers} title="Total Users" value={stats.totalUsers} color="coral" />
        <StatCard icon={FiHome} title="Gym Listings" value={stats.totalGyms} color="pink" />
        <StatCard icon={FiShield} title="Pending Approvals" value={stats.pendingApprovals} color="neon" />
        <StatCard icon={FiStar} title="New Reviews" value={stats.reviewsThisWeek} color="coral" />
        <StatCard icon={FiActivity} title="Active Promotions" value={stats.activePromotions} color="pink" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-fitnass-start to-fitnass-end border-b border-gray-100">
            <h3 className="font-semibold text-lg text-white">Recent Activity</h3>
          </div>
          <div className="p-6">
            <ul className="divide-y divide-gray-100">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="py-3 flex items-start">
                  <div className="bg-fitnass-neon p-2 rounded-lg mr-4">
                    <FiActivity className="text-fitnass-dark" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">
                      <span>{activity.user}</span> • <span>{activity.time}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-fitnass-start to-fitnass-end border-b border-gray-100">
            <h3 className="font-semibold text-lg text-white">System Health</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Server Load</span>
                  <span className="text-sm font-medium text-gray-700">24%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-fitnass-coral h-2.5 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Database</span>
                  <span className="text-sm font-medium text-gray-700">62%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-fitnass-pink h-2.5 rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Storage</span>
                  <span className="text-sm font-medium text-gray-700">38%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-fitnass-neon h-2.5 rounded-full" style={{ width: '38%' }}></div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-fitnass-neon bg-opacity-20 p-4 rounded-lg">
                  <p className="text-sm font-medium text-fitnass-dark">All Systems Operational</p>
                </div>
                <div className="bg-fitnass-coral bg-opacity-20 p-4 rounded-lg">
                  <p className="text-sm font-medium text-fitnass-dark">Last Backup: 2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color }) {
  const colorClasses = {
    coral: 'bg-fitnass-coral text-white',
    pink: 'bg-fitnass-pink text-white',
    neon: 'bg-fitnass-neon text-fitnass-dark',
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
    </div>
  );
} 