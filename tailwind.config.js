/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'fann-gold': '#C5A059', // Slightly darker, more metallic gold for better contrast on white
        'fann-peach': '#EAEAEA', // Platinum
        'fann-teal': '#121212', // Rich Black
        'fann-teal-dark': '#050505', // Pure Black
        'fann-accent-teal': '#1E1E1E', // Charcoal
        'fann-charcoal': '#1a1a1a', 
        'fann-charcoal-light': '#2c2c2c',
        'fann-light-gray': '#9CA3AF',
        'fann-accent-peach': '#F5F5F5', 
        'fann-border': '#333333',
        'fann-error': '#EF4444',
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
      },
      container: {
        center: true,
        padding: '1rem',
      },
      animation: {
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [
    typography,
  ],
}