import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sofa, Lightbulb, Sparkles, Loader2, ServerCrash, ArrowLeft } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';

interface DesignConcept {
    conceptName: string;
    detailedDescription: string;
    materials: string[];
    lighting: string;
    furnitureStyle: string[];
}

interface GeneratedDesign {
    designConcept: DesignConcept;
    image: string; // base64
}

const InfoCard = ({ icon: Icon, title, items }: { icon: React.ElementType, title: string, items: string[] | string }) => (
    <div className="bg-white/5 dark:bg-fann-teal/50 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
            <Icon className="w-6 h-6 text-fann-gold" />
            <h3 className="text-xl font-serif font-bold text-fann-peach">{title}</h3>
        </div>
        {Array.isArray(items) ? (
            <ul className="space-y-2 list-disc list-inside text-fann-light-gray">
                {items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        ) : (
            <p className="text-fann-light-gray">{items}</p>
        )}
    </div>
);

const InteriorResultPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { formData } = location.state || {};

    const [design, setDesign] = useState<GeneratedDesign | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!formData) {
            navigate('/fann-studio/interior');
            return;
        }

        const generateDesign = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/generate-interior-design', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to generate design.');
                }
                
                const data: GeneratedDesign = await response.json();
                setDesign(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        generateDesign();
    }, [formData, navigate]);

    return (
        <AnimatedPage>
            <SEO
                title={isLoading ? "Generating Your Interior Concept..." : design?.designConcept.conceptName || "Interior Concept"}
                description="Your bespoke AI-generated interior design concept from FANN Studio."
            />
            <div className="min-h-screen bg-fann-teal-dark pt-32 pb-20 text-fann-peach">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                    <Link to="/fann-studio/interior" className="flex items-center gap-2 text-fann-gold mb-8 font-semibold hover:underline">
                        <ArrowLeft size={16} /> Back to Brief
                    </Link>
                    
                    <AnimatePresence mode="wait">
                        {isLoading && (
                            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20">
                                <Loader2 className="w-16 h-16 text-fann-gold animate-spin mx-auto" />
                                <h1 className="text-4xl font-serif mt-6">Generating Your Vision...</h1>
                                <p className="text-fann-light-gray mt-2">This may take up to a minute. Our AI is crafting a unique concept for you.</p>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20 bg-red-900/20 border border-red-500 rounded-lg">
                                 <ServerCrash className="w-16 h-16 text-red-400 mx-auto" />
                                <h1 className="text-4xl font-serif mt-6 text-red-300">An Error Occurred</h1>
                                <p className="text-red-300/80 mt-2 max-w-2xl mx-auto">{error}</p>
                            </motion.div>
                        )}
                        
                        {design && !isLoading && (
                            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="text-center mb-12">
                                    <h1 className="text-5xl font-serif font-bold text-fann-gold mb-2">{design.designConcept.conceptName}</h1>
                                    <p className="text-xl text-fann-light-gray">Your AI-Generated 3D Render for {formData.projectName}</p>
                                </div>
                                <div className="bg-fann-teal p-2 rounded-lg shadow-2xl mb-12">
                                    <img 
                                        src={`data:image/jpeg;base64,${design.image}`} 
                                        alt={design.designConcept.conceptName} 
                                        className="w-full rounded-md" 
                                        width="1136"
                                        height="639"
                                        loading="lazy"
                                    />
                                </div>
                                
                                <div className="max-w-4xl mx-auto text-center mb-12">
                                     <h2 className="text-3xl font-serif text-fann-peach mb-4">Concept Overview</h2>
                                     <p className="text-lg text-fann-light-gray leading-relaxed">{design.designConcept.detailedDescription}</p>
                                </div>
                                
                                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                                    <InfoCard icon={Palette} title="Key Materials" items={design.designConcept.materials} />
                                    <InfoCard icon={Lightbulb} title="Lighting Strategy" items={design.designConcept.lighting} />
                                    <InfoCard icon={Sparkles} title="Key Features" items={formData.features} />
                                    <InfoCard icon={Sofa} title="Furniture Style" items={design.designConcept.furnitureStyle} />
                                </div>

                                <div className="mt-16 text-center bg-fann-teal p-8 rounded-lg">
                                    <h2 className="text-3xl font-serif font-bold text-fann-gold">Ready for the Next Step?</h2>
                                    <p className="max-w-2xl mx-auto text-fann-light-gray my-4">Our expert team is ready to turn this concept into reality. Contact us for a detailed proposal and pricing.</p>
                                    <Link to="/contact">
                                        <motion.button 
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider"
                                        >
                                            Get a Quote
                                        </motion.button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default InteriorResultPage;