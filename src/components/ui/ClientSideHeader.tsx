'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  FiHome, FiUser, FiMenu, FiX, FiActivity, 
  FiSearch, FiChevronDown, FiLogIn, FiLogOut, 
  FiShield, FiSettings, FiGrid, FiPlusCircle
} from 'react-icons/fi';

// Helper function to convert auth role to our app roles
const mapRoleToUserRole = (role: string | undefined): 'user' | 'admin' | 'owner' | null => {
  if (!role) return null;
  
  // Convert role to uppercase for case-insensitive comparison
  const normalizedRole = role.toUpperCase();
  
  if (normalizedRole === 'ADMIN') return 'admin';
  if (normalizedRole === 'OWNER') return 'owner';
  if (normalizedRole === 'USER') return 'user';
  
  return null;
};

export default function ClientSideHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  
  // Determine if user is logged in
  const isLoggedIn = status === 'authenticated';
  
  // Map user role from session
  const userRole = mapRoleToUserRole(session?.user?.role);
  
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };
  
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <FiActivity className="h-6 w-6 text-indigo-600 mr-2" />
              <span className="text-xl font-bold text-indigo-600 tracking-tight">FitNass</span>
            </Link>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link 
                href="/" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                  pathname === '/' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-neutral-700 hover:text-indigo-600'
                }`}
              >
                <FiHome className="mr-1.5 h-4 w-4" />
                Home
              </Link>
              <Link 
                href="/gyms" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                  pathname === '/gyms' || pathname.startsWith('/gyms/') 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-neutral-700 hover:text-indigo-600'
                }`}
              >
                <FiActivity className="mr-1.5 h-4 w-4" />
                Gyms
              </Link>
              <div className="relative group">
                <button className="inline-flex items-center px-1 pt-1 text-sm font-medium text-neutral-700 hover:text-indigo-600 transition-colors">
                  <FiSearch className="mr-1.5 h-4 w-4" />
                  Discover
                  <FiChevronDown className="ml-1.5 h-3 w-3" />
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                  <div className="py-1">
                    <Link href="/gyms?category=weights" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                      Weight Training
                    </Link>
                    <Link href="/gyms?category=cardio" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                      Cardio & HIIT
                    </Link>
                    <Link href="/gyms?category=yoga" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                      Yoga & Wellness
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Admin Link - Only visible to admins */}
              {userRole === 'admin' && (
                <Link 
                  href="/admin" 
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                    pathname.startsWith('/admin') 
                      ? 'text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-neutral-700 hover:text-indigo-600'
                  }`}
                >
                  <FiShield className="mr-1.5 h-4 w-4" />
                  Admin
                </Link>
              )}
              
              {/* Gym Owner Links - Only visible to gym owners */}
              {userRole === 'owner' && (
                <Link 
                  href="/owner/dashboard" 
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                    pathname.startsWith('/owner') 
                      ? 'text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-neutral-700 hover:text-indigo-600'
                  }`}
                >
                  <FiGrid className="mr-1.5 h-4 w-4" />
                  My Gyms
                </Link>
              )}
            </nav>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* User is logged in */}
                <div className="relative group">
                  <button className="inline-flex items-center px-4 py-2 border border-indigo-600 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors">
                    <FiUser className="mr-2 h-4 w-4" />
                    {session?.user?.name || 'My Account'}
                    <FiChevronDown className="ml-1.5 h-3 w-3" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                    <div className="py-1">
                      <Link 
                        href="/profile/me" 
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      >
                        <FiUser className="inline mr-2 h-4 w-4" />
                        My Profile
                      </Link>
                      
                      {userRole === 'owner' && (
                        <Link 
                          href="/owner/add-gym" 
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        >
                          <FiPlusCircle className="inline mr-2 h-4 w-4" />
                          Add New Gym
                        </Link>
                      )}
                      
                      <Link 
                        href="/profile/settings" 
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      >
                        <FiSettings className="inline mr-2 h-4 w-4" />
                        Settings
                      </Link>
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-neutral-100"
                      >
                        <FiLogOut className="inline mr-2 h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* User is not logged in */}
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-4 py-2 border border-indigo-600 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <FiLogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-700 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 p-1 rounded-md"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-indigo-600 hover:bg-neutral-50">
              <FiHome className="inline-block mr-2 h-5 w-5" />
              Home
            </Link>
            <Link href="/gyms" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-indigo-600 hover:bg-neutral-50">
              <FiActivity className="inline-block mr-2 h-5 w-5" />
              Gyms
            </Link>
            
            {/* User-specific mobile menu links */}
            {isLoggedIn ? (
              <>
                {/* Profile Link */}
                <Link href="/profile/me" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-indigo-600 hover:bg-neutral-50">
                  <FiUser className="inline-block mr-2 h-5 w-5" />
                  My Profile
                </Link>
                
                {/* Admin Link - Only visible to admins */}
                {userRole === 'admin' && (
                  <Link href="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-indigo-600 hover:bg-neutral-50">
                    <FiShield className="inline-block mr-2 h-5 w-5" />
                    Admin Dashboard
                  </Link>
                )}
                
                {/* Owner Links - Only visible to gym owners */}
                {userRole === 'owner' && (
                  <>
                    <Link href="/owner/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-indigo-600 hover:bg-neutral-50">
                      <FiGrid className="inline-block mr-2 h-5 w-5" />
                      My Gyms
                    </Link>
                    <Link href="/owner/add-gym" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-indigo-600 hover:bg-neutral-50">
                      <FiPlusCircle className="inline-block mr-2 h-5 w-5" />
                      Add New Gym
                    </Link>
                  </>
                )}
                
                {/* Settings Link */}
                <Link href="/profile/settings" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-indigo-600 hover:bg-neutral-50">
                  <FiSettings className="inline-block mr-2 h-5 w-5" />
                  Settings
                </Link>
                
                {/* Sign Out Button */}
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-neutral-50"
                >
                  <FiLogOut className="inline-block mr-2 h-5 w-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                {/* Auth Links - Only visible when logged out */}
                <Link href="/auth/signin" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:text-indigo-800 hover:bg-neutral-50">
                  <FiLogIn className="inline-block mr-2 h-5 w-5" />
                  Sign In
                </Link>
                <Link href="/auth/signup" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-indigo-600 hover:bg-neutral-50">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 