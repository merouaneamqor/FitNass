'use client';

import React from 'react';
import { FiBarChart2, FiUsers, FiDollarSign } from 'react-icons/fi';
import { Card } from '@/components/ui/card';
import { Bar } from 'react-chartjs-2';

export default function AnalyticsPage() {
  const [analyticsData] = React.useState({
    totalMembers: 150,
    activeMembers: 120,
    revenue: 15000,
    membershipStats: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'New Members',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    },
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Membership Growth',
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <h3 className="text-2xl font-bold">{analyticsData.totalMembers}</h3>
            </div>
            <FiUsers className="text-3xl text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Members</p>
              <h3 className="text-2xl font-bold">{analyticsData.activeMembers}</h3>
            </div>
            <FiBarChart2 className="text-3xl text-green-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <h3 className="text-2xl font-bold">${analyticsData.revenue}</h3>
            </div>
            <FiDollarSign className="text-3xl text-yellow-500" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <Bar data={analyticsData.membershipStats} options={options} />
      </Card>
    </div>
  );
} 