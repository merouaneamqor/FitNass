'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight, FiStar, FiCpu } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Testimonial type
export type Testimonial = {
  id: number;
  name: string;
  comment: string;
  image: string;
  rating: number;
  city: string;
  profession?: string;
};

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

export default function TestimonialsSection({ testimonials: initialTestimonials }: TestimonialsSectionProps) {
  // Use default testimonials if none provided
  const defaultTestimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah J.',
      profession: 'Fitness Enthusiast',
      comment: 'The AI fitness matcher found me the perfect gym with exactly the equipment I needed. Their algorithm understood my training style better than I did!',
      image: 'https://randomuser.me/api/portraits/women/12.jpg',
      rating: 5,
      city: 'Casablanca'
    },
    {
      id: 2,
      name: 'Ahmed M.',
      profession: 'Marathon Runner',
      comment: 'The data analytics showed me patterns in my training I never noticed. Following the AI recommendations improved my marathon time by 15 minutes.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5,
      city: 'Rabat'
    },
    {
      id: 3,
      name: 'Leila K.',
      profession: 'Crossfit Trainer',
      comment: "As a trainer, the AI insights help me customize programs for my clients. The platform's predictive analytics anticipate needs before they arise!",
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 5,
      city: 'Marrakech'
    }
  ];

  const testimonials = initialTestimonials.length > 0 ? initialTestimonials : defaultTestimonials;
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    // Light background for the section
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          {/* Darker heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas text-gray-900 uppercase tracking-wider mb-4">
            Data-Driven <span className="text-yellow-500">Success Stories</span>
          </h2>
          {/* Adjusted paragraph text color */}
          <p className="text-base md:text-lg text-gray-700 font-medium max-w-2xl mx-auto">
            Hear from athletes who transformed their fitness journey with our AI-powered platform
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-1">
                  <motion.div 
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0.8 }}
                    transition={{ duration: 0.3 }}
                    // Light card background, increased padding, softer shadow
                    className="bg-gray-50 rounded-xl p-8 md:p-10 border border-gray-200 shadow-sm max-w-3xl mx-auto"
                  >
                    <div className="flex items-center mb-5">
                      <FiCpu className="h-5 w-5 text-yellow-600 mr-3" />
                      <span className="text-xs uppercase tracking-wider text-yellow-700 font-semibold">AI-Powered Results</span>
                    </div>
                    
                    {/* Adjusted quote text color */}
                    <p className="text-lg md:text-xl text-gray-800 mb-8 italic font-medium">"{testimonial.comment}"</p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex items-center mb-4 sm:mb-0">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                          <Image 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          {/* Adjusted name text color */}
                          <h4 className="text-gray-900 font-semibold">{testimonial.name}</h4>
                          <div className="flex items-center flex-wrap">
                            {/* Adjusted city text color */}
                            <span className="text-gray-600 text-sm mr-2">{testimonial.city}</span>
                            {testimonial.profession && (
                              // Lighter tag background
                              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium mt-1 sm:mt-0">
                                {testimonial.profession}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Rating stars - adjusted colors */}
                      <div className="flex flex-shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < testimonial.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                            } mr-1`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls - Updated styling */}
          {testimonials.length > 1 && (
            <div className="flex justify-center items-center mt-8 gap-4">
              <button 
                onClick={prevTestimonial}
                className="h-10 w-10 rounded-full bg-white text-gray-600 hover:text-gray-900 flex items-center justify-center border border-gray-300 hover:border-gray-400 transition-colors shadow-sm"
                aria-label="Previous testimonial"
              >
                <FiChevronLeft className="h-5 w-5"/>
              </button>
              {/* Dots indicator */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                      index === activeIndex ? 'bg-yellow-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button 
                onClick={nextTestimonial}
                className="h-10 w-10 rounded-full bg-white text-gray-600 hover:text-gray-900 flex items-center justify-center border border-gray-300 hover:border-gray-400 transition-colors shadow-sm"
                aria-label="Next testimonial"
              >
                <FiChevronRight className="h-5 w-5"/>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 