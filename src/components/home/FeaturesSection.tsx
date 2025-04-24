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
  // Updated features with accent colors
  const defaultFeatures = [
    {
      icon: <FiCpu className="h-8 w-8 text-red-600" />,
      title: "AI-Powered Matching",
      description: "Our intelligent algorithm analyzes your fitness goals, training history, and preferences to recommend the perfect venues and coaches that match your unique needs."
    },
    {
      icon: <FiBarChart2 className="h-8 w-8 text-red-600" />,
      title: "Smart Performance Analytics",
      description: "Track your progress with advanced metrics and visualizations. Our AI system identifies patterns in your training data to suggest optimization strategies for faster results."
    },
    {
      icon: <FiTrendingUp className="h-8 w-8 text-red-600" />,
      title: "Predictive Training Insights",
      description: "Receive personalized recommendations based on real-time data analysis from thousands of similar athletes. The platform continuously learns from performance patterns to enhance your journey."
    }
  ];

  const displayFeatures = features || defaultFeatures;

  return (
    // White background for a clean look
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          {/* Darker heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas text-gray-900 uppercase tracking-wider mb-4">
            Data-Driven <span className="text-yellow-500">Fitness Optimization</span>
          </h2>
          {/* Adjusted paragraph text color */}
          <p className="text-base md:text-lg text-gray-700 font-medium max-w-2xl mx-auto">
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
              // White card background, subtle border, increased roundedness, softer shadow, hover effect
              className="flex flex-col items-center text-center p-6 md:p-8 rounded-xl bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-yellow-400"
            >
              {/* Lighter icon background */}
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 border border-gray-200">
                {feature.icon}
              </div>
              {/* Corrected text size to lg, removed uppercase */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{feature.title}</h3>
              {/* Adjusted description text color */}
              <p className="text-gray-600 text-sm text-center">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 