
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Crown, Palette, Sparkles, SlidersHorizontal, Users, Check, ArrowLeft, ArrowRight, Building, Mail, Phone, Calendar, MapPin, Music, Mic2, Wine, Lightbulb, Aperture, Loader2, AlertTriangle } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';

const eventTypes = [
    { id: 'Gala Dinner', label: 'Gala Dinner', icon: <Wine size={24} /> },
    { id: 'Product Launch', label: 'Product Launch', icon: <RocketIcon /> },
    { id: 'Conference', label: 'Conference', icon: <Mic2 size={24} /> },
    { id: 'Brand Activation', label: 'Activation', icon: <Aperture size={24} /> },
    { id: 'Award Ceremony', label: 'Award Show', icon: <Crown size={24} /> },
    { id: 'Networking', label: 'Networking', icon: <Users size={24} /> }
];

function RocketIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>;
}

const featuresList = [
    'Stage & AV Production', 'Immersive Projection', 'Live Entertainment',
    'VIP Lounge Area', 'Interactive Photo Ops', 'Sustainable Decor',
    'Catering & Bar Station', 'Registration Tech', 'Social Media Wall',
    'Custom Fabrication', 'Outdoor Cooling', 'Holographic Display'
];

const countryCodes = [
    { code: '+971', country: 'UAE' },
    { code: '+966', country: 'KSA' },
    { code: '+974', country: 'QAT' },
    { code: '+973', country: 'BHR' },
    { code: '+968', country: 'OMN' },
    { code: '+965', country: 'KWT' },
    { code: '+44', country: 'UK' },
    { code: '+1', country: 'USA' },
    { code: 'Other', country: 'Other' }
];

