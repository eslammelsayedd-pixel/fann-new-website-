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

const HeroSection: React.FC = () => {
    const [contentIndex, setContentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setContentIndex(prevIndex => (prevIndex + 1) % dynamicContent.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden bg-fann-charcoal">
            <model-viewer
                src="https://cdn.glitch.global/e8040d12-4f3b-487c-87d2-069a72172777/exhibition_stand.glb?v=1718890003223"
                alt="Interactive 3D model of a modern exhibition stand"
                camera-controls
                auto-rotate
                ar
                shadow-intensity="1.2"
                exposure="0.9"
                environment-image="neutral"
                class="absolute top-0 left-0 w-full h-full"
            >
                <button class="hotspot" slot="hotspot-1" data-position="-1.6m 1m -1.5m" data-normal="0m 1m 0m">
                    <div class="annotation">
                        <h4 class="font-bold text-fann-gold">Lead Generation Hub</h4>
                        <p class="text-xs text-fann-cream">Reception desks designed to attract and qualify leads efficiently.</p>
                    </div>
                </button>
                 <button class="hotspot" slot="hotspot-2" data-position="2.5m 1.5m 1m" data-normal="0m 1m 0m">
                    <div class="annotation">
                         <h4 class="font-bold text-fann-gold">Private Meeting Space</h4>
                        <p class="text-xs text-fann-cream">Integrated rooms for high-level discussions and closing deals.</p>
                    </div>
                </button>
                <button class="hotspot" slot="hotspot-3" data-position="0m 2m 2.8m" data-normal="0m 0m -1m">
                    <div class="annotation">
                        <h4 class="font-bold text-fann-gold">Immersive AV</h4>
                        <p class="text-xs text-fann-cream">State-of-the-art video walls for impactful brand storytelling.</p>
                    </div>
                </button>
            </model-viewer>

            <div className="relative z-10 p-4" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-serif font-extrabold leading-tight md:leading-snug"
                >
                    <span className="block font-bold">Transforming Visions Into</span>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={contentIndex}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.7 }}
                            className="text-fann-gold inline-block mt-2 md:mt-4"
                        >
                            {dynamicContent[contentIndex].headline}
                        </motion.span>
                    </AnimatePresence>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-fann-cream"
                >
                    Premier Exhibition, Event & Interior Design Innovators
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link to="/fann-studio">
                        <motion.button 
                            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(212, 175, 118, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-fann-gold text-fann-charcoal font-bold py-4 px-10 rounded-full text-lg uppercase tracking-wider transition-all duration-300 w-full sm:w-auto"
                        >
                            Design with FANN
                        </motion.button>
                    </Link>
                    <Link to="/portfolio">
                         <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="border-2 border-fann-gold text-fann-gold font-bold py-4 px-10 rounded-full text-lg uppercase tracking-wider transition-all duration-300 w-full sm:w-auto"
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
                <ArrowDown className="w-8 h-8 text-fann-gold" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.7))' }}/>
            </motion.div>
        </section>
    );
};

const ServiceCard: React.FC<{ icon: React.ReactNode; title: string; description: string; link: string; }> = ({ icon, title, description, link }) => (
    <motion.div 
        whileHover="hover"
        initial="rest"
        className="relative p-8 bg-fann-charcoal-light rounded-lg overflow-hidden border border-fann-border"
    >
        <motion.div className="absolute inset-0 bg-gradient-to-br from-fann-teal/20 to-transparent opacity-0" variants={{ hover: { opacity: 1 }, rest: { opacity: 0 } }} transition={{ duration: 0.5 }} />
        <div className="relative z-10">
            <div className="text-fann-gold mb-4">{icon}</div>
            <h3 className="text-2xl font-serif font-bold mb-2">{title}</h3>
            <p className="text-fann-light-gray mb-6">{description}</p>
            <Link to={link} className="font-semibold text-fann-gold hover:underline">Learn More &rarr;</Link>
        </div>
    </motion.div>
);

