import type { Metadata } from "next";
import { Inter, Bebas_Neue, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import AuthProvider from "@/components/AuthProvider";
import { FiLogIn, FiLogOut, FiMapPin, FiSearch, FiStar, FiTarget, FiUser } from "react-icons/fi";

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
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
