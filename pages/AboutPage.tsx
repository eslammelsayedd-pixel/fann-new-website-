import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 50 },
  },
};


const AboutPage: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="min-h-screen bg-fann-charcoal pt-32 text-white">
        <motion.div 
            className="container mx-auto px-4 sm:px-6 lg:px-8 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-5xl font-serif font-bold text-fann-gold mb-4">About FANN</motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-gray-300 max-w-3xl mx-auto">
            Founded on the principles of innovation and excellence, FANN is Dubai's leading force in creating spaces and events that tell a story. Our team of international experts brings global standards to local execution.
          </motion.p>
           <motion.div variants={itemVariants} className="mt-12">
            <img src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="FANN Team in a modern design office" className="rounded-lg shadow-xl" />
          </motion.div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default AboutPage;
