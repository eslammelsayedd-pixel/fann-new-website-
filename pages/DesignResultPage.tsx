
import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Lightbulb, Wrench, ArrowLeft, Loader2, ServerCrash, Sparkles, MessageSquare } from 'lucide-react';
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
    <div className="bg-white/5 dark:bg-fann-teal/50 p-6 rounded-none border border-white/10">
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
                    <Link to="/fann-studio/exhibition" className="flex items-center gap-2 text-fann-gold mb-8 font-semibold hover:underline uppercase tracking-widest text-xs">
                        <ArrowLeft size={14} /> Back to Brief
                    </Link>
                    
                    <AnimatePresence mode="wait">
                        {isLoading && (
                            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-fann-gold/20 rounded-full blur-xl animate-pulse"></div>
                                    <Loader2 className="w-16 h-16 text-fann-gold animate-spin relative z-10" />
                                </div>
                                <h1 className="text-4xl font-serif mt-8 text-white">Crafting Your Vision...</h1>
                                <div className="mt-4 space-y-2 text-fann-light-gray font-mono text-sm">
                                    <p>Analysing Brand Identity...</p>
                                    <p>Generating 3D Concepts (Option A & B)...</p>
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
                                        Industry: {result.industry}
                                    </span>
                                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">Design Concepts</h1>
                                </div>

                                {/* Custom Tab Switcher */}
                                <div className="flex justify-center mb-12">
                                    <div className="bg-[#111] p-1 rounded-full border border-white/10 flex relative">
                                        <button 
                                            onClick={() => setActiveTab('A')}
                                            className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 relative z-10 ${activeTab === 'A' ? 'text-black' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            Option 1
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('B')}
                                            className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 relative z-10 ${activeTab === 'B' ? 'text-black' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            Option 2
                                        </button>
                                        {/* Sliding Background */}
                                        <motion.div 
                                            className="absolute top-1 bottom-1 bg-fann-gold rounded-full shadow-lg"
                                            layoutId="activeTab"
                                            initial={false}
                                            animate={{ 
                                                left: activeTab === 'A' ? '4px' : '50%', 
                                                right: activeTab === 'A' ? '50%' : '4px',
                                                width: 'calc(50% - 4px)'
                                            }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    </div>
                                </div>

                                {/* Main Content Area */}
                                <div className="grid lg:grid-cols-12 gap-8">
                                    {/* Image Side */}
                                    <div className="lg:col-span-8">
                                        <motion.div 
                                            key={activeTab} // Trigger animation on tab switch
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.4 }}
                                            className="bg-black border border-white/10 p-2 shadow-2xl relative group overflow-hidden"
                                        >
                                            {activeConcept.image ? (
                                                <img 
                                                    src={`data:image/jpeg;base64,${activeConcept.image}`} 
                                                    alt={activeConcept.conceptName} 
                                                    className="w-full" 
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-96 flex items-center justify-center bg-gray-900 text-gray-600">
                                                    Image Generation Failed
                                                </div>
                                            )}
                                            <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-md text-fann-gold border border-fann-gold/30 px-6 py-2 text-xs font-bold uppercase tracking-widest">
                                                {activeConcept.style}
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Info Side */}
                                    <div className="lg:col-span-4 flex flex-col justify-center">
                                         <motion.div
                                            key={`${activeTab}-info`}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.4 }}
                                         >
                                            <h2 className="text-3xl font-serif text-white mb-4 leading-tight">{activeConcept.conceptName}</h2>
                                            <p className="text-gray-400 leading-relaxed mb-8 border-l-2 border-fann-gold pl-4">
                                                {activeConcept.description}
                                            </p>

                                            <div className="space-y-4">
                                                <InfoCard icon={Sparkles} title="Key Feature" items={activeConcept.keyFeature} />
                                                <InfoCard icon={Layers} title="Material Palette" items={activeConcept.materials} />
                                                <InfoCard icon={Wrench} title="Requirements Met" items={formData.features} />
                                            </div>
                                         </motion.div>
                                    </div>
                                </div>

                                {/* CTA Section */}
                                <div className="mt-16 bg-[#151515] p-8 md:p-12 border border-white/10 text-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                                    
                                    <h2 className="text-3xl font-serif font-bold text-white mb-4">Bring this concept to life</h2>
                                    <p className="max-w-xl mx-auto text-gray-400 mb-8">
                                        Speak directly with a sales agent to discuss pricing and technical details for <strong>{activeConcept.conceptName}</strong>.
                                    </p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <a 
                                            href={`https://wa.me/971505667502?text=${encodeURIComponent(`Hi FANN, I'm interested in the "${activeConcept.conceptName}" concept generated for ${formData.companyName}.`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-10 rounded-none text-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#25D366]/20"
                                        >
                                            <MessageSquare size={20} fill="currentColor" /> Speak to Sales Agent
                                        </a>
                                        <Link to="/contact">
                                            <button className="border-2 border-white/20 hover:bg-white hover:text-black text-white font-bold py-4 px-10 rounded-none text-lg uppercase tracking-wider transition-all w-full sm:w-auto">
                                                Request Formal Quote
                                            </button>
                                        </Link>
                                    </div>
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
