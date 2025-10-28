import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, Layers, Calendar, Star, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioProjects, testimonials } from '../constants';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';

const dynamicContent = [
    { headline: "Unforgettable Exhibitions" },
    { headline: "Flawless Events" },
    { headline: "Inspiring Interiors" }
];

const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FANN",
    "url": "https://fann.ae",
    "logo": "https://fann.ae/favicon.svg",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Office 508, Dusseldorf Business Point, Al Barsha 1",
        "addressLocality": "Dubai",
        "addressCountry": "AE"
    },
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+971505667502",
        "email": "sales@fann.ae",
        "contactType": "customer service"
    },
    "description": "FANN is a premier exhibition, events, and interior design company in Dubai, transforming visions into unforgettable experiences.",
    "sameAs": [
        "https://www.facebook.com/fannuae/",
        "https://www.instagram.com/fann_uae/",
        "https://ae.linkedin.com/company/fannaedubai",
        "https://fannae.quora.com/"
    ]
};


const HeroSection: React.FC = () => {
    const [contentIndex, setContentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setContentIndex(prevIndex => (prevIndex + 1) % dynamicContent.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section 
            className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.pexels.com/photos/1267696/pexels-photo-1267696.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
        >
            <div className="absolute inset-0 bg-fann-teal/80 backdrop-blur-sm"></div>

            <div className="relative z-10 p-4 w-full" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' }}>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-serif font-extrabold leading-tight md:leading-snug text-fann-peach"
                >
                    <span className="block font-bold">Transforming Visions Into</span>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={contentIndex}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.7 }}
                            className="text-fann-accent-peach inline-block mt-2 md:mt-4"
                        >
                            {dynamicContent[contentIndex].headline}
                        </motion.span>
                    </AnimatePresence>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-fann-peach/90"
                >
                    Your Premier Design and Build Partner for Exhibitions, Events & Interiors.
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link to="/fann-studio">
                        <motion.button 
                            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(249, 221, 200, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-fann-accent-peach text-fann-teal font-bold py-4 px-10 rounded-full text-lg uppercase tracking-wider transition-all duration-300 w-full sm:w-auto"
                        >
                            Design with FANN
                        </motion.button>
                    </Link>
                    <Link to="/portfolio">
                         <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="border-2 border-fann-accent-peach text-fann-accent-peach font-bold py-4 px-10 rounded-full text-lg uppercase tracking-wider transition-all duration-300 w-full sm:w-auto"
                        >
                            View Portfolio
                        </motion.button>
                    </Link>
                </motion.div>
            </div>

            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute bottom-10 z-20"
            >
                <ArrowDown className="w-8 h-8 text-fann-accent-peach" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.7))' }}/>
            </motion.div>
        </section>
    );
};

const sectionVariants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 40, duration: 0.8 },
  },
};

const cardContainerVariants = {
  offscreen: {},
  onscreen: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardItemVariants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 40 } },
};

const ServiceCard: React.FC<{ icon: React.ReactNode; title: string; description: string; link: string; }> = ({ icon, title, description, link }) => (
    <motion.div 
        variants={cardItemVariants}
        whileHover="hover"
        initial="rest"
        className="relative p-8 bg-white dark:bg-fann-teal-dark rounded-lg overflow-hidden border border-fann-teal/10 dark:border-fann-border shadow-md"
    >
        <motion.div className="absolute inset-0 bg-gradient-to-br from-fann-accent-teal/20 to-transparent opacity-0" variants={{ hover: { opacity: 1 }, rest: { opacity: 0 } }} transition={{ duration: 0.5 }} />
        <div className="relative z-10">
            <div className="text-fann-accent-teal dark:text-fann-accent-peach mb-4">{icon}</div>
            <h3 className="text-2xl font-serif font-bold mb-2 text-fann-teal dark:text-fann-peach">{title}</h3>
            <p className="text-fann-teal/80 dark:text-fann-light-gray mb-6">{description}</p>
            <Link to={link} className="font-semibold text-fann-accent-teal dark:text-fann-accent-peach hover:underline">Learn More &rarr;</Link>
        </div>
    </motion.div>
);

