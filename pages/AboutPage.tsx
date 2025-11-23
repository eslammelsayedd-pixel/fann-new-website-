import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "url": "https://fann.ae/about",
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://fann.ae/about"
    },
    "about": {
        "@type": "Organization",
        "@id": "https://fann.ae"
    }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
  },
} as const;

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 50 },
  },
} as const;


const AboutPage: React.FC = () => {
    const aboutImageUrl = "https://images.pexels.com/photos/8199563/pexels-photo-8199563.jpeg?auto=compress&cs=tinysrgb&w=1260&q=75";
  return (
    <AnimatedPage>
        <SEO
            title="About FANN | Dubai's Premier Design & Build Partner"
            description="Founded in 2019, FANN is a full-service design and build company in Dubai, dedicated to transforming visions into unforgettable realities with innovation and excellence."
            schema={aboutPageSchema}
        />
      <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
        <motion.div 
            className="container mx-auto px-4 sm:px-6 lg:px-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <div className="text-center">
            <motion.h1 variants={itemVariants} className="text-5xl font-serif font-bold text-fann-gold mb-4">About FANN</motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Founded in Dubai in 2019, FANN was born from a passion for transforming visions into tangible, unforgettable realities. As a full-service design and build company, we believe that a well-executed project—from initial concept to final construction—has the power to inspire, connect, and drive success.
            </motion.p>
          </div>
           <motion.div variants={itemVariants} className="mt-12 mb-16">
            <picture>
                <source srcSet={`${aboutImageUrl}&fm=webp`} type="image/webp" />
                <source srcSet={aboutImageUrl} type="image/jpeg" />
                <img 
                    src={aboutImageUrl} 
                    alt="The diverse FANN team of Arab and Indian professionals collaborating in a modern Dubai office." 
                    className="rounded-lg shadow-2xl mx-auto opacity-90" 
                    loading="lazy"
                    width="1260"
                    height="840"
                />
            </picture>
          </motion.div>
          <motion.div variants={itemVariants} className="max-w-3xl mx-auto text-lg text-gray-300 space-y-6 text-left leading-loose">
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