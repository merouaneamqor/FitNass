'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiMenu, FiX, FiSearch, FiUser, FiActivity, FiTag, FiAward, FiGrid, FiBriefcase, FiMapPin, FiChevronDown } from 'react-icons/fi';
import { GiTennisRacket, GiWeightLiftingUp } from 'react-icons/gi';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`bg-white dark:bg-fitnass-dark sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg backdrop-blur-md bg-white/90 dark:bg-fitnass-dark/90' : 'shadow-sm'
      }`}
    >
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <FiActivity className="h-8 w-8 md:h-9 md:w-9 text-fitnass-coral mr-2" />
            </Link>
            <div className="hidden lg:ml-10 lg:flex lg:space-x-10">
              <Link
                href="/gyms"
                className="text-gray-600 dark:text-gray-200 hover:text-fitnass-pink dark:hover:text-fitnass-neon inline-flex items-center font-medium text-sm"
              >
                <GiWeightLiftingUp className="mr-1.5" />
                Salles de Gym
              </Link>
              <Link
                href="/clubs"
                className="text-gray-600 dark:text-gray-200 hover:text-fitnass-pink dark:hover:text-fitnass-neon inline-flex items-center font-medium text-sm"
              >
                <GiTennisRacket className="mr-1.5" />
                Clubs Sportifs
              </Link>
              <Link
                href="/promotions"
                className="text-gray-600 dark:text-gray-200 hover:text-fitnass-pink dark:hover:text-fitnass-neon inline-flex items-center font-medium text-sm"
              >
                <FiAward className="mr-1.5" />
                Offres Exclusives
              </Link>
              <Link
                href="/subscriptions"
                className="text-gray-600 dark:text-gray-200 hover:text-fitnass-pink dark:hover:text-fitnass-neon inline-flex items-center font-medium text-sm"
              >
                <FiTag className="mr-1.5" />
                Abonnements
              </Link>
              <div className="relative group">
                <button className="text-gray-600 dark:text-gray-200 hover:text-fitnass-pink dark:hover:text-fitnass-neon inline-flex items-center font-medium text-sm">
                  <FiGrid className="mr-1.5" />
                  Services
                  <FiChevronDown className="ml-1 h-4 w-4 group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute left-0 mt-3 w-56 origin-top-left rounded-xl shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 z-50">
                  <div className="py-2 px-1 rounded-xl">
                    <Link href="/corporate" className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      Entreprises
                    </Link>
                    <Link href="/partnerships" className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      Partenariats
                    </Link>
                    <Link href="/for-gyms" className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      Pour les salles
                    </Link>
                  </div>
                </div>
              </div>
              {session?.user?.role === 'GYM_OWNER' && (
                <Link
                  href="/dashboard"
                  className="text-gray-600 dark:text-gray-200 hover:text-fitnass-pink dark:hover:text-fitnass-neon inline-flex items-center font-medium text-sm"
                >
                  <FiBriefcase className="mr-1.5" />
                  Espace Pro
                </Link>
              )}
              {session?.user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="text-gray-600 dark:text-gray-200 hover:text-fitnass-pink dark:hover:text-fitnass-neon inline-flex items-center font-medium text-sm"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-fitnass-pink">
                <FiSearch className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                <input
                  type="text"
                  placeholder="Rechercher gyms ou clubs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ml-2 bg-transparent border-0 focus:outline-none focus:ring-0 w-56 text-sm"
                />
              </div>
              <button type="submit" className="hidden">Search</button>
            </form>
            {session ? (
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-200 hover:text-fitnass-pink focus:outline-none bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full"
                    >
                      <FiUser className="h-5 w-5" />
                      <span className="hidden md:inline font-medium text-sm">{session.user.name}</span>
                      <FiChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                        <div className="py-2 px-1">
                          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{session.user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{session.user.email}</p>
                          </div>
                          <Link href="/profile" className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mt-1">
                            Mon Profil
                          </Link>
                          <Link href="/favorites" className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            Mes Favoris
                          </Link>
                          <Link href="/dashboard" className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            Mon Dashboard
                          </Link>
                          <div className="px-1 py-1 border-t border-gray-100 dark:border-gray-700">
                            <button
                              onClick={() => signOut()}
                              className="block w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium"
                            >
                              Déconnexion
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="ml-3 relative flex items-center space-x-4">
                <Link
                  href="/auth/signup"
                  className="text-gray-700 dark:text-gray-200 px-5 py-2 rounded-full font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  S&apos;inscrire
                </Link>
                <Link
                  href="/auth/signin"
                  className="bg-gradient-to-r from-fitnass-coral to-fitnass-pink text-white px-5 py-2 rounded-full font-medium text-sm hover:shadow-md transition-all"
                >
                  Connexion
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-fitnass-pink hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <div className="mb-6 mt-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
                  <FiSearch className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                  <input
                    type="text"
                    placeholder="Rechercher gyms ou clubs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ml-2 bg-transparent border-0 focus:outline-none focus:ring-0 w-full text-sm"
                  />
                </div>
                <button type="submit" className="hidden">Search</button>
              </form>
            </div>
            
            <Link
              href="/gyms"
              className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiMapPin className="mr-3 h-5 w-5 text-fitnass-coral" />
              Trouver une salle
            </Link>
            <Link
              href="/free-trials"
              className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiTag className="mr-3 h-5 w-5 text-fitnass-coral" />
              Essais Gratuits
            </Link>
            <Link
              href="/subscriptions"
              className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiTag className="mr-3 h-5 w-5 text-fitnass-coral" />
              Abonnements
            </Link>
            <Link
              href="/promotions"
              className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiAward className="mr-3 h-5 w-5 text-fitnass-coral" />
              Offres Exclusives
            </Link>
            
            <div className="mt-2 mb-2">
              <div className="px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200">
                <div className="flex items-center">
                  <FiGrid className="mr-3 h-5 w-5 text-fitnass-coral" />
                  Services
                </div>
              </div>
              <div className="ml-12 space-y-1">
                <Link href="/corporate" className="block py-2 px-4 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Entreprises
                </Link>
                <Link href="/partnerships" className="block py-2 px-4 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Partenariats
                </Link>
                <Link href="/for-gyms" className="block py-2 px-4 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Pour les salles
                </Link>
              </div>
            </div>
            
            {session?.user?.role === 'GYM_OWNER' && (
              <Link
                href="/dashboard"
                className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiBriefcase className="mr-3 h-5 w-5 text-fitnass-coral" />
                Espace Pro
              </Link>
            )}
            {session?.user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Admin
              </Link>
            )}
          </div>

          {session ? (
            <div className="pt-4 pb-5 border-t border-gray-200 dark:border-gray-700">
              <div className="px-4 py-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-fitnass-coral to-fitnass-pink flex items-center justify-center text-white">
                      {session.user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-white">{session.user.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{session.user.email}</div>
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-4">
                <Link
                  href="/profile"
                  className="flex items-center justify-center flex-col py-2 px-4 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Mon Profil
                </Link>
                <Link
                  href="/favorites"
                  className="block py-2 px-4 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Mes Favoris
                </Link>
                <Link
                  href="/dashboard"
                  className="block py-2 px-4 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Mon Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left py-2 px-4 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 mt-2"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-5 border-t border-gray-200 dark:border-gray-700">
              <div className="px-4 flex flex-col space-y-3">
                <Link
                  href="/auth/signup"
                  className="w-full text-center py-3 rounded-xl text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  S&apos;inscrire
                </Link>
                <Link
                  href="/auth/signin"
                  className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-fitnass-coral to-fitnass-pink text-white font-medium"
                >
                  Connexion
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
} 