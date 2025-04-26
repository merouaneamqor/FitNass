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

// Accent Color Definitions (copied from HeroSection for consistency)
const lightYellowAccentColor = 'yellow-400';
const lightYellowAccentTextClass = 'text-yellow-600';
// Used in template literal strings for the text and stats
const darkRedAccentTextClass = 'text-red-500';
// darkRedAccentColor and darkYellowAccentTextClass removed since they are unused

export default function StatsSection({ stats }: StatsSectionProps) {
  const defaultStats: Stat[] = [
    // Icons use red accent in dark mode
    { icon: <FiCpu className={`h-7 w-7 ${lightYellowAccentTextClass} dark:${darkRedAccentTextClass} mb-3 transition-colors`} />, value: "4.2M+", label: "AI Recommendations" },
    { icon: <FiPieChart className={`h-7 w-7 ${lightYellowAccentTextClass} dark:${darkRedAccentTextClass} mb-3 transition-colors`} />, value: "98.5%", label: "Match Accuracy" },
    { icon: <FiTrendingUp className={`h-7 w-7 ${lightYellowAccentTextClass} dark:${darkRedAccentTextClass} mb-3 transition-colors`} />, value: "32%", label: "Faster Progress" },
    { icon: <FiZap className={`h-7 w-7 ${lightYellowAccentTextClass} dark:${darkRedAccentTextClass} mb-3 transition-colors`} />, value: "0.2s", label: "Real-time Processing" }
  ];

  const displayStats = stats || defaultStats;

  return (
    // Light: White/Near-white bg. Dark: Dark bg.
    <section className="py-16 md:py-20 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          {/* Light: Dark text. Dark: Light text. Yellow accent remains similar. */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas text-gray-900 dark:text-white uppercase tracking-wider mb-4 transition-colors">
            Powered by <span className={`text-${lightYellowAccentColor} dark:${darkRedAccentTextClass} transition-colors`}>Advanced AI</span>
          </h2>
          {/* Light: Medium text. Dark: Lighter text. */}
          <p className="text-base md:text-lg text-gray-700 dark:text-neutral-300 font-inter font-medium max-w-2xl mx-auto transition-colors">
            Our platform leverages cutting-edge machine learning algorithms to deliver personalized experiences based on real workout data.
          </p>
        </div>
        
        {/* Light: Light divider. Dark: Darker divider. */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4 md:gap-x-6 text-center md:divide-x divide-gray-300 dark:divide-neutral-700 transition-colors">
          {displayStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              {stat.icon} {/* Icon color handled in defaultStats definition */}
              {/* Stat Value: Yellow accent in both modes */}
              <div className={`text-4xl sm:text-5xl lg:text-6xl font-bebas text-${lightYellowAccentColor} dark:${darkRedAccentTextClass} mb-1 tracking-wider transition-colors`}>{stat.value}</div>
              {/* Label: Medium text light, lighter text dark */}
              <div className="text-xs uppercase tracking-wide text-gray-600 dark:text-neutral-400 font-inter font-medium transition-colors">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 