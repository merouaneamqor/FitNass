'use client';

import React, { useState, useEffect } from 'react';
import { FiUsers, FiHome, FiStar, FiActivity, FiShield, FiAlertTriangle, FiGrid, FiTag, FiSettings } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Define interfaces for the stats and activity data types
interface Stats {
  totalUsers: number;
  totalGyms: number;
  pendingApprovals: number;
  reviewsThisWeek: number;
  activePromotions: number;
}

interface ActivityItem {
  id: string;
  action: string;
  time: string;
  user: string;
}

interface SystemHealth {
  serverLoad: number;
  databaseUsage: number;
  storageUsage: number;
  systemStatus: string;
  lastBackup: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Only fetch data if user is authenticated as admin
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        
        try {
          // Fetch stats and recent activity with timeout to prevent hanging
          const statsPromise = Promise.race([
            fetch('/api/admin/stats', { 
              headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
              }
            }),
            new Promise<Response>((_, reject) => 
              setTimeout(() => reject(new Error('Stats API request timeout')), 10000)
            )
          ]);
          
          const statsResponse = await statsPromise as Response;
          
          if (!statsResponse.ok) {
            console.error(`Stats API error status: ${statsResponse.status}`);
            const errorText = await statsResponse.text();
            console.error(`Stats API error: ${errorText}`);
            throw new Error(`API error: ${statsResponse.status} - ${errorText}`);
          }
          
          // Parse stats data
          let statsData;
          try {
            statsData = await statsResponse.json();
            setStats(statsData.stats);
            setRecentActivity(statsData.recentActivity);
          } catch (parseError) {
            console.error('Error parsing stats data:', parseError);
            throw new Error('Failed to parse API response');
          }
          
