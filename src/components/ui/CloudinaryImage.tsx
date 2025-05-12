'use client';

import { useState } from 'react';
import { CldImage } from 'next-cloudinary';

// Define the valid crop types that next-cloudinary accepts
type CropMode = 'auto' | 'fill' | 'limit' | 'crop' | 'fill_pad' | 'fit' | 'imagga_crop' | 
                'imagga_scale' | 'lfill' | 'lpad' | 'mfit' | 'mpad' | 'pad' | 'scale' | 'thumb';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  crop?: {
    type: CropMode;
    source?: boolean;
  };
  sizes?: string;
  className?: string;
  fallbackSrc?: string;
}

export default function ImageWithCloudinarySupport({
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