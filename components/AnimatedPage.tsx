import React from 'react';
// FIX: Removed the 'Transition' type import as it was causing type errors.
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

// FIX: Removed the explicit 'Transition' type annotation to allow TypeScript's
// type inference to correctly handle the object, resolving the build error.
const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.5,
};

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
