import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Award, Wrench, Users, Headset, ShieldCheck, CheckCircle, Play, ArrowRight, Star } from 'lucide-react';
import { testimonials } from '../constants';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

// --- WEBGL LIQUID HERO ENGINE ---
const LiquidMetalHero: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [morphState, setMorphState] = useState(0); // 0:Island, 1:Peninsula, 2:Corner, 3:Inline

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

        // 2. FRAGMENT SHADER (Raymarching Liquid SDFs)
        const fsSource = `
            precision highp float;
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec2 u_mouse;
            uniform float u_morph; // 0.0 to 3.0

            // SDF Primitives
            float sdBox(vec3 p, vec3 b) {
                vec3 q = abs(p) - b;
                return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
            }

            // Smooth Min for Liquid blending
            float smin(float a, float b, float k) {
                float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
                return mix(b, a, h) - k * h * (1.0 - h);
            }

            // Rotation
            mat2 rot(float a) {
                float s = sin(a), c = cos(a);
                return mat2(c, -s, s, c);
            }

            // Scene Map
            float map(vec3 p) {
                // Mouse Interaction (Ferrofluid attraction)
                vec2 m = (u_mouse / u_resolution) * 2.0 - 1.0;
                m.x *= u_resolution.x / u_resolution.y;
                // Invert Y for mouse
                m.y *= -1.0;
                
                float dMouse = length(p.xy - m * 4.0) - 0.5;
                
                // Morphing Shapes
                // 0: Island (Cube)
                float d1 = sdBox(p, vec3(1.2));
                
                // 1: Peninsula (U-Shape)
                vec3 p2 = p;
                p2.x += 0.5;
                float d2_outer = sdBox(p2, vec3(1.5, 1.2, 1.2));
                float d2_inner = sdBox(p2 + vec3(1.0, 0.0, 0.0), vec3(1.0, 2.0, 0.8));
                float d2 = max(d2_outer, -d2_inner);

                // 2: Corner (L-Shape)
                vec3 p3 = p;
                float d3_a = sdBox(p3 + vec3(0.8, 0.0, 0.0), vec3(0.5, 1.2, 1.2));
                float d3_b = sdBox(p3 + vec3(-0.8, 0.0, 0.8), vec3(1.2, 1.2, 0.5));
                float d3 = smin(d3_a, d3_b, 0.2);

                // 3: Inline (Wall)
                float d4 = sdBox(p + vec3(0.0, 0.0, 0.5), vec3(2.5, 1.2, 0.2));

                // Interpolate based on u_morph
                float d = d1;
                float t = u_morph;
                
                if (t < 1.0) d = mix(d1, d2, t);
                else if (t < 2.0) d = mix(d2, d3, t - 1.0);
                else d = mix(d3, d4, t - 2.0);

                // Liquid Distortion (Ripples)
                float ripple = sin(p.y * 5.0 + u_time * 2.0) * 0.05 + sin(p.x * 4.0 + u_time * 1.5) * 0.05;
                d += ripple;

                // Blend with mouse
                return smin(d, dMouse, 0.8);
            }

            // Normal Calculation
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
                
                // Camera
                vec3 ro = vec3(0.0, 0.0, 5.0); // Ray Origin
                vec3 rd = normalize(vec3(uv, -1.0)); // Ray Direction

                // Raymarching
                float t = 0.0;
                float d = 0.0;
                for(int i = 0; i < 64; i++) {
                    vec3 p = ro + rd * t;
                    d = map(p);
                    t += d;
                    if(d < 0.01 || t > 20.0) break;
                }

                vec3 col = vec3(0.05); // Dark Background

                if(t < 20.0) {
                    vec3 p = ro + rd * t;
                    vec3 n = calcNormal(p);
                    vec3 r = reflect(rd, n);

                    // Gold/Liquid Chrome Material
                    vec3 gold = vec3(0.83, 0.68, 0.21); // #D4AF37
                    vec3 chrome = vec3(0.9);
                    
                    // Lighting
                    vec3 lightPos = vec3(2.0, 5.0, 5.0);
                    vec3 l = normalize(lightPos - p);
                    float diff = max(dot(n, l), 0.0);
                    float spec = pow(max(dot(r, l), 0.0), 32.0);
                    float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);

                    // Environment Reflection Approximation
                    float ref = smoothstep(-0.5, 0.5, r.y);
                    
                    // Combine
                    vec3 baseColor = mix(gold, chrome, fresnel * 0.5);
                    col = baseColor * (diff * 0.8 + 0.2) + vec3(1.0) * spec + vec3(0.5) * ref * gold;
                }

                gl_FragColor = vec4(col, 1.0);
            }
        `;

        // 3. BOILERPLATE SETUP
        const shaderProgram = gl.createProgram();
        if (!shaderProgram) return;

        const createShader = (type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
        const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);

        if (!vertexShader || !fragmentShader) return;

        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);

        // Buffer Setup
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(shaderProgram, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Uniforms
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

        // Resize Handler
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(uResolution, canvas.width, canvas.height);
        };
        window.addEventListener('resize', resize);
        resize();

        // Animation Loop
        let startTime = performance.now();
        let currentMorph = 0;
        let targetMorph = 0;

        const render = () => {
            const currentTime = (performance.now() - startTime) / 1000;
            
            // Smooth Morph Transition
            targetMorph = (Math.floor(currentTime / 5) % 4); // Cycle every 5 seconds
            // Lerp currentMorph towards targetMorph
            // Handle wrapping: if target is 0 and current is 3, we want to animate forward? 
            // Simple approach: just lerp values. 
            // For 0->1->2->3->0 cycle, we might need a continuous variable.
            // Let's use a continuous time-based morph.
            const cycleTime = currentTime / 5; // 0.0 -> 1.0 -> 2.0 -> 3.0 -> 4.0...
            const morphValue = cycleTime % 4.0; // 0 to 3.999
            
            // Update React State for Text Overlay (Debounced)
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
    }, []); // Dependencies empty to run once

    const boothTitles = ["ISLAND CONFIGURATION", "PENINSULA CONFIGURATION", "CORNER CONFIGURATION", "INLINE CONFIGURATION"];

    return (
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-fann-black">
            <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full" />
            
            <div className="absolute inset-0 z-10 flex flex-col justify-center items-center pointer-events-none">
                <motion.h1 
                    className="text-6xl md:text-8xl lg:text-9xl font-black text-center tracking-tighter leading-none text-chrome-3d"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    DESIGN.<br/>BUILD.<br/><span className="text-liquid-gold">TRANSFORM.</span>
                </motion.h1>
                
                <div className="mt-8 flex flex-col items-center gap-4">
                    <div className="px-6 py-2 border border-fann-gold/30 rounded-full bg-black/50 backdrop-blur-md">
                        <span className="text-fann-gold font-mono text-sm tracking-[0.2em] animate-pulse">
                            MODE: {boothTitles[morphState % 4]}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm uppercase tracking-widest">Interactive Liquid Simulation</p>
                </div>
            </div>

            <div className="absolute bottom-10 w-full flex justify-center z-20 pointer-events-auto">
                <Link to="/contact">
                    <button className="btn-liquid shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                        Start Your Project
                    </button>
                </Link>
            </div>
        </div>
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
        <section id="showcase" className="py-32 bg-fann-black text-center relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <ScrollReveal variant="fade-up">
                    <span className="text-fann-gold font-bold uppercase tracking-widest text-xs mb-4 block">The FANN Distinction</span>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 text-white tracking-tight">Why Leading Brands Choose Us</h2>
                    <p className="max-w-3xl mx-auto text-gray-400 mb-20 text-lg font-light leading-relaxed">
                        We don't just build stands; we engineer success. Our in-house capabilities and DMCC licensing ensure a seamless, risk-free experience.
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {features.map((feature, index) => (
                        <ScrollReveal key={feature.title} variant="fade-up" delay={index * 0.1}>
                            <div className="group card-liquid p-8 h-full flex flex-col items-center justify-center rounded-xl">
                                <div className="mb-6 text-gray-500 group-hover:text-fann-gold transition-colors duration-300 transform group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
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
    <section className="py-32 bg-[#0F0F0F] relative border-t border-white/5">
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
                            <div key={service} className="flex items-center gap-3 group">
                                <CheckCircle className="w-5 h-5 text-fann-chrome group-hover:text-fann-gold transition-colors flex-shrink-0" />
                                <span className="font-medium text-gray-300 group-hover:text-white transition-colors tracking-wide">{service}</span>
                            </div>
                        ))}
                    </div>

                     <Link to="/services">
                        <button className="flex items-center gap-2 text-white font-bold uppercase tracking-wider group hover:text-fann-gold transition-colors text-sm">
                            Explore All Services 
                            <span className="bg-white/10 group-hover:bg-fann-gold group-hover:text-black text-white w-10 h-10 flex items-center justify-center transition-all duration-300 rounded-full ml-4 shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.5)]">
                                <ArrowRight size={18} />
                            </span>
                        </button>
                    </Link>
                </ScrollReveal>

                <div className="relative">
                    <ScrollReveal variant="parallax" className="relative z-10">
                        <div className="relative group rounded-2xl overflow-hidden border border-white/10 hover:border-fann-gold/50 transition-colors duration-500">
                            <div className="absolute inset-0 bg-fann-gold/0 group-hover:bg-fann-gold/10 transition-colors duration-500 z-10 mix-blend-overlay"></div>
                            <img 
                                src="https://images.pexels.com/photos/8199563/pexels-photo-8199563.jpeg?auto=compress&cs=tinysrgb&w=800&q=75" 
                                alt="FANN Team"
                                className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700 shadow-2xl scale-100 group-hover:scale-105"
                            />
                        </div>
                    </ScrollReveal>
                    <ScrollReveal variant="scale" delay={0.2} className="absolute -bottom-12 -left-12 z-20 hidden md:block">
                        <div className="bg-fann-charcoal p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-md rounded-xl">
                            <p className="text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-fann-gold to-white mb-2">200+</p>
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
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-fann-gold/5 blur-[150px] rounded-full pointer-events-none"></div>
         
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
                            <div className="px-10 py-5 border border-white/10 bg-white/5 hover:bg-fann-gold/20 hover:border-fann-gold/50 hover:text-white transition-all duration-300 cursor-pointer backdrop-blur-sm rounded-full">
                                <span className="font-bold text-gray-300 group-hover:text-fann-gold transition-colors uppercase tracking-wider text-sm group-hover:drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]">{evt}</span>
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
    <section className="py-32 bg-[#080808] relative">
        <div className="container mx-auto px-4">
            <ScrollReveal variant="fade-up">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4 text-white tracking-tight">Client Success</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-fann-gold to-transparent mx-auto mt-6"></div>
                </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {testimonials.map((testimonial, i) => (
                    <ScrollReveal key={i} variant="fade-up" delay={i * 0.1}>
                        <div className="card-liquid p-12 relative h-full rounded-2xl group hover:-translate-y-2">
                            <div className="absolute top-8 left-8 text-6xl text-fann-gold/10 font-serif group-hover:text-fann-gold/30 transition-colors">"</div>
                            <div className="flex mb-4">
                                {[1,2,3,4,5].map(star => <Star key={star} size={14} className="text-fann-gold fill-fann-gold mr-1 drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]" />)}
                            </div>
                            <p className="text-gray-300 mb-8 relative z-10 leading-relaxed text-lg font-light italic">
                                {testimonial.quote}
                            </p>
                            <div className="mt-auto pt-6 border-t border-white/5 group-hover:border-fann-gold/20 transition-colors">
                                <p className="font-bold text-white text-lg uppercase tracking-wide">{testimonial.client}</p>
                                <p className="text-sm text-gray-500">{testimonial.company}</p>
                                <p className="text-xs text-fann-gold mt-2 uppercase tracking-wide font-bold drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]">{testimonial.projectType}</p>
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
            <LiquidMetalHero />
            <WhyChooseFann />
            <ServicesOverview />
            <EventsSection />
            <TestimonialsSection />
            
            {/* Final CTA Strip */}
            <section className="py-28 bg-fann-gold relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-multiply"></div>
                 <div className="absolute inset-0 bg-gradient-to-r from-fann-gold via-[#e6c87a] to-fann-gold opacity-90"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-serif font-black text-black mb-10 tracking-tight uppercase drop-shadow-sm">Ready to stand out?</h2>
                    <Link to="/contact">
                        <button className="bg-black text-white font-bold py-6 px-16 text-lg hover:scale-105 transition-transform uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black hover:border-white rounded-none shadow-2xl">
                            Start Your Project
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;