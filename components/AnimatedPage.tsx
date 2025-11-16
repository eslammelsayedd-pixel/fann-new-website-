import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

// FIX: To resolve the framer-motion type error, the explicit 'Transition' type annotation
// was removed. This allows TypeScript to correctly infer the literal type for
// the 'type' property (e.g., 'tween' instead of 'string').
// FIX: Add 'as const' to ensure TypeScript infers a literal type for 'type'.
const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.5,
} as const;

interface AnimatedPageProps {
  children: React.ReactNode;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;