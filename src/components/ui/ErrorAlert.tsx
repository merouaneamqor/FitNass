import React from 'react';

interface ErrorAlertProps {
  message: string;
  className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  className = "",
}) => {
  return (
    <div className={`max-w-7xl mx-auto px-6 py-12 ${className}`}>
      <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-xl" role="alert">
        <span className="block sm:inline">{message}</span>
      </div>
    </div>
  );
};

export default ErrorAlert; 