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
        'fann-charcoal': '#1A1A1A', // Primary Dark
        'fann-charcoal-light': '#262626', // Lighter Dark for cards
        'fann-charcoal-dark': '#111111', // Deepest Dark
        'fann-grey': '#F5F5F5', // Primary Light Text
        'fann-gold': '#C9A962', // Refined Gold Accent
        'fann-gold-light': '#E5C580',
        'fann-white': '#FFFFFF',
        'fann-border': 'rgba(255, 255, 255, 0.1)',
        // Preserving existing variable names but mapping to dark theme palette or accents
        'fann-peach': '#1A1A1A', // Re-mapped to dark for safety
        'fann-teal': '#F5F5F5', // Re-mapped to light text for safety
        'fann-teal-dark': '#111111',
        'fann-accent-teal': '#C9A962', // Map accent teal to gold for consistency
        'fann-light-gray': '#A3A3A3',
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      container: {
        center: true,
        padding: '1.5rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
        }
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A962 0%, #E5C580 100%)',
        'subtle-dark': 'radial-gradient(circle at center, #2A2A2A 0%, #1A1A1A 100%)',
      }
    },
  },
  plugins: [
    typography,
  ],
}