import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Wrench, Users, Headset, ShieldCheck, CheckCircle, ArrowRight, ChevronRight, MousePointer2 } from 'lucide-react';
import { testimonials } from '../constants';
import SEO from '../components/SEO';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

const HeroSection: React.FC = () => {
    const { scrollY } = useScroll();
    const yText = useTransform(scrollY, [0, 500], [0, 150]);
    const opacityText = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-[#1a1a1a]">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#1a1a1a]/40 z-10" />
                {/* Linear Gradient Overlay: Black to Transparent to Black */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/80 via-transparent to-[#1a1a1a] z-10" />
                
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover scale-105 opacity-80"
                    poster="https://images.pexels.com/photos/3058926/pexels-photo-3058926.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                >
                    {/* Architectural / Interior Design Loop */}
                    <source src="https://player.vimeo.com/external/371843339.sd.mp4?s=d448100569762141979b1836792348395270214c&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
                </video>
            </div>

            {/* Main Content */}
            <motion.div 
                style={{ y: yText, opacity: opacityText }}
                className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center"
            >
                <div className="max-w-5xl mx-auto flex flex-col items-center">
                    
                    {/* Animated Intro Line */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-6"
                    >
                        <span className="text-white/80 text-sm md:text-base tracking-[0.3em] uppercase border-b border-fann-gold pb-2 font-medium">
                            Est. 2019 • Dubai, UAE
                        </span>
                    </motion.div>

                    {/* Main Headline - Bold Sans-Serif Industrial Look */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-black text-white leading-[1.1] tracking-tight mb-8">
                        <motion.span 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="block"
                        >
                            TRANSFORMING
                        </motion.span>
                        <motion.span 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400"
                        >
                            VISIONS INTO
                        </motion.span>
                        <motion.span 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="block text-fann-gold"
                        >
                            REALITY
                        </motion.span>
                    </h1>

                    {/* Subheadline */}
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="text-lg md:text-2xl text-gray-300 max-w-3xl mb-12 font-light leading-relaxed"
                    >
                        Premier Design & Build Partner for <span className="text-white font-medium">Exhibitions</span> and <span className="text-white font-medium">Luxury Interiors</span> in the UAE.
                    </motion.p>
                    
                    {/* CTA Buttons */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        className="flex flex-col sm:flex-row gap-6"
                    >
                        <Link to="/portfolio">
                            <button className="group relative px-10 py-4 bg-transparent border-2 border-fann-gold text-white font-bold text-sm tracking-[0.2em] uppercase overflow-hidden transition-all duration-300 hover:text-[#1a1a1a]">
                                <span className="absolute inset-0 w-full h-full bg-fann-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
                                <span className="relative flex items-center gap-3">
                                    View Our Portfolio <ArrowRight size={18} />
                                </span>
                            </button>
                        </Link>
                        
                        <Link to="/contact">
                            <button className="group relative px-10 py-4 bg-white text-[#1a1a1a] font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:bg-gray-200">
                                <span className="relative flex items-center gap-3">
                                    Get A Quote
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
                transition={{ duration: 1, delay: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
            >
                <span className="text-[10px] uppercase tracking-widest text-white/50">Scroll</span>
                <div className="w-[1px] h-16 bg-gradient-to-b from-fann-gold to-transparent opacity-60"></div>
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
        <section className="py-32 bg-white dark:bg-[#1a1a1a] text-center relative overflow-hidden">
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
                            <div className="group p-6 rounded-none border border-gray-100 dark:border-white/5 bg-fann-peach/20 dark:bg-white/5 hover:bg-white dark:hover:bg-fann-accent-teal transition-all duration-300 hover:shadow-xl hover:border-fann-gold/20">
                                <div className="w-16 h-16 mx-auto mb-6 bg-white dark:bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-8 h-8 text-fann-accent-teal dark:text-fann-gold" />
                                </div>
                                <h3 className="text-lg font-bold text-fann-teal dark:text-fann-peach mb-3 font-serif">{feature.title}</h3>
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
                        From the bustling aisles of GITEX to the exclusive corridors of private villas, we deliver excellence. Our <strong>Turnkey Services</strong> cover everything from initial <Link to="/fann-studio" className="text-fann-gold hover:underline">smart generated concepts</Link> to final fabrication.
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
                            <span className="bg-fann-accent-teal dark:bg-fann-gold text-white dark:text-fann-charcoal w-8 h-8 flex items-center justify-center group-hover:translate-x-2 transition-transform">
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
                            className="shadow-2xl w-full max-w-md ml-auto grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </ScrollReveal>
                    <ScrollReveal variant="scale" delay={0.2} className="absolute -bottom-10 left-0 z-20 hidden md:block">
                        <div className="bg-white dark:bg-fann-accent-teal p-6 shadow-xl max-w-xs border-l-4 border-fann-gold">
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
                            <div className="px-8 py-3 border border-white/20 bg-white/5 hover:bg-fann-gold hover:border-fann-gold transition-all duration-300">
                                <span className="font-bold text-gray-300 group-hover:text-fann-charcoal transition-colors uppercase tracking-wider text-sm">{evt}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </ScrollReveal>
            
            <div className="mt-16">
                 <Link to="/events-calendar" className="text-fann-gold hover:text-white transition-colors underline decoration-fann-gold underline-offset-4 uppercase tracking-widest text-sm">
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
                        <div className="bg-white dark:bg-[#153338] p-10 shadow-lg relative h-full border-t-4 border-fann-gold">
                            <div className="absolute top-6 left-6 text-6xl text-fann-gold/20 font-serif">"</div>
                            <p className="italic text-fann-teal/80 dark:text-gray-300 mb-8 relative z-10 leading-relaxed font-serif text-lg">
                                {testimonial.quote}
                            </p>
                            <div className="mt-auto border-t border-gray-100 dark:border-white/10 pt-6">
                                <p className="font-bold text-fann-accent-teal dark:text-fann-gold text-lg uppercase tracking-wide">{testimonial.client}</p>
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
        <div className="bg-fann-peach dark:bg-[#1a1a1a] overflow-x-hidden">
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
            <section className="py-24 bg-fann-gold">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-sans font-black text-fann-charcoal mb-8 tracking-tight uppercase">Ready to stand out?</h2>
                    <Link to="/contact">
                        <button className="bg-fann-charcoal text-white font-bold py-5 px-12 text-lg shadow-2xl hover:scale-105 transition-transform uppercase tracking-widest border border-fann-charcoal hover:bg-white hover:text-fann-charcoal">
                            Start Your Project
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;