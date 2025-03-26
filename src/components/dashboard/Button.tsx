import React from 'react';
import Link from 'next/link';
import { IconType } from 'react-icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconType;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  isLoading?: boolean;
}

interface LinkButtonProps extends Omit<ButtonProps, 'onClick'> {
  href: string;
}

const variantClasses = {
  primary:
    'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white border-transparent',
  secondary:
    'bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 text-gray-800 border-gray-200',
  danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white border-transparent',
  outline:
    'bg-white hover:bg-gray-50 focus:ring-blue-500 text-blue-600 border-blue-600',
  ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500 text-gray-600 border-transparent',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-md border font-medium
        focus:outline-none focus:ring-2 focus:ring-offset-2
        transition-colors duration-150 ease-in-out
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {Icon && iconPosition === 'left' && !isLoading && <Icon className="mr-2 -ml-1 h-5 w-5" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="ml-2 -mr-1 h-5 w-5" />}
    </button>
  );
}

export function LinkButton({ href, children, ...rest }: LinkButtonProps) {
  return (
    <Link href={href} passHref>
      <Button as="a" {...rest}>
        {children}
      </Button>
    </Link>
  );
}

interface IconButtonProps extends Omit<ButtonProps, 'icon' | 'iconPosition'> {
  icon: IconType;
  label: string;
}

export function IconButton({ icon: Icon, label, ...rest }: IconButtonProps) {
  return (
    <Button {...rest} className={`p-2 ${rest.className || ''}`}>
      <span className="sr-only">{label}</span>
      <Icon className="h-5 w-5" />
    </Button>
  );
} 