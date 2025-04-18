import type { Metadata } from "next";
import { Inter, Bebas_Neue, Poppins } from "next/font/google";
import "./globals.css";
import ClientSideHeader from "@/components/ui/ClientSideHeader";
import Footer from "@/components/Footer";
import Providers from "./providers";

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
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
