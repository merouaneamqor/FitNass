import React from 'react';
import { IconType } from 'react-icons';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

const colorMap = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  purple: 'bg-purple-100 text-purple-600',
  red: 'bg-red-100 text-red-600',
};

export function StatsCard({ title, value, icon: Icon, color = 'blue', trend, subtitle }: StatsCardProps) {
  const colorClass = colorMap[color];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClass}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          
          {trend && (
            <div className="flex items-center mt-1">
              <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </span>
              <span className="text-gray-500 text-sm ml-1">{subtitle || 'vs. last period'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 