          // Fetch system health with same pattern
          const healthPromise = Promise.race([
            fetch('/api/admin/system-health', {
              headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
              }
            }),
            new Promise<Response>((_, reject) => 
              setTimeout(() => reject(new Error('Health API request timeout')), 10000)
            )
          ]);
          
          const healthResponse = await healthPromise as Response;
          
          if (!healthResponse.ok) {
            console.error(`Health API error status: ${healthResponse.status}`);
            const errorText = await healthResponse.text();
            console.error(`Health API error: ${errorText}`);
            throw new Error(`API error: ${healthResponse.status} - ${errorText}`);
          }
          
          // Parse health data
          let healthData;
          try {
            healthData = await healthResponse.json();
            setSystemHealth(healthData);
          } catch (parseError) {
            console.error('Error parsing health data:', parseError);
            throw new Error('Failed to parse API response');
          }
          
        } catch (err) {
          console.error('Error fetching dashboard data:', err);
          setError('Failed to load dashboard data. Please try again or contact support if this persists.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchDashboardData();
    }
  }, [status, session]);
  
  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center h-screen p-6">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-neutral-600">Loading dashboard data...</p>
      </div>
    </div>;
  }
  
  if (status === 'unauthenticated' || (session && session.user.role !== 'ADMIN')) {
    return <div className="flex justify-center items-center h-screen p-6 bg-neutral-50">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        <FiAlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Access Denied</h2>
        <p className="text-neutral-600 mb-6">You don't have permission to access the admin dashboard.</p>
        <a href="/" className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          Return to Homepage
        </a>
      </div>
    </div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-screen p-6 bg-neutral-50">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        <FiAlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Error</h2>
        <p className="text-neutral-600 mb-6">{error}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Retry
          </button>
          <a 
            href="/"
            className="inline-flex items-center justify-center px-5 py-2 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 hover:bg-indigo-50"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>;
  }
  
  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Admin Dashboard</h1>
        <p className="text-neutral-600">Welcome back, {session?.user?.name || 'Admin'}!</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard icon={FiUsers} title="Total Users" value={stats?.totalUsers || 0} color="coral" />
        <StatCard icon={FiHome} title="Gym Listings" value={stats?.totalGyms || 0} color="pink" />
        <StatCard icon={FiShield} title="Pending Approvals" value={stats?.pendingApprovals || 0} color="neon" />
        <StatCard icon={FiStar} title="New Reviews" value={stats?.reviewsThisWeek || 0} color="coral" />
        <StatCard icon={FiActivity} title="Active Promotions" value={stats?.activePromotions || 0} color="pink" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdminNavCard 
          icon={FiUsers} 
          title="User Management" 
          description="Manage users, roles, and permissions"
          href="/admin/users"
          color="coral"
        />
        <AdminNavCard 
          icon={FiHome} 
          title="Gym Management" 
          description="Manage gym listings and verifications"
          href="/admin/gyms"
          color="pink"
        />
        <AdminNavCard 
          icon={FiTag} 
          title="Promotions" 
          description="Manage promotions and special offers"
          href="/admin/promotions"
          color="neon"
        />
        <AdminNavCard 
          icon={FiSettings} 
          title="Settings" 
          description="System configuration and preferences"
          href="/admin/settings"
          color="coral"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 border-b border-neutral-100">
            <h3 className="font-semibold text-lg text-white">Recent Activity</h3>
          </div>
          <div className="p-6">
            {recentActivity.length > 0 ? (
              <ul className="divide-y divide-neutral-100">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="py-3 flex items-start">
                    <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                      <FiActivity className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{activity.action}</p>
                      <p className="text-sm text-neutral-500">
                        <span>{activity.user}</span> • <span>{activity.time}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6 text-neutral-500">
                No recent activity found.
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 border-b border-neutral-100">
            <h3 className="font-semibold text-lg text-white">System Health</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-neutral-700">Server Load</span>
                  <span className="text-sm font-medium text-neutral-700">{systemHealth?.serverLoad || 0}%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${systemHealth?.serverLoad || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-neutral-700">Database</span>
                  <span className="text-sm font-medium text-neutral-700">{systemHealth?.databaseUsage || 0}%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-500 h-2.5 rounded-full" 
                    style={{ width: `${systemHealth?.databaseUsage || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-neutral-700">Storage</span>
                  <span className="text-sm font-medium text-neutral-700">{systemHealth?.storageUsage || 0}%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-400 h-2.5 rounded-full" 
                    style={{ width: `${systemHealth?.storageUsage || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${
                  systemHealth?.systemStatus === 'operational' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  <p className="text-sm font-medium">
                    {systemHealth?.systemStatus === 'operational' 
                      ? 'All Systems Operational' 
                      : 'System Issues Detected'}
                  </p>
                </div>
                <div className="bg-indigo-100 p-4 rounded-lg">
                  <p className="text-sm font-medium text-indigo-800">
                    Last Backup: {systemHealth?.lastBackup || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color }: { 
  icon: React.ElementType;
  title: string;
  value: string | number;
  color: 'coral' | 'pink' | 'neon'; 
}) {
  const colorClasses = {
    coral: 'bg-fitnass-coral text-white',
    pink: 'bg-fitnass-pink text-white',
    neon: 'bg-fitnass-blue text-white',
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-neutral-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-neutral-900">{value.toLocaleString()}</p>
    </div>
  );
}

function AdminNavCard({ 
  icon: Icon, 
  title, 
  description,
  href,
  color 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  href: string;
  color: 'coral' | 'pink' | 'neon'; 
}) {
  const colorClasses = {
    coral: 'bg-indigo-600 text-white hover:bg-indigo-700',
    pink: 'bg-indigo-500 text-white hover:bg-indigo-600',
    neon: 'bg-indigo-400 text-indigo-900 hover:bg-indigo-500 hover:text-white',
  };
  
  return (
    <Link href={href} className={`rounded-xl shadow-md overflow-hidden ${colorClasses[color]} transition-colors`}>
      <div className="p-6">
        <div className="flex items-center mb-3">
          <Icon className="h-6 w-6 mr-3" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="opacity-90">{description}</p>
      </div>
    </Link>
  );
} 