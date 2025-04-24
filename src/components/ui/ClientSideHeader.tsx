'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import {
  FiUser, FiMenu, FiX,
  FiChevronDown, FiLogOut,
  FiShield, FiSettings, FiGrid, FiPlusCircle
} from 'react-icons/fi';
// Removed unused Bebas_Neue import - using font variables from layout
// import { Bebas_Neue } from 'next/font/google';

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

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  // --- Refined Light Theme Nav Link Classes ---
  const navLinkClasses = (isActive: boolean) =>
    // Premium navigation styling with subtle transitions
    `inline-flex items-center px-1.5 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-yellow-600 border-yellow-500 font-semibold' // Active state
        : 'text-gray-600 border-transparent hover:text-gray-800 hover:opacity-90' // Inactive with subtle hover
    }`;

  // --- Premium Dropdown Item Classes ---
  const dropdownItemClasses = "block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-all duration-200";
  const dropdownDestructiveItemClasses = "block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200";

  return (
    // Premium header with refined shadow
    <header className="bg-white border-b border-gray-200/80 sticky top-0 z-50 backdrop-blur-sm bg-white/95 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group mr-4">
              <Image 
                src="/images/logo.svg" 
                alt="Fitnass Logo" 
                width={34} 
                height={34} 
                className="transition-transform duration-300 group-hover:scale-105" 
              />
              {/* Premium text logo with refined hover */}
              <span className="hidden sm:inline font-bebas text-2xl text-gray-900 uppercase tracking-wider group-hover:text-yellow-600 transition-colors ml-2.5">FITNASS</span>
            </Link>
            {/* Desktop Navigation - Refined spacing */}
            <nav className="hidden md:ml-8 md:flex md:space-x-7">
              <Link href="/" className={navLinkClasses(pathname === '/')}>Home</Link>
              <Link href="/search?type=gym" className={navLinkClasses(pathname === '/search' && searchParams.get('type') === 'gym')}>Gyms</Link>
              <Link href="/search?type=club" className={navLinkClasses(pathname === '/search' && searchParams.get('type') === 'club')}>Clubs</Link>
              <Link href="/pricing" className={navLinkClasses(pathname === '/pricing')}>Pricing</Link>
              {/* Admin/Owner Links - Icons provide visual cue */}
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

          {/* Premium Auth Buttons & User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="relative group">
                <button className="inline-flex items-center px-3.5 py-1.5 border border-gray-300/90 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 bg-white/90 backdrop-blur-sm">
                  <FiUser className="mr-2 h-4 w-4 text-yellow-600" />
                  {session?.user?.name || 'Account'}
                  <FiChevronDown className="ml-1.5 h-3 w-3 text-gray-500 group-hover:text-gray-700 transition-colors" />
                </button>
                <div className="absolute right-0 mt-1 w-56 origin-top-right rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.08)] bg-white ring-1 ring-black/5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out transform group-hover:translate-y-0 translate-y-1 border border-gray-200/80 py-1">
                  {/* Premium dropdown content with refined icons */}
                  <Link href="/profile/me" className={dropdownItemClasses}>
                    <FiUser className="inline mr-2.5 h-4 w-4 opacity-80 text-yellow-600" aria-hidden="true"/> Profile
                  </Link>
                  {userRole === 'owner' && (
                    <Link href="/dashboard/add" className={dropdownItemClasses}>
                      <FiPlusCircle className="inline mr-2.5 h-4 w-4 opacity-80 text-yellow-600" aria-hidden="true"/> Add Venue
                    </Link>
                  )}
                  <Link href="/profile/settings" className={dropdownItemClasses}>
                    <FiSettings className="inline mr-2.5 h-4 w-4 opacity-80 text-yellow-600" aria-hidden="true"/> Settings
                  </Link>
                  {/* Refined divider */}
                  <div className="border-t border-gray-100 my-1"></div> 
                  <button onClick={handleLogout} className={`${dropdownDestructiveItemClasses} flex items-center`}> 
                    <FiLogOut className="inline mr-2.5 h-4 w-4 opacity-80" aria-hidden="true"/> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-4 py-1.5 border border-gray-300/90 rounded-md text-sm font-medium text-gray-700 bg-white/90 hover:bg-gray-50 transition-all duration-200 backdrop-blur-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-5 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-400 border border-transparent rounded-md text-sm font-semibold text-black hover:from-yellow-600 hover:to-yellow-500 transition-all duration-200 shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Premium Mobile Menu Button */} 
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-500 hover:text-gray-900 focus:outline-none p-1.5 rounded-md hover:bg-gray-50 transition-all duration-200"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Premium Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200/80 shadow-[0_8px_16px_rgba(0,0,0,0.08)] absolute top-full left-0 right-0 z-20">
          <div className="px-3 pt-3 pb-4 space-y-1.5 sm:px-4">
            {/* Premium Mobile Nav links */}
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-all duration-200">Home</Link>
            <Link href="/search?type=gym" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-all duration-200">Gyms</Link>
            <Link href="/search?type=club" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-all duration-200">Clubs</Link>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-all duration-200">Pricing</Link>

            {/* Premium User/Auth Section */}
            {isLoggedIn ? (
              <div className="border-t border-gray-200/80 pt-4 mt-3">
                 <div className="flex items-center px-3 mb-3.5">
                    <div className="flex-shrink-0">
                      {/* Enhanced user avatar */}
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-gray-100 to-white shadow-inner flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-yellow-500"/>
                      </div>
                    </div>
                    <div className="ml-3.5">
                      <div className="text-base font-semibold text-gray-900">{session?.user?.name || 'User'}</div>
                      <div className="text-sm font-medium text-gray-500">{session?.user?.email}</div>
                    </div>
                  </div>
                <div className="mt-3 space-y-1.5">
                  {/* Premium Mobile Dropdown items */}
                  <Link href="/profile/me" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-all duration-200">Profile</Link>
                  {userRole === 'admin' && <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-all duration-200">Admin</Link>}
                  {userRole === 'owner' && <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-all duration-200">Dashboard</Link>}
                  <Link href="/profile/settings" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-all duration-200">Settings</Link>
                  {/* Premium divider */}
                  <div className="border-t border-gray-100 !my-2.5"></div>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 rounded-md text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200/80 pt-4 mt-3 space-y-2.5">
                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-3 py-2.5 rounded-md text-base font-medium text-gray-700 border border-gray-300/90 hover:bg-gray-50 transition-all duration-200">Sign In</Link>
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-3 py-2.5 rounded-md text-base font-semibold text-black bg-gradient-to-r from-yellow-500 to-yellow-400 border border-transparent hover:from-yellow-600 hover:to-yellow-500 transition-all duration-200">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 