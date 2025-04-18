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

  // --- Updated Nav Link Classes ---
  const navLinkClasses = (isActive: boolean) =>
    `inline-flex items-center px-1 pt-1 border-b-2 text-sm uppercase font-bebas tracking-wider transition-colors duration-150 ${
      isActive
        ? 'text-neon-yellow border-neon-yellow' // Active state: Neon Yellow text and border
        : 'text-neutral-300 border-transparent hover:text-white hover:border-neutral-500' // Inactive state
    }`;

  // --- Updated Dropdown Item Classes ---
  const dropdownItemClasses = "block px-4 py-2 text-sm text-neutral-200 font-poppins hover:bg-neutral-700 hover:text-neon-yellow transition-colors duration-150";
  const dropdownDestructiveItemClasses = "block w-full text-left px-4 py-2 text-sm text-blood-red font-poppins hover:bg-neutral-700 hover:text-red-400 transition-colors duration-150";

  return (
    // Main header styling
    <header className="bg-jet-black border-b border-neutral-800/60 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo - Using SVG */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <Image src="/images/logo.svg" alt="Fitnass Logo" width={32} height={32} className="mr-2" />
            </Link>
            {/* Desktop Navigation - Using Bebas Neue via font variable */}
            <nav className="hidden md:ml-10 md:flex md:space-x-8"> {/* Increased spacing */}
              <Link href="/" className={navLinkClasses(pathname === '/')}>Home</Link>
              <Link href="/search?type=gym" className={navLinkClasses(pathname === '/search' && searchParams.get('type') === 'gym')}>Gyms</Link>
              <Link href="/search?type=club" className={navLinkClasses(pathname === '/search' && searchParams.get('type') === 'club')}>Clubs</Link>
              {/* Add Coaches link if route exists */}
              {/* <Link href="/coaches" className={navLinkClasses(pathname.startsWith('/coaches'))}>Coaches</Link> */}

              {/* Admin/Owner Links - Adjusted styling */}
              {userRole === 'admin' && (
                <Link href="/admin" className={navLinkClasses(pathname.startsWith('/admin'))}>
                  <FiShield className="mr-1.5 h-4 w-4" /> Admin
                </Link>
              )}
              {userRole === 'owner' && (
                <Link href="/dashboard" className={navLinkClasses(pathname.startsWith('/dashboard'))}>
                  <FiGrid className="mr-1.5 h-4 w-4" /> Dashboard
                </Link>
              )}
            </nav>
          </div>

          {/* Desktop Auth Buttons & User Menu */}
          <div className="hidden md:flex items-center space-x-4"> {/* Increased spacing */}
            {isLoggedIn ? (
              // --- Updated User Dropdown ---
              <div className="relative group">
                <button className="inline-flex items-center px-3 py-1.5 border-2 border-neutral-700 rounded-md text-sm font-medium text-neutral-200 hover:bg-gunmetal-gray hover:border-neutral-500 transition-colors font-poppins">
                  <FiUser className="mr-2 h-4 w-4 text-blood-red" />
                  {session?.user?.name || 'Account'}
                  <FiChevronDown className="ml-1.5 h-3 w-3" />
                </button>
                {/* Dropdown styling */}
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-lg bg-gunmetal-gray ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-in-out border border-neutral-700">
                  <div className="py-1">
                    <Link href="/profile/me" className={dropdownItemClasses}>
                      <FiUser className="inline mr-2 h-4 w-4" /> Profile
                    </Link>
                    {userRole === 'owner' && (
                      <Link href="/dashboard/add" className={dropdownItemClasses}>
                        <FiPlusCircle className="inline mr-2 h-4 w-4" /> Add Venue
                      </Link>
                    )}
                    <Link href="/profile/settings" className={dropdownItemClasses}>
                      <FiSettings className="inline mr-2 h-4 w-4" /> Settings
                    </Link>
                    <button onClick={handleLogout} className={dropdownDestructiveItemClasses}>
                      <FiLogOut className="inline mr-2 h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // --- Updated Auth Buttons ---
              <>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-4 py-1.5 border-2 border-neutral-600 rounded-md text-sm font-medium text-neutral-200 hover:bg-neutral-700 hover:border-neutral-500 transition-colors font-poppins"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-4 py-2 bg-neon-yellow border-2 border-neon-yellow rounded-md text-sm font-bold text-black hover:bg-yellow-400 hover:border-yellow-400 transition-colors shadow-md uppercase font-poppins tracking-wide"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-300 hover:text-white focus:outline-none p-1 rounded-md hover:bg-neutral-700"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel - Updated Styling */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gunmetal-gray border-t border-neutral-700 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Use Bebas Neue for main mobile links */}
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bebas uppercase tracking-wider text-neutral-200 hover:bg-neutral-700 hover:text-neon-yellow">Home</Link>
            <Link href="/search?type=gym" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bebas uppercase tracking-wider text-neutral-200 hover:bg-neutral-700 hover:text-neon-yellow">Gyms</Link>
            <Link href="/search?type=club" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bebas uppercase tracking-wider text-neutral-200 hover:bg-neutral-700 hover:text-neon-yellow">Clubs</Link>
            {/* Add Coaches link */}

            {isLoggedIn ? (
              <div className="border-t border-neutral-700 pt-4 mt-4">
                 <div className="flex items-center px-3 mb-3">
                    <div className="flex-shrink-0">
                      {/* Add user image */}
                      <FiUser className="h-8 w-8 text-blood-red"/>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white font-poppins">{session?.user?.name || 'User'}</div>
                      <div className="text-sm font-medium text-neutral-400 font-poppins">{session?.user?.email}</div>
                    </div>
                  </div>
                {/* Mobile Dropdown items use Poppins */}
                <Link href="/profile/me" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-200 hover:bg-neutral-700 hover:text-neon-yellow font-poppins">Profile</Link>
                {userRole === 'admin' && <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-200 hover:bg-neutral-700 hover:text-neon-yellow font-poppins">Admin</Link>}
                {userRole === 'owner' && <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-200 hover:bg-neutral-700 hover:text-neon-yellow font-poppins">Dashboard</Link>}
                <Link href="/profile/settings" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-200 hover:bg-neutral-700 hover:text-neon-yellow font-poppins">Settings</Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blood-red hover:bg-neutral-700 hover:text-red-400 font-poppins">
                  Sign Out
                </button>
              </div>
            ) : (
              // Mobile Auth Buttons - Updated styling
              <div className="border-t border-neutral-700 pt-4 mt-4 space-y-2">
                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-neutral-200 border-2 border-neutral-600 hover:bg-neutral-700 hover:border-neutral-500 font-poppins">Sign In</Link>
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-3 py-2 rounded-md text-base font-bold text-black bg-neon-yellow border-2 border-neon-yellow hover:bg-yellow-400 hover:border-yellow-400 uppercase font-poppins tracking-wide">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 