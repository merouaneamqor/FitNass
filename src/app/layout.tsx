import React from 'react';
import Link from 'next/link';
import './globals.css';
import { FiHome, FiUser, FiMenu, FiX, FiActivity } from 'react-icons/fi';
import Providers from './providers';

export const metadata = {
  title: 'FitNass | Find the Best Gyms in Morocco',
  description: 'Discover and book the best gyms across Morocco with FitNass.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-neutral-50">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <header className="bg-white border-b border-neutral-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <Link href="/" className="flex-shrink-0 flex items-center">
                      <span className="text-xl font-bold text-indigo-600">FitNass</span>
                    </Link>
                    <nav className="hidden md:ml-8 md:flex md:space-x-8">
                      <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-neutral-700 hover:text-indigo-600 transition-colors">
                        <FiHome className="mr-1 h-4 w-4" />
                        Home
                      </Link>
                      <Link href="/gyms" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-neutral-700 hover:text-indigo-600 transition-colors">
                        <FiActivity className="mr-1 h-4 w-4" />
                        Gyms
                      </Link>
                    </nav>
                  </div>
                  <div className="hidden md:flex items-center">
                    <Link
                      href="/profile/me"
                      className="inline-flex items-center px-4 py-2 border border-indigo-600 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <FiUser className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </div>
                  <div className="flex items-center md:hidden">
                    <button className="text-neutral-700 hover:text-indigo-600">
                      <FiMenu className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-grow">
              {children}
            </main>
            <footer className="bg-neutral-800 text-white py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-xl font-bold">FitNass</h3>
                    <p className="mt-4 text-neutral-400">
                      Discover and book the best gyms across Morocco.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Quick Links</h3>
                    <ul className="mt-4 space-y-2">
                      <li>
                        <Link href="/" className="text-neutral-400 hover:text-white transition-colors">
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link href="/gyms" className="text-neutral-400 hover:text-white transition-colors">
                          Find Gyms
                        </Link>
                      </li>
                      <li>
                        <Link href="/profile/me" className="text-neutral-400 hover:text-white transition-colors">
                          My Profile
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Contact</h3>
                    <ul className="mt-4 space-y-2">
                      <li className="text-neutral-400">
                        Email: info@fitnass.com
                      </li>
                      <li className="text-neutral-400">
                        Phone: +212 522 123 456
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-8 border-t border-neutral-700 pt-8 text-center text-neutral-400">
                  <p>&copy; {new Date().getFullYear()} FitNass. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
