'use client';

import { FiCpu, FiBarChart2, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

type Feature = {
  icon: JSX.Element;
  title: string;
  description: string;
};

type FeaturesSectionProps = {
  features?: Feature[];
};

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  // Updated features with conditional accent colors
  const defaultFeatures = [
    {
      icon: <FiCpu className="h-8 w-8 text-red-500 dark:text-red-600 transition-colors" />,
      title: "AI-Powered Matching",
      description: "Our intelligent algorithm analyzes your fitness goals, training history, and preferences to recommend the perfect venues and coaches that match your unique needs."
    },
    {
      icon: <FiBarChart2 className="h-8 w-8 text-red-500 dark:text-red-600 transition-colors" />,
      title: "Smart Performance Analytics",
      description: "Track your progress with advanced metrics and visualizations. Our AI system identifies patterns in your training data to suggest optimization strategies for faster results."
    },
    {
      icon: <FiTrendingUp className="h-8 w-8 text-red-500 dark:text-red-600 transition-colors" />,
      title: "Predictive Training Insights",
      description: "Receive personalized recommendations based on real-time data analysis from thousands of similar athletes. The platform continuously learns from performance patterns to enhance your journey."
    }
  ];

  const displayFeatures = features || defaultFeatures;

  return (
    // Conditional background
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          {/* Conditional heading text color */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas text-gray-900 dark:text-white uppercase tracking-wider mb-4 transition-colors">
            Data-Driven <span className="text-yellow-500 dark:text-yellow-400 transition-colors">Fitness Optimization</span>
          </h2>
          {/* Conditional paragraph text color */}
          <p className="text-base md:text-lg text-gray-700 dark:text-neutral-300 font-medium max-w-2xl mx-auto transition-colors">
            FitNass leverages machine learning to transform your fitness journey through intelligent data analysis and personalized insights.
          </p>
        </div>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {displayFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              // Conditional card styles: background, border, shadow, hover border
              className="flex flex-col items-center text-center p-6 md:p-8 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl hover:border-yellow-400 dark:hover:border-yellow-500"
            >
              {/* Conditional icon background and border */}
              <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 border border-gray-200 dark:border-gray-700 transition-colors">
                {feature.icon}
              </div>
              {/* Conditional title text color */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center transition-colors">{feature.title}</h3>
              {/* Conditional description text color */}
              <p className="text-gray-600 dark:text-neutral-400 text-sm text-center transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 