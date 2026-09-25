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
        // Palette is driven by CSS variables (see index.css) so the
        // day/night ThemeToggle can switch themes at runtime.
        'fann-charcoal': 'rgb(var(--fann-charcoal) / <alpha-value>)', // Main Backgrounds
        'fann-charcoal-light': 'rgb(var(--fann-charcoal-light) / <alpha-value>)', // Secondary Backgrounds (Cards)
        'fann-charcoal-lighter': 'rgb(var(--fann-charcoal-lighter) / <alpha-value>)', // Hover states
        'fann-grey': 'rgb(var(--fann-grey) / <alpha-value>)', // Primary Text
        'fann-grey-muted': 'rgb(var(--fann-grey-muted) / <alpha-value>)', // Secondary Text
        'fann-gold': 'rgb(var(--fann-gold) / <alpha-value>)', // Refined Gold Accent
        'fann-gold-light': 'rgb(var(--fann-gold-light) / <alpha-value>)',
        'fann-white': 'rgb(var(--fann-white) / <alpha-value>)',
        'fann-border': 'var(--fann-border)',
        // Legacy mappings follow the same variables
        'fann-peach': 'rgb(var(--fann-peach) / <alpha-value>)',
        'fann-teal': 'rgb(var(--fann-teal) / <alpha-value>)',
        'fann-teal-dark': 'rgb(var(--fann-teal-dark) / <alpha-value>)',
        'fann-accent-teal': 'rgb(var(--fann-accent-teal) / <alpha-value>)',
        'fann-light-gray': 'rgb(var(--fann-light-gray) / <alpha-value>)',
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
        'subtle-dark': 'var(--fann-gradient-subtle)',
      }
    },
  },
  plugins: [
    typography,
  ],
}
