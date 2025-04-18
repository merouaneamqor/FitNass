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
  // Default features with updated styling classes
  const defaultFeatures = [
    {
      icon: <FiSearch className="h-8 w-8 text-blood-red" />, // Red icon
      title: "Pinpoint Your Perfect Venue",
      description: "Advanced search and filters to find gyms or clubs matching your exact needs – equipment, classes, location, and vibe."
    },
    {
      icon: <FiCalendar className="h-8 w-8 text-blood-red" />, // Red icon
      title: "Instant Booking & Scheduling",
      description: "Check real-time availability for courts, classes, or trainers. Book your spot instantly, no phone calls needed."
    },
    {
      icon: <FiUsers className="h-8 w-8 text-blood-red" />, // Red icon
      title: "Verified Reviews & Community",
      description: "Access genuine feedback and ratings from the FitNass community. Connect with other athletes and find training partners."
    }
  ];

  const displayFeatures = features || defaultFeatures;

  return (
    // Gunmetal Gray background
    <section className="py-16 md:py-24 bg-gunmetal-gray">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          {/* Bebas Neue heading, white text */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas text-white uppercase tracking-wider mb-4">
            Engineered for Performance
          </h2>
          {/* Poppins text */}
          <p className="text-base md:text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
            FitNass cuts through the noise. Find, book, and train – faster and smarter.
          </p>
        </div>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {displayFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              // Jet Black card, subtle border, maybe red/yellow accent on hover (optional)
              className="flex flex-col items-center text-center p-6 md:p-8 rounded-md bg-jet-black border border-neutral-700/70 shadow-md transition-all duration-300 hover:border-blood-red"
            >
              {/* Icon with dark background */}
              <div className="h-16 w-16 bg-gunmetal-gray rounded-full flex items-center justify-center mb-6 border border-neutral-600">
                {feature.icon}
              </div>
              {/* Bebas Neue title, white text */}
              <h3 className="text-2xl md:text-3xl font-bebas text-white uppercase tracking-wide mb-3">{feature.title}</h3>
              {/* Poppins description */}
              <p className="text-neutral-400 text-sm font-poppins">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 