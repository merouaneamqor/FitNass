'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Use empty string as initial state to avoid hydration mismatch
  const [currentLocale, setCurrentLocale] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  // Initialize locale from cookie on client side only
  useEffect(() => {
    setIsClient(true);
    const savedLocale = Cookies.get('NEXT_LOCALE') || 'en';
    setCurrentLocale(savedLocale);
    
    // Also set document direction based on locale
    if (savedLocale === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.classList.remove('rtl');
    }
  }, []);

  const changeLanguage = (locale: string) => {
    setCurrentLocale(locale);
    
    // Save locale preference in cookie
    Cookies.set('NEXT_LOCALE', locale, { expires: 365 });
    
    // Apply RTL if Arabic is selected
    if (locale === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.classList.remove('rtl');
    }
    
    // Force refresh the page to update all translations
    window.location.reload();
  };

  // Don't render anything during server-side rendering
  // This prevents hydration errors
  if (!isClient) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button 
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 text-sm rounded ${currentLocale === 'en' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button 
        onClick={() => changeLanguage('fr')}
        className={`px-2 py-1 text-sm rounded ${currentLocale === 'fr' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
        aria-label="Switch to French"
      >
        FR
      </button>
      <button 
        onClick={() => changeLanguage('ar')}
        className={`px-2 py-1 text-sm rounded ${currentLocale === 'ar' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
        aria-label="Switch to Arabic"
      >
        عربي
      </button>
    </div>
  );
} 