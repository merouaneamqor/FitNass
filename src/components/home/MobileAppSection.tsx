'use client';

import Image from 'next/image';

type MobileAppSectionProps = {
  appImageUrl?: string;
};

export default function MobileAppSection({ appImageUrl }: MobileAppSectionProps) {
  const defaultImageUrl = "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
  
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-700 to-purple-700 overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          
          <div className="relative py-16 px-8 md:py-24 md:px-12 z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Download Our Mobile App</h2>
                <p className="text-lg text-indigo-100 mb-8">
                  Get the FitNass app for a better experience. Book sessions, track your workouts, and receive personalized recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="inline-flex items-center bg-white text-indigo-900 py-3 px-6 rounded-lg hover:bg-indigo-50 transition-colors">
                    <svg className="h-8 w-8 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.707 10.708L16.293 9.294 13 12.587 9.707 9.294 8.293 10.708 11.586 14.001 8.293 17.294 9.707 18.708 13 15.415 16.293 18.708 17.707 17.294 14.414 14.001z"></path></svg>
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="text-base font-semibold">App Store</div>
                    </div>
                  </button>
                  <button className="inline-flex items-center bg-white text-indigo-900 py-3 px-6 rounded-lg hover:bg-indigo-50 transition-colors">
                    <svg className="h-8 w-8 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.707 10.708L16.293 9.294 13 12.587 9.707 9.294 8.293 10.708 11.586 14.001 8.293 17.294 9.707 18.708 13 15.415 16.293 18.708 17.707 17.294 14.414 14.001z"></path></svg>
                    <div className="text-left">
                      <div className="text-xs">GET IT ON</div>
                      <div className="text-base font-semibold">Google Play</div>
                    </div>
                  </button>
                </div>
              </div>
              <div className="hidden lg:block relative">
                <Image 
                  src={appImageUrl || defaultImageUrl} 
                  alt="FitNass mobile app"
                  width={400}
                  height={800}
                  className="mx-auto rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 