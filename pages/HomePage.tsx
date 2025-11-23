import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Wrench, Users, Headset, ShieldCheck, CheckCircle, Calendar, ArrowRight, Sparkles, Play, ChevronRight } from 'lucide-react';
import { testimonials, regionalEvents } from '../constants';
import SEO from '../components/SEO';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

const HeroSection: React.FC = () => {
    // Parallax effect for hero content
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <section className="relative h-screen min-h-[800px] flex items-center overflow-hidden bg-fann-teal">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-fann-teal/40 z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/80 z-10" />
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover scale-105"
                    poster="https://images.pexels.com/photos/3058926/pexels-photo-3058926.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                >
                    <source src="https://player.vimeo.com/external/371843339.sd.mp4?s=d448100569762141979b1836792348395270214c&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
                    {/* Fallback Image if video fails */}
                    <img src="https://images.pexels.com/photos/3058926/pexels-photo-3058926.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Architecture Background" />
                </video>
            </div>

            <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left: Main Brand Messaging */}
                    <motion.div style={{ y: y1 }} className="text-left">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <span className="h-px w-12 bg-fann-gold"></span>
                                <span className="text-fann-gold font-bold uppercase tracking-[0.2em] text-sm">
                                    Dubai's Premier Design & Build
                                </span>
                            </div>
                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.1] text-white mb-8">
                                Crafting <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fann-gold to-fann-peach">Experiences.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-10 font-light leading-relaxed">
                                Award-winning exhibition stands, corporate events, and luxury interiors. We merge human expertise with AI innovation to build the extraordinary.
                            </p>
                            
                            <div className="flex flex-wrap gap-4">
                                <Link to="/portfolio">
                                    <button className="group relative px-8 py-4 bg-transparent border border-white/30 text-white font-bold rounded-full overflow-hidden transition-all hover:border-fann-gold hover:text-fann-gold">
                                        <span className="absolute inset-0 w-0 bg-white/5 transition-all duration-[250ms] ease-out group-hover:w-full"></span>
                                        <span className="relative flex items-center gap-2">View Portfolio <ArrowRight size={18} /></span>
                                    </button>
                                </Link>
                                <Link to="/contact">
                                    <button className="px-8 py-4 bg-fann-gold text-fann-charcoal font-bold rounded-full shadow-[0_0_20px_rgba(212,175,118,0.3)] hover:shadow-[0_0_30px_rgba(212,175,118,0.5)] transition-all hover:scale-105">
                                        Get a Quote
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right: FANN Studio Integration Card */}
                    <motion.div style={{ y: y2 }} className="hidden lg:block">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="relative"
                        >
                            {/* Decorative Elements */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-fann-gold to-fann-accent-teal rounded-2xl blur opacity-30 animate-pulse"></div>
                            
                            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-20">
                                    <Sparkles size={120} className="text-fann-gold" />
                                </div>
                                
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fann-gold to-orange-500 flex items-center justify-center shadow-lg">
                                        <Sparkles size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-serif font-bold text-white">FANN Studio</h3>
                                        <p className="text-xs text-fann-gold uppercase tracking-widest font-bold">AI-Powered Design</p>
                                    </div>
                                </div>

                                <p className="text-gray-300 mb-6 relative z-10">
                                    Visualize your next project in seconds. Use our proprietary AI tools to generate concepts for exhibitions, events, and interiors instantly.
                                </p>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                        <span className="text-sm text-gray-200">Instant 3D Concepts</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                        <span className="text-sm text-gray-200">Smart Budget Estimation</span>
                                    </div>
                                </div>

                                <Link to="/fann-studio" className="block w-full">
                                    <button className="w-full py-4 bg-gradient-to-r from-fann-gold to-[#bfa172] text-fann-charcoal font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg">
                                        <Play size={18} fill="currentColor" /> Launch Studio
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
            >
                <span className="text-xs uppercase tracking-widest">Scroll to Explore</span>
                <div className="w-px h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0"></div>
            </motion.div>
        </section>
    );
};

