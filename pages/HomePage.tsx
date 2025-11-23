import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Award, Wrench, Users, Headset, ShieldCheck, CheckCircle, Play, ArrowRight, Star, Zap } from 'lucide-react';
import { testimonials } from '../constants';
import SEO from '../components/SEO';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

// --- BACKGROUND AMBIENCE ---
const BackgroundFlow: React.FC = () => (
    <div className="blob-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03]"></div>
    </div>
);

// --- WEBGL LIQUID HERO ENGINE ---
const LiquidMetalHero: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [morphState, setMorphState] = useState(0); 

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const gl = canvas.getContext('webgl');
        if (!gl) return;

        // 1. VERTEX SHADER
        const vsSource = `
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        // 2. FRAGMENT SHADER (Enhanced Raymarching Liquid)
        const fsSource = `
            precision highp float;
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec2 u_mouse;
            uniform float u_morph;

            // SDF Primitives
            float sdBox(vec3 p, vec3 b) {
                vec3 q = abs(p) - b;
                return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
            }

            float smin(float a, float b, float k) {
                float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
                return mix(b, a, h) - k * h * (1.0 - h);
            }

            mat2 rot(float a) {
                float s = sin(a), c = cos(a);
                return mat2(c, -s, s, c);
            }

            float map(vec3 p) {
                // More chaotic mouse interaction
                vec2 m = (u_mouse / u_resolution) * 2.0 - 1.0;
                m.x *= u_resolution.x / u_resolution.y;
                m.y *= -1.0;
                
                float dMouse = length(p.xy - m * 4.0) - 0.8;
                
                // Morphing Shapes
                float d1 = sdBox(p, vec3(1.2)); // Island
                
                vec3 p2 = p; p2.x += 0.5;
                float d2_outer = sdBox(p2, vec3(1.5, 1.2, 1.2));
                float d2_inner = sdBox(p2 + vec3(1.0, 0.0, 0.0), vec3(1.0, 2.0, 0.8));
                float d2 = max(d2_outer, -d2_inner); // Peninsula

                vec3 p3 = p;
                float d3_a = sdBox(p3 + vec3(0.8, 0.0, 0.0), vec3(0.5, 1.2, 1.2));
                float d3_b = sdBox(p3 + vec3(-0.8, 0.0, 0.8), vec3(1.2, 1.2, 0.5));
                float d3 = smin(d3_a, d3_b, 0.2); // Corner

                float d4 = sdBox(p + vec3(0.0, 0.0, 0.5), vec3(2.5, 1.2, 0.2)); // Inline

                float d = d1;
                float t = u_morph;
                
                if (t < 1.0) d = mix(d1, d2, t);
                else if (t < 2.0) d = mix(d2, d3, t - 1.0);
                else d = mix(d3, d4, t - 2.0);

                // Increased Distortion for Dramatic Liquid Effect
                float wave = sin(p.y * 4.0 + u_time * 2.5) * 0.1 + sin(p.x * 3.0 + u_time * 3.0) * 0.1;
                d += wave;

                // Ferrofluid spikes near mouse
                float spike = sin(p.x * 20.0) * sin(p.y * 20.0) * sin(p.z * 20.0) * 0.02;
                d += spike * smoothstep(2.0, 0.0, length(p.xy - m * 4.0));

                return smin(d, dMouse, 1.2);
            }

            vec3 calcNormal(vec3 p) {
                const float h = 0.001;
                const vec2 k = vec2(1, -1);
                return normalize(k.xyy * map(p + k.xyy * h) +
                                 k.yyx * map(p + k.yyx * h) +
                                 k.yxy * map(p + k.yxy * h) +
                                 k.xxx * map(p + k.xxx * h));
            }

            void main() {
                vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
                vec3 ro = vec3(0.0, 0.0, 5.0);
                vec3 rd = normalize(vec3(uv, -1.0));

                float t = 0.0;
                float d = 0.0;
                for(int i = 0; i < 80; i++) { // Increased iterations
                    vec3 p = ro + rd * t;
                    d = map(p);
                    t += d;
                    if(d < 0.005 || t > 20.0) break;
                }

                vec3 col = vec3(0.02); // Darker background

                if(t < 20.0) {
                    vec3 p = ro + rd * t;
                    vec3 n = calcNormal(p);
                    vec3 r = reflect(rd, n);

                    // Enhanced Materials
                    vec3 gold = vec3(0.9, 0.75, 0.3); 
                    vec3 chrome = vec3(0.95);
                    
                    vec3 lightPos = vec3(2.0 * sin(u_time), 5.0, 5.0);
                    vec3 l = normalize(lightPos - p);
                    
                    float diff = max(dot(n, l), 0.0);
                    float spec = pow(max(dot(r, l), 0.0), 64.0);
                    float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);

                    // Environment mapping fakery (Studio lights)
                    float ref = smoothstep(-0.2, 0.2, r.y);
                    
                    vec3 baseColor = mix(gold, chrome, fresnel * 0.8);
                    col = baseColor * (diff * 0.6 + 0.4) + vec3(1.0) * spec * 1.5 + vec3(0.5) * ref * gold;
                }

                // Vignette
                col *= 1.0 - length(uv) * 0.5;

                gl_FragColor = vec4(col, 1.0);
            }
        `;

        const shaderProgram = gl.createProgram();
        if (!shaderProgram) return;

        const createShader = (type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        };

        const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
        const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);

        if (!vertexShader || !fragmentShader) return;

        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(shaderProgram, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const uResolution = gl.getUniformLocation(shaderProgram, 'u_resolution');
        const uTime = gl.getUniformLocation(shaderProgram, 'u_time');
        const uMouse = gl.getUniformLocation(shaderProgram, 'u_mouse');
        const uMorph = gl.getUniformLocation(shaderProgram, 'u_morph');

        let mouseX = 0, mouseY = 0;
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };
        window.addEventListener('mousemove', handleMouseMove);

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(uResolution, canvas.width, canvas.height);
        };
        window.addEventListener('resize', resize);
        resize();

        let startTime = performance.now();

        const render = () => {
            const currentTime = (performance.now() - startTime) / 1000;
            const cycleTime = currentTime / 5; 
            const morphValue = cycleTime % 4.0;
            
            const stage = Math.floor(morphValue);
            if (stage !== morphState) setMorphState(stage);

            gl.uniform1f(uTime, currentTime);
            gl.uniform2f(uMouse, mouseX, mouseY);
            gl.uniform1f(uMorph, morphValue);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', resize);
        };
    }, []);

    const boothTitles = ["ISLAND", "PENINSULA", "CORNER", "INLINE"];

    // Floating particles CSS
    const particles = Array.from({ length: 20 }).map((_, i) => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 5 + Math.random() * 10,
        delay: Math.random() * 5,
        size: 2 + Math.random() * 4
    }));

    return (
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-fann-black">
            <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full" />
            
            {/* Overlay Particles */}
            <div className="absolute inset-0 pointer-events-none z-10">
                {particles.map((p, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full bg-fann-gold/40 blur-[1px]"
                        style={{
                            left: p.left,
                            top: p.top,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`
                        }}
                    />
                ))}
            </div>

            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center pointer-events-none px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative"
                >
                    <h1 className="text-7xl md:text-9xl font-black text-center tracking-tighter leading-[0.85] text-chrome-3d mix-blend-overlay opacity-50 select-none">
                        DESIGN<br/>BUILD<br/>TRANSFORM
                    </h1>
                    <h1 className="absolute inset-0 text-7xl md:text-9xl font-black text-center tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white via-white/50 to-transparent select-none">
                        DESIGN<br/>BUILD<br/>TRANSFORM
                    </h1>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-12 flex flex-col items-center gap-6"
                >
                    <div className="glass-panel px-8 py-3 rounded-full border border-fann-gold/20 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-fann-gold font-mono text-sm tracking-[0.2em]">
                            MODE: {boothTitles[morphState % 4]}
                        </span>
                    </div>
                    <p className="text-gray-300 text-sm uppercase tracking-[0.3em] font-light">
                        Interactive Liquid Simulation
                    </p>
                </motion.div>
            </div>

            <div className="absolute bottom-16 w-full flex justify-center z-30 pointer-events-auto">
                <Link to="/contact">
                    <button className="btn-liquid text-lg group relative">
                        Start Your Project
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                    </button>
                </Link>
            </div>
        </div>
    );
};

