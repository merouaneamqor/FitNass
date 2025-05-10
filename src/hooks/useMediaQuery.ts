'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to check if the current viewport matches a media query
 * @param query The media query to check (e.g., '(max-width: 768px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Default to true for desktop to avoid layout shifts
  const [matches, setMatches] = useState(false);
  // Track if component is mounted to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Set initial value based on window
    if (typeof window !== 'undefined') {
      setMatches(window.matchMedia(query).matches);
    }
    
    // Only run on client
    if (typeof window === 'undefined') return undefined;
    
    // Create a media query list
    const media = window.matchMedia(query);
    
    // Update matches state when query changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add the listener
    media.addEventListener('change', listener);
    
    // Clean up
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);
  
  // Return false during SSR, actual value after mounting
  return mounted ? matches : false;
} 