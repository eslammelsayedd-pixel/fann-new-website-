import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Wrench, Users, Headset, ShieldCheck, CheckCircle, Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials, regionalEvents } from '../constants';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';

const heroSlides = [
    {
        id: 1,
        image: "https://images.pexels.com/photos/8112165/pexels-photo-8112165.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        title: "Exhibition Stand Builders",
        subtitle: "Award-winning custom designs for GITEX, Arab Health & more.",
        cta: "Get a Stand Quote"
    },
    {
        id: 2,
        image: "https://images.pexels.com/photos/2422290/pexels-photo-2422290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        title: "Corporate Event Experts",
        subtitle: "Flawless execution for galas, launches & global summits.",
        cta: "Plan Your Event"
    },
    {
        id: 3,
        image: "https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        title: "Luxury Interior Design",
        subtitle: "Transforming commercial & residential spaces across the UAE.",
        cta: "View Interiors"
    }
];

const HeroSection: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [nextEvent, setNextEvent] = useState<{ name: string, startDate: Date, venue: string } | null>(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Carousel Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

    // Countdown Logic
    useEffect(() => {
        const today = new Date();
        // Find the next upcoming event
        const upcoming = regionalEvents
            .map(e => {
                try {
                    // Simple parser for formats like "Oct 14-18, 2024" or "Sep 26 - Oct 5, 2024"
                    const yearMatch = e.date.match(/\d{4}/);
                    const year = yearMatch ? parseInt(yearMatch[0]) : today.getFullYear();
                    const datePart = e.date.split(',')[0]; 
                    // Extract first month and day part (e.g. "Oct 14" from "Oct 14-18")
                    const startStr = datePart.split('-')[0].trim(); 
                    const startDate = new Date(`${startStr}, ${year}`);
                    
                    if (isNaN(startDate.getTime())) return null;
                    
                    return { ...e, startDate };
                } catch {
                    return null;
                }
            })
            .filter(e => e && e.startDate > today)
            .sort((a, b) => a!.startDate.getTime() - b!.startDate.getTime())[0];

        if (upcoming) {
            setNextEvent(upcoming);
        }
    }, []);

    useEffect(() => {
        if (!nextEvent) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = nextEvent.startDate.getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [nextEvent]);

    return (
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-fann-teal">
            {/* Background Slider */}
            <AnimatePresence initial={false}>
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 z-0"
                >
                    <picture>
                        <source srcSet={`${heroSlides[currentSlide].image}&fm=webp`} type="image/webp" />
                        <source srcSet={heroSlides[currentSlide].image} type="image/jpeg" />
                        <img 
                            src={heroSlides[currentSlide].image} 
                            alt={heroSlides[currentSlide].title}
                            className="w-full h-full object-cover"
                            width="1920"
                            height="1080"
                        />
                    </picture>
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-fann-teal/90" />
                </motion.div>
            </AnimatePresence>

            {/* Main Content */}
            <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center mt-[-60px]">
                 <motion.div
                    key={`text-${currentSlide}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                 >
                    <p className="text-fann-gold font-bold uppercase tracking-[0.2em] mb-4 text-sm md:text-base">
                        Dubai's Premier Design & Build Firm
                    </p>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight text-fann-peach mb-6 drop-shadow-2xl">
                        {heroSlides[currentSlide].title}
                    </h1>
                    <p className="text-lg md:text-2xl text-fann-light-gray max-w-3xl mx-auto mb-10 font-light">
                        {heroSlides[currentSlide].subtitle}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/contact">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-fann-gold text-fann-charcoal font-bold py-4 px-10 rounded-full text-lg uppercase tracking-wider shadow-lg shadow-fann-gold/20 hover:shadow-xl hover:shadow-fann-gold/40 transition-all"
                            >
                                {heroSlides[currentSlide].cta}
                            </motion.button>
                        </Link>
                        <Link to="/portfolio">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-transparent border-2 border-fann-peach text-fann-peach font-bold py-4 px-10 rounded-full text-lg uppercase tracking-wider hover:bg-fann-peach hover:text-fann-charcoal transition-all"
                            >
                                Explore Work
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Controls & Indicators */}
            <div className="absolute bottom-8 left-0 right-0 z-20 container mx-auto px-4 flex justify-between items-end pointer-events-none">
                 {/* Slider Indicators */}
                <div className="flex gap-3 pointer-events-auto mb-4 md:mb-0">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-8 bg-fann-gold' : 'w-2 bg-white/30 hover:bg-white/60'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Next Event Countdown Widget */}
                {nextEvent && (
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 }}
                        className="pointer-events-auto hidden md:block"
                    >
                        <Link to="/events-calendar" className="block group">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-lg text-left hover:bg-white/20 transition-all duration-300 w-72">
                                <div className="flex items-center gap-2 text-fann-gold mb-2">
                                    <Calendar size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Upcoming Event</span>
                                </div>
                                <h3 className="text-fann-peach font-serif font-bold text-lg truncate">{nextEvent.name}</h3>
                                <p className="text-fann-light-gray text-xs mb-3 truncate">{nextEvent.venue}</p>
                                <div className="flex justify-between items-center border-t border-white/10 pt-3">
                                    <div className="text-center">
                                        <span className="block text-xl font-bold text-fann-peach leading-none">{timeLeft.days}</span>
                                        <span className="text-[10px] text-fann-light-gray uppercase">Days</span>
                                    </div>
                                    <div className="text-fann-light-gray">:</div>
                                    <div className="text-center">
                                        <span className="block text-xl font-bold text-fann-peach leading-none">{timeLeft.hours}</span>
                                        <span className="text-[10px] text-fann-light-gray uppercase">Hrs</span>
                                    </div>
                                    <div className="text-fann-light-gray">:</div>
                                    <div className="text-center">
                                        <span className="block text-xl font-bold text-fann-peach leading-none">{timeLeft.minutes}</span>
                                        <span className="text-[10px] text-fann-light-gray uppercase">Min</span>
                                    </div>
                                    <div className="text-fann-light-gray">:</div>
                                    <div className="text-center">
                                        <span className="block text-xl font-bold text-fann-peach leading-none">{timeLeft.seconds}</span>
                                        <span className="text-[10px] text-fann-light-gray uppercase">Sec</span>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center text-xs text-fann-gold opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Calendar <ArrowRight size={12} className="ml-1" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}
            </div>
            
            {/* Manual Navigation Arrows */}
             <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 text-white/50 hover:bg-black/40 hover:text-white transition-all hidden md:block"
            >
                <ChevronLeft size={32} />
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 text-white/50 hover:bg-black/40 hover:text-white transition-all hidden md:block"
            >
                <ChevronRight size={32} />
            </button>
        </section>
    );
};

const WhyChooseFann: React.FC = () => {
    const features = [
        { icon: ShieldCheck, title: "DMCC Licensed", description: "Ensuring quality, compliance, and reliability for your peace of mind." },
        { icon: Award, title: "6+ Years Expertise", description: "Deep knowledge of the UAE & KSA markets, venues, and regulations." },
        { icon: Users, title: "200+ Successful Projects", description: "A proven track record of delivering excellence for leading brands." },
        { icon: Wrench, title: "In-House Fabrication", description: "Complete control over quality, timelines, and craftsmanship." },
        { icon: Headset, title: "Turnkey Solutions", description: "From 3D design to dismantling, we manage every detail seamlessly." },
    ];
    return (
        <section className="py-24 bg-white dark:bg-fann-accent-teal text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-fann-teal dark:text-fann-peach">Why Choose FANN for Your Exhibition Stand?</h2>
            <p className="max-w-3xl mx-auto text-fann-teal/80 dark:text-fann-light-gray mb-12">
                Choosing the right exhibition partner in Dubai is critical. FANN stands apart as a fully <Link to="/contact" className="font-bold hover:underline">DMCC licensed</Link> contractor, providing you with the assurance of quality, compliance, and reliability. Our state-of-the-art in-house fabrication facilities give us complete control over quality and timelines, enabling us to deliver stunning <Link to="/services" className="font-bold hover:underline">custom stands</Link> and modular systems.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
                {features.map(feature => (
                    <div key={feature.title}>
                        <feature.icon className="w-12 h-12 text-fann-accent-teal dark:text-fann-gold mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-fann-teal dark:text-fann-peach mb-2">{feature.title}</h3>
                        <p className="text-fann-teal/80 dark:text-fann-light-gray text-sm">{feature.description}</p>
                    </div>
                ))}
            </div>
             <div className="text-center mt-12">
                 <Link to="/portfolio">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        className="border-2 border-fann-accent-teal dark:border-fann-gold text-fann-accent-teal dark:text-fann-gold font-bold py-3 px-8 rounded-full text-base uppercase tracking-wider"
                    >
                        View Our Portfolio
                    </motion.button>
                </Link>
            </div>
        </section>
    );
};

const ServicesOverview: React.FC = () => (
    <section className="py-24">
        <div className="grid md:grid-cols-2 items-center gap-12 max-w-7xl mx-auto">
            <div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Exhibition Stand Services</h2>
                <p className="text-fann-teal/80 dark:text-fann-light-gray mb-6 leading-relaxed">
                    FANN offers a comprehensive suite of services. Our <Link to="/services" className="font-bold hover:underline">Custom Exhibition Stands</Link> are bespoke, brand-centric environments. For flexibility, our **Modular Systems** provide reusable, scalable solutions. As a leading <Link to="/contact" className="font-bold hover:underline">booth contractor in Dubai</Link>, we offer true **Turnkey Services**, a complete end-to-end solution from initial <span className="font-bold">exhibition stand design</span> to post-event breakdown. Our strength lies in our **In-house Fabrication** and professional **Interior Fit-Out** for hospitality suites and meeting rooms.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    {["Custom Stand Design", "Modular Systems", "Turnkey Project Management", "In-House Fabrication", "AV & Lighting", "Logistics & Storage"].map(service => (
                        <div key={service} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-fann-accent-teal dark:text-fann-gold" />
                            <span>{service}</span>
                        </div>
                    ))}
                </div>
                 <div className="mt-8">
                     <Link to="/services">
                        <motion.button whileHover={{ scale: 1.05 }} className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full text-base uppercase tracking-wider">
                            Explore Our Services
                        </motion.button>
                    </Link>
                </div>
            </div>
            <div>
                 <picture>
                    <source srcSet="https://images.pexels.com/photos/8199563/pexels-photo-8199563.jpeg?auto=compress&cs=tinysrgb&w=600&q=75&fm=webp" type="image/webp" />
                    <source srcSet="https://images.pexels.com/photos/8199563/pexels-photo-8199563.jpeg?auto=compress&cs=tinysrgb&w=600&q=75" type="image/jpeg" />
                    <img 
                        src="https://images.pexels.com/photos/8199563/pexels-photo-8199563.jpeg?auto=compress&cs=tinysrgb&w=600&q=75" 
                        alt="FANN exhibition stand design and fabrication team working on project"
                        className="rounded-lg shadow-xl"
                        loading="lazy"
                        width="600"
                        height="400"
                    />
                </picture>
            </div>
        </div>
    </section>
);

const StatsSection: React.FC = () => {
     const stats = [
        { value: "200+", label: "Successful Exhibitions" },
        { value: "87", label: "Satisfied Clients" },
        { value: "6", label: "Years in Business" },
        { value: "5.0/5", label: "Star Average Rating" },
    ];
    return (
        <section className="py-24 bg-white dark:bg-fann-accent-teal text-center">
             <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-fann-teal dark:text-fann-peach">200+ Successful Exhibitions Across Dubai & UAE</h2>
            <p className="max-w-3xl mx-auto text-fann-teal/80 dark:text-fann-light-gray mb-12">
                Our numbers tell a story of trust, quality, and consistent delivery. As a preferred contractor at the Dubai World Trade Centre (DWTC), we have a deep understanding of what it takes to succeed in the region's most competitive environments.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {stats.map(stat => (
                    <div key={stat.label}>
                        <p className="text-5xl font-bold text-fann-accent-teal dark:text-fann-gold">{stat.value}</p>
                        <p className="text-fann-teal/80 dark:text-fann-light-gray mt-2">{stat.label}</p>
                    </div>
                ))}
            </div>
             <div className="text-center mt-12">
                 <Link to="/contact">
                    <motion.button whileHover={{ scale: 1.05 }} className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full text-base uppercase tracking-wider">
                        Join Our Success Stories
                    </motion.button>
                </Link>
            </div>
        </section>
    );
};

const EventsSection: React.FC = () => (
    <section className="py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Major Exhibition Events We Serve</h2>
        <p className="max-w-3xl mx-auto text-fann-teal/80 dark:text-fann-light-gray mb-12">We specialize in creating impactful stands for the GCC's most prestigious events. Our extensive experience means we understand the unique audience, regulations, and opportunities at each show.</p>
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
            <Link to="/events" className="font-bold bg-white dark:bg-fann-accent-teal py-2 px-4 rounded-full hover:bg-fann-gold hover:text-fann-charcoal transition-colors">GITEX Technology Week</Link>
            <Link to="/events" className="font-bold bg-white dark:bg-fann-accent-teal py-2 px-4 rounded-full hover:bg-fann-gold hover:text-fann-charcoal transition-colors">Gulfood</Link>
            <Link to="/events" className="font-bold bg-white dark:bg-fann-accent-teal py-2 px-4 rounded-full hover:bg-fann-gold hover:text-fann-charcoal transition-colors">Arab Health</Link>
            <Link to="/events" className="font-bold bg-white dark:bg-fann-accent-teal py-2 px-4 rounded-full hover:bg-fann-gold hover:text-fann-charcoal transition-colors">The Big 5</Link>
            <Link to="/events" className="font-bold bg-white dark:bg-fann-accent-teal py-2 px-4 rounded-full hover:bg-fann-gold hover:text-fann-charcoal transition-colors">Arabian Travel Market</Link>
            <Link to="/events" className="font-bold bg-white dark:bg-fann-accent-teal py-2 px-4 rounded-full hover:bg-fann-gold hover:text-fann-charcoal transition-colors">Cityscape Global</Link>
            <Link to="/events" className="font-bold bg-white dark:bg-fann-accent-teal py-2 px-4 rounded-full hover:bg-fann-gold hover:text-fann-charcoal transition-colors">ADIPEC</Link>
        </div>
    </section>
);


const TestimonialsSection: React.FC = () => (
    <section className="py-24 bg-white dark:bg-fann-accent-teal text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-fann-teal dark:text-fann-peach">What Our Clients Say About FANN</h2>
        <p className="max-w-3xl mx-auto text-fann-teal/80 dark:text-fann-light-gray mb-12">With an aggregate rating of **5.0/5 stars from 87 reviews**, we have built a reputation for reliability, creativity, and outstanding service. As a DMCC licensed and verified company, we operate with the highest standards of professionalism.</p>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial) => (
                <div key={testimonial.client} className="bg-fann-peach dark:bg-fann-teal p-8 rounded-lg text-left">
                    <p className="italic text-fann-teal dark:text-fann-peach mb-6">"{testimonial.quote}"</p>
                    <p className="font-bold text-fann-accent-teal dark:text-fann-gold">{testimonial.client}</p>
                    <p className="text-sm text-fann-light-gray">{testimonial.company}</p>
                </div>
            ))}
        </div>
    </section>
);


const HomePage: React.FC = () => {
    return (
        <div>
            <SEO
                title="Exhibition Stand Builders Dubai | FANN - Custom Stands UAE"
                description="Award-winning exhibition stand builders in Dubai. 200+ successful stands for GITEX, Gulfood, Arab Health. DMCC licensed. Same-day quote. Call +971-50-566-7502"
            />
            <HeroSection />

            <div className="bg-fann-peach dark:bg-fann-teal">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                   <WhyChooseFann />
                   <ServicesOverview />
                   <StatsSection />
                   <EventsSection />
                   <TestimonialsSection />
                </div>
            </div>
        </div>
    );
};

export default HomePage;