// --- 3D CARD COMPONENT ---
const FeatureCard: React.FC<{ feature: any; index: number }> = ({ feature, index }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left - rect.width / 2);
        y.set(event.clientY - rect.top - rect.height / 2);
    }

    return (
        <ScrollReveal variant="fade-up" delay={index * 0.1} className="h-full">
            <motion.div
                style={{ rotateX, rotateY, perspective: 1000 }}
                onMouseMove={handleMouse}
                onMouseLeave={() => { x.set(0); y.set(0); }}
                className="liquid-border-container h-full cursor-pointer group"
            >
                <div className="relative h-full bg-fann-charcoal p-8 flex flex-col items-center justify-center z-10 transition-colors duration-300 group-hover:bg-[#1a1a1a]">
                    <div className="absolute inset-0 bg-gradient-to-br from-fann-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="mb-6 p-4 rounded-full bg-white/5 border border-white/10 group-hover:border-fann-gold/50 group-hover:bg-fann-gold/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                        <feature.icon className="w-10 h-10 text-gray-400 group-hover:text-fann-gold transition-colors" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white mb-3 tracking-wide group-hover:text-fann-gold transition-colors">{feature.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed text-center group-hover:text-gray-300 transition-colors">{feature.description}</p>
                </div>
            </motion.div>
        </ScrollReveal>
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
        <section className="py-32 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <ScrollReveal variant="fade-up">
                    <div className="text-center mb-20">
                        <span className="text-fann-gold font-bold uppercase tracking-[0.2em] text-xs mb-4 block">The FANN Distinction</span>
                        <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white tracking-tight">Why Leading Brands <br/><span className="text-liquid-gold">Choose Us</span></h2>
                        <p className="max-w-2xl mx-auto text-gray-400 text-lg font-light leading-relaxed">
                            We don't just build stands; we engineer success. Experience the difference of true partnership.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.title} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const ServicesOverview: React.FC = () => (
    <section className="py-32 relative border-t border-white/5 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-fann-gold/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-fann-dark-glass rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="grid lg:grid-cols-2 items-center gap-24">
                <ScrollReveal variant="fade-up">
                    <span className="text-fann-gold font-bold uppercase tracking-[0.2em] text-xs mb-2 block">Our Expertise</span>
                    <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 text-white leading-[1.1]">
                        Comprehensive <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Design Solutions</span>
                    </h2>
                    <p className="text-gray-400 mb-12 text-xl font-light leading-relaxed">
                        From the bustling aisles of GITEX to the exclusive corridors of private villas, we deliver excellence. Our <strong>Turnkey Services</strong> cover everything from initial <Link to="/fann-studio" className="text-fann-gold hover:underline decoration-1 underline-offset-4">smart generated concepts</Link> to final fabrication.
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-y-6 gap-x-8 mb-14">
                        {["Custom Stand Design", "Modular Systems", "Turnkey Management", "In-House Fabrication", "AV & Lighting", "Interior Fit-Out"].map((service, i) => (
                            <div key={service} className="flex items-center gap-4 group">
                                <div className="p-2 rounded-full bg-white/5 group-hover:bg-fann-gold/20 transition-colors">
                                    <CheckCircle className="w-4 h-4 text-fann-chrome group-hover:text-fann-gold transition-colors" />
                                </div>
                                <span className="font-medium text-gray-300 group-hover:text-white transition-colors tracking-wide text-lg">{service}</span>
                            </div>
                        ))}
                    </div>

                     <Link to="/services">
                        <button className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-none border border-white/20">
                            <div className="absolute inset-0 w-0 bg-fann-gold transition-all duration-[250ms] ease-out group-hover:w-full"></div>
                            <span className="relative text-white group-hover:text-black font-bold uppercase tracking-widest flex items-center gap-3">
                                Explore All Services <ArrowRight size={18} />
                            </span>
                        </button>
                    </Link>
                </ScrollReveal>

                <div className="relative">
                    <ScrollReveal variant="scale" className="relative z-10">
                        <div className="relative group">
                            {/* Liquid Blob Frame */}
                            <div className="absolute inset-0 bg-gradient-to-br from-fann-gold to-transparent rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-700 animate-blob"></div>
                            
                            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                                <img 
                                    src="https://images.pexels.com/photos/8199563/pexels-photo-8199563.jpeg?auto=compress&cs=tinysrgb&w=800&q=75" 
                                    alt="FANN Team"
                                    className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                                
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="glass-panel p-6 rounded-xl border-l-4 border-fann-gold">
                                        <p className="text-3xl font-serif font-bold text-white mb-1">200+ Successful Projects</p>
                                        <p className="text-sm text-gray-400 uppercase tracking-wider">Delivered across UAE & KSA</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </div>
    </section>
);

