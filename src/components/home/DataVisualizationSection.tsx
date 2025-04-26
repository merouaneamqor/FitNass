'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiActivity, FiPieChart, FiInfo } from 'react-icons/fi';

// Animation variants for smoother transitions
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function DataVisualizationSection() {
  return (
    // Conditional background
    <section className="py-20 md:py-28 bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-20">
          <motion.h2
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.2 }}
            // Conditional heading text color
            className="text-4xl md:text-5xl lg:text-6xl font-bebas text-gray-900 dark:text-white uppercase tracking-wider mb-4 transition-colors"
          >
            {/* Conditional gradient highlight */}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-red-500 dark:to-red-600 transition-all">Smart</span> Analytics Dashboard
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.2 }}
            // Conditional paragraph text color
            className="text-base md:text-lg text-gray-600 dark:text-neutral-300 font-medium max-w-2xl mx-auto font-inter transition-colors"
          >
            Gain personalized insights and optimization strategies powered by our AI analysis of your workout data.
          </motion.p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12"
        >
          {/* First visualization - Activity tracking */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            // Conditional card styling: bg, border, shadow
            className="bg-white dark:bg-gray-900 p-7 md:p-9 rounded-2xl border border-gray-200/70 dark:border-gray-700/50 shadow-[0_3px_15px_rgba(0,0,0,0.03)] dark:shadow-none transition-colors duration-300"
          >
            <div className="flex items-center justify-between mb-7">
              {/* Conditional card title color */}
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 uppercase tracking-wide transition-colors">Workout Performance</h3>
              <div className="flex items-center">
                {/* Conditional subtext color */}
                <span className="text-xs text-gray-500 dark:text-neutral-400 mr-2 font-medium font-inter transition-colors">Last 7 days</span>
                {/* Conditional icon color */}
                <FiActivity className="h-5 w-5 text-yellow-600 dark:text-red-500 transition-colors" />
              </div>
            </div>

            <div className="h-60 w-full relative">
              {/* Conditional grid lines */}
              <div className="absolute inset-0 h-[85%] w-full">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    // Conditional border color
                    className="absolute border-t border-gray-100/90 dark:border-gray-800/50 left-0 right-0 transition-colors"
                    style={{ top: `${index * 25}%`, height: '1px' }}
                  />
                ))}
              </div>

              {/* Conditional bottom border */}
              <div className="absolute bottom-0 left-0 right-0 h-[85%] flex items-end border-b border-gray-200/60 dark:border-gray-700/50 transition-colors">
                {[
                  { value: 35, label: 'Mon' },
                  { value: 55, label: 'Tue' },
                  { value: 45, label: 'Wed' },
                  { value: 70, label: 'Thu' },
                  { value: 65, label: 'Fri' },
                  { value: 85, label: 'Sat' },
                  { value: 60, label: 'Sun' },
                ].map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center h-full justify-end px-1.5 group">
                    <div className="relative w-full h-full flex flex-col items-center justify-end">
                      {/* Conditional tooltip bg/text */}
                      <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="bg-gray-800/90 dark:bg-gray-200 text-white dark:text-gray-900 text-[11px] font-medium py-1 px-2.5 rounded-md shadow-md whitespace-nowrap">
                          {day.value}% performance
                        </div>
                        <div className="w-1.5 h-1.5 bg-gray-800/90 dark:bg-gray-200 transform rotate-45 mx-auto -mt-0.5"></div>
                      </div>

                      {/* Conditional bar color */}
                      <motion.div
                        initial={{ height: '0%' }}
                        whileInView={{ height: `${day.value}%` }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.9, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                        // Conditional background color
                        className="w-3/5 bg-yellow-400 dark:bg-red-500 rounded-t transition-colors"
                        style={{ originY: 1 }}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Conditional X-axis labels */}
              <div className="absolute bottom-[-22px] left-0 right-0 flex justify-around text-[11px] text-gray-500/90 dark:text-neutral-400/80 font-medium px-1 font-inter transition-colors">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <span key={index} className="text-center w-8">{day}</span>
                ))}
              </div>

              {/* Conditional Y-axis labels */}
              <div className="absolute left-[-10px] top-0 h-[85%] flex flex-col justify-between text-[11px] text-gray-500/90 dark:text-neutral-400/80 font-medium pr-2 font-inter transition-colors">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
            </div>

            {/* Conditional progression info section styling */}
            <div className="mt-10 flex items-center justify-between bg-gray-50/70 dark:bg-gray-800/40 rounded-lg px-4 py-2.5 border border-gray-200/50 dark:border-gray-700/40 transition-colors">
              {/* Conditional text color */}
              <span className="text-xs text-gray-700 dark:text-gray-200 font-medium font-inter transition-colors">Weekly progression</span>
              {/* Conditional badge styling */}
              <span className="text-xs bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-300 font-semibold px-2 py-0.5 rounded-full flex items-center font-inter transition-colors">
                <FiTrendingUp className="h-3 w-3 mr-1 inline-block stroke-2" />
                +23%
              </span>
            </div>
          </motion.div>

          {/* Second visualization - Performance metrics */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            // Consistent conditional card styling
            className="bg-white dark:bg-gray-900 p-7 md:p-9 rounded-2xl border border-gray-200/70 dark:border-gray-700/50 shadow-[0_3px_15px_rgba(0,0,0,0.03)] dark:shadow-none transition-colors duration-300"
          >
            <div className="flex items-center justify-between mb-7">
              {/* Conditional card title color */}
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 uppercase tracking-wide transition-colors">AI Recommendations</h3>
              {/* Conditional info icon styling */}
              <div className="p-1.5 rounded-full bg-yellow-100/70 dark:bg-red-900/30 transition-colors">
                <FiInfo className="h-4 w-4 text-yellow-700 dark:text-red-400 transition-colors" />
              </div>
            </div>

            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-2 gap-5"
            >
              {[
                { label: 'Optimal Training Time', value: '6:00 PM', color: 'bg-yellow-400 dark:bg-red-500' },
                { label: 'Recovery Quality', value: '87%', color: 'bg-green-400 dark:bg-green-500' },
                { label: 'Intensity Balance', value: 'Optimal', color: 'bg-blue-400 dark:bg-blue-500' },
                { label: 'Next Focus Area', value: 'Endurance', color: 'bg-purple-400 dark:bg-purple-500' },
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)', transition: { duration: 0.2 } }} // TODO: Adjust hover for dark mode
                  // Conditional metric card styling
                  className="bg-gray-50/70 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/40 transition-colors duration-200"
                >
                  {/* Conditional label text color */}
                  <div className="text-[11px] text-gray-600 dark:text-neutral-400 mb-1 font-medium font-inter transition-colors">{metric.label}</div>
                  {/* Conditional value text color */}
                  <div className="text-base md:text-lg text-gray-900 dark:text-white font-semibold mb-2.5 font-inter transition-colors">{metric.value}</div>
                  {/* Conditional progress bar styling (color defined in array) */}
                  <div className={`w-full h-1 rounded-full ${metric.color} opacity-90 transition-colors`}></div>
                </motion.div>
              ))}
            </motion.div>

            {/* Conditional suggestion section styling */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="mt-7 bg-yellow-50/60 dark:bg-red-950/30 border border-yellow-200/50 dark:border-red-800/40 p-5 rounded-xl transition-colors"
            >
              <div className="flex items-start">
                {/* Conditional icon container styling */}
                <div className="h-7 w-7 rounded-full bg-yellow-100 dark:bg-red-900/40 flex items-center justify-center mr-3.5 flex-shrink-0 shadow-sm transition-colors">
                  {/* Conditional icon color */}
                  <FiPieChart className="h-3.5 w-3.5 text-yellow-700 dark:text-red-400 transition-colors" />
                </div>
                <div>
                  {/* Conditional suggestion text color */}
                  <p className="text-sm text-yellow-800 dark:text-red-200 font-medium leading-relaxed font-inter transition-colors">
                    <strong>Suggestion:</strong> Focus on interval training today to boost VO2 max. Our data shows optimal results with 5x800m sprints.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Minimalist Call to action */} 
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 md:mt-24 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            className="bg-yellow-500 hover:bg-yellow-500/90 dark:bg-red-600 dark:hover:bg-red-700 text-black dark:text-white px-7 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-yellow-500/20 dark:shadow-red-600/30 hover:shadow-lg hover:shadow-yellow-500/30 dark:hover:shadow-red-600/40 font-inter"
          >
            Access Your AI Dashboard
          </motion.button>
          <p className="mt-4 text-xs text-gray-500 dark:text-neutral-400 font-medium font-inter">Powered by advanced machine learning algorithms.</p>
        </motion.div>
      </div>
    </section>
  );
} 