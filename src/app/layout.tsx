import React from 'react';
import Link from 'next/link';
import './globals.css';
import { FiActivity, FiArrowRight } from 'react-icons/fi';
import Providers from './providers';
import ClientSideHeader from '@/components/ui/ClientSideHeader';
import { Bebas_Neue, Poppins } from 'next/font/google';

// Configure fonts
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas-neue',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata = {
  title: 'FITNASS - Train Like A Beast',
  description: 'Find the toughest coaches, gyms, and clubs. Book sessions and dominate your goals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bebasNeue.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-jet-black font-poppins text-base-foreground">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <ClientSideHeader />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="bg-gunmetal-gray text-neutral-300 py-10 md:py-16 border-t border-neutral-700">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl font-bebas text-blood-red mr-2">F</span>
                      <h3 className="text-2xl font-bebas text-white">FITNASS</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The ultimate platform for serious athletes, coaches, and gyms in Morocco.
                    </p>
                    <div className="mt-6 flex space-x-5">
                      <a href="#" className="text-muted-foreground hover:text-blood-red transition-colors">
                        <span className="sr-only">Facebook</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bebas tracking-wider text-white mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                      <li><Link href="/" className="text-muted-foreground hover:text-white transition-colors">Home</Link></li>
                      <li><Link href="/search?type=gym" className="text-muted-foreground hover:text-white transition-colors">Find Gyms</Link></li>
                      <li><Link href="/search?type=club" className="text-muted-foreground hover:text-white transition-colors">Find Clubs</Link></li>
                      <li><Link href="/coaches" className="text-muted-foreground hover:text-white transition-colors">Find Coaches</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-base font-bebas tracking-wider text-white mb-4">Resources</h3>
                    <ul className="space-y-2 text-sm">
                      <li><Link href="/about" className="text-muted-foreground hover:text-white transition-colors">About Fitnass</Link></li>
                      <li><Link href="/contact" className="text-muted-foreground hover:text-white transition-colors">Contact Us</Link></li>
                      <li><Link href="/pro" className="text-muted-foreground hover:text-white transition-colors">For Pros</Link></li>
                      <li><Link href="/faq" className="text-muted-foreground hover:text-white transition-colors">FAQ</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-base font-bebas tracking-wider text-white mb-4">Contact</h3>
                    <ul className="space-y-3 text-sm">
                      <li className="text-muted-foreground flex items-start">
                        <span className="mr-2 mt-0.5 text-blood-red">📍</span>
                        <span>123 Beast Mode Ave<br />Casablanca, Morocco</span>
                      </li>
                      <li className="text-muted-foreground flex items-center">
                        <span className="mr-2 text-blood-red">✉️</span>
                        <a href="mailto:info@fitnass.com" className="hover:text-white">info@fitnass.com</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-8 border-t border-neutral-700 pt-8 text-center text-neutral-400">
                  <p className="text-xs">&copy; {new Date().getFullYear()} FITNASS. Unleash Your Potential.</p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