const EventsSection: React.FC = () => (
    <section className="py-32 relative border-y border-white/5 overflow-hidden bg-black/40 backdrop-blur-sm">
         <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center mb-16">
                <ScrollReveal variant="fade-up">
                    <span className="text-fann-gold font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Event Coverage</span>
                    <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 text-white tracking-tight">We Dominate The <br/> Major Venues</h2>
                    <p className="max-w-2xl mx-auto text-gray-400 text-lg font-light">
                        Deep experience at DWTC, ADNEC, and Riyadh Front ensuring a smooth, compliant, and stress-free exhibition experience.
                    </p>
                </ScrollReveal>
            </div>

            <ScrollReveal variant="scale">
                <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto">
                    {["GITEX Global", "Gulfood", "Arab Health", "The Big 5", "ATM", "ADIPEC", "Cityscape", "Intersec"].map((evt, i) => (
                        <Link key={evt} to="/events-calendar" className="group">
                            <motion.div 
                                whileHover={{ y: -5 }}
                                className="px-8 py-6 bg-[#111] border border-white/10 rounded-lg hover:border-fann-gold/50 hover:bg-[#1a1a1a] transition-all duration-300 cursor-pointer flex flex-col items-center gap-2 min-w-[160px]"
                            >
                                <Zap size={16} className="text-fann-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="font-bold text-gray-300 group-hover:text-white transition-colors uppercase tracking-wider text-sm">{evt}</span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </ScrollReveal>
            
            <div className="mt-20 text-center">
                 <Link to="/events-calendar" className="inline-flex items-center gap-2 text-white hover:text-fann-gold transition-colors border-b border-white/20 hover:border-fann-gold pb-1 uppercase tracking-widest text-xs font-bold">
                    View Full Events Calendar <ArrowRight size={14} />
                 </Link>
            </div>
        </div>
    </section>
);


const TestimonialsSection: React.FC = () => (
    <section className="py-32 relative">
        <div className="container mx-auto px-4">
            <ScrollReveal variant="fade-up">
                <div className="text-center mb-24">
                    <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white tracking-tight">Client Success</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-fann-gold to-transparent mx-auto"></div>
                </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {testimonials.map((testimonial, i) => (
                    <ScrollReveal key={i} variant="fade-up" delay={i * 0.1}>
                        <div className="glass-panel p-10 relative h-full rounded-none border-t-4 border-t-fann-gold group hover:-translate-y-2 transition-transform duration-500">
                            <div className="absolute -top-6 left-8 w-12 h-12 bg-fann-charcoal border border-fann-gold rounded-full flex items-center justify-center text-fann-gold">
                                <span className="font-serif text-2xl">"</span>
                            </div>
                            <div className="flex mb-6 mt-2">
                                {[1,2,3,4,5].map(star => <Star key={star} size={14} className="text-fann-gold fill-fann-gold mr-1 drop-shadow-lg" />)}
                            </div>
                            <p className="text-gray-300 mb-8 relative z-10 leading-loose text-lg font-light">
                                {testimonial.quote}
                            </p>
                            <div className="mt-auto pt-6 border-t border-white/5">
                                <p className="font-bold text-white text-lg uppercase tracking-wide">{testimonial.client}</p>
                                <p className="text-sm text-gray-500">{testimonial.company}</p>
                                <span className="inline-block mt-3 text-[10px] font-bold px-3 py-1 bg-white/5 rounded-full text-fann-gold uppercase tracking-wider border border-white/10">
                                    {testimonial.projectType}
                                </span>
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
        <div className="bg-fann-black text-white overflow-x-hidden selection:bg-fann-gold selection:text-black">
            <SEO
                title="Exhibition Stand Builders Dubai | FANN - Custom Stands UAE"
                description="Award-winning exhibition stand builders in Dubai. 200+ successful stands for GITEX, Gulfood, Arab Health. DMCC licensed. Same-day quote. Call +971-50-566-7502"
            />
            
            <BackgroundFlow />
            
            <LiquidMetalHero />
            <WhyChooseFann />
            <ServicesOverview />
            <EventsSection />
            <TestimonialsSection />
            
            {/* Final CTA Strip */}
            <section className="py-32 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-fann-gold via-[#e6c87a] to-fann-gold opacity-90"></div>
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-multiply"></div>
                 
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-5xl md:text-8xl font-serif font-black text-black mb-12 tracking-tight uppercase drop-shadow-sm">
                        Ready to <br/> stand out?
                    </h2>
                    <Link to="/contact">
                        <button className="bg-black text-white font-bold py-6 px-20 text-xl hover:scale-105 transition-transform duration-300 uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black hover:border-white rounded-none shadow-2xl">
                            Start Your Project
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;