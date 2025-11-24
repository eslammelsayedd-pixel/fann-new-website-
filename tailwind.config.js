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
        'fann-charcoal': '#0F0F0F', // Deepest Black/Grey for Main Backgrounds
        'fann-charcoal-light': '#1A1A1A', // Secondary Backgrounds (Cards)
        'fann-charcoal-lighter': '#262626', // Hover states
        'fann-grey': '#E5E5E5', // Primary Text (High Clarity)
        'fann-grey-muted': '#A3A3A3', // Secondary Text
        'fann-gold': '#C9A962', // Refined Gold Accent
        'fann-gold-light': '#E5C580',
        'fann-white': '#FFFFFF',
        'fann-border': 'rgba(255, 255, 255, 0.1)',
        // Legacy mappings re-routed to dark theme palette
        'fann-peach': '#0F0F0F', 
        'fann-teal': '#E5E5E5', 
        'fann-teal-dark': '#0A0A0A',
        'fann-accent-teal': '#C9A962',
        'fann-light-gray': '#D4D4D4', // Improved contrast from A3A3A3
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
        'subtle-dark': 'radial-gradient(circle at center, #1F1F1F 0%, #0F0F0F 100%)',
      }
    },
  },
  plugins: [
    typography,
  ],
}