const steps = [
    { id: 1, title: 'The Vision' },
    { id: 2, title: 'The Experience' }
];

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
                                backgroundColor: isActive ? '#C9A962' : isCompleted ? '#333' : '#1a1a1a',
                                borderColor: isActive ? '#C9A962' : isCompleted ? '#333' : '#333',
                                color: isActive ? '#000' : isCompleted ? '#fff' : '#666',
                                scale: isActive ? 1.1 : 1
                            }}
                            className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-lg z-20`}
                        >
                            {isCompleted ? <Check size={18} /> : step.id}
                        </motion.div>
                        <span className={`text-xs mt-3 font-bold tracking-widest uppercase ${isActive ? 'text-fann-gold' : isCompleted ? 'text-white' : 'text-gray-700'}`}>
                            {step.title}
                        </span>
                    </div>
                );
            })}
        </div>
        <div className="absolute top-5 left-0 w-full px-8 -z-0">
             <div className="h-0.5 bg-gray-800 w-full rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-fann-gold/50 to-fann-gold"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>
        </div>
    </div>
);


const EventStudioPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<{[key: string]: boolean | string}>({});
    const [detectedVibe, setDetectedVibe] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        // Step 1
        companyName: '',
        eventName: '',
        eventDate: '',
        location: '',
        guestCount: 200,
        eventType: 'Gala Dinner',
        brief: '',
        // Step 2
        features: [] as string[],
        // Step 3
        firstName: '',
        lastName: '',
        email: '',
        countryCode: '+971',
        phone: '',
    });

    // Simulating AI Analysis for "Vibe"
    useEffect(() => {
        if (formData.eventType && formData.eventName.length > 3) {
            const timer = setTimeout(() => {
                const vibes = ['Elegant', 'High-Tech', 'Corporate', 'Celebratory', 'Networking-Focused'];
                setDetectedVibe(vibes[Math.floor(Math.random() * vibes.length)]);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [formData.eventName, formData.eventType]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[e.target.name];
                return newErrors;
            });
        }
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });
    };

    const handleFeatureChange = (feature: string) => {
        setFormData(prev => {
            const newFeatures = prev.features.includes(feature)
                ? prev.features.filter(f => f !== feature)
                : [...prev.features, feature];
            return { ...prev, features: newFeatures };
        });
    };

    const nextStep = () => { setErrors({}); setCurrentStep(prev => Math.min(prev + 1, steps.length)); };
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/fann-studio/event/result', { state: { formData: { ...formData, attendees: formData.guestCount, brandColors: [], detectedIndustry: '', style: formData.brief || formData.eventType } } });
    };

    const getInputClass = (fieldName: string) => `w-full bg-transparent border-b border-white/20 py-4 text-base text-white placeholder-gray-600 transition-all duration-300 focus:outline-none focus:border-fann-gold rounded-none font-light ${errors[fieldName] ? 'border-red-500' : ''}`;

    return (
        <AnimatedPage>
            <SEO
                title="Event Design Studio | FANN"
                description="Create stunning mood boards and concept visuals for your next corporate event."
            />
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white selection:bg-fann-gold selection:text-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 tracking-tight">Event Studio</h1>
                        <p className="text-xl text-gray-500 mb-6">Design your event in 2 steps. See concepts before sharing contact details.</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fann-gold/10 border border-fann-gold/20 text-fann-gold/80 text-xs font-semibold">
                            <AlertTriangle size={14} />
                            <span>Beta Preview: AI concepts are for creative exploration only.</span>
                        </div>
                    </div>

                    <div className="bg-fann-charcoal-light border border-white/5 p-4 sm:p-12 shadow-2xl relative overflow-hidden rounded-sm min-h-[600px] flex flex-col">

                        <StepIndicator currentStep={currentStep} totalSteps={steps.length} />

                        <AnimatePresence mode="wait">
                            {Object.keys(errors).length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-red-900/20 border border-red-500/50 text-red-200 p-3 rounded mb-6 text-center text-sm font-semibold"
                                >
                                    Please check your entries. {errors.email && typeof errors.email === 'string' && `(${errors.email})`}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-between">
                            <div className="flex-grow">
                                {currentStep === 1 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-serif text-white">The Vision</h2>
                                            <p className="text-gray-500 text-sm">Set the stage for your event.</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Host Company</label>
                                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className={getInputClass('companyName')} placeholder="e.g. Emaar" />
                                                </div>
                                                <div className="relative">
                                                    <label className="text-xs font-bold text-fann-gold uppercase tracking-widest flex justify-between">
                                                        Event Name
                                                        {detectedVibe && <span className="text-green-400 flex items-center gap-1 lowercase normal-case animate-pulse"><Sparkles size={10}/> {detectedVibe} vibe detected</span>}
                                                    </label>
                                                    <input type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} className={getInputClass('eventName')} placeholder="e.g. Annual Gala 2025" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Date</label>
                                                    <input type="date" name="eventDate" value={formData.eventDate} onChange={handleInputChange} className={getInputClass('eventDate')} />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Venue/Location</label>
                                                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} className={getInputClass('location')} placeholder="e.g. Armani Hotel, Dubai" />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <label className="text-xs font-bold text-fann-gold uppercase tracking-widest mb-4 block">Event Type</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {eventTypes.map(type => (
                                                            <button
                                                                key={type.id}
                                                                type="button"
                                                                onClick={() => setFormData({...formData, eventType: type.id})}
                                                                className={`p-3 border flex flex-col items-center justify-center gap-2 text-xs transition-all rounded-sm h-24 ${formData.eventType === type.id ? 'border-fann-gold bg-fann-gold text-black font-bold' : 'border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5'}`}
                                                            >
                                                                {type.icon}
                                                                {type.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-fann-gold uppercase tracking-widest mb-2 block flex justify-between">
                                                        Guest Count <span className="text-white font-mono">{formData.guestCount}</span>
                                                    </label>
                                                    <input
                                                        type="range"
                                                        name="guestCount"
                                                        min="50" max="5000" step="50"
                                                        value={formData.guestCount}
                                                        onChange={handleSliderChange}
                                                        className="w-full h-1 bg-gray-700 appearance-none cursor-pointer accent-fann-gold"
                                                    />
                                                    <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono uppercase"><span>50</span><span>5000+</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 2 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                                        <div className="text-center mb-6">
                                            <h2 className="text-2xl font-serif text-white">The Experience</h2>
                                            <p className="text-gray-500 text-sm">Curate the atmosphere.</p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-fann-gold uppercase tracking-widest mb-4 block">Your Brief / Theme</label>
                                            <textarea
                                                name="brief"
                                                value={formData.brief}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className="w-full bg-white/5 border border-white/10 p-4 text-white text-base placeholder-gray-500 focus:border-fann-gold focus:outline-none rounded-sm resize-none"
                                                placeholder="Describe the mood, colors, or specific theme you have in mind (e.g., 'Futuristic Oasis', 'Great Gatsby', 'Sustainable Luxury')..."
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-fann-gold uppercase tracking-widest mb-4 block">Key Features & Tech</label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {featuresList.map(f => (
                                                    <button
                                                        key={f}
                                                        type="button"
                                                        onClick={() => handleFeatureChange(f)}
                                                        className={`p-3 text-xs uppercase tracking-wider border transition-all rounded-sm text-center ${formData.features.includes(f) ? 'bg-white text-black border-white font-bold' : 'border-white/10 text-gray-500 hover:text-white hover:border-white/30'}`}
                                                    >
                                                        {f}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                            </div>

                            {/* Navigation */}
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
                                        className="btn-gold"
                                    >
                                        Next Step
                                    </button>
                                ) : (
                                    <button
                                        type="submit"

                                        className="bg-gradient-to-r from-fann-gold to-[#bfa172] text-black font-bold py-4 px-12 rounded-sm uppercase tracking-widest text-sm hover:shadow-[0_0_30px_rgba(201,169,98,0.4)] transition-all disabled:opacity-70 flex items-center gap-2"
                                    >
                                        <Sparkles size={18} />
                                        See My 4 Concepts
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

export default EventStudioPage;