const WhyChooseFann: React.FC = () => {
    const features = [
        { icon: ShieldCheck, title: "DMCC Licensed", description: "Fully compliant and insured for total peace of mind." },
        { icon: Award, title: "6+ Years Expertise", description: "Deep knowledge of UAE & KSA venues and regulations." },
        { icon: Users, title: "200+ Projects", description: "A proven track record of delivering excellence." },
        { icon: Wrench, title: "In-House Build", description: "Complete control over quality and timelines." },
        { icon: Headset, title: "Turnkey Solutions", description: "End-to-end management from concept to dismantling." },
    ];
    return (
        <section className="py-32 bg-white dark:bg-[#0d2125] text-center relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                <ScrollReveal variant="blur">
                    <span className="text-fann-gold font-bold uppercase tracking-widest text-sm mb-4 block">The FANN Advantage</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-fann-teal dark:text-fann-peach">Why Leading Brands Choose Us</h2>
                    <p className="max-w-3xl mx-auto text-fann-teal/70 dark:text-gray-400 mb-16 text-lg">
                        We don't just build stands; we engineer success. Our in-house capabilities and DMCC licensing ensure a seamless, risk-free experience.
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <ScrollReveal key={feature.title} variant="scale" delay={index * 0.1}>
                            <div className="group p-6 rounded-2xl bg-fann-peach/20 dark:bg-white/5 hover:bg-white dark:hover:bg-fann-accent-teal transition-all duration-300 hover:shadow-xl border border-transparent hover:border-fann-gold/20">
                                <div className="w-16 h-16 mx-auto mb-6 bg-white dark:bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-8 h-8 text-fann-accent-teal dark:text-fann-gold" />
                                </div>
                                <h3 className="text-lg font-bold text-fann-teal dark:text-fann-peach mb-3">{feature.title}</h3>
                                <p className="text-fann-teal/70 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ServicesOverview: React.FC = () => (
    <section className="py-32 bg-fann-peach/30 dark:bg-[#0A1F22]">
        <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-2 items-center gap-16">
                <ScrollReveal variant="fade-up">
                    <span className="text-fann-accent-teal dark:text-fann-gold font-bold uppercase tracking-widest text-sm mb-2 block">Our Expertise</span>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-fann-teal dark:text-white leading-tight">
                        Comprehensive <br/> Design Solutions
                    </h2>
                    <p className="text-fann-teal/80 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                        From the bustling aisles of GITEX to the exclusive corridors of private villas, we deliver excellence. Our <strong>Turnkey Services</strong> cover everything from initial <Link to="/fann-studio" className="text-fann-gold hover:underline">AI-powered concepts</Link> to final fabrication.
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8 mb-10">
                        {["Custom Stand Design", "Modular Systems", "Turnkey Management", "In-House Fabrication", "AV & Lighting", "Interior Fit-Out"].map((service, i) => (
                            <div key={service} className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-fann-gold flex-shrink-0" />
                                <span className="font-medium text-fann-teal dark:text-fann-peach">{service}</span>
                            </div>
                        ))}
                    </div>

                     <Link to="/services">
                        <button className="flex items-center gap-2 text-fann-accent-teal dark:text-fann-gold font-bold uppercase tracking-wider group">
                            Explore All Services 
                            <span className="bg-fann-accent-teal dark:bg-fann-gold text-white dark:text-fann-charcoal w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform">
                                <ChevronRight size={16} />
                            </span>
                        </button>
                    </Link>
                </ScrollReveal>

                <div className="relative">
                    <ScrollReveal variant="parallax" className="relative z-10">
                        <img 
                            src="https://images.pexels.com/photos/8199563/pexels-photo-8199563.jpeg?auto=compress&cs=tinysrgb&w=800&q=75" 
                            alt="FANN Team"
                            className="rounded-lg shadow-2xl w-full max-w-md ml-auto"
                        />
                    </ScrollReveal>
                    <ScrollReveal variant="scale" delay={0.2} className="absolute -bottom-10 left-0 z-20 hidden md:block">
                        <div className="bg-white dark:bg-fann-accent-teal p-6 rounded-lg shadow-xl max-w-xs border-l-4 border-fann-gold">
                            <p className="text-4xl font-bold text-fann-teal dark:text-white mb-1">200+</p>
                            <p className="text-sm text-gray-500 dark:text-gray-300">Successful projects delivered across UAE & KSA.</p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </div>
    </section>
);

const EventsSection: React.FC = () => (
    <section className="py-32 bg-fann-teal dark:bg-black text-center relative">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
         <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal variant="fade-up">
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white">We Dominate The Major Venues</h2>
                <p className="max-w-2xl mx-auto text-gray-400 mb-12">
                    Our extensive experience at DWTC, ADNEC, and Riyadh Front ensures a smooth, compliant, and stress-free exhibition experience.
                </p>
            </ScrollReveal>

            <ScrollReveal variant="scale">
                <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
                    {["GITEX Global", "Gulfood", "Arab Health", "The Big 5", "ATM", "ADIPEC", "Cityscape"].map((evt) => (
                        <Link key={evt} to="/events-calendar" className="group">
                            <div className="px-8 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-fann-gold hover:border-fann-gold transition-all duration-300">
                                <span className="font-bold text-gray-300 group-hover:text-fann-charcoal transition-colors">{evt}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </ScrollReveal>
            
            <div className="mt-16">
                 <Link to="/events-calendar" className="text-fann-gold hover:text-white transition-colors underline decoration-fann-gold underline-offset-4">
                    View Full Events Calendar
                 </Link>
            </div>
        </div>
    </section>
);


const TestimonialsSection: React.FC = () => (
    <section className="py-32 bg-fann-peach dark:bg-[#0F2A2F]">
        <div className="container mx-auto px-4">
            <ScrollReveal variant="fade-up">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-fann-teal dark:text-fann-peach">Client Success Stories</h2>
                    <div className="w-24 h-1 bg-fann-gold mx-auto"></div>
                </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {testimonials.map((testimonial, i) => (
                    <ScrollReveal key={i} variant="fade-up" delay={i * 0.1}>
                        <div className="bg-white dark:bg-[#153338] p-10 rounded-tl-3xl rounded-br-3xl shadow-lg relative h-full">
                            <div className="absolute top-6 left-6 text-6xl text-fann-gold/20 font-serif">"</div>
                            <p className="italic text-fann-teal/80 dark:text-gray-300 mb-8 relative z-10 leading-relaxed">
                                {testimonial.quote}
                            </p>
                            <div className="mt-auto border-t border-gray-100 dark:border-white/10 pt-6">
                                <p className="font-bold text-fann-accent-teal dark:text-fann-gold text-lg">{testimonial.client}</p>
                                <p className="text-sm text-gray-500">{testimonial.company}</p>
                                <p className="text-xs text-fann-gold mt-1 uppercase tracking-wide">{testimonial.projectType}</p>
                            </div>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
        </div>
    </section>
);


const HomePage: React.FC = () => {
    return (
        <div className="bg-fann-peach dark:bg-fann-teal overflow-x-hidden">
            <SEO
                title="Exhibition Stand Builders Dubai | FANN - Custom Stands UAE"
                description="Award-winning exhibition stand builders in Dubai. 200+ successful stands for GITEX, Gulfood, Arab Health. DMCC licensed. Same-day quote. Call +971-50-566-7502"
            />
            <HeroSection />
            <WhyChooseFann />
            <ServicesOverview />
            <EventsSection />
            <TestimonialsSection />
            
            {/* Final CTA Strip */}
            <section className="py-20 bg-fann-gold">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-fann-charcoal mb-6">Ready to stand out from the crowd?</h2>
                    <Link to="/contact">
                        <button className="bg-fann-charcoal text-white font-bold py-4 px-12 rounded-full text-lg shadow-2xl hover:scale-105 transition-transform">
                            Start Your Project
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;