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
        'fann-gold': '#D4AF76',
        'fann-peach': '#FCE5D4',
        'fann-teal': '#0F2A2F',
        'fann-teal-dark': '#0A1F22',
        'fann-accent-teal': '#2D767F',
        'fann-charcoal': '#1a1a1a',
        'fann-charcoal-light': '#2c2c2c',
        'fann-light-gray': '#A99E96',
        'fann-accent-peach': '#EAD2C0',
        'fann-border': '#333333',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [
    typography,
  ],
}