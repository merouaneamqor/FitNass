'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  FiUser, FiMenu, FiX,
  FiSearch, FiChevronDown, FiLogIn, FiLogOut,
  FiShield, FiSettings, FiGrid, FiPlusCircle, FiTarget // Added FiTarget as possible logo
} from 'react-icons/fi';

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

  const isLoggedIn = status === 'authenticated';
  const userRole = mapRoleToUserRole(session?.user?.role);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const navLinkClasses = (isActive: boolean) =>
    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'text-blood-red border-blood-red'
        : 'text-neutral-300 border-transparent hover:text-white'
    }`;

  const dropdownItemClasses = "block px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors duration-150";
  const dropdownDestructiveItemClasses = "block w-full text-left px-4 py-2 text-sm text-blood-red hover:bg-neutral-700 hover:text-red-400 transition-colors duration-150";

  return (
    // Use Jet Black bg, adjust border
    <header className="bg-jet-black border-b border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              {/* Placeholder for stylized F/icon */}
              <span className="text-2xl font-bebas text-blood-red mr-1 group-hover:scale-110 transition-transform">F</span>
              <span className="text-xl font-bebas text-white tracking-wider group-hover:text-neutral-200 transition-colors">FITNASS</span>
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-10 md:flex md:space-x-6">
              <Link href="/" className={navLinkClasses(pathname === '/')}>Home</Link>
              <Link href="/search?type=gym" className={navLinkClasses(pathname.startsWith('/gyms'))}>Gyms</Link>
              <Link href="/search?type=club" className={navLinkClasses(pathname.startsWith('/clubs'))}>Clubs</Link>
              {/* Add Coaches link if route exists */}
              {/* <Link href="/coaches" className={navLinkClasses(pathname.startsWith('/coaches'))}>Coaches</Link> */}

              {/* Admin Link */}
              {userRole === 'admin' && (
                <Link href="/admin" className={navLinkClasses(pathname.startsWith('/admin'))}>
                  <FiShield className="mr-1.5 h-4 w-4" /> Admin
                </Link>
              )}
              {/* Owner Link */}
              {userRole === 'owner' && (
                <Link href="/dashboard" className={navLinkClasses(pathname.startsWith('/dashboard'))}>
                  <FiGrid className="mr-1.5 h-4 w-4" /> Dashboard
                </Link>
              )}
            </nav>
          </div>

          {/* Desktop Auth Buttons & User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="relative group">
                <button className="inline-flex items-center px-3 py-1.5 border-2 border-neutral-700 rounded-md text-sm font-medium text-neutral-200 hover:bg-gunmetal-gray hover:border-neutral-600 transition-colors">
                  <FiUser className="mr-2 h-4 w-4 text-blood-red" />
                  {session?.user?.name || 'Account'}
                  <FiChevronDown className="ml-1.5 h-3 w-3" />
                </button>
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-lg bg-gunmetal-gray ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-in-out">
                  <div className="py-1">
                    <Link href="/profile/me" className={dropdownItemClasses}>
                      <FiUser className="inline mr-2 h-4 w-4" /> Profile
                    </Link>
                    {userRole === 'owner' && (
                      <Link href="/dashboard/add" className={dropdownItemClasses}> {/* Assuming /dashboard/add is correct */}
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
              <>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-4 py-1.5 border-2 border-neutral-600 rounded-md text-sm font-medium text-neutral-200 hover:bg-gunmetal-gray hover:border-neutral-500 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-4 py-2 bg-neon-yellow border border-transparent rounded-md text-sm font-bold text-black hover:bg-yellow-300 transition-colors shadow-sm"
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
              className="text-neutral-300 hover:text-white focus:outline-none p-1 rounded-md"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gunmetal-gray border-t border-neutral-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white">Home</Link>
            <Link href="/search?type=gym" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white">Gyms</Link>
            <Link href="/search?type=club" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white">Clubs</Link>

            {isLoggedIn ? (
              <div className="border-t border-neutral-700 pt-4 mt-4">
                 <div className="flex items-center px-3 mb-3">
                    <div className="flex-shrink-0">
                      {/* Add user image if available */}
                      <FiUser className="h-8 w-8 text-blood-red"/>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">{session?.user?.name || 'User'}</div>
                      <div className="text-sm font-medium text-neutral-400">{session?.user?.email}</div>
                    </div>
                  </div>
                <Link href="/profile/me" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white">Profile</Link>
                {userRole === 'admin' && <Link href="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white">Admin</Link>}
                {userRole === 'owner' && <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white">Dashboard</Link>}
                <Link href="/profile/settings" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white">Settings</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blood-red hover:bg-neutral-700 hover:text-red-400">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-neutral-700 pt-4 mt-4 space-y-2">
                <Link href="/auth/signin" className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-neutral-200 border-2 border-neutral-600 hover:bg-gunmetal-gray">Sign In</Link>
                <Link href="/auth/signup" className="block w-full text-center px-3 py-2 rounded-md text-base font-bold text-black bg-neon-yellow hover:bg-yellow-300">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 