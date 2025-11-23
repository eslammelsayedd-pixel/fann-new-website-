import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: 'fade-up' | 'parallax' | 'scale' | 'blur';
  delay?: number;
  className?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, variant = 'fade-up', delay = 0, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], [100, -100]);
  
  const variants = {
    'fade-up': {
      hidden: { opacity: 0, y: 60 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay } }
    },
    'scale': {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut", delay } }
    },
    'blur': {
      hidden: { opacity: 0, filter: 'blur(20px)', y: 20 },
      visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 1, ease: "easeOut", delay } }
    }
  };

  if (variant === 'parallax') {
    return (
      <motion.div ref={ref} style={{ y: yParallax }} className={className}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[variant] as any}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;