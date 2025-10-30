import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Building2, SlidersHorizontal, Palette, User, ArrowLeft, ArrowRight } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';

const steps = [
    { id: 1, name: 'Brief', icon: FileText },
    { id: 2, name: 'Structure', icon: Building2 },
    { id: 3, name: 'Functionality', icon: SlidersHorizontal },
    { id: 4, name: 'Aesthetics', icon: Palette },
    { id: 5, name: 'Your Details', icon: User },
];

const Stepper = ({ currentStep }: { currentStep: number }) => {
    return (
        <div className="w-full max-w-4xl mx-auto py-8">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-fann-teal/20 dark:bg-fann-border"></div>
                <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-fann-accent-teal dark:bg-fann-gold transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>
                {steps.map((step) => (
                    <div key={step.id} className="z-10 text-center">
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
                                currentStep >= step.id ? 'bg-fann-accent-teal dark:bg-fann-gold text-white dark:text-fann-charcoal' : 'bg-fann-peach/50 dark:bg-fann-accent-teal border-2 border-fann-teal/20 dark:border-fann-border'
                            }`}
                        >
                            <step.icon size={24} className={`${currentStep >= step.id ? '' : 'text-fann-teal/60 dark:text-fann-light-gray'}`} />
                        </div>
                        <p className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                            currentStep === step.id ? 'text-fann-teal dark:text-fann-peach' : 'text-fann-light-gray'
                        }`}>
                            {step.name}
                        </p>
                         {currentStep === step.id && (
                            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-20 h-1 bg-fann-accent-teal dark:bg-fann-gold rounded-full" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const Step1Brief = ({ formData, setFormData, onIndustryChange }: { formData: any, setFormData: Function, onIndustryChange: (industry: string) => void }) => {
    const [debouncedEventName, setDebouncedEventName] = useState('');

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedEventName(formData.eventName);
      }, 500); // 500ms debounce delay
  
      return () => {
        clearTimeout(handler);
      };
    }, [formData.eventName]);
    
    useEffect(() => {
        if (debouncedEventName) {
            // Mock industry analysis.
            const industries: { [key: string]: string } = {
                'gitex': 'Technology', 'arab health': 'Healthcare', 'gulfood': 'Food & Beverage',
                'cityscape': 'Real Estate', 'adipec': 'Energy', 'big 5': 'Construction'
            };
            const eventLower = debouncedEventName.toLowerCase();
            for (const key in industries) {
                if (eventLower.includes(key)) {
                    onIndustryChange(industries[key]);
                    return;
                }
            }
            onIndustryChange('Analysis in progress...');
        } else {
            onIndustryChange('');
        }
    }, [debouncedEventName, onIndustryChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });
    }

    return (
        <div className="space-y-8 text-fann-teal dark:text-fann-peach">
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm font-medium text-fann-teal/80 dark:text-fann-light-gray mb-1">Event Name</label>
                    <input type="text" name="eventName" value={formData.eventName} onChange={handleChange} placeholder="e.g., GITEX Global" className="w-full bg-transparent border-b-2 border-fann-teal/20 dark:border-fann-border focus:border-fann-accent-teal dark:focus:border-fann-gold focus:outline-none py-2"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-fann-teal/80 dark:text-fann-light-gray mb-1">Event Location</label>
                    <input type="text" name="eventLocation" value={formData.eventLocation} onChange={handleChange} placeholder="e.g., Dubai World Trade Centre" className="w-full bg-transparent border-b-2 border-fann-teal/20 dark:border-fann-border focus:border-fann-accent-teal dark:focus:border-fann-gold focus:outline-none py-2"/>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-fann-teal/80 dark:text-fann-light-gray mb-1">Industry (Auto-detected)</label>
                <input type="text" value={formData.industry} placeholder="Analyzed from event name..." readOnly className="w-full bg-fann-peach dark:bg-fann-teal-dark border-b-2 border-fann-teal/20 dark:border-fann-border py-2 px-3 cursor-not-allowed"/>
            </div>
            <div className="grid md:grid-cols-2 gap-8 pt-4">
                 <div>
                    <label className="block text-sm font-medium text-fann-teal/80 dark:text-fann-light-gray mb-2">Stand Width (m): <span className="font-bold text-fann-accent-teal dark:text-fann-gold">{formData.standWidth}</span></label>
                    <input type="range" name="standWidth" min="3" max="50" value={formData.standWidth} onChange={handleSliderChange} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-fann-teal/20 dark:bg-fann-border accent-fann-accent-teal dark:accent-fann-gold" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-fann-teal/80 dark:text-fann-light-gray mb-2">Stand Length (m): <span className="font-bold text-fann-accent-teal dark:text-fann-gold">{formData.standLength}</span></label>
                    <input type="range" name="standLength" min="3" max="50" value={formData.standLength} onChange={handleSliderChange} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-fann-teal/20 dark:bg-fann-border accent-fann-accent-teal dark:accent-fann-gold" />
                </div>
            </div>
        </div>
    );
};

