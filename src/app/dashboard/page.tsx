'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiUsers, FiTag, FiStar, FiBarChart2, FiHome, FiSettings, FiPlus } from 'react-icons/fi';
import { PageHeader, Card, StatsCard, Button } from '@/components/dashboard';

// Mock data for demonstration
const mockDashboardData = {
  totalMembers: 250,
  activePromotions: 3,
  averageRating: 4.8,
  totalReviews: 120,
  recentReviews: [
    {
      id: 1,
      user: 'John Doe',
      rating: 5,
      comment: 'Great gym with excellent equipment!',
      date: '2024-03-15',
    },
    {
      id: 2,
      user: 'Jane Smith',
      rating: 4,
      comment: 'Good facilities but can get crowded.',
      date: '2024-03-14',
    },
  ],
  promotions: [
    {
      id: 1,
      title: 'New Year Special',
      status: 'active',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      discount: '33% OFF',
    },
    {
      id: 2,
      title: 'Student Discount',
      status: 'active',
      startDate: '2024-03-15',
      endDate: '2024-12-31',
      discount: '25% OFF',
    },
  ],
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${session.user.name}`}
        icon={FiHome}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Members"
          value={mockDashboardData.totalMembers.toString()}
          icon={FiUsers}
          color="blue"
          trend={+5}
          subtitle="Since last month"
        />

        <StatsCard
          title="Active Promotions"
          value={mockDashboardData.activePromotions.toString()}
          icon={FiTag}
          color="green"
        />

        <StatsCard
          title="Average Rating"
          value={mockDashboardData.averageRating.toString()}
          icon={FiStar}
          color="yellow"
          trend={+0.2}
          subtitle="Since last month"
        />

        <StatsCard
          title="Total Reviews"
          value={mockDashboardData.totalReviews.toString()}
          icon={FiBarChart2}
          color="purple"
          trend={+12}
          subtitle="Since last month"
        />
      </div>

      {/* Tabs */}
      <Card noPadding>
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['overview', 'promotions', 'reviews', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm capitalize`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
              <div className="space-y-4">
                {mockDashboardData.recentReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`h-5 w-5 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-gray-600">{review.user}</span>
                      </div>
                      <span className="text-gray-500">{review.date}</span>
                    </div>
                    <p className="mt-2 text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'promotions' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Active Promotions</h2>
                <Button icon={FiPlus}>Create Promotion</Button>
              </div>
              <div className="space-y-4">
                {mockDashboardData.promotions.map((promotion) => (
                  <div key={promotion.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{promotion.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(promotion.startDate).toLocaleDateString()} -{' '}
                          {new Date(promotion.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                        {promotion.status}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-blue-600 font-medium">{promotion.discount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">All Reviews</h2>
              <div className="space-y-4">
                {mockDashboardData.recentReviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`h-5 w-5 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-gray-600">{review.user}</span>
                      </div>
                      <span className="text-gray-500">{review.date}</span>
                    </div>
                    <p className="mt-2 text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Gym Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gym Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    defaultValue="FitLife Gym"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={4}
                    defaultValue="State-of-the-art equipment and personal trainers"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    defaultValue="info@fitlifegym.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    defaultValue="(555) 123-4567"
                  />
                </div>
                <Button icon={FiSettings}>Save Changes</Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 