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
        'fann-gold': '#D4AF37', // Metallic Gold
        'fann-gold-light': '#F4D06F', // Light Gold Reflection
        'fann-chrome': '#E0E0E0', // Liquid Chrome
        'fann-black': '#0A0A0A', // Deep Black
        'fann-charcoal': '#151515',
        'fann-dark-glass': 'rgba(10, 10, 10, 0.8)',
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
        'liquid-pulse': 'liquidPulse 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
        },
        liquidPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: 0.8 },
          '50%': { transform: 'scale(1.05)', opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        }
      },
      backgroundImage: {
        'liquid-gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F4D06F 25%, #996515 50%, #D4AF37 75%, #F4D06F 100%)',
        'chrome-gradient': 'linear-gradient(135deg, #E0E0E0 0%, #FFFFFF 50%, #A0A0A0 100%)',
      }
    },
  },
  plugins: [
    typography,
  ],
}