'use client';

import Link from 'next/link';
import { FiTarget, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

type CTASectionProps = {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
};

export default function CTASection({
  title = "STOP WAITING. START DOMINATING.",
  description = "Find the toughest training grounds. Sign up and unleash your beast mode. No excuses.",
  primaryButtonText = "Find Your Battleground",
  primaryButtonUrl = "/search",
  secondaryButtonText = "Join the Ranks",
  secondaryButtonUrl = "/auth/signup"
}: CTASectionProps) {
  return (
    <section className="py-20 md:py-28 bg-jet-black border-t border-neutral-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-6 text-center"
      >
        <FiTarget className="h-12 w-12 md:h-14 md:w-14 mx-auto mb-6 text-blood-red" />
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas mb-4 text-white uppercase tracking-wider">
          {title}
        </h2>
        <p className="text-base md:text-lg mb-10 max-w-2xl mx-auto text-neutral-300 font-poppins">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={primaryButtonUrl}
            className="inline-flex items-center justify-center bg-neon-yellow text-black px-7 py-3 rounded-md font-bold text-sm md:text-base uppercase tracking-wider hover:bg-yellow-400 transition-colors duration-200 shadow-lg transform hover:scale-105"
          >
            {primaryButtonText}
            <FiArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href={secondaryButtonUrl}
            className="inline-flex items-center justify-center bg-gunmetal-gray text-white border border-neutral-700 px-7 py-3 rounded-md font-bold text-sm md:text-base uppercase tracking-wider hover:bg-neutral-700 hover:border-neutral-600 transition-all duration-200"
          >
            {secondaryButtonText}
          </Link>
        </div>
      </motion.div>
    </section>
  );
} 