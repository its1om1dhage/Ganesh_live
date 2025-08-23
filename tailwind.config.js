/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'navy': '#0a192f',
        'gold': '#FFD700',
        'saffron': '#FF9933',
        'marigold': '#FFC24B',
        'slate': '#8892b0',
        'light-navy': '#112240',
      },
      fontFamily: {
        heading: ["'Lustria'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      backdropBlur: {
        'xl': '24px',
      },
      // NEW: Add a keyframe for shifting gradients
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      },
      // NEW: Add the animation utility
      animation: {
        gradientShift: 'gradientShift 6s ease infinite',
      },
    },
  },
  plugins: [],
};