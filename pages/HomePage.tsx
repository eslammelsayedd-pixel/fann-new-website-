import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Award, Wrench, Users, Headset, ShieldCheck, CheckCircle, ArrowRight, ChevronRight, Star, Play, Pause, Volume2, VolumeX, MousePointer2 } from 'lucide-react';
import { testimonials } from '../constants';
import SEO from '../components/SEO';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

// --- SPLIT FLAP TEXT COMPONENT ---
// Simulates a mechanical departure board flipping effect
const SplitFlapText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
    const [displayString, setDisplayString] = useState('');
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

    useEffect(() => {
        let interval: any;
        let iteration = 0;
        
        const runAnimation = () => {
            interval = setInterval(() => {
                setDisplayString(prev => 
                    text.split('').map((char, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return charSet[Math.floor(Math.random() * charSet.length)];
                    }).join('')
                );

                if (iteration >= text.length) {
                    clearInterval(interval);
                }
                iteration += 1 / 3; // Speed of reveal
            }, 30);
        };

        runAnimation();
        return () => clearInterval(interval);
    }, [text]);

    return (
        <span className={`font-mono tracking-widest ${className}`}>
            {displayString}
        </span>
    );
};

// --- IMMERSIVE HERO SECTION ---
const HeroSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRefBW = useRef<HTMLVideoElement>(null);
    const videoRefColor = useRef<HTMLVideoElement>(null);
    
    // Interaction State
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [activeChapter, setActiveChapter] = useState(0);

    // Physics for smooth mouse movement
    const springConfig = { damping: 25, stiffness: 120 };
    const springX = useSpring(0, springConfig);
    const springY = useSpring(0, springConfig);

    // Video Chapters (Time in seconds)
    const chapters = [
        { id: 0, label: "CONCEPT", time: 0, title: "Where Ideas Take Shape" },
        { id: 1, label: "DESIGN", time: 5, title: "Precision Meets Creativity" },
        { id: 2, label: "BUILD", time: 10, title: "Craftsmanship In Action" },
        { id: 3, label: "EXPERIENCE", time: 15, title: "Unforgettable Moments" }
    ];

    // Handle Mouse Move
    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        // Update state for rendering
        setMousePos({ x: clientX, y: clientY });
        setIsHovering(true);

        // Update springs for parallax effect
        // Calculate normalized position (-1 to 1)
        const xPct = (clientX / innerWidth - 0.5) * 2;
        const yPct = (clientY / innerHeight - 0.5) * 2;
        
        springX.set(xPct * 20); // 20px movement
        springY.set(yPct * 20);
    };

    // Sync Videos Hook
    useEffect(() => {
        const v1 = videoRefBW.current;
        const v2 = videoRefColor.current;
        
        if (!v1 || !v2) return;

        const syncVideos = () => {
            if (Math.abs(v1.currentTime - v2.currentTime) > 0.1) {
                v2.currentTime = v1.currentTime;
            }
            requestAnimationFrame(syncVideos);
        };
        const animFrame = requestAnimationFrame(syncVideos);

        // Sync Play/Pause
        const handlePlay = () => v2.play();
        const handlePause = () => v2.pause();
        
        v1.addEventListener('play', handlePlay);
        v1.addEventListener('pause', handlePause);
        v1.addEventListener('seeking', () => v2.currentTime = v1.currentTime);

        return () => {
            cancelAnimationFrame(animFrame);
            v1.removeEventListener('play', handlePlay);
            v1.removeEventListener('pause', handlePause);
        };
    }, []);

    // Chapter Navigation
    const seekToChapter = (index: number) => {
        if (videoRefBW.current && videoRefColor.current) {
            const time = chapters[index].time;
            videoRefBW.current.currentTime = time;
            videoRefColor.current.currentTime = time;
            setActiveChapter(index);
        }
    };

    const togglePlay = () => {
        if (videoRefBW.current) {
            if (isPlaying) videoRefBW.current.pause();
            else videoRefBW.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRefBW.current) {
            videoRefBW.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // Video Source - High quality architectural timelapse
    const videoSrc = "https://videos.pexels.com/video-files/3205633/3205633-hd_1920_1080_25fps.mp4";

    return (
        <section 
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden bg-black"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* --- VIDEO LAYERS --- */}
            <motion.div 
                className="absolute inset-0 w-full h-full"
                style={{ x: springX, y: springY, scale: 1.05 }} // Parallax Container
            >
                {/* Layer 1: B&W Conceptual Layer */}
                <video
                    ref={videoRefBW}
                    src={videoSrc}
                    className="absolute inset-0 w-full h-full object-cover filter grayscale brightness-50 contrast-125"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                />

                {/* Layer 2: Color Reality Layer (Masked) */}
                <div 
                    className="absolute inset-0 w-full h-full overflow-hidden"
                    style={{
                        clipPath: isHovering 
                            ? `circle(250px at ${mousePos.x}px ${mousePos.y}px)` 
                            : `circle(0px at 50% 50%)`,
                        transition: 'clip-path 0.1s ease-out' // Smooth feathering
                    }}
                >
                    <video
                        ref={videoRefColor}
                        src={videoSrc}
                        className="absolute inset-0 w-full h-full object-cover filter brightness-110 saturate-125"
                        muted
                        playsInline
                        autoPlay={isPlaying} // Controlled via sync
                        loop
                    />
                    {/* Spotlight Edge Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fann-gold/10 to-transparent opacity-50 mix-blend-overlay pointer-events-none"></div>
                </div>
            </motion.div>

            {/* --- OVERLAY UI --- */}
            <div className="absolute inset-0 z-30 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"></div>

            <div className="absolute inset-0 z-40 flex flex-col justify-center items-center px-4">
                {/* Headline */}
                <div className="text-center space-y-6 max-w-5xl">
                    <div className="inline-block bg-black/30 backdrop-blur-sm border border-white/10 px-4 py-1 rounded-full mb-4">
                        <span className="text-fann-gold text-xs font-mono tracking-[0.3em] uppercase flex items-center gap-2">
                            <span className="w-2 h-2 bg-fann-gold rounded-full animate-pulse"></span>
                            Concept 2: Immersive Canvas
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white leading-none tracking-tighter mix-blend-overlay">
                        <SplitFlapText text="FROM VISION" className="block mb-2" />
                        <SplitFlapText text="TO REALITY" className="text-fann-gold" />
                    </h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="text-lg md:text-2xl text-gray-300 font-light max-w-2xl mx-auto tracking-wide"
                    >
                        Transforming Exhibition Concepts into Award-Winning Experiences.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2 }}
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 pointer-events-auto"
                    >
                        <Link to="/contact">
                            <button className="bg-fann-gold hover:bg-white text-black font-bold py-4 px-10 rounded-none uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105">
                                Start Project
                            </button>
                        </Link>
                        <button 
                            onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}
                            className="flex items-center gap-3 text-white hover:text-fann-gold transition-colors group uppercase tracking-widest text-sm font-bold"
                        >
                            <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:border-fann-gold transition-colors">
                                <Play size={16} className="fill-current ml-1" />
                            </div>
                            Watch Reel
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* --- SIDEBAR NAVIGATION (CHAPTERS) --- */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-8 pointer-events-auto">
                {chapters.map((chapter, idx) => (
                    <button 
                        key={chapter.id}
                        onClick={() => seekToChapter(idx)}
                        className="group flex items-center gap-4 justify-end"
                    >
                        <div className={`text-right transition-all duration-300 ${activeChapter === idx ? 'opacity-100' : 'opacity-0 group-hover:opacity-50 -translate-x-4'}`}>
                            <span className="block text-[10px] font-bold text-fann-gold tracking-widest uppercase">{chapter.label}</span>
                            <span className="block text-xs text-white font-serif">{chapter.title}</span>
                        </div>
                        <div className={`w-1 h-12 rounded-full transition-all duration-300 ${activeChapter === idx ? 'bg-fann-gold h-16' : 'bg-white/20 hover:bg-white/50'}`}></div>
                        <span className="text-[10px] font-mono text-gray-500 w-4">0{idx + 1}</span>
                    </button>
                ))}
            </div>

            {/* --- BOTTOM CONTROLS --- */}
            <div className="absolute bottom-8 left-8 z-50 flex items-center gap-4 pointer-events-auto">
                <button onClick={togglePlay} className="text-white/70 hover:text-white transition-colors">
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <div className="h-px w-12 bg-white/20"></div>
                <span className="text-[10px] text-white/50 uppercase tracking-widest">Sound {isMuted ? 'Off' : 'On'}</span>
            </div>

            {/* --- CURSOR HINT --- */}
            <AnimatePresence>
                {!isHovering && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 text-fann-gold/50 flex flex-col items-center gap-2 pointer-events-none"
                    >
                        <MousePointer2 size={24} className="animate-bounce" />
                        <span className="text-xs uppercase tracking-widest">Hover to Reveal Reality</span>
                    </motion.div>
                )}
            </AnimatePresence>
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
        <section id="showcase" className="py-32 bg-[#0A0A0A] text-center relative overflow-hidden">
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