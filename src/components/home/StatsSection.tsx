'use client';

import React from 'react';
import { FiCpu, FiPieChart, FiTrendingUp, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';

type Stat = {
  icon: JSX.Element;
  value: string;
  label: string;
};

type StatsSectionProps = {
  stats?: Stat[];
};

export default function StatsSection({ stats }: StatsSectionProps) {
  // Stats with updated accent colors
  const defaultStats: Stat[] = [
    { icon: <FiCpu className="h-7 w-7 text-red-600 mb-3" />, value: "4.2M+", label: "AI Recommendations" },
    { icon: <FiPieChart className="h-7 w-7 text-red-600 mb-3" />, value: "98.5%", label: "Match Accuracy" },
    { icon: <FiTrendingUp className="h-7 w-7 text-red-600 mb-3" />, value: "32%", label: "Faster Progress" },
    { icon: <FiZap className="h-7 w-7 text-red-600 mb-3" />, value: "0.2s", label: "Real-time Processing" }
  ];

  const displayStats = stats || defaultStats;

  return (
    // Lighter background, removed borders
    <section className="py-16 md:py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas text-gray-900 uppercase tracking-wider mb-4">
            Powered by <span className="text-yellow-500">Advanced AI</span>
          </h2>
          <p className="text-base md:text-lg text-gray-700 font-medium max-w-2xl mx-auto">
            Our platform leverages cutting-edge machine learning algorithms to deliver personalized experiences based on real workout data.
          </p>
        </div>
        
        {/* Adjusted grid styling, lighter divider */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4 md:gap-x-6 text-center md:divide-x divide-gray-300">
          {displayStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              // Removed padding adjustments, ensuring items center
              className="flex flex-col items-center"
            >
              {stat.icon}
              {/* Adjusted value text color */}
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bebas text-yellow-500 mb-1 tracking-wider">{stat.value}</div>
              {/* Adjusted label text color */}
              <div className="text-xs uppercase tracking-wide text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 