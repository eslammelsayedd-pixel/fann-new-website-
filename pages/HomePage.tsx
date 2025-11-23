import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Award, Wrench, Users, Headset, ShieldCheck, CheckCircle, ArrowRight, ChevronRight, Star } from 'lucide-react';
import { testimonials } from '../constants';
import SEO from '../components/SEO';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

// --- CONCEPT 1: 3D Floating Exhibition Booth Particles (Canvas Implementation) ---

interface Point3D {
    x: number;
    y: number;
    z: number;
    tx: number; // Target X
    ty: number; // Target Y
    tz: number; // Target Z
    vx: number; // Velocity
    vy: number;
    vz: number;
    size: number;
    color: string;
}

const HeroSection: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeConfig, setActiveConfig] = useState(0);
    const mouseRef = useRef({ x: 0, y: 0 });
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const configs = ['Island', 'Peninsula', 'Corner', 'Inline'];

    // Text Animation Variants
    const sentence = "CRAFTING EXTRAORDINARY EXHIBITION EXPERIENCES";
    const letters = sentence.split("");

    const textVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = container.clientWidth;
        let height = container.clientHeight;
        let animationFrameId: number;

        canvas.width = width;
        canvas.height = height;

        const particles: Point3D[] = [];
        const numParticles = isMobile ? 600 : 1500;
        const focalLength = 800;
        const baseColor = '#C5A059'; // FANN Gold

        // Helper to generate random range
        const random = (min: number, max: number) => Math.random() * (max - min) + min;

        // Initialize particles
        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: random(-1000, 1000),
                y: random(-1000, 1000),
                z: random(-1000, 1000),
                tx: random(-1000, 1000),
                ty: random(-1000, 1000),
                tz: random(-1000, 1000),
                vx: 0, vy: 0, vz: 0,
                size: random(1, 3),
                color: baseColor
            });
        }

        // Define Booth Shapes (Target Coordinates)
        const setTargetShape = (shapeIndex: number) => {
            const scale = isMobile ? 200 : 300;
            let pIndex = 0;

            const setPoint = (x: number, y: number, z: number) => {
                if (pIndex < particles.length) {
                    // Add some noise for organic feel
                    const noise = 20;
                    particles[pIndex].tx = x * scale + random(-noise, noise);
                    particles[pIndex].ty = y * scale + random(-noise, noise);
                    particles[pIndex].tz = z * scale + random(-noise, noise);
                    pIndex++;
                }
            };

            // Helper to draw lines of particles
            const drawLine = (start: [number, number, number], end: [number, number, number], density: number) => {
                for (let i = 0; i < density; i++) {
                    const t = i / density;
                    setPoint(
                        start[0] + (end[0] - start[0]) * t,
                        start[1] + (end[1] - start[1]) * t,
                        start[2] + (end[2] - start[2]) * t
                    );
                }
            };

            if (shapeIndex === 0) { // ISLAND (Cube frame + Pillars)
                // Top Frame
                drawLine([-1, -0.5, -1], [1, -0.5, -1], 40);
                drawLine([1, -0.5, -1], [1, -0.5, 1], 40);
                drawLine([1, -0.5, 1], [-1, -0.5, 1], 40);
                drawLine([-1, -0.5, 1], [-1, -0.5, -1], 40);
                // Pillars
                drawLine([-1, -0.5, -1], [-1, 1, -1], 30);
                drawLine([1, -0.5, -1], [1, 1, -1], 30);
                drawLine([1, -0.5, 1], [1, 1, 1], 30);
                drawLine([-1, -0.5, 1], [-1, 1, 1], 30);
                // Center Feature
                drawLine([0, 1, 0], [0, -0.5, 0], 50);
            } else if (shapeIndex === 1) { // PENINSULA (Back wall + Side walls)
                // Back Wall
                for(let y = -0.5; y <= 1; y+=0.1) drawLine([-1, y, 1], [1, y, 1], 20);
                // Side Walls (Partial)
                for(let y = -0.5; y <= 1; y+=0.2) drawLine([-1, y, 1], [-1, y, -0.5], 15);
                for(let y = -0.5; y <= 1; y+=0.2) drawLine([1, y, 1], [1, y, -0.5], 15);
                // Roof beams
                drawLine([-1, -0.5, 1], [-1, -0.5, -1], 30);
                drawLine([1, -0.5, 1], [1, -0.5, -1], 30);
            } else if (shapeIndex === 2) { // CORNER (L-Shape)
                // Wall 1
                for(let y = -0.5; y <= 1; y+=0.1) drawLine([-1, y, -1], [-1, y, 1], 20);
                // Wall 2
                for(let y = -0.5; y <= 1; y+=0.1) drawLine([-1, y, 1], [1, y, 1], 20);
                // Counter
                drawLine([0, 0.8, 0], [0.5, 0.8, 0.5], 20);
            } else if (shapeIndex === 3) { // INLINE (Back wall only + reception)
                // Back Wall
                for(let x = -1.5; x <= 1.5; x+=0.1) drawLine([x, -0.5, 1], [x, 1, 1], 15);
                // Reception Desk
                drawLine([-0.5, 0.5, 0], [0.5, 0.5, 0], 30);
                drawLine([-0.5, 0.5, 0], [-0.5, 1, 0], 10);
                drawLine([0.5, 0.5, 0], [0.5, 1, 0], 10);
            }

            // Send remaining particles to random orbit
            while (pIndex < particles.length) {
                const theta = random(0, Math.PI * 2);
                const phi = random(0, Math.PI);
                const r = random(scale * 1.5, scale * 2.5);
                setPoint(
                    (r * Math.sin(phi) * Math.cos(theta)) / scale,
                    (r * Math.sin(phi) * Math.sin(theta)) / scale,
                    (r * Math.cos(phi)) / scale
                );
            }
        };

        // Cycle shapes
        const shapeInterval = setInterval(() => {
            setActiveConfig(prev => {
                const next = (prev + 1) % 4;
                setTargetShape(next);
                return next;
            });
        }, 4000);
        
        // Initialize first shape
        setTargetShape(0);

        // Animation Loop
        let rotationY = 0;

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            
            // Camera/Scene Rotation
            rotationY += 0.002;
            const cx = width / 2;
            const cy = height / 2;

            // Sorting particles by depth for proper z-indexing
            particles.sort((a, b) => b.z - a.z);

            particles.forEach(p => {
                // Physics: Move towards target
                const dx = p.tx - p.x;
                const dy = p.ty - p.y;
                const dz = p.tz - p.z;

                p.vx += dx * 0.005;
                p.vy += dy * 0.005;
                p.vz += dz * 0.005;

                // Damping
                p.vx *= 0.92;
                p.vy *= 0.92;
                p.vz *= 0.92;

                // Mouse Interaction (Magnetic Pull/Ripple)
                // Transform 3D point to 2D to check distance from mouse
                const scaleProj = focalLength / (focalLength + p.z);
                const screenX = p.x * scaleProj + cx;
                const screenY = p.y * scaleProj + cy;

                const distMouse = Math.sqrt(Math.pow(screenX - mouseRef.current.x, 2) + Math.pow(screenY - mouseRef.current.y, 2));
                
                if (distMouse < 200) {
                    const force = (200 - distMouse) / 200;
                    // Magnetic pull towards mouse, but keeping z depth
                    p.vx += (mouseRef.current.x - screenX) * force * 0.001;
                    p.vy += (mouseRef.current.y - screenY) * force * 0.001;
                }

                p.x += p.vx;
                p.y += p.vy;
                p.z += p.vz;

                // 3D Rotation
                const cos = Math.cos(rotationY);
                const sin = Math.sin(rotationY);
                const rx = p.x * cos - p.z * sin;
                const rz = p.z * cos + p.x * sin;

                // Projection
                const scale = focalLength / (focalLength + rz);
                const x2d = rx * scale + cx;
                const y2d = p.y * scale + cy;

                // Draw
                if (scale > 0) { // Only draw if in front of camera
                    const alpha = Math.min(1, (scale - 0.2)); // Fade out distant particles
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(x2d, y2d, p.size * scale, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // Connecting lines for active shape structure (optimization: only connect close neighbors)
            // Skipped for performance to maintain 60fps on all devices without webgl shaders

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            width = container.clientWidth;
            height = container.clientHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(shapeInterval);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }
    };

    return (
        <section 
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden bg-[#050505]"
            onMouseMove={handleMouseMove}
        >
            {/* 3D Canvas Layer */}
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 z-10 block"
            />

            {/* Vignette & Grading Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#050505_120%)]" />
            <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/80" />

            {/* Content Layer */}
            <div className="absolute inset-0 z-30 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pointer-events-none">
                <div className="max-w-6xl mx-auto text-center">
                    
                    {/* Dynamic Config Label */}
                    <div className="mb-8 overflow-hidden flex justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeConfig}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="flex items-center gap-2 px-4 py-1 rounded-full border border-fann-gold/30 bg-black/40 backdrop-blur-md"
                            >
                                <div className="w-2 h-2 rounded-full bg-fann-gold animate-pulse" />
                                <span className="text-fann-gold text-xs font-mono tracking-widest uppercase">
                                    Mode: {configs[activeConfig]}
                                </span>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Staggered Headline */}
                    <motion.h1 
                        className="text-4xl md:text-6xl lg:text-8xl font-serif font-bold text-white tracking-tight leading-[1.1] mb-8 drop-shadow-2xl mix-blend-screen"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.03 } }
                        }}
                    >
                        {letters.map((char, index) => (
                            <motion.span key={index} variants={textVariants} className="inline-block">
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto mb-12 tracking-wide"
                    >
                        Transforming abstract visions into award-winning physical realities.
                        <br className="hidden md:block"/> Your premier partner for Exhibitions, Events & Interiors.
                    </motion.p>

                    {/* CTAs - Pointer events enabled for buttons */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.8, type: "spring" }}
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center pointer-events-auto"
                    >
                        <Link to="/fann-studio/exhibition">
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
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div 
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 text-white/30 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1 }}
            >
                <span className="text-[10px] uppercase tracking-widest">Scroll to Explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-fann-gold to-transparent"></div>
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