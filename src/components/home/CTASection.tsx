'use client';

import Link from 'next/link';
import { FiActivity } from 'react-icons/fi';

type CTASectionProps = {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
};

export default function CTASection({
  title = "Ready to Start Your Fitness Journey?",
  description = "Join thousands of members who have found their perfect gym through FitNass. Sign up today and transform your fitness experience.",
  primaryButtonText = "Find Your Venue",
  primaryButtonUrl = "/gyms",
  secondaryButtonText = "Sign Up Free",
  secondaryButtonUrl = "/auth/signup"
}: CTASectionProps) {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <FiActivity className="h-16 w-16 mx-auto mb-6 text-indigo-600" />
        <h2 className="text-3xl font-bold mb-4 text-gray-900">{title}</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-600">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={primaryButtonUrl}
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-md"
          >
            {primaryButtonText}
          </Link>
          <Link
            href={secondaryButtonUrl}
            className="inline-block bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all"
          >
            {secondaryButtonText}
          </Link>
        </div>
      </div>
    </section>
  );
} 