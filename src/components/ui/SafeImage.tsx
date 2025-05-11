'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

// Map of default fallback images by type
const defaultImages = {
  fitnass: '/images/logo.svg', // Use logo as default fallback
  place: '/images/logo.svg',
  gym: '/images/logo.svg',
  club: '/images/logo.svg',
  trainer: '/images/logo.svg',
  class: '/images/logo.svg',
};

type SafeImageProps = Omit<ImageProps, 'onError'> & {
  fallbackType?: keyof typeof defaultImages;
};

export default function SafeImage({
  src,
  alt,
  fallbackType = 'fitnass',
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);

  // If there's an error, use the fallback image
  const imageSrc = error ? defaultImages[fallbackType] : src;

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt}
      onError={() => setError(true)}
    />
  );
} 