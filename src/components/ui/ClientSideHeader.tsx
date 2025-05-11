'use client';

import React, { useState } from 'react';
import CloudinaryImage from '@/components/ui/CloudinaryImage';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import {
  FiUser, FiMenu, FiX,
  FiChevronDown, FiLogOut,
  FiShield, FiSettings, FiGrid, FiPlusCircle
} from 'react-icons/fi';
import { ThemeToggleButton } from './ThemeToggleButton'; // Updated to named import
import NavbarSearchBar from './NavbarSearchBar'; // Import NavbarSearchBar

// Helper function to convert auth role to our app roles
const mapRoleToUserRole = (role: string | undefined): 'user' | 'admin' | 'owner' | null => {
  if (!role) return null;
  const normalizedRole = role.toUpperCase();
  if (normalizedRole === 'ADMIN') return 'admin';
  // Assuming GYM_OWNER and CLUB_OWNER map to 'owner'
  if (normalizedRole === 'GYM_OWNER' || normalizedRole === 'CLUB_OWNER') return 'owner';
  if (normalizedRole === 'USER') return 'user';
  return null;
};

export default function ClientSideHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isLoggedIn = status === 'authenticated';
  const userRole = mapRoleToUserRole(session?.user?.role);
  const isSearchPage = pathname === '/search';
  
  // Get current search parameters for NavbarSearchBar
  const currentSearchQuery = searchParams.get('q') || '';
  const currentSport = searchParams.get('sport') || 'padel';
  const currentDate = searchParams.get('date') || '';
  const currentTime = searchParams.get('time') || '';

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  // --- Updated Nav Link Classes for Dark Mode with Red Accents ---
  const navLinkClasses = (isActive: boolean) =>
    `inline-flex items-center px-1.5 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-yellow-600 dark:text-red-500 border-yellow-500 dark:border-red-500 font-semibold' // Active state with red in dark mode
        : 'text-gray-600 dark:text-neutral-300 border-transparent hover:text-gray-800 dark:hover:text-red-300 hover:opacity-90' // Red hover in dark mode
    }`;

  // --- Updated Dropdown Item Classes for Dark Mode ---
  const dropdownItemClasses = "block w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-red-950/30 hover:text-yellow-600 dark:hover:text-red-400 transition-all duration-200";
  const dropdownDestructiveItemClasses = "block w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200";

  return (
    // More aggressive header with stronger border and shadow in dark mode
    <header data-header="client-side-header" className="bg-white/95 border-b border-gray-200/80 dark:bg-gray-950/95 dark:border-red-900/60 dark:border-b-2 sticky top-0 z-50 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_8px_rgba(200,0,0,0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group mr-4">
              {/* Logo with red glow in dark mode */}
              <CloudinaryImage
                src="fitnass-logo" 
                alt="FitNASS"
                width={120}
                height={40}
                crop={{ type: 'fit' }}
                fallbackSrc="/images/logo.svg"
                className="h-8 w-auto transition-transform duration-300 group-hover:scale-105 dark:drop-shadow-[0_0_8px_rgba(255,0,0,0.6)]"
              />
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-8 md:flex md:space-x-7">
              {/* Nav links use updated classes */}
              <Link href="/" className={navLinkClasses(pathname === '/')}>Home</Link>
              <Link href="/search?type=gym" className={navLinkClasses(pathname === '/search' && searchParams.get('type') === 'gym')}>Gyms</Link>
              <Link href="/search?type=club" className={navLinkClasses(pathname === '/search' && searchParams.get('type') === 'club')}>Clubs</Link>
              <Link href="/pricing" className={navLinkClasses(pathname === '/pricing')}>Pricing</Link>
              {userRole === 'admin' && (
                <Link href="/admin" className={navLinkClasses(pathname.startsWith('/admin'))}>
                  <FiShield className="mr-1.5 h-4 w-4 opacity-80" aria-hidden="true" /> Admin
                </Link>
              )}
              {userRole === 'owner' && (
                <Link href="/dashboard" className={navLinkClasses(pathname.startsWith('/dashboard'))}>
                  <FiGrid className="mr-1.5 h-4 w-4 opacity-80" aria-hidden="true" /> Dashboard
                </Link>
              )}
            </nav>
          </div>

          {/* Right side: Search Bar (on search page), Auth Buttons, User Menu, Theme Toggle */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Add NavbarSearchBar when on search page */}
            {isSearchPage && (
              <NavbarSearchBar
                initialQuery={currentSearchQuery}
                initialSport={currentSport}
                initialDate={currentDate}
                initialTime={currentTime}
              />
            )}
            
            {/* Add Theme Toggle Button before auth buttons/menu */}
            <ThemeToggleButton /> 

            {isLoggedIn ? (
              <div className="relative group">
                {/* More aggressive User Menu Button in dark mode */}
                <button className="inline-flex items-center px-3.5 py-1.5 border border-gray-300/90 dark:border-red-900/80 rounded-md text-sm font-medium text-gray-700 dark:text-neutral-200 bg-white/90 dark:bg-neutral-900/90 hover:bg-gray-50 dark:hover:bg-red-950/30 hover:border-gray-400 dark:hover:border-red-700/90 transition-all duration-200 backdrop-blur-sm">
                  <FiUser className="mr-2 h-4 w-4 text-yellow-600 dark:text-red-500" />
                  {session?.user?.name || 'Account'}
                  <FiChevronDown className="ml-1.5 h-3 w-3 text-gray-500 dark:text-neutral-400 group-hover:text-gray-700 dark:group-hover:text-red-300 transition-colors" />
                </button>
                {/* More aggressive Dropdown Panel in dark mode */}
                <div className="absolute right-0 mt-1 w-56 origin-top-right rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(180,0,0,0.15)] bg-white dark:bg-neutral-900 ring-1 ring-black/5 dark:ring-red-900/30 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out transform group-hover:translate-y-0 translate-y-1 border border-gray-200/80 dark:border-red-950/70 py-1">
                  <Link href="/profile/me" className={dropdownItemClasses}>
                    <FiUser className="inline mr-2.5 h-4 w-4 opacity-80 text-yellow-600 dark:text-red-500" aria-hidden="true"/> Profile
                  </Link>
                  {userRole === 'owner' && (
                    <Link href="/dashboard/add" className={dropdownItemClasses}>
                      <FiPlusCircle className="inline mr-2.5 h-4 w-4 opacity-80 text-yellow-600 dark:text-red-500" aria-hidden="true"/> Add Venue
                    </Link>
                  )}
                  <Link href="/profile/settings" className={dropdownItemClasses}>
                    <FiSettings className="inline mr-2.5 h-4 w-4 opacity-80 text-yellow-600 dark:text-red-500" aria-hidden="true"/> Settings
                  </Link>
                  <div className="border-t border-gray-100 dark:border-neutral-800 my-1"></div> 
                  <button onClick={handleLogout} className={`${dropdownDestructiveItemClasses} flex items-center`}> 
                    <FiLogOut className="inline mr-2.5 h-4 w-4 opacity-80" aria-hidden="true"/> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* More aggressive Sign In Button in dark mode */}
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-4 py-1.5 border border-gray-300/90 dark:border-red-900/70 rounded-md text-sm font-medium text-gray-700 dark:text-neutral-200 bg-white/90 dark:bg-neutral-900/90 hover:bg-gray-50 dark:hover:bg-red-950/30 transition-all duration-200 backdrop-blur-sm"
                >
                  Sign In
                </Link>
                {/* More aggressive Sign Up Button in dark mode */}
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-5 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-400 dark:from-red-600 dark:to-red-500 border border-transparent rounded-md text-sm font-semibold text-black dark:text-white hover:from-yellow-600 hover:to-yellow-500 dark:hover:from-red-700 dark:hover:to-red-600 transition-all duration-200 shadow-sm dark:shadow-red-700/30"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex items-center md:hidden space-x-2">
             <ThemeToggleButton /> 
             <button
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
               className="text-gray-500 dark:text-red-400 hover:text-gray-900 dark:hover:text-red-300 focus:outline-none p-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-red-950/30 transition-all duration-200"
               aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
             >
               {mobileMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
             </button>
           </div>
        </div>
      </div>

      {/* More aggressive Mobile Menu Panel in dark mode */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-neutral-900/98 backdrop-blur-sm border-t border-gray-200/80 dark:border-red-900/30 shadow-[0_8px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_rgba(180,0,0,0.18)] absolute top-full left-0 right-0 z-20">
          {/* Add NavbarSearchBar to mobile menu when on search page */}
          {isSearchPage && (
            <div className="px-4 pt-4 pb-2">
              <NavbarSearchBar
                initialQuery={currentSearchQuery}
                initialSport={currentSport}
                initialDate={currentDate}
                initialTime={currentTime}
                className="flex-wrap"
              />
            </div>
          )}
          
          <div className="px-3 pt-3 pb-4 space-y-1.5 sm:px-4">
            {/* Mobile Nav links with red accents in dark mode */}
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-red-950/30 hover:text-yellow-600 dark:hover:text-red-400 transition-all duration-200">Home</Link>
            <Link href="/search?type=gym" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-red-950/30 hover:text-yellow-600 dark:hover:text-red-400 transition-all duration-200">Gyms</Link>
            <Link href="/search?type=club" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-red-950/30 hover:text-yellow-600 dark:hover:text-red-400 transition-all duration-200">Clubs</Link>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-red-950/30 hover:text-yellow-600 dark:hover:text-red-400 transition-all duration-200">Pricing</Link>

            {isLoggedIn ? (
              <div className="border-t border-gray-200/80 dark:border-red-900/20 pt-4 mt-3">
                 <div className="flex items-center px-3 mb-3.5">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-gray-100 dark:from-neutral-800 to-white dark:to-neutral-700 shadow-inner dark:shadow-red-900/20 flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-yellow-500 dark:text-red-500"/>
                      </div>
                    </div>
                    <div className="ml-3.5">
                      <div className="text-base font-semibold text-gray-900 dark:text-red-100">{session?.user?.name || 'User'}</div>
                      <div className="text-sm font-medium text-gray-500 dark:text-neutral-400">{session?.user?.email}</div>
                    </div>
                  </div>
                <div className="mt-3 space-y-1.5">
                  {/* Mobile Dropdown items with red accents in dark mode */}
                  <Link href="/profile/me" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-red-950/30 hover:text-yellow-600 dark:hover:text-red-400 transition-all duration-200">Profile</Link>
                  {userRole === 'admin' && <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-red-950/30 hover:text-yellow-600 dark:hover:text-red-400 transition-all duration-200">Admin</Link>}
                  {userRole === 'owner' && <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-red-950/30 hover:text-yellow-600 dark:hover:text-red-400 transition-all duration-200">Dashboard</Link>}
                  <Link href="/profile/settings" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-red-950/30 hover:text-yellow-600 dark:hover:text-red-400 transition-all duration-200">Settings</Link>
                  <div className="border-t border-gray-100 dark:border-neutral-800 !my-2.5"></div>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200/80 dark:border-red-900/20 pt-4 mt-3 space-y-2.5">
                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-3 py-2.5 rounded-md text-base font-medium text-gray-700 dark:text-neutral-200 border border-gray-300/90 dark:border-red-900/50 hover:bg-gray-50 dark:hover:bg-red-950/30 transition-all duration-200">Sign In</Link>
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-3 py-2.5 rounded-md text-base font-semibold text-black dark:text-white bg-gradient-to-r from-yellow-500 to-yellow-400 dark:from-red-600 dark:to-red-500 border border-transparent hover:from-yellow-600 hover:to-yellow-500 dark:hover:from-red-700 dark:hover:to-red-600 transition-all duration-200">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
