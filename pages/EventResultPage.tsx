import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Clapperboard, Music, Sparkles, Loader2, ServerCrash, ArrowLeft, MessageSquare, RefreshCw, Lightbulb } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';

interface Concept {
    conceptName: string;
    style: string;
    detailedDescription: string;
    decorElements: string[];
    lighting: string;
    engagementTech: string[];
    image: string; // base64
}

interface GeneratedResult {
    industry: string;
    conceptA: Concept;
    conceptB: Concept;
    conceptC: Concept;
    conceptD: Concept;
}

const InfoCard = ({ icon: Icon, title, items }: { icon: React.ElementType, title: string, items: string[] | string }) => (
    <div className="bg-white/5 p-6 rounded-sm border border-white/10 h-full">
        <div className="flex items-center gap-3 mb-3">
            <Icon className="w-5 h-5 text-fann-gold" />
            <h3 className="text-lg font-serif font-bold text-white">{title}</h3>
        </div>
        {Array.isArray(items) ? (
            <ul className="space-y-2 list-disc list-inside text-sm text-gray-300">
                {items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        ) : (
            <p className="text-sm text-gray-300">{items}</p>
        )}
    </div>
);

const EventResultPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { formData } = location.state || {};

    const [result, setResult] = useState<GeneratedResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C' | 'D'>('A');

    useEffect(() => {
        if (!formData) {
            navigate('/fann-studio/event');
            return;
        }

        const generateDesign = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/generate-event-design', {
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

    const getActiveConcept = () => {
        if (!result) return null;
        switch(activeTab) {
            case 'A': return result.conceptA;
            case 'B': return result.conceptB;
            case 'C': return result.conceptC;
            case 'D': return result.conceptD;
            default: return result.conceptA;
        }
    };

    const activeConcept = getActiveConcept();

    return (
        <AnimatedPage>
            <SEO
                title={isLoading ? "Curating Experiences..." : "Your Event Concepts | FANN"}
                description="View your bespoke AI-generated event concepts."
            />
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <Link to="/fann-studio/event" className="flex items-center gap-2 text-fann-gold mb-8 font-semibold hover:underline uppercase tracking-widest text-xs">
                        <ArrowLeft size={14} /> Back to Studio
                    </Link>
                    
                    <AnimatePresence mode="wait">
                        {isLoading && (
                            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-fann-gold/20 rounded-full blur-xl animate-pulse"></div>
                                    <Loader2 className="w-16 h-16 text-fann-gold animate-spin relative z-10" />
                                </div>
                                <h1 className="text-4xl font-serif mt-8 text-white">Orchestrating Your Vision...</h1>
                                <div className="mt-4 space-y-2 text-gray-400 font-mono text-sm">
                                    <p>Curating 4 Distinct Concepts...</p>
                                    <p>Designing Immersive Atmospheres...</p>
                                    <p>Rendering 3D Mood Boards...</p>
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20 bg-red-900/20 border border-red-500 rounded-lg">
                                 <ServerCrash className="w-16 h-16 text-red-400 mx-auto" />
                                <h1 className="text-4xl font-serif mt-6 text-red-300">Creation Failed</h1>
                                <p className="text-red-300/80 mt-2 max-w-2xl mx-auto">{error}</p>
                                <button onClick={() => navigate('/fann-studio/event')} className="mt-8 bg-red-500/20 hover:bg-red-500/40 text-red-200 px-6 py-3 rounded-full transition-colors">
                                    Try Again
                                </button>
                            </motion.div>
                        )}
                        
                        {result && activeConcept && !isLoading && (
                            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="text-center mb-8">
                                    <span className="text-fann-gold text-xs font-bold uppercase tracking-widest border border-fann-gold/30 px-3 py-1 rounded-full bg-fann-gold/5 mb-4 inline-block">
                                        Event Context: {result.industry || 'Corporate'}
                                    </span>
                                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">Your 4 Concepts</h1>
                                </div>

                                {/* Tab Switcher */}
                                <div className="flex flex-wrap justify-center gap-2 mb-12">
                                    {['A', 'B', 'C', 'D'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab as any)}
                                            className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 border ${
                                                activeTab === tab 
                                                ? 'bg-fann-gold text-black border-fann-gold' 
                                                : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'
                                            }`}
                                        >
                                            Concept {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Main Content Area */}
                                <div className="grid lg:grid-cols-12 gap-8">
                                    {/* Image Side */}
                                    <div className="lg:col-span-8">
                                        <motion.div 
                                            key={activeTab}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.4 }}
                                            className="bg-black border border-white/10 p-2 shadow-2xl relative group overflow-hidden"
                                        >
                                            {activeConcept.image ? (
                                                <img 
                                                    src={`data:image/jpeg;base64,${activeConcept.image}`} 
                                                    alt={activeConcept.conceptName} 
                                                    className="w-full object-cover aspect-video" 
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full aspect-video flex items-center justify-center bg-gray-900 text-gray-600">
                                                    Image generation unavailable.
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
                                            className="h-full flex flex-col"
                                         >
                                            <h2 className="text-3xl font-serif text-white mb-4 leading-tight">{activeConcept.conceptName}</h2>
                                            <p className="text-gray-300 leading-relaxed mb-8 border-l-2 border-fann-gold pl-4 text-sm">
                                                {activeConcept.detailedDescription}
                                            </p>

                                            <div className="space-y-4 flex-grow">
                                                <InfoCard icon={Palette} title="Decor Elements" items={activeConcept.decorElements} />
                                                <InfoCard icon={Lightbulb} title="Lighting" items={activeConcept.lighting} />
                                                <InfoCard icon={Sparkles} title="Engagement Tech" items={activeConcept.engagementTech} />
                                            </div>
                                         </motion.div>
                                    </div>
                                </div>

                                {/* CTA Section */}
                                <div className="mt-16 bg-fann-charcoal-light p-8 md:p-12 border border-white/10 text-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                                    
                                    <div className="relative z-10">
                                        <h2 className="text-3xl font-serif font-bold text-white mb-6">Ready to make this happen?</h2>
                                        
                                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                            <a 
                                                href={`https://wa.me/971505667502?text=${encodeURIComponent(`Hi FANN, I generated event concepts for ${formData.eventName} and would like to discuss refinements.`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-8 rounded-sm text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-lg w-full sm:w-auto"
                                            >
                                                <RefreshCw size={20} /> Discuss via WhatsApp
                                            </a>
                                            <a 
                                                href={`https://wa.me/971505667502?text=${encodeURIComponent(`Hi FANN, I'm interested in Event Concept ${activeTab}: "${activeConcept.conceptName}" generated for ${formData.eventName}.`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="border-2 border-white/20 hover:bg-white hover:text-black text-white font-bold py-4 px-8 rounded-sm text-sm uppercase tracking-wider transition-all w-full sm:w-auto flex items-center justify-center gap-3"
                                            >
                                                <MessageSquare size={20} /> Get a Quote for Concept {activeTab}
                                            </a>
                                        </div>
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

export default EventResultPage;