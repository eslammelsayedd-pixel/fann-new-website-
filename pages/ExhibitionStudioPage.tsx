import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Palette, Sparkles, SlidersHorizontal, Check, Globe, ArrowRight, ArrowLeft, Briefcase, Mail, Phone, Calendar, MapPin, Users, Ruler, Activity, AlertCircle } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';

const boothTypes = ['Island (4-side open)', 'Peninsula (3-side open)', 'Corner (2-side open)', 'Inline (1-side open)'];
const designStyles = ['Luxurious & Elegant', 'Minimalist & Clean', 'High-Tech & Futuristic', 'Bold & Experiential', 'Warm & Natural'];
const featureOptions = ['Private Meeting Room', 'Hospitality Bar', 'LED Screen Wall', 'Product Display Pods', 'Interactive Demo Area', 'Storage Room'];
const eventTypes = ['Exhibition', 'Product Launch', 'Conference', 'Gala', 'Corporate Event', 'Summit'];

const steps = [
    { id: 1, title: 'Basics' },
    { id: 2, title: 'Event' },
    { id: 3, title: 'Specs' },
    { id: 4, title: 'Style' },
    { id: 5, title: 'Features' }
];

// Reusable Components
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
    <div className="mb-12 relative px-4">
        <div className="flex justify-between items-center relative z-10">
            {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                
                return (
                    <div key={step.id} className="flex flex-col items-center">
                        <motion.div 
                            initial={false}
                            animate={{
                                backgroundColor: isActive ? '#D4AF76' : isCompleted ? '#333' : '#1a1a1a',
                                borderColor: isActive ? '#D4AF76' : isCompleted ? '#333' : '#333',
                                color: isActive ? '#000' : isCompleted ? '#fff' : '#666',
                                scale: isActive ? 1.1 : 1
                            }}
                            className={`w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-300 shadow-lg`}
                        >
                            {isCompleted ? <Check size={16} /> : step.id}
                        </motion.div>
                        <span className={`text-[10px] md:text-xs mt-3 font-bold tracking-widest uppercase ${isActive ? 'text-fann-gold' : isCompleted ? 'text-white' : 'text-gray-700'}`}>
                            {step.title}
                        </span>
                    </div>
                );
            })}
        </div>
        <div className="absolute top-4 md:top-5 left-0 w-full px-8 -z-0">
             <div className="h-0.5 bg-gray-800 w-full rounded-full overflow-hidden">
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
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={onClick}
        className={`relative p-6 rounded-none border text-left transition-all duration-300 group overflow-hidden w-full ${
            isSelected 
            ? 'border-fann-gold bg-fann-gold/10' 
            : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
        }`}
    >
        <div className="flex items-center justify-between z-10 relative">
            <span className={`font-semibold text-lg tracking-wide ${isSelected ? 'text-fann-gold' : 'text-gray-300 group-hover:text-white'}`}>{label}</span>
            {isSelected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={20} className="text-fann-gold" /></motion.div>}
        </div>
    </motion.button>
);

interface ValidationErrors {
    [key: string]: boolean;
}

const ExhibitionStudioPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [shake, setShake] = useState(false);

    const [formData, setFormData] = useState({
        companyName: '',
        eventType: 'Exhibition',
        contactName: '',
        email: '',
        phone: '',
        websiteUrl: '',
        eventName: '',
        eventDate: '',
        eventLocation: '',
        footfall: '',
        standWidth: 6,
        standLength: 3,
        boothType: 'Inline (1-side open)',
        style: 'Modern & Corporate',
        features: [] as string[],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: false }));
        }
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });
    };

    const handleOptionClick = (field: string, value: string) => {
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

    const validateStep = (step: number) => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.companyName) newErrors.companyName = true;
            if (!formData.contactName) newErrors.contactName = true;
            if (!formData.email) newErrors.email = true;
        } else if (step === 2) {
             if (!formData.eventName) newErrors.eventName = true;
             if (!formData.eventDate) newErrors.eventDate = true;
             if (!formData.eventLocation) newErrors.eventLocation = true;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setShake(true);
            setTimeout(() => setShake(false), 500);
            isValid = false;
        }

        return isValid;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            navigate('/fann-studio/exhibition/result', { 
                state: { 
                    formData: {
                        ...formData,
                        boothSize: formData.standWidth * formData.standLength,
                    }
                } 
            });
        }
    };

    const getInputClass = (fieldName: string) => `input-premium ${errors[fieldName] ? 'input-error' : ''}`;

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-sans font-bold text-white mb-2">Company Essentials</h2>
                            <p className="text-gray-400">Let's start with the basics.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Company Name*</label>
                                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className={getInputClass('companyName')} placeholder="e.g. TechGlobal" />
                                {errors.companyName && <span className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={10} /> Required</span>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Event Type</label>
                                <select name="eventType" value={formData.eventType} onChange={handleInputChange} className="input-premium appearance-none">
                                    {eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Contact Name*</label>
                                <input type="text" name="contactName" value={formData.contactName} onChange={handleInputChange} className={getInputClass('contactName')} placeholder="Full Name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Work Email*</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={getInputClass('email')} placeholder="name@company.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Phone</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input-premium" placeholder="+971..." />
                            </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Website</label>
                                <input type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleInputChange} className="input-premium" placeholder="https://..." />
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-sans font-bold text-white mb-2">Event Context</h2>
                            <p className="text-gray-400">Where are we building?</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                             <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Event Name*</label>
                                <input type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} className={getInputClass('eventName')} placeholder="e.g. GITEX Global" />
                            </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Date*</label>
                                <input type="date" name="eventDate" value={formData.eventDate} onChange={handleInputChange} className={getInputClass('eventDate')} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Venue / Location*</label>
                                <input type="text" name="eventLocation" value={formData.eventLocation} onChange={handleInputChange} className={getInputClass('eventLocation')} placeholder="e.g. DWTC" />
                            </div>
                        </div>
                    </motion.div>
                );
            case 3: 
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                         <div className="text-center mb-6">
                            <h2 className="text-3xl font-sans font-bold text-white mb-2">Space Dimensions</h2>
                            <p className="text-gray-400">Define your footprint.</p>
                        </div>
                        
                        <div className="bg-[#151515] p-8 border border-white/5 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10"><Ruler size={100} className="text-fann-gold"/></div>
                            <div className="flex justify-between items-end mb-10 relative z-10">
                                <span className="text-4xl font-bold text-fann-gold">{formData.standWidth * formData.standLength} <span className="text-lg text-gray-400">sqm</span></span>
                                <span className="text-sm font-mono text-gray-500 uppercase">
                                    {formData.standWidth}m width × {formData.standLength}m length
                                </span>
                            </div>
                            <div className="space-y-8 relative z-10">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-fann-gold uppercase tracking-widest mb-4"><span>Width</span><span>{formData.standWidth}m</span></div>
                                    <input type="range" name="standWidth" min="3" max="50" value={formData.standWidth} onChange={handleSliderChange} className="w-full h-1 bg-gray-800 appearance-none cursor-pointer accent-fann-gold" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-fann-gold uppercase tracking-widest mb-4"><span>Length</span><span>{formData.standLength}m</span></div>
                                    <input type="range" name="standLength" min="3" max="50" value={formData.standLength} onChange={handleSliderChange} className="w-full h-1 bg-gray-800 appearance-none cursor-pointer accent-fann-gold" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Configuration</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                         <div className="text-center mb-10">
                            <h2 className="text-3xl font-sans font-bold text-white mb-2">Visual Identity</h2>
                            <p className="text-gray-400">Choose your aesthetic direction.</p>
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
                         <div className="mt-8 p-4 border border-fann-gold/20 bg-fann-gold/5 flex items-start gap-4">
                            <Palette className="text-fann-gold flex-shrink-0 mt-1" />
                            <p className="text-sm text-gray-300">
                                <strong>Smart Analysis:</strong> We will automatically analyze your website to extract brand colors and integrate them into the chosen style.
                            </p>
                        </div>
                    </motion.div>
                );
            case 5: 
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-sans font-bold text-white mb-2">Functionality</h2>
                            <p className="text-gray-400">Select key features.</p>
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
                        <div className="mt-12 pt-8 border-t border-white/10">
                            <h4 className="text-fann-gold font-bold mb-6 text-sm uppercase tracking-widest">Summary</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-400">
                                <div><p className="text-xs text-gray-600 uppercase">Company</p><p className="text-white">{formData.companyName}</p></div>
                                <div><p className="text-xs text-gray-600 uppercase">Event</p><p className="text-white">{formData.eventName}</p></div>
                                <div><p className="text-xs text-gray-600 uppercase">Size</p><p className="text-white">{formData.standWidth}m x {formData.standLength}m</p></div>
                                <div><p className="text-xs text-gray-600 uppercase">Style</p><p className="text-white">{formData.style}</p></div>
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <AnimatedPage>
            <SEO title="Exhibition Stand Designer | FANN Studio" description="Design your custom exhibition stand." />
            <div className="min-h-screen bg-[#050505] pt-32 pb-20 text-white selection:bg-fann-gold selection:text-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center p-4 border border-white/10 bg-white/5 rounded-none mb-6">
                            <Building2 className="h-8 w-8 text-fann-gold" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-sans font-bold text-white mb-4 tracking-tight">Exhibition Designer</h1>
                        <p className="text-xl text-gray-500">Create a world-class concept in 5 simple steps.</p>
                    </div>

                    <motion.div 
                        className={`bg-[#0A0A0A] border border-white/5 p-6 sm:p-12 shadow-2xl relative overflow-hidden ${shake ? 'animate-shake' : ''}`}
                    >
                        <StepIndicator currentStep={currentStep} totalSteps={steps.length} />

                        <form onSubmit={handleSubmit} className="relative z-10 min-h-[400px] flex flex-col justify-between">
                            {renderStepContent()}

                            <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className={`flex items-center gap-2 font-bold uppercase tracking-widest text-sm transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-500 hover:text-white'}`}
                                >
                                    <ArrowLeft size={16} /> Back
                                </button>

                                {currentStep < steps.length ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="btn-secondary flex items-center gap-3"
                                    >
                                        Next <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="btn-primary flex items-center gap-3"
                                    >
                                        <Sparkles size={16} /> Generate Concept
                                    </button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ExhibitionStudioPage;