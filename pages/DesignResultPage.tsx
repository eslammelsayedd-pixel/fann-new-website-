import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Lightbulb, Wrench, ArrowLeft, Loader2, ServerCrash, Zap, Sparkles, MessageSquare } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';

interface Concept {
    conceptName: string;
    style: string;
    description: string;
    materials: string[];
    keyFeature: string;
    image: string; // base64
}

interface GeneratedResult {
    industry: string;
    conceptA: Concept;
    conceptB: Concept;
}

const InfoCard = ({ icon: Icon, title, items }: { icon: React.ElementType, title: string, items: string[] | string }) => (
    <div className="bg-white/5 dark:bg-fann-teal/50 p-6 rounded-lg border border-white/5">
        <div className="flex items-center gap-3 mb-3">
            <Icon className="w-5 h-5 text-fann-gold" />
            <h3 className="text-lg font-serif font-bold text-fann-peach">{title}</h3>
        </div>
        {Array.isArray(items) ? (
            <ul className="space-y-2 list-disc list-inside text-sm text-fann-light-gray">
                {items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        ) : (
            <p className="text-sm text-fann-light-gray">{items}</p>
        )}
    </div>
);

const DesignResultPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { formData } = location.state || {};

    const [result, setResult] = useState<GeneratedResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');

    useEffect(() => {
        if (!formData) {
            navigate('/fann-studio/exhibition');
            return;
        }

        const generateDesign = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/generate-exhibition-design', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to generate design.');
                }
                
                const data: GeneratedResult = await response.json();
                setResult(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        generateDesign();
    }, [formData, navigate]);

    const activeConcept = activeTab === 'A' ? result?.conceptA : result?.conceptB;

    return (
        <AnimatedPage>
            <SEO
                title={isLoading ? "Generating Concepts..." : "Your Custom Concepts | FANN"}
                description="View your bespoke AI-generated exhibition stand concepts."
            />
            <div className="min-h-screen bg-fann-teal-dark pt-32 pb-20 text-fann-peach">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <Link to="/fann-studio/exhibition" className="flex items-center gap-2 text-fann-gold mb-8 font-semibold hover:underline">
                        <ArrowLeft size={16} /> Back to Brief
                    </Link>
                    
                    <AnimatePresence mode="wait">
                        {isLoading && (
                            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-fann-gold/20 rounded-full blur-xl animate-pulse"></div>
                                    <Loader2 className="w-16 h-16 text-fann-gold animate-spin relative z-10" />
                                </div>
                                <h1 className="text-4xl font-serif mt-8 text-white">Analyzing {formData.websiteUrl}...</h1>
                                <div className="mt-4 space-y-2 text-fann-light-gray font-mono text-sm">
                                    <p>Identifying Brand Identity...</p>
                                    <p>Detecting Industry Vertical...</p>
                                    <p>Generating Concept Options A & B...</p>
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20 bg-red-900/20 border border-red-500 rounded-lg">
                                 <ServerCrash className="w-16 h-16 text-red-400 mx-auto" />
                                <h1 className="text-4xl font-serif mt-6 text-red-300">Generation Failed</h1>
                                <p className="text-red-300/80 mt-2 max-w-2xl mx-auto">{error}</p>
                                <button onClick={() => navigate('/fann-studio/exhibition')} className="mt-8 bg-red-500/20 hover:bg-red-500/40 text-red-200 px-6 py-3 rounded-full transition-colors">
                                    Try Again
                                </button>
                            </motion.div>
                        )}
                        
                        {result && activeConcept && !isLoading && (
                            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="text-center mb-8">
                                    <span className="text-fann-gold text-xs font-bold uppercase tracking-widest border border-fann-gold/30 px-3 py-1 rounded-full bg-fann-gold/5 mb-4 inline-block">
                                        Industry Detected: {result.industry}
                                    </span>
                                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">Your Design Concepts</h1>
                                    <p className="text-fann-light-gray">Two unique approaches tailored for {formData.companyName}</p>
                                </div>

                                {/* Tabs */}
                                <div className="flex justify-center mb-8">
                                    <div className="bg-[#151515] p-1 rounded-full border border-white/10 flex">
                                        <button 
                                            onClick={() => setActiveTab('A')}
                                            className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'A' ? 'bg-fann-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            Option 1
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('B')}
                                            className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'B' ? 'bg-fann-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            Option 2
                                        </button>
                                    </div>
                                </div>

                                {/* Main Content Area */}
                                <div className="grid lg:grid-cols-12 gap-8">
                                    {/* Image Side */}
                                    <div className="lg:col-span-8">
                                        <motion.div 
                                            key={activeTab} // Trigger animation on tab switch
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.4 }}
                                            className="bg-black border border-white/10 p-2 rounded-xl shadow-2xl relative group overflow-hidden"
                                        >
                                            <img 
                                                src={`data:image/jpeg;base64,${activeConcept.image}`} 
                                                alt={activeConcept.conceptName} 
                                                className="w-full rounded-lg" 
                                                loading="lazy"
                                            />
                                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-wider">
                                                {activeConcept.style}
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Info Side */}
                                    <div className="lg:col-span-4 flex flex-col justify-center">
                                         <motion.div
                                            key={`${activeTab}-info`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: 0.1 }}
                                         >
                                            <h2 className="text-3xl font-serif text-white mb-4 leading-tight">{activeConcept.conceptName}</h2>
                                            <p className="text-gray-400 leading-relaxed mb-8 border-l-2 border-fann-gold pl-4">
                                                {activeConcept.description}
                                            </p>

                                            <div className="space-y-4">
                                                <InfoCard icon={Sparkles} title="Standout Feature" items={activeConcept.keyFeature} />
                                                <InfoCard icon={Layers} title="Key Materials" items={activeConcept.materials} />
                                                <InfoCard icon={Wrench} title="Essentials Included" items={formData.features} />
                                            </div>
                                         </motion.div>
                                    </div>
                                </div>

                                {/* CTA Section */}
                                <div className="mt-16 bg-gradient-to-r from-[#1a1a1a] to-[#0A0A0A] p-8 md:p-12 rounded-2xl border border-fann-gold/30 text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-fann-gold/5 rounded-full blur-3xl pointer-events-none"></div>
                                    
                                    <h2 className="text-3xl font-serif font-bold text-white mb-4">Want to realize this vision?</h2>
                                    <p className="max-w-xl mx-auto text-gray-400 mb-8">
                                        These concepts are just the beginning. Speak directly with our design team to refine these options and get a full technical proposal.
                                    </p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <a 
                                            href={`https://wa.me/971505667502?text=${encodeURIComponent(`Hi FANN, I just generated a design concept for ${formData.companyName} using your AI Studio. I'd like to discuss the "${activeConcept.conceptName}" option.`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-10 rounded-full text-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#25D366]/30"
                                        >
                                            <MessageSquare size={20} fill="currentColor" /> Chat with an Expert
                                        </a>
                                        <Link to="/contact">
                                            <button className="border-2 border-white/20 hover:bg-white hover:text-black text-white font-bold py-4 px-10 rounded-full text-lg uppercase tracking-wider transition-all w-full sm:w-auto">
                                                Request Full Quote
                                            </button>
                                        </Link>
                                    </div>
                                    <p className="mt-4 text-xs text-gray-500">Typical response time: Under 10 minutes</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default DesignResultPage;