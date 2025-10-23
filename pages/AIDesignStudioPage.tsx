import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import { Building, Crown, PenTool } from 'lucide-react';

// Import the actual page components to be rendered as tabs
import ExhibitionStudioPage from './ExhibitionStudioPage';
import EventStudioPage from './EventStudioPage';
import InteriorStudioPage from './InteriorStudioPage';

const studioOptions = [
    { id: 'exhibition', name: 'Exhibition Studio', icon: Building, component: <ExhibitionStudioPage /> },
    { id: 'events', name: 'Event Studio', icon: Crown, component: <EventStudioPage /> },
    { id: 'interior-design', name: 'Interior Design Studio', icon: PenTool, component: <InteriorStudioPage />, isComingSoon: true },
];

const AIDesignStudioPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeStudioId = searchParams.get('studio') || 'exhibition';
    
    const activeStudio = studioOptions.find(s => s.id === activeStudioId) || studioOptions[0];

    const handleStudioChange = (id: string) => {
        setSearchParams({ studio: id });
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-fann-gold mb-4">AI Design Studio</h1>
                        <p className="text-xl text-fann-cream max-w-3xl mx-auto">
                            Your vision, realized in minutes. Select a studio to begin creating with the power of generative AI.
                        </p>
                    </div>

                    {/* Studio Navigation Tabs */}
                    <div className="flex justify-center border-b border-fann-border mb-12">
                        {studioOptions.map((studio) => (
                            <button
                                key={studio.id}
                                onClick={() => handleStudioChange(studio.id)}
                                className={`relative flex items-center gap-3 px-4 md:px-6 py-4 text-sm font-semibold transition-colors ${activeStudioId === studio.id ? 'text-fann-gold' : 'text-fann-light-gray hover:text-white'}`}
                            >
                                <studio.icon size={20} />
                                <span>{studio.name}</span>
                                {studio.isComingSoon && <span className="hidden md:inline-block text-xs bg-fann-light-gray text-fann-charcoal font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ml-2">Soon</span>}
                                {activeStudioId === studio.id && (
                                    <motion.div
                                        className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-fann-gold"
                                        layoutId="underline"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Render Active Studio */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStudioId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeStudio.component}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default AIDesignStudioPage;