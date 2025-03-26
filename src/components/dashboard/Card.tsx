import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ children, title, subtitle, footer, className = '', noPadding = false }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className="border-b border-gray-200 px-6 py-4">
          {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}
      
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
      
      {footer && (
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">{footer}</div>
      )}
    </div>
  );
} 