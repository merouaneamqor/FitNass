'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Testimonial type
export type Testimonial = {
  id: number;
  name: string;
  comment: string;
  image: string;
  rating: number;
  city: string;
};

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied users who found their perfect fitness venue through FitNass
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={testimonial.id} 
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={`h-5 w-5 mr-1 ${i < testimonial.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.comment}"</p>
              <div className="flex items-center">
                <div className="h-14 w-14 rounded-full overflow-hidden">
                  <Image 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 p-6 md:p-8 bg-indigo-600 rounded-3xl text-white max-w-4xl mx-auto shadow-lg">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-2xl font-bold mb-3">Ready to find your perfect fitness space?</h3>
              <p className="text-indigo-100">
                Sign up today and get access to exclusive deals and promotions
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/auth/signup"
                className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold text-base hover:bg-gray-100 transition-all shadow-md"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 