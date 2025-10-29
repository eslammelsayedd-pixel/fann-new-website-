import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, LayoutGrid, SlidersHorizontal, Palette, User, ArrowLeft, Loader2 } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';
import { useApiKey } from '../context/ApiKeyProvider';

const studioSteps = [
    { name: 'Brief', icon: FileText },
    { name: 'Structure', icon: LayoutGrid },
    { name: 'Functionality', icon: SlidersHorizontal },
    { name: 'Aesthetics', icon: Palette },
    { name: 'Your Details', icon: User },
];

const StudioProgressBar = ({ currentStep }: { currentStep: number }) => (
    <div className="w-full max-w-4xl mx-auto mb-12">
        <div className="flex items-center justify-between">
            {studioSteps.map((step, index) => (
                <div key={step.name} className="flex flex-col items-center text-center w-24">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${index <= currentStep ? 'bg-white text-fann-teal-dark border-white' : 'border-white/50 text-white/50'}`}>
                        <step.icon size={24} />
                    </div>
                    <p className={`mt-2 text-sm font-medium ${index === currentStep ? 'text-white' : 'text-white/60'}`}>{step.name}</p>
                </div>
            ))}
        </div>
        <div className="relative mt-4 h-1 bg-white/20 rounded-full">
            <div 
                className="absolute top-0 left-0 h-1 bg-white rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / (studioSteps.length - 1)) * 100}%` }}
            />
        </div>
    </div>
);

const ExhibitionStudioPage: React.FC = () => {
    const [eventName, setEventName] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [industry, setIndustry] = useState('');
    const [standWidth, setStandWidth] = useState(11);
    const [standLength, setStandLength] = useState(6);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    const { handleApiError } = useApiKey();

    const analyzeIndustry = useCallback(async (name: string) => {
        if (!name.trim()) {
            setIndustry('');
            return;
        }
        setIsAnalyzing(true);
        try {
            const response = await fetch('/api/analyze-event-industry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventName: name }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to analyze industry.');
            }
            const data = await response.json();
            setIndustry(data.industry);
        } catch (e: any) {
            handleApiError(e);
            setIndustry('Could not analyze');
        } finally {
            setIsAnalyzing(false);
        }
    }, [handleApiError]);

    useEffect(() => {
        const handler = setTimeout(() => {
            analyzeIndustry(eventName);
        }, 800); // Debounce API call

        return () => {
            clearTimeout(handler);
        };
    }, [eventName, analyzeIndustry]);

    return (
        <AnimatedPage>
            <SEO
                title="Exhibition Studio | FANN"
                description="Design your exhibition stand concept with FANN's AI-powered studio. Define your brief and visualize your presence in minutes."
            />
            <div className="min-h-screen bg-fann-teal-dark pt-32 pb-20 text-white flex flex-col items-center px-4">
                <StudioProgressBar currentStep={0} />

                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-4xl bg-white dark:bg-fann-charcoal-light text-fann-teal-dark dark:text-fann-peach p-8 md:p-12 rounded-lg shadow-2xl"
                >
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
                        {/* Event Name */}
                        <div>
                            <label htmlFor="eventName" className="block text-sm font-medium mb-2">Event Name</label>
                            <input
                                type="text"
                                id="eventName"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                placeholder="e.g., GITEX Global"
                                className="w-full bg-fann-peach/50 dark:bg-fann-charcoal border border-fann-teal/20 dark:border-fann-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fann-accent-teal dark:focus:ring-fann-gold transition-shadow"
                            />
                        </div>

                        {/* Event Location */}
                        <div>
                            <label htmlFor="eventLocation" className="block text-sm font-medium mb-2">Event Location</label>
                            <input
                                type="text"
                                id="eventLocation"
                                value={eventLocation}
                                onChange={(e) => setEventLocation(e.target.value)}
                                placeholder="e.g., Dubai World Trade Centre"
                                className="w-full bg-fann-peach/50 dark:bg-fann-charcoal border border-fann-teal/20 dark:border-fann-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fann-accent-teal dark:focus:ring-fann-gold transition-shadow"
                            />
                        </div>

                        {/* Industry */}
                        <div className="md:col-span-2">
                             <label htmlFor="industry" className="block text-sm font-medium mb-2">Industry (Auto-detected)</label>
                             <div className="relative">
                                <input
                                    type="text"
                                    id="industry"
                                    value={industry}
                                    readOnly
                                    placeholder={isAnalyzing ? "Analyzing..." : "Analyzed from event name..."}
                                    className="w-full bg-gray-100 dark:bg-fann-charcoal border-none rounded-md px-4 py-2 italic cursor-not-allowed"
                                />
                                {isAnalyzing && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-fann-light-gray" />}
                             </div>
                        </div>

                        {/* Stand Width */}
                        <div>
                            <label htmlFor="standWidth" className="block text-sm font-medium mb-2">Stand Width (m): <span className="font-bold">{standWidth}</span></label>
                             <input
                                type="range"
                                id="standWidth"
                                min="1"
                                max="30"
                                value={standWidth}
                                onChange={(e) => setStandWidth(Number(e.target.value))}
                                className="w-full h-2 bg-gray-300 dark:bg-fann-charcoal rounded-lg appearance-none cursor-pointer accent-fann-accent-teal dark:accent-fann-gold"
                            />
                        </div>

                        {/* Stand Length */}
                        <div>
                            <label htmlFor="standLength" className="block text-sm font-medium mb-2">Stand Length (m): <span className="font-bold">{standLength}</span></label>
                            <input
                                type="range"
                                id="standLength"
                                min="1"
                                max="30"
                                value={standLength}
                                onChange={(e) => setStandLength(Number(e.target.value))}
                                className="w-full h-2 bg-gray-300 dark:bg-fann-charcoal rounded-lg appearance-none cursor-pointer accent-fann-accent-teal dark:accent-fann-gold"
                            />
                        </div>
                    </div>
                    
                    <div className="mt-12 flex justify-between items-center">
                        <Link to="/fann-studio" className="flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity">
                            <ArrowLeft size={16} />
                            Back
                        </Link>
                        {/* Next button will be added in subsequent steps */}
                    </div>
                </motion.div>
            </div>
        </AnimatedPage>
    );
};

export default ExhibitionStudioPage;