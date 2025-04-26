'use client';

import Image from 'next/image';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { FiBell } from 'react-icons/fi';

type MobileAppSectionProps = {
  appImageUrl?: string;
};

export default function MobileAppSection({ appImageUrl }: MobileAppSectionProps) {
  const defaultImageUrl = "/images/mockup-mobile.png";

  return (
    <section className="py-16 md:py-24 bg-gray-100 dark:bg-jet-black overflow-hidden border-t border-b border-gray-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-lg bg-white dark:bg-gunmetal-gray border border-gray-200/80 dark:border-neutral-700/80 overflow-hidden shadow-xl transition-colors duration-300">
          <div className="relative py-12 px-6 md:py-20 md:px-12 z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas text-gray-900 dark:text-white mb-5 leading-tight uppercase tracking-wider transition-colors">
                  Dominate Your Training <span className="text-yellow-500 dark:text-red-500 transition-colors">On The Go.</span>
                </h2>
                <p className="text-base md:text-lg text-gray-700 dark:text-neutral-300 mb-8 transition-colors">
                  Access exclusive features, track progress, and stay motivated with the Fitnass mobile app. Download now and take your fitness journey anywhere.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="inline-flex items-center justify-center bg-gray-50 hover:bg-gray-100 dark:bg-jet-black dark:hover:bg-neutral-800 text-gray-900 dark:text-white py-3 px-6 rounded-md transition-colors duration-200 font-semibold border border-gray-300 hover:border-yellow-500 dark:border-neutral-700 dark:hover:border-red-500 group">
                    <FaApple className="h-5 w-5 mr-3 text-gray-500 group-hover:text-gray-800 dark:text-neutral-400 dark:group-hover:text-white transition-colors" />
                    <div className="text-left font-poppins">
                      <div className="text-xs opacity-70 text-gray-600 dark:text-neutral-400 transition-colors">Download on the</div>
                      <div className="text-base">App Store</div>
                    </div>
                  </button>
                  <button className="inline-flex items-center justify-center bg-gray-50 hover:bg-gray-100 dark:bg-jet-black dark:hover:bg-neutral-800 text-gray-900 dark:text-white py-3 px-6 rounded-md transition-colors duration-200 font-semibold border border-gray-300 hover:border-yellow-500 dark:border-neutral-700 dark:hover:border-red-500 group">
                    <FaGooglePlay className="h-5 w-5 mr-3 text-gray-500 group-hover:text-gray-800 dark:text-neutral-400 dark:group-hover:text-white transition-colors" />
                    <div className="text-left font-poppins">
                      <div className="text-xs opacity-70 text-gray-600 dark:text-neutral-400 transition-colors">GET IT ON</div>
                      <div className="text-base">Google Play</div>
                    </div>
                  </button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative flex justify-center lg:justify-end mt-10 lg:mt-0"
              >
                <div className="relative w-[240px] h-[480px] sm:w-[280px] sm:h-[560px]">
                  <Image
                    src={appImageUrl || defaultImageUrl}
                    alt="FitNass mobile app mockup"
                    fill
                    className="object-contain drop-shadow-[0_15px_30px_rgba(255,0,0,0.15)]"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}