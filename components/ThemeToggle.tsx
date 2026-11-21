import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const reduceMotion = useReducedMotion();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="w-11 h-11 shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fann-gold rounded-full flex items-center justify-center bg-gray-200/50 dark:bg-fann-charcoal-light hover:bg-gray-300/50 dark:hover:bg-fann-border transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        key={theme}
        aria-hidden="true"
        initial={reduceMotion ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={reduceMotion ? undefined : { y: 20, opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
      >
        {theme === 'dark' ? (
          <Sun className="text-fann-gold" />
        ) : (
          <Moon className="text-fann-teal" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
