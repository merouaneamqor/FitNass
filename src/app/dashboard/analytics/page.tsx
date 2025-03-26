'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiUsers, FiTrendingUp, FiBarChart2, FiPieChart, FiCalendar, FiEye } from 'react-icons/fi';

// Mock data for demonstration
const mockAnalyticsData = {
  visitorStats: {
    total: 2548,
    growth: 18.2,
    timeRange: 'last 30 days',
    dailyData: [150, 120, 160, 180, 130, 110, 140, 160, 170, 180, 190, 195, 185, 170, 160, 150, 170, 180, 190, 200, 210, 220, 230, 220, 210, 200, 190, 180, 170, 165]
  },
  memberStats: {
    total: 428,
    growth: 5.6,
    newMembers: 38,
    timeRange: 'last 30 days',
    conversionRate: 8.9
  },
  engagementStats: {
    averageVisitsPerWeek: 2.7,
    mostPopularDay: 'Monday',
    mostPopularTime: '18:00 - 20:00',
    timeRange: 'last 30 days'
  },
  revenueStats: {
    totalRevenue: 185420,
    growth: 12.4,
    timeRange: 'last 30 days',
    averageRevenuePerMember: 433
  },
  popularServices: [
    { name: 'Fitness Classes', usage: 42 },
    { name: 'Personal Training', usage: 28 },
    { name: 'Open Gym', usage: 18 },
    { name: 'Swimming Pool', usage: 12 }
  ],
  membershipBreakdown: [
    { type: 'Premium', count: 128, percentage: 30 },
    { type: 'Standard', count: 215, percentage: 50 },
    { type: 'Basic', count: 85, percentage: 20 }
  ]
};

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [timeRange, setTimeRange] = useState('30days');
  const [analyticsData, setAnalyticsData] = useState(mockAnalyticsData);

  if (!session || session.user.role !== 'GYM_OWNER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need to be a gym owner to access this page.</p>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-MA').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(num);
  };

  // Simplified chart component
  const SimpleBarChart = ({ data, height = 100, barColor = '#3B82F6' }: { 
    data: number[];
    height?: number;
    barColor?: string;
  }) => {
    const max = Math.max(...data);
    
    return (
      <div className="flex items-end h-[100px] w-full gap-1">
        {data.map((value, index) => (
          <div 
            key={index} 
            className="flex-1 rounded-t bg-opacity-80 transition-all hover:bg-opacity-100"
            style={{ 
              height: `${(value / max) * 100}%`,
              backgroundColor: barColor
            }}
            title={`Day ${index + 1}: ${value} visitors`}
          ></div>
        ))}
      </div>
    );
  };

  // Simplified pie chart component
  const SimplePieChart = ({ data }: { 
    data: Array<{ percentage: number }> 
  }) => {
    let cumulativePercentage = 0;
    
    return (
      <div className="relative h-[200px] w-[200px] mx-auto">
        <div className="h-full w-full rounded-full overflow-hidden">
          {data.map((segment, index) => {
            const startPercentage = cumulativePercentage;
            cumulativePercentage += segment.percentage;
            
            const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
            
            return (
              <div 
                key={index}
                className="absolute inset-0"
                style={{
                  background: `conic-gradient(transparent ${startPercentage}%, ${colors[index % colors.length]} ${startPercentage}%, ${colors[index % colors.length]} ${cumulativePercentage}%, transparent ${cumulativePercentage}%)`
                }}
              ></div>
            );
          })}
        </div>
        <div className="absolute inset-[15%] rounded-full bg-white flex items-center justify-center">
          <span className="text-xl font-semibold">{data.length} types</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Track your gym's performance and member activity.</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="12months">Last 12 months</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Visitors</p>
              <p className="text-2xl font-bold mt-1">{formatNumber(analyticsData.visitorStats.total)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <FiEye className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <FiTrendingUp className={`mr-1 ${analyticsData.visitorStats.growth > 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-sm font-medium ${analyticsData.visitorStats.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {analyticsData.visitorStats.growth > 0 ? '+' : ''}{analyticsData.visitorStats.growth}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs previous {analyticsData.visitorStats.timeRange}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Members</p>
              <p className="text-2xl font-bold mt-1">{formatNumber(analyticsData.memberStats.total)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <FiUsers className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <FiTrendingUp className={`mr-1 ${analyticsData.memberStats.growth > 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-sm font-medium ${analyticsData.memberStats.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {analyticsData.memberStats.growth > 0 ? '+' : ''}{analyticsData.memberStats.growth}%
            </span>
            <span className="text-sm text-gray-500 ml-1">+{analyticsData.memberStats.newMembers} new</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Weekly Visits</p>
              <p className="text-2xl font-bold mt-1">{analyticsData.engagementStats.averageVisitsPerWeek}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <FiCalendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-sm text-gray-500">Most popular: {analyticsData.engagementStats.mostPopularDay}</span>
            <span className="text-sm text-gray-500 mx-1">·</span>
            <span className="text-sm text-gray-500">{analyticsData.engagementStats.mostPopularTime}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(analyticsData.revenueStats.totalRevenue)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <FiBarChart2 className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <FiTrendingUp className={`mr-1 ${analyticsData.revenueStats.growth > 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-sm font-medium ${analyticsData.revenueStats.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {analyticsData.revenueStats.growth > 0 ? '+' : ''}{analyticsData.revenueStats.growth}%
            </span>
            <span className="text-sm text-gray-500 ml-1">avg {formatCurrency(analyticsData.revenueStats.averageRevenuePerMember)}/member</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Visitor Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Visitor Trend</h2>
          <div className="h-60">
            <div className="mb-4">
              <SimpleBarChart data={analyticsData.visitorStats.dailyData} barColor="#3B82F6" />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1 {timeRange === '30days' ? 'Mar' : 'Day'}</span>
              <span>15 {timeRange === '30days' ? 'Mar' : 'Day'}</span>
              <span>30 {timeRange === '30days' ? 'Mar' : 'Day'}</span>
            </div>
          </div>
        </div>

        {/* Membership Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Membership Distribution</h2>
          <div className="flex items-center">
            <div className="w-1/2">
              <SimplePieChart data={analyticsData.membershipBreakdown} />
            </div>
            <div className="w-1/2 space-y-4">
              {analyticsData.membershipBreakdown.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className={`h-4 w-4 rounded-full mr-3 ${
                    index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium">{item.type}</p>
                    <p className="text-xs text-gray-500">{item.count} members ({item.percentage}%)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Services */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Popular Services</h2>
          <div className="space-y-4">
            {analyticsData.popularServices.map((service, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-grow">
                  <p className="text-sm font-medium">{service.name}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(service.usage / analyticsData.popularServices.reduce((acc, curr) => acc + curr.usage, 0)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <p className="ml-4 text-sm font-medium">{service.usage}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Key Metrics</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Conversion Rate (Visitors to Members)</p>
                <p className="text-sm font-bold">{analyticsData.memberStats.conversionRate}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-500 h-2.5 rounded-full" 
                  style={{ width: `${analyticsData.memberStats.conversionRate}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Member Retention Rate</p>
                <p className="text-sm font-bold">87.5%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full" 
                  style={{ width: '87.5%' }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Member Satisfaction Rate</p>
                <p className="text-sm font-bold">92%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-500 h-2.5 rounded-full" 
                  style={{ width: '92%' }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Class Attendance Rate</p>
                <p className="text-sm font-bold">78.3%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-yellow-500 h-2.5 rounded-full" 
                  style={{ width: '78.3%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 