'use client';

import { FiMapPin, FiUsers, FiStar, FiCheckSquare, FiTarget } from 'react-icons/fi';
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
  // Default stats with updated icons/colors
  const defaultStats: Stat[] = [
    { icon: <FiCheckSquare className="h-7 w-7 text-blood-red mb-3" />, value: "500+", label: "Verified Venues" },
    { icon: <FiUsers className="h-7 w-7 text-blood-red mb-3" />, value: "15K+", label: "Committed Athletes" },
    { icon: <FiMapPin className="h-7 w-7 text-blood-red mb-3" />, value: "25+", label: "Cities Dominated" },
    { icon: <FiTarget className="h-7 w-7 text-blood-red mb-3" />, value: "95%", label: "Goal Achievement Rate" }
  ];

  const displayStats = stats || defaultStats;

  return (
    <section className="py-16 md:py-20 bg-jet-black border-t border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 md:gap-x-6 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-700/80">
          {displayStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="pt-6 md:pt-0 md:px-4 flex flex-col items-center first:pt-0 md:first:pl-0 md:last:pr-0"
            >
              {stat.icon}
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bebas text-neon-yellow mb-1 tracking-wider">{stat.value}</div>
              <div className="text-xs uppercase tracking-wide text-neutral-400 font-poppins font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 