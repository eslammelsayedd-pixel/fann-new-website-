import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Wrench, Users, Headset, ShieldCheck, CheckCircle, ArrowRight, ChevronRight, Mouse, Star, Zap } from 'lucide-react';
import { testimonials } from '../constants';
import SEO from '../components/SEO';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

const HeroSection: React.FC = () => {
    const { scrollY } = useScroll();
    const yText = useTransform(scrollY, [0, 500], [0, 150]);
    const opacityText = useTransform(scrollY, [0, 300], [1, 0]);

    const slides = [
        {
            image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80",
            text: "Exhibitions"
        },
        {
            image: "https://images.pexels.com/photos/2608516/pexels-photo-2608516.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80",
            text: "Global Events"
        },
        {
            image: "https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80",
            text: "Luxury Interiors"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 5000); 
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-fann-teal-dark">
            {/* Background Slideshow */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <img 
                            src={slides[currentIndex].image}
                            alt="FANN Project Background"
                            className="w-full h-full object-cover"
                        />
                        {/* Professional Dark Overlays for Text Readability */}
                        <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-fann-teal-dark/90" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Main Content */}
            <motion.div 
                style={{ y: yText, opacity: opacityText }}
                className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center"
            >
                <div className="max-w-6xl mx-auto flex flex-col items-center">
                    
                    {/* Animated Headline */}
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="mb-10"
                    >
                         <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold text-white tracking-tight uppercase leading-[0.9] mb-8 drop-shadow-2xl flex flex-col items-center">
                            <span className="block text-fann-gold/90 text-2xl md:text-4xl font-sans font-bold tracking-[0.3em] mb-4">Premier Design & Build</span>
                            <span className="block">For World-Class</span>
                            <span className="relative h-[1.2em] overflow-hidden min-w-[5ch] text-left inline-flex items-center mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-fann-gold to-white bg-200% animate-gradient">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={slides[currentIndex].text}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -100, opacity: 0 }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
                                    >
                                        {slides[currentIndex].text}
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                        </h1>
                        <p className="text-lg md:text-2xl text-gray-300 font-light tracking-wide max-w-3xl mx-auto border-t border-fann-gold/30 pt-8 mt-4 leading-relaxed">
                            Your trusted turnkey partner in Dubai & KSA for award-winning <span className="text-white font-medium">Exhibition Stands</span>, <span className="text-white font-medium">Corporate Events</span>, and <span className="text-white font-medium">Commercial Fit-Outs</span>.
                        </p>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-6"
                    >
                        <Link to="/portfolio">
                            <button className="group relative bg-fann-gold text-black font-bold text-sm tracking-[0.2em] uppercase py-5 px-12 overflow-hidden transition-transform duration-300 hover:scale-105 shadow-[0_0_30px_rgba(212,175,118,0.3)]">
                                <span className="relative z-10 flex items-center gap-3">
                                    View Projects <ArrowRight size={18} />
                                </span>
                            </button>
                        </Link>
                        <Link to="/contact">
                            <button className="group relative bg-transparent border border-white text-white font-bold text-sm tracking-[0.2em] uppercase py-5 px-12 overflow-hidden transition-colors duration-300 hover:bg-white hover:text-black hover:border-white backdrop-blur-sm">
                                <span className="relative z-10 flex items-center gap-3">
                                    Get A Quote <CheckCircle size={18} className="text-fann-gold group-hover:text-black"/>
                                </span>
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
            >
                <span className="text-[10px] uppercase tracking-widest text-fann-gold/70">Explore FANN</span>
                <div className="w-[1px] h-16 bg-gradient-to-b from-fann-gold/0 via-fann-gold to-fann-gold/0 opacity-50"></div>
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
        <section className="py-32 bg-[#0A0A0A] text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fann-accent-teal/20 via-[#0A0A0A] to-[#0A0A0A] pointer-events-none"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                <ScrollReveal variant="fade-up">
                    <span className="text-fann-gold font-bold uppercase tracking-widest text-xs mb-4 block">The FANN Distinction</span>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 text-white tracking-tight">Why Leading Brands Choose Us</h2>
                    <p className="max-w-3xl mx-auto text-gray-400 mb-20 text-lg font-light leading-relaxed">
                        We don't just build stands; we engineer success. Our in-house capabilities and DMCC licensing ensure a seamless, risk-free experience.
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-px bg-white/10 border border-white/10">
                    {features.map((feature, index) => (
                        <ScrollReveal key={feature.title} variant="fade-up" delay={index * 0.1}>
                            <div className="group bg-[#0A0A0A] p-10 h-full flex flex-col items-center justify-center hover:bg-white/5 transition-colors duration-500">
                                <div className="mb-6 text-gray-500 group-hover:text-fann-gold transition-colors duration-300 transform group-hover:scale-110">
                                    <feature.icon className="w-12 h-12" strokeWidth={1} />
                                </div>
                                <h3 className="text-lg font-serif font-bold text-white mb-3 tracking-wide">{feature.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ServicesOverview: React.FC = () => (
    <section className="py-32 bg-fann-teal relative border-t border-white/5">
        <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-2 items-center gap-20">
                <ScrollReveal variant="fade-up">
                    <span className="text-fann-gold font-bold uppercase tracking-widest text-xs mb-2 block">Our Expertise</span>
                    <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 text-white leading-tight">
                        Comprehensive <br/> Design Solutions
                    </h2>
                    <p className="text-gray-400 mb-10 text-xl font-light leading-relaxed">
                        From the bustling aisles of GITEX to the exclusive corridors of private villas, we deliver excellence. Our <strong>Turnkey Services</strong> cover everything from initial <Link to="/fann-studio" className="text-fann-gold hover:underline">smart generated concepts</Link> to final fabrication.
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-y-6 gap-x-8 mb-12">
                        {["Custom Stand Design", "Modular Systems", "Turnkey Management", "In-House Fabrication", "AV & Lighting", "Interior Fit-Out"].map((service, i) => (
                            <div key={service} className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-fann-gold flex-shrink-0" />
                                <span className="font-medium text-gray-300 tracking-wide">{service}</span>
                            </div>
                        ))}
                    </div>

                     <Link to="/services">
                        <button className="flex items-center gap-2 text-white font-bold uppercase tracking-wider group hover:text-fann-gold transition-colors text-sm">
                            Explore All Services 
                            <span className="bg-white/10 group-hover:bg-fann-gold group-hover:text-black text-white w-10 h-10 flex items-center justify-center transition-all duration-300 rounded-full ml-4">
                                <ChevronRight size={18} />
                            </span>
                        </button>
                    </Link>
                </ScrollReveal>

                <div className="relative">
                    <ScrollReveal variant="parallax" className="relative z-10">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-fann-gold/0 group-hover:bg-fann-gold/10 transition-colors duration-500 z-10"></div>
                            <img 
                                src="https://images.pexels.com/photos/8199563/pexels-photo-8199563.jpeg?auto=compress&cs=tinysrgb&w=800&q=75" 
                                alt="FANN Team"
                                className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700 shadow-2xl"
                            />
                            <div className="absolute -inset-4 border border-white/10 -z-10 group-hover:inset-0 transition-all duration-500"></div>
                        </div>
                    </ScrollReveal>
                    <ScrollReveal variant="scale" delay={0.2} className="absolute -bottom-12 -left-12 z-20 hidden md:block">
                        <div className="bg-fann-charcoal p-10 shadow-2xl border border-white/10">
                            <p className="text-6xl font-serif font-bold text-white mb-2">200+</p>
                            <p className="text-xs text-fann-gold uppercase tracking-widest">Successful projects</p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </div>
    </section>
);

const EventsSection: React.FC = () => (
    <section className="py-32 bg-black text-center relative border-y border-white/5 overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-fann-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
         
         <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal variant="fade-up">
                <span className="text-fann-gold font-bold uppercase tracking-widest text-xs mb-4 block">Event Coverage</span>
                <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 text-white tracking-tight">We Dominate The Major Venues</h2>
                <p className="max-w-2xl mx-auto text-gray-500 mb-16 text-lg font-light">
                    Our extensive experience at DWTC, ADNEC, and Riyadh Front ensures a smooth, compliant, and stress-free exhibition experience.
                </p>
            </ScrollReveal>

            <ScrollReveal variant="scale">
                <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
                    {["GITEX Global", "Gulfood", "Arab Health", "The Big 5", "ATM", "ADIPEC", "Cityscape", "Intersec"].map((evt) => (
                        <Link key={evt} to="/events-calendar" className="group">
                            <div className="px-10 py-5 border border-white/10 bg-white/5 hover:bg-fann-gold hover:border-fann-gold hover:text-black transition-all duration-300 cursor-pointer backdrop-blur-sm">
                                <span className="font-bold text-gray-300 group-hover:text-black transition-colors uppercase tracking-wider text-sm">{evt}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </ScrollReveal>
            
            <div className="mt-20">
                 <Link to="/events-calendar" className="text-white hover:text-fann-gold transition-colors border-b border-fann-gold/50 hover:border-fann-gold pb-1 uppercase tracking-widest text-xs font-bold">
                    View Full Events Calendar
                 </Link>
            </div>
        </div>
    </section>
);


const TestimonialsSection: React.FC = () => (
    <section className="py-32 bg-fann-teal-dark relative">
        <div className="container mx-auto px-4">
            <ScrollReveal variant="fade-up">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4 text-white tracking-tight">Client Success</h2>
                    <div className="w-24 h-1 bg-fann-gold mx-auto mt-6"></div>
                </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {testimonials.map((testimonial, i) => (
                    <ScrollReveal key={i} variant="fade-up" delay={i * 0.1}>
                        <div className="bg-[#111] p-12 relative h-full border border-white/5 hover:border-fann-gold/30 transition-all duration-300 hover:-translate-y-2 group">
                            <div className="absolute top-8 left-8 text-6xl text-fann-gold/20 font-serif group-hover:text-fann-gold/40 transition-colors">"</div>
                            <div className="flex mb-4">
                                {[1,2,3,4,5].map(star => <Star key={star} size={14} className="text-fann-gold fill-fann-gold mr-1" />)}
                            </div>
                            <p className="text-gray-300 mb-8 relative z-10 leading-relaxed text-lg font-light italic">
                                {testimonial.quote}
                            </p>
                            <div className="mt-auto pt-6 border-t border-white/5 group-hover:border-fann-gold/20 transition-colors">
                                <p className="font-bold text-white text-lg uppercase tracking-wide">{testimonial.client}</p>
                                <p className="text-sm text-gray-500">{testimonial.company}</p>
                                <p className="text-xs text-fann-gold mt-2 uppercase tracking-wide font-bold">{testimonial.projectType}</p>
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
        <div className="bg-fann-teal-dark text-white overflow-x-hidden selection:bg-fann-gold selection:text-black">
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
            <section className="py-28 bg-fann-gold relative overflow-hidden">
                 <div className="absolute inset-0 bg-black/5 pattern-grid-lg opacity-20"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-serif font-black text-black mb-10 tracking-tight uppercase">Ready to stand out?</h2>
                    <Link to="/contact">
                        <button className="bg-black text-white font-bold py-6 px-16 text-lg hover:scale-105 transition-transform uppercase tracking-widest border border-black hover:bg-white hover:text-black rounded-none shadow-2xl">
                            Start Your Project
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;