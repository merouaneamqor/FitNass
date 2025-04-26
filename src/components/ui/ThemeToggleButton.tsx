'use client';

import { useTheme } from '@/context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a placeholder or null on the server/initial render
    return <div className="w-8 h-8" />; // Placeholder to prevent layout shift
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-1.5 rounded-full transition-colors duration-200 text-gray-500 hover:text-gray-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-gray-100 dark:hover:bg-red-950/30 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {theme === 'dark' ? (
        <FiSun className="h-5 w-5 drop-shadow-[0_0_3px_rgba(255,0,0,0.5)]" />
      ) : (
        <FiMoon className="h-5 w-5" />
      )}
    </motion.button>
  );
} 