'use client';

import Link from 'next/link';
import { FiTarget, FiArrowRight, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Animation variants (add this if not already present)
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

type CTASectionProps = {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  icon?: React.ReactNode;
};

export default function CTASection({
  title = "STOP WAITING. START DOMINATING.",
  description = "Find the toughest training grounds. Sign up and unleash your beast mode. No excuses.",
  primaryButtonText = "Find Your Battleground",
  primaryButtonUrl = "/search",
  secondaryButtonText = "Join the Ranks",
  secondaryButtonUrl = "/auth/signup",
  icon = <FiZap className="h-8 w-8 mb-4 text-yellow-400" /> // Default icon
}: CTASectionProps) {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Add subtle background pattern/effect if desired */}
      <div className="absolute inset-0 bg-[url('/path-to-subtle-pattern.svg')] opacity-5"></div> 
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {icon && <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>{icon}</motion.div>}
        <motion.h2 
          className="text-4xl md:text-5xl font-bebas uppercase tracking-wider mb-5"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          {title}
        </motion.h2>
        <motion.p 
          className="text-base md:text-lg mb-10 max-w-2xl mx-auto text-neutral-300"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {description}
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Link
            href={primaryButtonUrl}
            className="inline-flex items-center justify-center px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {primaryButtonText}
            <FiArrowRight className="ml-2 h-4 w-4" />
          </Link>
          {secondaryButtonText && secondaryButtonUrl && (
            <Link
              href={secondaryButtonUrl}
              className="inline-flex items-center justify-center px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {secondaryButtonText}
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
} 