const HomePage: React.FC = () => {
    return (
        <AnimatedPage>
            <SEO
                title="Premier Design & Build in Dubai for Exhibitions & Interiors"
                description="FANN is a premier design and build company in Dubai. Discover our world-class exhibition stand construction, event management, and luxury interior fit-out services in the GCC."
                schema={homePageSchema}
            />
            <HeroSection />

            <div className="py-20 bg-fann-peach dark:bg-fann-teal">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Services Section */}
                    <motion.section 
                        className="text-center"
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <motion.h2 variants={sectionVariants} className="text-4xl md:text-5xl font-serif font-bold mb-12">Our Expertise</motion.h2>
                        <motion.div 
                            className="grid md:grid-cols-3 gap-8"
                            variants={cardContainerVariants}
                        >
                            <ServiceCard icon={<Layers size={40} />} title="Exhibitions" description="Designing and building immersive brand pavilions that captivate audiences and drive business." link="/services" />
                            <ServiceCard icon={<Calendar size={40} />} title="Events" description="Executing flawless corporate events, from grand openings to global summits." link="/services" />
                            <ServiceCard icon={<PenTool size={40} />} title="Interior Design" description="Designing and building inspiring commercial and residential spaces with a touch of luxury." link="/services" />
                        </motion.div>
                    </motion.section>

                    {/* FANN Studio Section */}
                    <motion.section 
                        className="mt-24 text-center bg-white dark:bg-fann-teal-dark rounded-lg py-16 px-8"
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={sectionVariants}
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-fann-accent-teal dark:text-fann-accent-peach mb-4">Visualize Your Vision in Minutes</h2>
                        <p className="max-w-2xl mx-auto text-fann-teal/90 dark:text-fann-peach mb-8">Our revolutionary FANN Studio allows you to configure your exhibition stand, see it in 3D, and get instant pricing. Innovation at your fingertips.</p>
                        <div className="mb-8">
                           <img src="https://images.pexels.com/photos/8112165/pexels-photo-8112165.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="A sleek, modern exhibition stand with integrated lighting and a hospitality bar, showcasing a 3D concept from FANN Studio." className="rounded-lg shadow-2xl mx-auto" />
                        </div>
                         <Link to="/fann-studio">
                           <motion.button 
                                whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(249, 221, 200, 0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-fann-accent-peach text-fann-teal font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider"
                            >
                                Try It Now - Free
                            </motion.button>
                        </Link>
                    </motion.section>
                    
                    {/* Featured Projects Section */}
                    <motion.section 
                        className="mt-24"
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <motion.h2 variants={sectionVariants} className="text-4xl md:text-5xl font-serif font-bold text-center mb-12">Featured Projects</motion.h2>
                        <motion.div 
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                            variants={cardContainerVariants}
                        >
                            {portfolioProjects.slice(0, 6).map(project => (
                                <motion.div 
                                    key={project.id} 
                                    className="group relative overflow-hidden rounded-lg"
                                    variants={cardItemVariants}
                                >
                                    <img src={project.image} alt={project.title} className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-6">
                                        <span className="text-sm bg-fann-accent-peach text-fann-teal font-bold py-1 px-2 rounded">{project.service}</span>
                                        <h3 className="text-xl font-bold mt-2 text-white">{project.title}</h3>
                                        <p className="text-fann-peach">{project.client}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                        <div className="text-center mt-12">
                             <Link to="/portfolio">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    className="border-2 border-fann-accent-teal dark:border-fann-accent-peach text-fann-accent-teal dark:text-fann-accent-peach font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider"
                                >
                                    View Full Portfolio
                                </motion.button>
                            </Link>
                        </div>
                    </motion.section>
                    
                    {/* Testimonials Section */}
                    <motion.section 
                        className="mt-24 text-center"
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={sectionVariants}
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-12">What Our Clients Say</h2>
                        <div className="relative max-w-3xl mx-auto">
                            <div className="bg-white dark:bg-fann-teal-dark p-8 rounded-lg">
                                <Star className="text-fann-accent-peach mx-auto mb-4" size={32} />
                                <p className="text-xl italic text-fann-teal/90 dark:text-fann-peach mb-6">"{testimonials[0].quote}"</p>
                                <h4 className="font-bold text-fann-teal dark:text-fann-peach text-lg">{testimonials[0].client}</h4>
                                <p className="text-fann-light-gray">{testimonials[0].company}</p>
                            </div>
                        </div>
                    </motion.section>

                    {/* CTA Section */}
                    <motion.section 
                        className="mt-24 text-center bg-gradient-to-r from-fann-accent-teal to-fann-accent-peach p-1 rounded-lg"
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={sectionVariants}
                    >
                         <div className="bg-white dark:bg-fann-teal rounded-lg py-16 px-8">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-fann-teal dark:text-fann-peach">Ready to Create Something Extraordinary?</h2>
                            <p className="max-w-2xl mx-auto text-fann-teal/90 dark:text-fann-peach/90 mb-8">Let's discuss how our design and build expertise can bring your vision to life. Schedule a complimentary consultation with our experts today.</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                               <Link to="/contact">
                                  <motion.button 
                                      whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(249, 221, 200, 0.5)" }}
                                      whileTap={{ scale: 0.95 }}
                                      className="bg-fann-accent-peach text-fann-teal font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider w-full sm:w-auto"
                                  >
                                      Book Consultation
                                  </motion.button>
                                </Link>
                                <Link to="/fann-studio">
                                   <motion.button 
                                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                      className="border-2 border-fann-accent-teal dark:border-fann-accent-peach text-fann-accent-teal dark:text-fann-accent-peach font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider w-full sm:w-auto"
                                  >
                                      Start Designing
                                  </motion.button>
                                </Link>
                            </div>
                         </div>
                    </motion.section>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default HomePage;