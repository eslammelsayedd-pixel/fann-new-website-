import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Building2, Palette, Sparkles, SlidersHorizontal, Check, Globe, ArrowRight, ArrowLeft } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';

const boothTypes = ['Island (4-side open)', 'Peninsula (3-side open)', 'Corner (2-side open)', 'Inline (1-side open)'];
const designStyles = ['Luxurious & Elegant', 'Minimalist & Clean', 'High-Tech & Futuristic', 'Bold & Experiential', 'Warm & Natural'];
const featureOptions = ['Private Meeting Room', 'Hospitality Bar', 'LED Screen Wall', 'Product Display Pods', 'Interactive Demo Area', 'Storage Room'];

const steps = ['Brief', 'Structure', 'Aesthetics', 'Functionality'];

const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
    <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => {
                const stepNum = index + 1;
                const isActive = stepNum === currentStep;
                const isCompleted = stepNum < currentStep;
                
                return (
                    <div key={step} className="flex flex-col items-center relative z-10">
                        <motion.div 
                            initial={false}
                            animate={{
                                backgroundColor: isActive || isCompleted ? '#D4AF76' : '#1a1a1a',
                                borderColor: isActive || isCompleted ? '#D4AF76' : '#333333',
                                color: isActive || isCompleted ? '#1a1a1a' : '#A99E96',
                            }}
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-colors duration-300`}
                        >
                            {isCompleted ? <Check size={18} /> : stepNum}
                        </motion.div>
                        <span className={`text-xs mt-2 font-medium tracking-wide ${isActive ? 'text-fann-gold' : 'text-fann-light-gray'}`}>
                            {step}
                        </span>
                    </div>
                );
            })}
            {/* Connecting Line */}
            <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-800 -z-0 transform -translate-y-1/2 px-4 sm:px-10">
                <motion.div 
                    className="h-full bg-fann-gold" 
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>
        </div>
    </div>
);

const OptionCard: React.FC<{ label: string; isSelected: boolean; onClick: () => void; }> = ({ label, isSelected, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`relative p-4 rounded-xl border-2 text-left transition-all duration-300 group overflow-hidden ${
            isSelected 
            ? 'border-fann-gold bg-fann-gold/10 shadow-[0_0_15px_rgba(212,175,118,0.3)]' 
            : 'border-white/10 bg-white/5 hover:border-fann-gold/50 hover:bg-white/10'
        }`}
    >
        <div className="flex items-center justify-between z-10 relative">
            <span className={`font-semibold ${isSelected ? 'text-fann-gold' : 'text-gray-300 group-hover:text-white'}`}>{label}</span>
            {isSelected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={18} className="text-fann-gold" /></motion.div>}
        </div>
    </button>
);

const ExhibitionStudioPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: '',
        websiteUrl: '',
        eventName: '',
        standWidth: 10,
        standLength: 6,
        boothType: 'Island (4-side open)',
        style: 'Luxurious & Elegant',
        features: ['Hospitality Bar', 'LED Screen Wall', 'Private Meeting Room'],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });
    };

    const handleOptionClick = (field: 'boothType' | 'style', value: string) => {
        setFormData({ ...formData, [field]: value });
    };
    
    const handleFeatureChange = (feature: string) => {
        setFormData(prev => {
            const newFeatures = prev.features.includes(feature)
                ? prev.features.filter(f => f !== feature)
                : [...prev.features, feature];
            return { ...prev, features: newFeatures };
        });
    };

    const nextStep = () => {
        // Basic validation
        if (currentStep === 1) {
            if (!formData.companyName || !formData.eventName) return; // Add visual error handling ideally
        }
        setCurrentStep(prev => Math.min(prev + 1, steps.length));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/fann-studio/exhibition/result', { 
            state: { 
                formData: {
                    ...formData,
                    boothSize: formData.standWidth * formData.standLength,
                }
            } 
        });
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-serif font-bold text-fann-peach">Project Essentials</h2>
                            <p className="text-fann-light-gray">Start by telling us about your brand and the event.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-fann-gold ml-1">Company Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input type="text" name="companyName" placeholder="e.g. Acme Corp" value={formData.companyName} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-fann-gold focus:ring-1 focus:ring-fann-gold transition-all text-white placeholder-gray-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-fann-gold ml-1">Event Name</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input type="text" name="eventName" placeholder="e.g. GITEX Global" value={formData.eventName} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-fann-gold focus:ring-1 focus:ring-fann-gold transition-all text-white placeholder-gray-500" />
                                </div>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-fann-gold ml-1">Website URL <span className="text-gray-500 font-normal">(Optional - for brand analysis)</span></label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input type="url" name="websiteUrl" placeholder="https://example.com" value={formData.websiteUrl} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-fann-gold focus:ring-1 focus:ring-fann-gold transition-all text-white placeholder-gray-500" />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-8">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-serif font-bold text-fann-peach">Stand Structure</h2>
                            <p className="text-fann-light-gray">Define the dimensions and layout of your space.</p>
                        </div>
                        
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-bold text-lg text-white">Stand Dimensions</span>
                                <span className="text-fann-gold font-mono bg-fann-gold/10 px-3 py-1 rounded-lg">
                                    {formData.standWidth}m × {formData.standLength}m ({formData.standWidth * formData.standLength} sqm)
                                </span>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm text-gray-400 mb-2"><span>Width</span><span>{formData.standWidth}m</span></div>
                                    <input type="range" name="standWidth" min="3" max="50" value={formData.standWidth} onChange={handleSliderChange} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-fann-gold" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm text-gray-400 mb-2"><span>Length</span><span>{formData.standLength}m</span></div>
                                    <input type="range" name="standLength" min="3" max="50" value={formData.standLength} onChange={handleSliderChange} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-fann-gold" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-fann-gold mb-3 ml-1">Booth Configuration</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {boothTypes.map(type => (
                                    <OptionCard 
                                        key={type} 
                                        label={type} 
                                        isSelected={formData.boothType === type} 
                                        onClick={() => handleOptionClick('boothType', type)} 
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-serif font-bold text-fann-peach">Visual Style</h2>
                            <p className="text-fann-light-gray">Choose the aesthetic that best represents your brand.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {designStyles.map(style => (
                                <OptionCard 
                                    key={style} 
                                    label={style} 
                                    isSelected={formData.style === style} 
                                    onClick={() => handleOptionClick('style', style)} 
                                />
                            ))}
                        </div>
                        <div className="bg-fann-gold/10 p-4 rounded-xl flex items-start gap-3 border border-fann-gold/20">
                            <Palette className="text-fann-gold flex-shrink-0 mt-1" size={20} />
                            <p className="text-sm text-fann-peach/80">
                                <strong>Tip:</strong> Our AI will analyze your website (if provided) to ensure the generated concept aligns with your existing brand colors and identity, blending it with the selected style.
                            </p>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                         <div className="text-center mb-6">
                            <h2 className="text-2xl font-serif font-bold text-fann-peach">Key Features</h2>
                            <p className="text-fann-light-gray">What functional elements does your stand need?</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {featureOptions.map(feature => (
                                <OptionCard 
                                    key={feature} 
                                    label={feature} 
                                    isSelected={formData.features.includes(feature)} 
                                    onClick={() => handleFeatureChange(feature)} 
                                />
                            ))}
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 mt-6">
                            <h4 className="text-fann-gold font-bold mb-2 flex items-center gap-2"><SlidersHorizontal size={16}/> Summary</h4>
                            <ul className="text-sm text-gray-400 space-y-1">
                                <li>• {formData.companyName} at {formData.eventName}</li>
                                <li>• {formData.standWidth}m x {formData.standLength}m {formData.boothType}</li>
                                <li>• {formData.style} Style</li>
                                <li>• {formData.features.length} features selected</li>
                            </ul>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AnimatedPage>
            <SEO
                title="Exhibition Design Brief | FANN Studio"
                description="Start designing your exhibition stand with our guided step-by-step brief."
            />
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-fann-peach">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center p-3 bg-fann-gold/10 rounded-full mb-4">
                            <Building2 className="h-8 w-8 text-fann-gold" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">Exhibition Studio</h1>
                        <p className="text-lg text-gray-400">Design your perfect stand in 4 simple steps.</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-fann-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                        <StepIndicator currentStep={currentStep} totalSteps={steps.length} />

                        <form onSubmit={handleSubmit} className="relative z-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="min-h-[300px]"
                                >
                                    {renderStepContent()}
                                </motion.div>
                            </AnimatePresence>

                            <div className="flex justify-between items-center mt-12 pt-6 border-t border-white/10">
                                {currentStep > 1 ? (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/5"
                                    >
                                        <ArrowLeft size={18} /> Back
                                    </button>
                                ) : (
                                    <div></div> // Spacer
                                )}

                                {currentStep < steps.length ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={!formData.companyName || !formData.eventName}
                                        className="flex items-center gap-2 bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-fann-gold/20"
                                    >
                                        Next Step <ArrowRight size={18} />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full hover:bg-white transition-all shadow-lg shadow-fann-gold/20 hover:shadow-fann-gold/40 transform hover:-translate-y-1"
                                    >
                                        <Sparkles size={18} /> Generate Concept
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ExhibitionStudioPage;
