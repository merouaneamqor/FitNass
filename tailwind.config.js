/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // New color scheme based on the image
        fitnass: {
          coral: '#ff5c5c',
          pink: '#ff0074',
          neon: '#e6ff00',
          dark: '#1a1a1a',
          light: '#ffffff',
        },
        // Gradient from coral to pink
        gradient: {
          start: '#ff5c5c',
          middle: '#ff3a6b',
          end: '#ff0074',
        },
        // Keep the original primary colors for backward compatibility
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      backgroundImage: {
        'gradient-fitnass': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      gradientColorStops: theme => ({
        ...theme('colors'),
        'fitnass-start': '#ff5c5c',
        'fitnass-end': '#ff0074',
      }),
    },
  },
  darkMode: 'class',
  plugins: [],
}