const Step2Structure = () => (<div className="text-center p-8 text-fann-teal dark:text-fann-peach"><h2 className="text-2xl font-serif">Structure Details</h2><p className="text-fann-teal/80 dark:text-fann-light-gray mt-2">This step will include options for booth type, double deck, rigging, etc.</p></div>);
const Step3Functionality = () => (<div className="text-center p-8 text-fann-teal dark:text-fann-peach"><h2 className="text-2xl font-serif">Functionality Requirements</h2><p className="text-fann-teal/80 dark:text-fann-light-gray mt-2">This step will cover meeting rooms, storage, hospitality areas, and product displays.</p></div>);
const Step4Aesthetics = () => (<div className="text-center p-8 text-fann-teal dark:text-fann-peach"><h2 className="text-2xl font-serif">Aesthetic Preferences</h2><p className="text-fann-teal/80 dark:text-fann-light-gray mt-2">This step will allow you to choose design styles, materials, and lighting preferences.</p></div>);
const Step5YourDetails = () => (<div className="text-center p-8 text-fann-teal dark:text-fann-peach"><h2 className="text-2xl font-serif">Your Details</h2><p className="text-fann-teal/80 dark:text-fann-light-gray mt-2">This final step will collect your contact information to send you the design concept.</p></div>);


const ExhibitionStudioPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        eventName: '',
        eventLocation: '',
        industry: '',
        standWidth: 10,
        standLength: 6,
    });

    const nextStep = () => setStep(s => Math.min(s + 1, steps.length));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    
    const handleIndustryChange = useCallback((industry: string) => {
        setFormData(prev => ({ ...prev, industry }));
    }, []);

    const renderStepContent = () => {
        switch (step) {
            case 1: return <Step1Brief formData={formData} setFormData={setFormData} onIndustryChange={handleIndustryChange} />;
            case 2: return <Step2Structure />;
            case 3: return <Step3Functionality />;
            case 4: return <Step4Aesthetics />;
            case 5: return <Step5YourDetails />;
            default: return <Step1Brief formData={formData} setFormData={setFormData} onIndustryChange={handleIndustryChange} />;
        }
    };

    return (
        <AnimatedPage>
            <SEO
                title="Exhibition Design Brief | FANN Studio"
                description="Start designing your exhibition stand with our guided step-by-step brief. Provide your requirements to receive a custom concept from FANN."
            />
            <div className="min-h-screen bg-fann-peach dark:bg-fann-teal pt-24 pb-20 text-fann-teal dark:text-fann-peach">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Stepper currentStep={step} />

                    <div className="max-w-4xl mx-auto bg-fann-peach dark:bg-fann-teal p-8 sm:p-12 rounded-lg">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderStepContent()}
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-12 flex justify-between items-center">
                           <motion.button
                                onClick={prevStep}
                                className="flex items-center gap-2 text-fann-teal/80 dark:text-fann-light-gray font-semibold disabled:opacity-50"
                                disabled={step === 1}
                                whileHover={{ x: -2 }}
                                whileTap={{ x: 1 }}
                            >
                                <ArrowLeft size={16} /> Back
                            </motion.button>
                            
                            {step < steps.length ? (
                                <motion.button
                                    onClick={nextStep}
                                    className="bg-fann-accent-teal dark:bg-fann-gold text-white dark:text-fann-charcoal font-bold py-3 px-8 rounded-full flex items-center gap-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Next <ArrowRight size={16} />
                                </motion.button>
                            ) : (
                                <motion.button
                                    className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Submit & Get Design
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ExhibitionStudioPage;