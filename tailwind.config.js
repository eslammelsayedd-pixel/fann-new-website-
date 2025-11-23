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
        'fann-charcoal-light': '#2A2A2A',
        'fann-grey': '#F5F5F5', // Primary Light
        'fann-gold': '#C9A962', // Refined Gold Accent
        'fann-gold-light': '#E5C580',
        'fann-white': '#FFFFFF',
        'fann-border': 'rgba(255, 255, 255, 0.1)',
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
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
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