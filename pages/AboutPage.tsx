import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

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
        <SEO
            title="About FANN | Dubai's Premier Design & Build Partner"
            description="Founded in 2019, FANN is a full-service design and build company in Dubai, dedicated to transforming visions into unforgettable realities with innovation and excellence."
        />
      <div className="min-h-screen bg-fann-peach dark:bg-fann-teal pt-32 pb-20 text-fann-teal dark:text-fann-peach">
        <motion.div 
            className="container mx-auto px-4 sm:px-6 lg:px-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <div className="text-center">
            <motion.h1 variants={itemVariants} className="text-5xl font-serif font-bold text-fann-accent-teal dark:text-fann-gold mb-4">About FANN</motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-fann-teal/90 dark:text-fann-peach/90 max-w-3xl mx-auto leading-relaxed">
              Founded in Dubai in 2019, FANN was born from a passion for transforming visions into tangible, unforgettable realities. As a full-service design and build company, we believe that a well-executed project—from initial concept to final construction—has the power to inspire, connect, and drive success.
            </motion.p>
          </div>
           <motion.div variants={itemVariants} className="mt-12 mb-16">
            <img src="https://images.pexels.com/photos/8199563/pexels-photo-8199563.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="The diverse FANN team of Arab and Indian professionals collaborating in a modern Dubai office." className="rounded-lg shadow-xl mx-auto" />
          </motion.div>
          <motion.div variants={itemVariants} className="max-w-3xl mx-auto text-lg text-fann-teal dark:text-fann-peach/95 space-y-6 text-left leading-loose">
            <p>
              Our philosophy is built on a dual commitment: relentless innovation and uncompromising excellence. We merge cutting-edge technology and global design trends with a deep understanding of the regional culture and market. This unique synthesis allows us to deliver experiences that are not only visually stunning but also strategically sound and culturally resonant.
            </p>
            <p>
              At the heart of FANN is our diverse team of strategists, designers, architects, and project managers. Hailing from across the globe, our experts bring a wealth of international experience to every project, ensuring world-class standards are met with precise local execution. We are more than just designers; we are a complete design and build partner, dedicated to bringing our clients' stories to life with creativity, precision, and expert craftsmanship.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default AboutPage;