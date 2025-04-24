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
    // Use a cleaner, lighter background
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-20">
          <motion.h2
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bebas text-gray-900 uppercase tracking-wider mb-4"
          >
            {/* Softer gradient for the highlight */}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-600">Smart</span> Analytics Dashboard
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-base md:text-lg text-gray-600 font-medium max-w-2xl mx-auto font-inter"
          >
            Gain personalized insights and optimization strategies powered by our AI analysis of your workout data.
          </motion.p>
        </div>

        {/* Increased gap for more whitespace */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12"
        >
          {/* First visualization - Activity tracking - Apple-inspired Card */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            // Softer background, subtle border, minimal shadow
            className="bg-white p-7 md:p-9 rounded-2xl border border-gray-200/70 shadow-[0_3px_15px_rgba(0,0,0,0.03)]"
          >
            <div className="flex items-center justify-between mb-7">
              <h3 className="text-xl font-semibold text-gray-800 uppercase tracking-wide">Workout Performance</h3>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2 font-medium font-inter">Last 7 days</span>
                <FiActivity className="h-5 w-5 text-yellow-600" />
              </div>
            </div>

            {/* Minimalist Activity chart */} 
            <div className="h-60 w-full relative">
              {/* Fainter grid lines */} 
              <div className="absolute inset-0 h-[85%] w-full">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="absolute border-t border-gray-100/90 left-0 right-0"
                    style={{ top: `${index * 25}%`, height: '1px' }}
                  />
                ))}
              </div>

              {/* Simplified bars */} 
              <div className="absolute bottom-0 left-0 right-0 h-[85%] flex items-end border-b border-gray-200/60">
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
                    {/* Ensure this container has full height and aligns bar at the bottom */}
                    <div className="relative w-full h-full flex flex-col items-center justify-end">
                      {/* Simplified tooltip */}
                      <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="bg-gray-800/90 text-white text-[11px] font-medium py-1 px-2.5 rounded-md shadow-md whitespace-nowrap">
                          {day.value}% performance
                        </div>
                        <div className="w-1.5 h-1.5 bg-gray-800/90 transform rotate-45 mx-auto -mt-0.5"></div>
                      </div>

                      {/* Single color bar with smoother animation */}
                      <motion.div
                        initial={{ height: '0%' }}
                        whileInView={{ height: `${day.value}%` }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.9, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }} // Smoother cubic-bezier ease
                        // Thinner bar, softer color
                        className="w-3/5 bg-yellow-400 rounded-t"
                        style={{ originY: 1 }} // Animate height from bottom
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clean X-axis labels */} 
              <div className="absolute bottom-[-22px] left-0 right-0 flex justify-around text-[11px] text-gray-500/90 font-medium px-1 font-inter">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <span key={index} className="text-center w-8">{day}</span>
                ))}
              </div>

              {/* Clean Y-axis labels */} 
              <div className="absolute left-[-10px] top-0 h-[85%] flex flex-col justify-between text-[11px] text-gray-500/90 font-medium pr-2 font-inter">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
            </div>

            {/* Simplified progression info */}
            <div className="mt-10 flex items-center justify-between bg-gray-50/70 rounded-lg px-4 py-2.5 border border-gray-200/50">
              <span className="text-xs text-gray-700 font-medium font-inter">Weekly progression</span>
              <span className="text-xs bg-green-100/80 text-green-700 font-semibold px-2 py-0.5 rounded-full flex items-center font-inter">
                <FiTrendingUp className="h-3 w-3 mr-1 inline-block stroke-2" />
                +23%
              </span>
            </div>
          </motion.div>

          {/* Second visualization - Performance metrics - Apple-inspired Card */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            // Consistent card styling
            className="bg-white p-7 md:p-9 rounded-2xl border border-gray-200/70 shadow-[0_3px_15px_rgba(0,0,0,0.03)]"
          >
            <div className="flex items-center justify-between mb-7">
              <h3 className="text-xl font-semibold text-gray-800 uppercase tracking-wide">AI Recommendations</h3>
              {/* Minimalist info icon */}
              <div className="p-1.5 rounded-full bg-yellow-100/70">
                <FiInfo className="h-4 w-4 text-yellow-700" />
              </div>
            </div>

            {/* Minimalist Metrics grid */}
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-2 gap-5"
            >
              {[
                { label: 'Optimal Training Time', value: '6:00 PM', color: 'bg-yellow-400' },
                { label: 'Recovery Quality', value: '87%', color: 'bg-green-400' },
                { label: 'Intensity Balance', value: 'Optimal', color: 'bg-blue-400' },
                { label: 'Next Focus Area', value: 'Endurance', color: 'bg-purple-400' },
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)', transition: { duration: 0.2 } }} // subtle hover on gray-50
                  className="bg-gray-50/70 p-4 rounded-xl border border-gray-200/50 transition-colors duration-200"
                >
                  <div className="text-[11px] text-gray-600 mb-1 font-medium font-inter">{metric.label}</div>
                  <div className="text-base md:text-lg text-gray-900 font-semibold mb-2.5 font-inter">{metric.value}</div>
                  {/* Simplified thin progress bar */}
                  <div className={`w-full h-1 rounded-full ${metric.color} opacity-90`}></div>
                </motion.div>
              ))}
            </motion.div>

            {/* Minimalist Activity suggestion */} 
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="mt-7 bg-yellow-50/60 border border-yellow-200/50 p-5 rounded-xl"
            >
              <div className="flex items-start">
                <div className="h-7 w-7 rounded-full bg-yellow-100 flex items-center justify-center mr-3.5 flex-shrink-0 shadow-sm">
                  <FiPieChart className="h-3.5 w-3.5 text-yellow-700" />
                </div>
                <div>
                  <h4 className="text-sm text-gray-800 font-semibold mb-1 font-inter">AI Training Insight</h4>
                  <p className="text-xs text-gray-600 leading-relaxed font-inter">Increase HIIT sessions to 3x weekly to optimize results based on your recent performance data.</p>
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
            className="bg-yellow-500 hover:bg-yellow-500/90 text-black px-7 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-yellow-500/20 hover:shadow-lg hover:shadow-yellow-500/30 font-inter"
          >
            Access Your AI Dashboard
          </motion.button>
          <p className="mt-4 text-xs text-gray-500 font-medium font-inter">Powered by advanced machine learning algorithms.</p>
        </motion.div>
      </div>
    </section>
  );
} 