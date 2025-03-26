import React from 'react';
import { IconType } from 'react-icons';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: IconType;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, icon: Icon, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex items-start">
        {Icon && (
          <div className="mr-3 p-2 bg-blue-100 rounded-lg">
            <Icon className="text-blue-600 text-xl" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-gray-600 mt-2">{description}</p>}
        </div>
      </div>
      {actions && <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
} 