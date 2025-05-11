'use client';

import React from 'react';

export const ScrollToPlansButton = ({ children }: { children: React.ReactNode }) => {
  const handleClick = () => {
    const plansSection = document.getElementById('pricing-plans');
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button 
      onClick={handleClick}
      className="inline-block bg-neon-yellow text-black font-bold py-4 px-8 rounded-md uppercase tracking-wider hover:brightness-95 transition-all duration-200 text-lg shadow-md"
    >
      {children}
    </button>
  );
};

export default ScrollToPlansButton; 