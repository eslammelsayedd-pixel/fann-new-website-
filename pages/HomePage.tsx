import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Award, Wrench, Users, Headset, ShieldCheck, CheckCircle, ArrowRight, ChevronRight, Star, MousePointer2 } from 'lucide-react';
import { testimonials } from '../constants';
import SEO from '../components/SEO';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

// --- ELITE-TIER CUSTOM 3D PARTICLE ENGINE ---
// This engine simulates Three.js physics using lightweight Canvas 2D for maximum performance and compatibility.

interface Point3D {
    x: number;
    y: number;
    z: number;
    // Target coordinates for morphing
    tx: number;
    ty: number;
    tz: number;
    // Velocity
    vx: number;
    vy: number;
    vz: number;
    // Appearance
    color: string;
    baseSize: number;
    // Interaction
    magnetForce: number;
}

const HeroSection: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeConfig, setActiveConfig] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    
    const configNames = ['Island Structure', 'Peninsula Layout', 'Corner Stand', 'Inline Booth'];

    // Text Animation - Letter by Letter
    const sentence = "CRAFTING EXTRAORDINARY EXHIBITION EXPERIENCES";
    const words = sentence.split(" ");

    // ----------------------------------------------------------------
    // 3D SHAPE GENERATORS
    // ----------------------------------------------------------------
    // These functions generate 3D coordinates for different booth types
    
    const generateIsland = (count: number): {x:number, y:number, z:number}[] => {
        const points = [];
        const width = 600;
        const height = 300;
        const depth = 600;
        
        for (let i = 0; i < count; i++) {
            const r = Math.random();
            let p = {x:0, y:0, z:0};
            
            if (r < 0.2) { // Top Ring
                const theta = Math.random() * Math.PI * 2;
                p = { x: Math.cos(theta) * width/2, y: -height/2, z: Math.sin(theta) * depth/2 };
            } else if (r < 0.4) { // 4 Pillars
                const pillar = Math.floor(Math.random() * 4);
                const px = (pillar % 2 === 0 ? 1 : -1) * (width/2 - 20);
                const pz = (pillar < 2 ? 1 : -1) * (depth/2 - 20);
                p = { x: px + (Math.random()-0.5)*20, y: (Math.random()-0.5)*height, z: pz + (Math.random()-0.5)*20 };
            } else if (r < 0.7) { // Center Feature
                const h = (Math.random()-0.5) * height * 0.8;
                const radius = 100 * (1 - (h + height/2)/height); // Cone shape
                const theta = Math.random() * Math.PI * 2;
                p = { x: Math.cos(theta) * radius, y: h, z: Math.sin(theta) * radius };
            } else { // Floor scattered
                p = { x: (Math.random()-0.5)*width, y: height/2, z: (Math.random()-0.5)*depth };
            }
            points.push(p);
        }
        return points;
    };

    const generatePeninsula = (count: number): {x:number, y:number, z:number}[] => {
        const points = [];
        const width = 600;
        const height = 350;
        const depth = 400;

        for (let i = 0; i < count; i++) {
            const r = Math.random();
            let p = {x:0, y:0, z:0};

            if (r < 0.4) { // Back Wall
                p = { x: (Math.random()-0.5)*width, y: (Math.random()-0.5)*height, z: -depth/2 };
            } else if (r < 0.6) { // Side Wall Left
                p = { x: -width/2, y: (Math.random()-0.5)*height, z: (Math.random()-0.5)*depth };
            } else if (r < 0.8) { // Side Wall Right
                p = { x: width/2, y: (Math.random()-0.5)*height, z: (Math.random()-0.5)*depth };
            } else { // Overhead Beams
                p = { x: (Math.random()-0.5)*width, y: -height/2, z: (Math.random()-0.5)*depth };
            }
            points.push(p);
        }
        return points;
    };

    const generateCorner = (count: number): {x:number, y:number, z:number}[] => {
        const points = [];
        const size = 500;
        
        for (let i = 0; i < count; i++) {
            const r = Math.random();
            let p = {x:0, y:0, z:0};
            
            if (r < 0.5) { // Wall 1 (Back)
                p = { x: (Math.random()-0.5)*size, y: (Math.random()-0.5)*300, z: -size/2 };
            } else { // Wall 2 (Side)
                p = { x: -size/2, y: (Math.random()-0.5)*300, z: (Math.random()-0.5)*size };
            }
            
            // Add L-shaped reception desk
            if (Math.random() < 0.1) {
               p.y = 100 + Math.random() * 50;
               p.x *= 0.5;
               p.z *= 0.5;
            }
            points.push(p);
        }
        return points;
    };

    const generateInline = (count: number): {x:number, y:number, z:number}[] => {
        const points = [];
        const width = 700;
        const height = 300;
        
        for (let i = 0; i < count; i++) {
            const r = Math.random();
            let p = {x:0, y:0, z:0};
            
            if (r < 0.7) { // Huge Back Wall
                p = { x: (Math.random()-0.5)*width, y: (Math.random()-0.5)*height, z: 100 };
            } else if (r < 0.85) { // Branding Header
                p = { x: (Math.random()-0.5)*width, y: -height/2, z: 50 };
            } else { // Counter
                p = { x: (Math.random()-0.5)*200, y: 100, z: -100 };
            }
            points.push(p);
        }
        return points;
    };

    // ----------------------------------------------------------------
    // ANIMATION LOOP
    // ----------------------------------------------------------------

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Configuration
        let width = window.innerWidth;
        let height = window.innerHeight;
        const particleCount = window.innerWidth < 768 ? 300 : 800;
        const focalLength = 800;
        let frameId = 0;
        let autoRotate = 0;

        // Initialize Particles
        const particles: Point3D[] = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: (Math.random() - 0.5) * 2000,
                y: (Math.random() - 0.5) * 2000,
                z: (Math.random() - 0.5) * 2000,
                tx: 0, ty: 0, tz: 0,
                vx: 0, vy: 0, vz: 0,
                color: Math.random() > 0.8 ? '#FFFFFF' : '#D4AF76', // Gold & White mix
                baseSize: Math.random() * 2 + 1,
                magnetForce: 0
            });
        }

        // Shape Targets
        const shapes = [
            generateIsland(particleCount),
            generatePeninsula(particleCount),
            generateCorner(particleCount),
            generateInline(particleCount)
        ];

        // Render Loop
        const render = () => {
            // 1. Setup Canvas
            canvas.width = width;
            canvas.height = height;
            const cx = width / 2;
            const cy = height / 2;
            
            ctx.fillStyle = '#050505'; // Deep black background
            ctx.fillRect(0, 0, width, height);

            // 2. Update Physics
            autoRotate += 0.003;
            const targetShape = shapes[activeConfig];

            // Sort for Z-buffering (drawing far items first)
            particles.sort((a, b) => b.z - a.z);

            particles.forEach((p, i) => {
                // A. Morphing Logic: Move towards target (tx, ty, tz)
                // Loop array if fewer target points than particles
                const target = targetShape[i % targetShape.length];
                
                // Spring physics for smooth morph
                const dx = target.x - p.x;
                const dy = target.y - p.y;
                const dz = target.z - p.z;

                p.vx += dx * 0.02; // Spring stiffness
                p.vy += dy * 0.02;
                p.vz += dz * 0.02;

                p.vx *= 0.9; // Friction
                p.vy *= 0.9;
                p.vz *= 0.9;

                // B. Magnetic Mouse Interaction
                // Project current 3D position to 2D to check distance from mouse
                const scaleProj = focalLength / (focalLength + p.z);
                const screenX = p.x * scaleProj + cx;
                const screenY = p.y * scaleProj + cy;

                const distMouseX = screenX - mousePos.x;
                const distMouseY = screenY - mousePos.y;
                const distMouse = Math.sqrt(distMouseX*distMouseX + distMouseY*distMouseY);
                
                const magnetRadius = 200;
                
                if (distMouse < magnetRadius) {
                    // Magnetic Pull/Push
                    const force = (1 - distMouse / magnetRadius) * 50;
                    // Ripple effect using sine wave
                    const ripple = Math.sin(distMouse * 0.05 - autoRotate * 10) * 20;
                    
                    // Apply force to velocity
                    p.vx -= (distMouseX / distMouse) * force * 0.05;
                    p.vy -= (distMouseY / distMouse) * force * 0.05;
                    p.z += ripple; // Move in Z for 3D ripple
                }

                // Apply Velocity
                p.x += p.vx;
                p.y += p.vy;
                p.z += p.vz;

                // C. 3D Rotation (Camera Orbit)
                const cos = Math.cos(autoRotate);
                const sin = Math.sin(autoRotate);
                
                const rx = p.x * cos - p.z * sin;
                const rz = p.z * cos + p.x * sin;
                const ry = p.y; // No vertical rotation

                // D. Projection to 2D
                const scale = focalLength / (focalLength + rz);
                const x2d = rx * scale + cx;
                const y2d = ry * scale + cy;

                // E. Draw Particle
                if (scale > 0) { // Only draw if in front of camera
                    const alpha = Math.max(0.1, Math.min(1, (scale - 0.2))); // Depth fade
                    const size = p.baseSize * scale;

                    // Glow effect
                    const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size * 2);
                    gradient.addColorStop(0, p.color === '#FFFFFF' ? 'rgba(255,255,255,1)' : 'rgba(212,175,118,1)');
                    gradient.addColorStop(0.4, p.color === '#FFFFFF' ? 'rgba(255,255,255,0.5)' : 'rgba(212,175,118,0.5)');
                    gradient.addColorStop(1, 'rgba(0,0,0,0)');

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(x2d, y2d, size * 2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Optional: Draw connecting lines for close particles to form "structure"
                    // Optimization: Only check close neighbors in array (since we morphed from same structure)
                    if (i > 0 && Math.random() > 0.9) {
                        const prev = particles[i-1];
                        // Re-project prev
                        const prx = prev.x * cos - prev.z * sin;
                        const prz = prev.z * cos + prev.x * sin;
                        const pscale = focalLength / (focalLength + prz);
                        const px2d = prx * pscale + cx;
                        const py2d = prev.y * pscale + cy;

                        const dist = Math.hypot(x2d - px2d, y2d - py2d);
                        if (dist < 50) {
                            ctx.strokeStyle = `rgba(212,175,118, ${0.2 * alpha})`;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.moveTo(x2d, y2d);
                            ctx.lineTo(px2d, py2d);
                            ctx.stroke();
                        }
                    }
                }
            });

            frameId = requestAnimationFrame(render);
        };

        // Handle Resize
        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, [activeConfig, mousePos]); // Re-run effect only if config changes (points stay, target changes)

    // ----------------------------------------------------------------
    // INTERACTIONS
    // ----------------------------------------------------------------

    // Mouse Tracking
    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
        setIsHovering(true);
    };

    // Config Auto-Cycle
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isHovering) { // Pause morphing if user is interacting
                setActiveConfig(prev => (prev + 1) % 4);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [isHovering]);


    return (
        <section 
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden bg-[#050505]"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* 1. 3D Engine Layer */}
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 z-10 block pointer-events-none"
            />

            {/* 2. Overlay Gradients for Depth */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#050505_120%)] opacity-80" />
            
            {/* 3. Main Content Layer */}
            <div className="absolute inset-0 z-30 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center w-full">
                    
                    {/* Mode Indicator */}
                    <motion.div 
                        key={activeConfig}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-fann-gold/30 bg-black/50 backdrop-blur-md mb-8"
                    >
                        <div className="w-2 h-2 rounded-full bg-fann-gold animate-pulse shadow-[0_0_10px_#C5A059]" />
                        <span className="text-fann-gold text-xs font-mono tracking-[0.3em] uppercase">
                            Mode: {configNames[activeConfig]}
                        </span>
                    </motion.div>

                    {/* Main Headline - Fully Responsive & Wrapping */}
                    <h1 className="font-serif font-bold text-white leading-[1.1] mb-8 drop-shadow-2xl mix-blend-screen flex flex-wrap justify-center gap-x-4 gap-y-2 px-4">
                        {/* Responsive Text Sizes: Mobile: 36px (text-4xl), Tablet: 60px, Desktop: 96px (text-8xl) */}
                        {words.map((word, i) => (
                            <span key={i} className="inline-block whitespace-nowrap overflow-visible">
                                {word.split("").map((char, j) => (
                                    <motion.span
                                        key={j}
                                        initial={{ opacity: 0, y: 50, rotateX: 90 }}
                                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                        transition={{ 
                                            duration: 0.8, 
                                            delay: i * 0.2 + j * 0.05,
                                            type: "spring",
                                            damping: 12
                                        }}
                                        className="inline-block text-4xl md:text-6xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-400"
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5, duration: 1 }}
                        className="text-lg md:text-2xl text-gray-300 font-light max-w-3xl mx-auto mb-12 tracking-wide leading-relaxed"
                    >
                        Transforming abstract visions into award-winning physical realities.
                        <span className="block mt-2 text-fann-gold/80">Your premier partner for Exhibitions, Events & Interiors.</span>
                    </motion.p>

                    {/* CTAs */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 3, type: "spring" }}
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center"
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

            {/* 4. Interactive Cursor Hint */}
            <AnimatePresence>
                {!isHovering && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 text-fann-gold/50 flex flex-col items-center gap-2 pointer-events-none"
                    >
                        <MousePointer2 size={24} className="animate-bounce" />
                        <span className="text-xs uppercase tracking-widest">Interact with the Particles</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 5. Scroll Indicator */}
            <motion.div 
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-white/30 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4, duration: 1 }}
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