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
        'fann-gold': '#D4AF76', // Metallic Gold - Primary Accent
        'fann-peach': '#E5E5E5', // Platinum/Light Gray - Text & Subtle backgrounds
        'fann-teal': '#0F0F0F', // Almost Black - Main Background
        'fann-teal-dark': '#050505', // Pure Black - Deep Backgrounds
        'fann-accent-teal': '#262626', // Dark Charcoal - Secondary Backgrounds/Cards
        'fann-charcoal': '#1a1a1a', // Standard Charcoal
        'fann-charcoal-light': '#2c2c2c',
        'fann-light-gray': '#9CA3AF', // Muted text
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
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
        }
      }
    },
  },
  plugins: [
    typography,
  ],
}