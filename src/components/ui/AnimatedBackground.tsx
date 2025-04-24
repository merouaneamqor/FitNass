'use client';

import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <motion.div
      className="absolute inset-0 z-0"
      animate={{
        background: [
          'linear-gradient(150deg, #fdfdfe 0%, #fbfbfc 100%)',
          'linear-gradient(150deg, #fbfbfc 0%, #f9fafc 100%)',
          'linear-gradient(150deg, #f9fafc 0%, #fbfbfc 100%)',
          'linear-gradient(150deg, #fbfbfc 0%, #fdfdfe 100%)',
        ]
      }}
      transition={{
        duration: 25,
        ease: "linear",
        repeat: Infinity,
      }}
    />
  );
} 