const HomePage: React.FC = () => {
    return (
        <AnimatedPage>
            <SEO
                title="Premier Exhibition, Events & Interior Design in Dubai"
                description="FANN transforms visions into unforgettable experiences. Discover our world-class exhibition stand design, event management, and luxury interior design services in Dubai and the GCC."
            >
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "FANN",
                        "url": "https://fann-new-website.web.app/",
                        "logo": "https://fann-new-website.web.app/favicon.svg",
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "telephone": "+971-0-000-0000",
                            "contactType": "customer service"
                        },
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Dubai Design District",
                            "addressLocality": "Dubai",
                            "addressCountry": "AE"
                        }
                    })}
                </script>
            </SEO>
            <HeroSection />

            <div className="py-20 bg-fann-charcoal">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Services Section */}
                    <section className="text-center">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-12">Our Expertise</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <ServiceCard icon={<Layers size={40} />} title="Exhibitions" description="Crafting immersive brand pavilions that captivate audiences and drive business." link="/services" />
                            <ServiceCard icon={<Calendar size={40} />} title="Events" description="Executing flawless corporate events, from grand openings to global summits." link="/services" />
                            <ServiceCard icon={<PenTool size={40} />} title="Interior Design" description="Designing inspiring commercial and residential spaces with a touch of luxury." link="/services" />
                        </div>
                    </section>

                    {/* FANN Studio Section */}
                    <section className="mt-24 text-center bg-fann-charcoal-light rounded-lg py-16 px-8">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-fann-gold mb-4">Visualize Your Vision in Minutes</h2>
                        <p className="max-w-2xl mx-auto text-fann-cream mb-8">Our revolutionary FANN Studio allows you to configure your exhibition stand, see it in 3D, and get instant pricing. Innovation at your fingertips.</p>
                        <div className="mb-8">
                           <img src="https://images.unsplash.com/photo-1677708511494-1b157aa7a104?w=1000&q=80" alt="3D model of a modern exhibition stand generated by FANN Studio" className="rounded-lg shadow-2xl mx-auto" />
                        </div>
                         <Link to="/fann-studio">
                           <motion.button 
                                whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(212, 175, 118, 0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider"
                            >
                                Try It Now - Free
                            </motion.button>
                        </Link>
                    </section>
                    
                    {/* Featured Projects Section */}
                    <section className="mt-24">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-12">Featured Projects</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {portfolioProjects.slice(0, 6).map(project => (
                                <div key={project.id} className="group relative overflow-hidden rounded-lg">
                                    <img src={project.image} alt={project.title} className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-6">
                                        <span className="text-sm bg-fann-gold text-fann-charcoal font-bold py-1 px-2 rounded">{project.service}</span>
                                        <h3 className="text-xl font-bold mt-2 text-white">{project.title}</h3>
                                        <p className="text-fann-cream">{project.client}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-12">
                             <Link to="/portfolio">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    className="border-2 border-fann-gold text-fann-gold font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider"
                                >
                                    View Full Portfolio
                                </motion.button>
                            </Link>
                        </div>
                    </section>
                    
                    {/* Testimonials Section */}
                    <section className="mt-24 text-center">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-12">What Our Clients Say</h2>
                        <div className="relative max-w-3xl mx-auto">
                            <div className="bg-fann-charcoal-light p-8 rounded-lg">
                                <Star className="text-fann-gold mx-auto mb-4" size={32} />
                                <p className="text-xl italic text-fann-cream mb-6">"{testimonials[0].quote}"</p>
                                <h4 className="font-bold text-white text-lg">{testimonials[0].client}</h4>
                                <p className="text-fann-light-gray">{testimonials[0].company}</p>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="mt-24 text-center bg-gradient-to-r from-fann-teal to-fann-gold p-1 rounded-lg">
                         <div className="bg-fann-charcoal rounded-lg py-16 px-8">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Ready to Create Something Extraordinary?</h2>
                            <p className="max-w-2xl mx-auto text-fann-cream mb-8">Let's discuss how we can bring your vision to life. Schedule a complimentary consultation with our experts today.</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                               <Link to="/contact">
                                  <motion.button 
                                      whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(212, 175, 118, 0.5)" }}
                                      whileTap={{ scale: 0.95 }}
                                      className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider w-full sm:w-auto"
                                  >
                                      Book Consultation
                                  </motion.button>
                                </Link>
                                <Link to="/fann-studio">
                                   <motion.button 
                                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                      className="border-2 border-fann-gold text-fann-gold font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider w-full sm:w-auto"
                                  >
                                      Start Designing
                                  </motion.button>
                                </Link>
                            </div>
                         </div>
                    </section>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default HomePage;