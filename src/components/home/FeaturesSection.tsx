'use client';

import { FiSearch, FiCalendar, FiUsers } from 'react-icons/fi';
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
  // Default features if none provided
  const defaultFeatures = [
    {
      icon: <FiSearch className="h-8 w-8 text-indigo-600" />,
      title: "Find Fitness Venues",
      description: "Discover gyms and sports clubs based on location, facilities, and pricing. Filter by amenities, pricing, and user ratings."
    },
    {
      icon: <FiCalendar className="h-8 w-8 text-indigo-600" />,
      title: "Book Online",
      description: "Reserve sports fields, classes, and personal training sessions with real-time availability. Receive instant confirmations."
    },
    {
      icon: <FiUsers className="h-8 w-8 text-indigo-600" />,
      title: "Community Verified",
      description: "Read authentic reviews from real members. View high-quality photos and detailed information about facilities."
    }
  ];

  const displayFeatures = features || defaultFeatures;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose FitNass?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to find and book the perfect fitness venue
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {displayFeatures.map((feature, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -10 }}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all"
            >
              <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 