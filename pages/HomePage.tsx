import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Wrench, Users, Headset, ShieldCheck, CheckCircle, ArrowRight, ChevronRight, Star } from 'lucide-react';
import { testimonials } from '../constants';
import SEO from '../components/SEO';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

// --- CONCEPT 5: Cinematic Depth-of-Field Showcase ---
const HeroSection: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for mouse movement (Parallax)
    const springConfig = { damping: 25, stiffness: 100 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    // Parallax transforms
    const bgX = useTransform(x, [-1, 1], ["-2%", "2%"]); // Background moves opposite
    const bgY = useTransform(y, [-1, 1], ["-2%", "2%"]);
    const textX = useTransform(x, [-1, 1], ["1%", "-1%"]); // Text moves slightly with mouse

    const slides = [
        {
            id: 1,
            image: "https://images.pexels.com/photos/3052725/pexels-photo-3052725.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80", // Architect/Design sketch vibe
            label: "CONCEPTUALIZE",
            title: "Visionary Design",
            subtitle: "It starts with a spark. We turn abstract ideas into award-winning 3D concepts.",
            color: "from-blue-900/40"
        },
        {
            id: 2,
            image: "https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80", // Fabrication/Workshop
            label: "CONSTRUCT",
            title: "Precision Build",
            subtitle: "Crafted in our state-of-the-art UAE workshop with obsessive attention to detail.",
            color: "from-amber-900/40"
        },
        {
            id: 3,
            image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80", // The Event/Booth
            label: "EXPERIENCE",
            title: "World-Class Events",
            subtitle: "Dominating the floor at GITEX, Arab Health, and The Big 5.",
            color: "from-purple-900/40"
        },
        {
            id: 4,
            image: "https://images.pexels.com/photos/1181438/pexels-photo-1181438.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80", // Success/Handshake
            label: "SUCCEED",
            title: "Measurable ROI",
            subtitle: "Elevating brands and driving business growth across the Middle East.",
            color: "from-emerald-900/40"
        }
    ];

    useEffect(() => {
        // Preload images
        const imagePromises = slides.map(slide => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = slide.image;
                img.onload = resolve;
                img.onerror = reject;
            });
        });

        Promise.all(imagePromises).then(() => setIsLoaded(true));

        // Slide rotation
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);

        return () => clearInterval(timer);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        // Normalize mouse position to -1 to 1
        mouseX.set((clientX / innerWidth) * 2 - 1);
        mouseY.set((clientY / innerHeight) * 2 - 1);
    };

    if (!isLoaded) {
        return (
            <div className="h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-fann-gold border-t-transparent rounded-full animate-spin mb-4"></div>
                    <span className="text-fann-gold text-xs tracking-[0.3em] uppercase animate-pulse">Loading Experience</span>
                </div>
            </div>
        );
    }

    return (
        <section 
            className="relative h-screen w-full overflow-hidden bg-black"
            onMouseMove={handleMouseMove}
        >
            {/* Cinematic Background Carousel */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={slides[currentSlide].id}
                    className="absolute inset-0 z-0"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    style={{ x: bgX, y: bgY }} // Parallax effect applied to background
                >
                    <div className="absolute inset-0 bg-black/40 z-10" /> {/* Base Dimmer */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${slides[currentSlide].color} via-transparent to-black/90 z-10 mix-blend-overlay`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20" /> {/* Bottom Fade */}
                    
                    <img 
                        src={slides[currentSlide].image} 
                        alt={slides[currentSlide].title}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Floating Particles / Bokeh Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen animate-pulse" />

            {/* Main Content */}
            <div className="absolute inset-0 z-30 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
                <motion.div 
                    className="max-w-5xl mx-auto text-center"
                    style={{ x: textX, y: useTransform(y, [-1, 1], ["0.5%", "-0.5%"]) }} // Subtle foreground parallax
                >
                    {/* Dynamic Label */}
                    <div className="overflow-hidden mb-6 flex justify-center">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={slides[currentSlide].label}
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -40, opacity: 0 }}
                                transition={{ duration: 0.5, ease: "circOut" }}
                                className="inline-block px-4 py-1 border border-fann-gold/50 rounded-full text-fann-gold text-xs md:text-sm font-bold tracking-[0.3em] uppercase bg-black/30 backdrop-blur-sm"
                            >
                                {slides[currentSlide].label}
                            </motion.span>
                        </AnimatePresence>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tight leading-[1.1] mb-8 drop-shadow-2xl">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-400">
                            ELEVATING BRANDS
                        </span>
                        <span className="block text-2xl md:text-4xl lg:text-5xl font-sans font-light tracking-[0.2em] mt-4 text-gray-200">
                            THROUGH WORLD-CLASS EXHIBITIONS
                        </span>
                    </h1>

                    {/* Dynamic Subtitle */}
                    <div className="h-16 md:h-12 mb-12 overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={slides[currentSlide].subtitle}
                                initial={{ opacity: 0, filter: "blur(10px)" }}
                                animate={{ opacity: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, filter: "blur(10px)" }}
                                transition={{ duration: 0.8 }}
                                className="text-lg md:text-xl text-gray-300 font-light max-w-3xl mx-auto"
                            >
                                {slides[currentSlide].subtitle}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    {/* CTAs */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                    >
                        <Link to="/contact">
                            <button className="group relative bg-fann-gold text-black font-bold text-sm tracking-[0.2em] uppercase py-5 px-10 overflow-hidden rounded-none hover:shadow-[0_0_40px_rgba(212,175,118,0.6)] transition-all duration-300">
                                <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                                <span className="relative z-10 flex items-center gap-3">
                                    Start Your Project <ArrowRight size={18} />
                                </span>
                            </button>
                        </Link>
                        <Link to="/portfolio">
                            <button className="group relative bg-transparent border border-white/30 text-white font-bold text-sm tracking-[0.2em] uppercase py-5 px-10 overflow-hidden transition-all duration-300 hover:bg-white hover:text-black hover:border-white backdrop-blur-sm">
                                <span className="relative z-10 flex items-center gap-3">
                                    View Portfolio <Users size={18} />
                                </span>
                            </button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Slide Progress Indicators */}
            <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center gap-3">
                {slides.map((slide, index) => (
                    <button
                        key={slide.id}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1 transition-all duration-500 rounded-full ${currentSlide === index ? 'w-12 bg-fann-gold' : 'w-4 bg-white/30 hover:bg-white/50'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Scroll Hint */}
            <motion.div 
                className="absolute bottom-8 right-8 z-30 hidden lg:flex flex-col items-center gap-2 text-white/50 mix-blend-difference"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
            >
                <span className="text-[10px] uppercase tracking-widest rotate-90 origin-right translate-x-2">Scroll</span>
                <div className="w-[1px] h-12 bg-white/30 overflow-hidden">
                    <motion.div 
                        className="w-full h-full bg-white"
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                </div>
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