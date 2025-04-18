'use client';

import Image from 'next/image';
// import Link from 'next/link'; // Removed Link as CTA is separate
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
    // Gunmetal Gray background, adjust padding
    <section className="py-16 md:py-24 bg-gunmetal-gray">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          {/* Bebas Neue heading, white text */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas text-white uppercase tracking-wider mb-4">
            COMMUNITY FEEDBACK
          </h2>
          {/* Poppins text, lighter */}
          <p className="text-base md:text-lg text-neutral-300 font-poppins max-w-2xl mx-auto">
            Hear from athletes who leveled up with FitNass.
          </p>
        </div>

        {/* Responsive grid for testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              // Jet Black card, subtle border, Red accent on hover (optional)
              className="flex flex-col bg-jet-black p-6 rounded-md shadow-lg border border-neutral-700/70 hover:border-blood-red transition-all duration-300"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`h-4 w-4 mr-1 ${
                      i < testimonial.rating
                        ? 'text-neon-yellow fill-current' // Neon Yellow stars
                        : 'text-neutral-600'
                    }`}
                  />
                ))}
              </div>
              {/* Poppins quote text */}
              <p className="text-neutral-200 mb-6 text-sm font-poppins flex-grow italic">
                &quot;{testimonial.comment}&quot;
              </p>
              <div className="flex items-center mt-auto pt-4 border-t border-neutral-700/50">
                <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-neutral-600">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="ml-3">
                  {/* Bebas Neue name, Poppins city */}
                  <h4 className="font-bebas text-lg uppercase tracking-wide text-white">{testimonial.name}</h4>
                  <p className="text-neutral-400 text-xs font-poppins">{testimonial.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Removed CTA block - will be handled by CTASection component */}
      </div>
    </section>
  );
} 