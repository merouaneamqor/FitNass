'use client';

import { useTheme } from 'next-themes';
import { FiMoon, FiSun } from 'react-icons/fi';

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="fixed right-4 top-4 z-50">
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-full ${
          theme === 'dark' 
            ? 'bg-neutral-800 text-yellow-400 hover:bg-neutral-700' 
            : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
        } transition-colors shadow-md`}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
      </button>
    </div>
  );
} 