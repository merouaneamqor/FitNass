import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import ClientSideHeader from "@/components/ui/ClientSideHeader";
import Footer from "@/components/Footer";
import Providers from "./providers";
import { Suspense } from 'react';

// Font configurations
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas-neue',
  display: 'swap',
});

// Configure Inter font (restoring previous config)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Set variable for Inter
  display: 'swap',
});

// Metadata object with type annotation
export const metadata: Metadata = {
  title: 'FITNASS - Train Like A Beast',
  description: 'Find the toughest coaches, gyms, and clubs. Book sessions and dominate your goals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bebasNeue.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-gray-50 font-inter text-gray-700 antialiased">
        <Providers>
          <div className="flex flex-col min-h-screen">
            {/* Consider a more styled Suspense fallback later if needed */}
            <Suspense fallback={<div className="h-16 bg-white border-b border-gray-200"></div>}>
              <ClientSideHeader />
            </Suspense>
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
