'use client';

import { useState } from 'react';
import CloudinaryImage from '@/components/ui/CloudinaryImage';
import { CldImage } from 'next-cloudinary';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  crop?: {
    type: string;
    source?: boolean;
  };
  sizes?: string;
  className?: string;
  fallbackSrc?: string;
}

export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  crop = { type: 'fill' },
  sizes,
  className = '',
  fallbackSrc = '/images/logo.svg',
}: CloudinaryImageProps) {
  const [error, setError] = useState(false);
  
  // Improved Cloudinary image detection
  const isCloudinaryImage = () => {
    // If it's already a Cloudinary URL
    if (src.includes('cloudinary.com') || src.includes('res.cloudinary.com')) {
      return true;
    }
    
    // If it's a public ID (not a URL)
    if (!src.startsWith('http') && !src.startsWith('/')) {
      return true;
    }
    
    return false;
  };

  // Handle default/error cases
  if (error || !src || src === 'N/A' || src === 'fitnass-default') {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  // For Cloudinary images
  if (isCloudinaryImage()) {
    return (
      <CldImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        crop={crop}
        sizes={sizes}
        className={className}
        onError={() => setError(true)}
      />
    );
  }

  // For external images
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
    />
  );
} 